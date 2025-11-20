import { NextResponse } from "next/server";
import { generateResumeBullets } from "@/lib/openai/bullets";

/**
 * Test endpoint for resume bullet generation
 * GET /api/test/bullets
 */
export async function GET() {
  try {
    // Mock project data
    const mockProject = {
      name: "TaskMaster Pro",
      description:
        "A full-stack task management application with real-time collaboration features",
      languages: {
        TypeScript: 45.2,
        JavaScript: 30.1,
        CSS: 15.3,
        HTML: 9.4,
      },
      stars: 127,
      forks: 23,
      url: "https://github.com/user/taskmaster-pro",
    };

    console.log("Generating resume bullets for test project...");

    const bullets = await generateResumeBullets(mockProject);

    console.log("Generated bullets:", bullets);

    // Validate all bullets meet requirements
    const validation = {
      allUnder150Chars: bullets.every((b) => b.characterCount <= 150),
      hasVariedEmphasis: new Set(bullets.map((b) => b.emphasis)).size > 1,
      allHaveActionVerbs: bullets.every((b) => b.actionVerb.length > 0),
      bulletCount: bullets.length,
    };

    return NextResponse.json({
      success: true,
      bullets,
      validation,
      message: "Resume bullets generated successfully",
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
