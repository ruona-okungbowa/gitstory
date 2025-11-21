import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractJobSkills } from "@/lib/openai/extractJobSkills";
import { calculateJobMatch } from "@/lib/analysis/calculateJobMatch";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { jobTitle, jobDescription } = body;

    if (!jobTitle || !jobDescription) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_INPUT",
            message: "Job title and description are required",
          },
        },
        { status: 400 }
      );
    }

    // Extract required skills from job description using AI
    const requiredSkills = await extractJobSkills(jobDescription);

    // Fetch user's projects
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id);

    if (projectsError) {
      console.error("Error fetching projects:", projectsError);
      return NextResponse.json(
        {
          error: {
            code: "DATABASE_ERROR",
            message: "Failed to fetch projects",
          },
        },
        { status: 500 }
      );
    }

    if (!projects || projects.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: "NO_PROJECTS",
            message: "No projects found. Please analyze some projects first.",
          },
        },
        { status: 404 }
      );
    }

    // Calculate job match
    const matchResult = calculateJobMatch(requiredSkills, projects);

    // Store job match in database
    const { data: jobMatch, error: insertError } = await supabase
      .from("job_matches")
      .insert({
        user_id: user.id,
        job_title: jobTitle,
        job_description: jobDescription,
        required_skills: requiredSkills,
        match_percentage: matchResult.matchPercentage,
        matched_skills: matchResult.matchedSkills,
        missing_skills: matchResult.missingSkills,
        recommended_projects: matchResult.recommendedProjects,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error storing job match:", insertError);
      // Continue even if storage fails
    }

    return NextResponse.json({
      success: true,
      jobMatch: {
        id: jobMatch?.id,
        jobTitle,
        requiredSkills,
        matchPercentage: matchResult.matchPercentage,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills,
        recommendedProjects: matchResult.recommendedProjects,
        breakdown: matchResult.breakdown,
      },
    });
  } catch (error) {
    console.error("Job match error:", error);
    return NextResponse.json(
      {
        error: {
          code: "UNKNOWN_ERROR",
          message:
            error instanceof Error ? error.message : "Failed to match job",
        },
      },
      { status: 500 }
    );
  }
}
