import { NextRequest, NextResponse } from "next/server";
import {
  getRoleRequirements,
  getAllRoles,
} from "@/lib/data/getRoleRequirements";
import type { Role } from "@/types/skills";

/**
 * Test endpoint for role requirements
 * GET /api/test/role-requirements?role=frontend
 * GET /api/test/role-requirements (returns all roles)
 */
export async function GET(request: NextRequest) {
  try {
    // Get role from query parameter
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");

    // If no role specified, return all roles
    if (!role) {
      const allRoles = getAllRoles();
      const allRequirements: Record<string, any> = {};

      for (const r of allRoles) {
        allRequirements[r] = getRoleRequirements(r);
      }

      return NextResponse.json({
        success: true,
        message: "All role requirements",
        roles: allRoles,
        requirements: allRequirements,
      });
    }

    // Validate role
    const validRoles: Role[] = ["frontend", "backend", "fullstack", "devops"];
    if (!validRoles.includes(role as Role)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Get requirements for specific role
    const requirements = getRoleRequirements(role as Role);

    if (!requirements) {
      return NextResponse.json(
        {
          success: false,
          error: "Requirements not found for role",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      role,
      requirements,
      skillCounts: {
        essential: requirements.essential.length,
        preferred: requirements.preferred.length,
        niceToHave: requirements.niceToHave.length,
        total:
          requirements.essential.length +
          requirements.preferred.length +
          requirements.niceToHave.length,
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
