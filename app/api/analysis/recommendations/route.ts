import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/types/skills";
import { extractSkillsFromProjects } from "@/lib/analysis/extractSkills";
import { calculateSkillGaps } from "@/lib/analysis/calculateSkillGaps";
import { getAllTemplates } from "@/lib/data/getProjectTemplate";
import {
  matchProjectsToGaps,
  getTopRecommendations,
} from "@/lib/analysis/matchProjects";
import { personaliseRecommendation } from "@/lib/openai/personaliseRecommendation";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { targetRole, personalize = true } = body;

    const validRoles: Role[] = ["frontend", "backend", "fullstack", "devops"];
    if (!targetRole || !validRoles.includes(targetRole)) {
      return NextResponse.json(
        {
          error: `Invalid target role. Must be one of: ${validRoles.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const { data: existingRecs } = await supabase
      .from("project_recommendations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (existingRecs && existingRecs.length > 0) {
      const latestRec = existingRecs[0];
      const createdAt = new Date(latestRec.created_at);
      const now = new Date();
      const hoursSinceCreation =
        (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

      if (hoursSinceCreation < 24) {
        return NextResponse.json({
          recommendations: existingRecs,
          cached: true,
          generatedAt: latestRec.created_at,
        });
      }
    }

    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id);

    if (projectsError) {
      throw new Error(`Failed to fetch projects: ${projectsError.message}`);
    }

    if (!projects || projects.length === 0) {
      return NextResponse.json(
        {
          error:
            "No projects found. Please analyze some GitHub repositories first.",
        },
        { status: 404 }
      );
    }

    const githubToken = user.user_metadata?.provider_token;
    const presentSkills = await extractSkillsFromProjects(
      projects,
      githubToken
    );

    const skillGaps = calculateSkillGaps(presentSkills, targetRole);
    const templates = getAllTemplates();
    const matches = matchProjectsToGaps(skillGaps, templates);
    const topMatches = getTopRecommendations(matches, 5);

    if (topMatches.length === 0) {
      return NextResponse.json({
        recommendations: [],
        message:
          "Great job! You have all the essential skills for this role. Consider exploring advanced topics or contributing to open source.",
      });
    }

    const recommendations = [];

    for (const match of topMatches) {
      let description = match.template.description;

      // Personalize with OpenAI if requested
      if (personalize) {
        try {
          description = await personaliseRecommendation(
            match.template,
            presentSkills,
            [...match.gapsFilled.essential, ...match.gapsFilled.preferred]
          );
        } catch (error) {
          console.error("Failed to personalize recommendation:", error);
        }
      }

      // Store in database
      const { data: savedRec, error: insertError } = await supabase
        .from("project_recommendations")
        .insert({
          user_id: user.id,
          project_name: match.template.name,
          description: description,
          tech_stack: match.template.techStack,
          difficulty: match.template.difficulty,
          time_estimate: match.template.timeEstimate,
          gaps_filled: [
            ...match.gapsFilled.essential,
            ...match.gapsFilled.preferred,
            ...match.gapsFilled.niceToHave,
          ],
          learning_resources: match.template.learningResources,
          priority: match.priorityScore,
          status: "suggested",
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error storing recommendation:", insertError);
      }

      recommendations.push({
        id: savedRec?.id,
        template: match.template,
        description,
        gapsFilled: match.gapsFilled,
        priorityScore: match.priorityScore,
        matchPercentage: match.matchPercentage,
      });
    }

    return NextResponse.json({
      recommendations,
      skillGaps: {
        present: presentSkills,
        missing: skillGaps.missingSkills,
        coverage: skillGaps.coveragePercentage,
      },
      cached: false,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      {
        error: "Failed to generate recommendations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
