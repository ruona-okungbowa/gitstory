import { NextResponse } from "next/server";
import { getAllTemplates } from "@/lib/data/getProjectTemplate";
import {
  matchProjectsToGaps,
  getTopRecommendations,
} from "@/lib/analysis/matchProjects";
import type { SkillAnalysis, Role } from "@/types/skills";

/**
 * Test endpoint for project recommendations
 * GET /api/test/recommendations?role=frontend
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = (searchParams.get("role") || "frontend") as Role;

    // Mock skill gap analysis
    const mockSkillGaps: SkillAnalysis = {
      role,
      presentSkills: ["JavaScript", "HTML", "CSS", "React", "Git", "Node.js"],
      missingSkills: {
        essential: ["TypeScript", "Testing"],
        preferred: ["Next.js", "Tailwind CSS", "PostgreSQL"],
        niceToHave: ["Docker", "CI/CD", "GraphQL"],
      },
      coveragePercentage: 60,
    };

    console.log("Loading project templates...");
    const templates = getAllTemplates();
    console.log(`Loaded ${templates.length} templates`);

    console.log("Matching templates to skill gaps...");
    const matches = matchProjectsToGaps(mockSkillGaps, templates);
    console.log(`Found ${matches.length} matching projects`);

    console.log("Getting top 5 recommendations...");
    const topRecommendations = getTopRecommendations(matches, 5);

    // Test all roles
    const allRoles: Role[] = ["frontend", "backend", "fullstack", "devops"];
    const roleTests: Record<string, any> = {};

    for (const testRole of allRoles) {
      const roleGaps: SkillAnalysis = {
        role: testRole,
        presentSkills: ["JavaScript", "HTML", "CSS"],
        missingSkills: {
          essential: ["React", "TypeScript", "Node.js"],
          preferred: ["Next.js", "PostgreSQL"],
          niceToHave: ["Docker"],
        },
        coveragePercentage: 40,
      };

      const roleMatches = matchProjectsToGaps(roleGaps, templates);
      const topForRole = getTopRecommendations(roleMatches, 3);

      roleTests[testRole] = {
        matchCount: roleMatches.length,
        topProject: topForRole[0]?.template.name || "None",
        topPriority: topForRole[0]?.priorityScore || 0,
        gapsFilled: topForRole[0]?.gapsFilled.total || 0,
      };
    }

    return NextResponse.json({
      success: true,
      selectedRole: role,
      mockSkillGaps: {
        present: mockSkillGaps.presentSkills,
        missing: mockSkillGaps.missingSkills,
        coverage: mockSkillGaps.coveragePercentage,
      },
      templates: {
        total: templates.length,
        byCategory: {
          frontend: templates.filter((t) => t.category === "frontend").length,
          backend: templates.filter((t) => t.category === "backend").length,
          fullstack: templates.filter((t) => t.category === "fullstack").length,
          devops: templates.filter((t) => t.category === "devops").length,
        },
        byDifficulty: {
          beginner: templates.filter((t) => t.difficulty === "beginner").length,
          intermediate: templates.filter((t) => t.difficulty === "intermediate")
            .length,
          advanced: templates.filter((t) => t.difficulty === "advanced").length,
        },
      },
      matches: {
        total: matches.length,
        top5: topRecommendations.map((rec) => ({
          name: rec.template.name,
          category: rec.template.category,
          difficulty: rec.template.difficulty,
          priorityScore: rec.priorityScore,
          matchPercentage: rec.matchPercentage,
          gapsFilled: {
            essential: rec.gapsFilled.essential.length,
            preferred: rec.gapsFilled.preferred.length,
            niceToHave: rec.gapsFilled.niceToHave.length,
            total: rec.gapsFilled.total,
          },
          skillsTaught: rec.template.skillsTaught,
        })),
      },
      roleTests,
      validation: {
        hasTemplates: templates.length > 0,
        hasMatches: matches.length > 0,
        hasRecommendations: topRecommendations.length > 0,
        sortedByPriority:
          topRecommendations.length < 2 ||
          topRecommendations[0].priorityScore >=
            topRecommendations[1].priorityScore,
        topFillsEssentialGaps:
          topRecommendations[0]?.gapsFilled.essential.length > 0,
      },
    });
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
