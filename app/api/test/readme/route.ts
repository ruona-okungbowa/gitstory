import { NextResponse } from "next/server";
import { generateReadme } from "@/lib/openai/generateReadme";
import { validateMarkdown } from "@/lib/utils/validateMarkdown";
import { generateBadges } from "@/lib/utils/generateBadges";
import type { Project } from "@/types";

/**
 * Test endpoint for README generation
 * GET /api/test/readme
 */
export async function GET() {
  try {
    // Mock project data
    const mockProject: Project = {
      id: "test-123",
      userId: "user-123",
      githubRepoId: 123456,
      name: "awesome-todo-app",
      description:
        "A modern task management application built with React and TypeScript",
      url: "https://github.com/testuser/awesome-todo-app",
      languages: {
        TypeScript: 65.5,
        JavaScript: 20.3,
        CSS: 10.2,
        HTML: 4.0,
      },
      stars: 42,
      forks: 8,
      lastCommitDate: new Date("2024-11-15"),
      complexityScore: 75,
      analysedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Generating README for test project...");

    // Test 1: Generate new README (without existing README)
    const newReadme = await generateReadme(mockProject);

    console.log("Generated new README, validating...");

    // Validate the generated README
    const validation = validateMarkdown(newReadme);

    // Test 2: Generate badges
    const badges = generateBadges(mockProject);

    // Test 3: Count sections
    const sections = newReadme.match(/^#{1,3}\s+.+$/gm) || [];

    // Test 4: Check for code blocks
    const codeBlocks = (newReadme.match(/```/g) || []).length / 2;

    // Test 5: Check for required sections
    const requiredSections = [
      "installation",
      "usage",
      "tech stack",
      "features",
      "license",
    ];

    const foundSections = requiredSections.filter((section) =>
      newReadme.toLowerCase().includes(section)
    );

    return NextResponse.json({
      success: true,
      message: "README generation test completed",
      mockProject: {
        name: mockProject.name,
        description: mockProject.description,
        languages: Object.keys(mockProject.languages || {}),
        stars: mockProject.stars,
      },
      readme: {
        content: newReadme,
        characterCount: newReadme.length,
        lineCount: newReadme.split("\n").length,
        sectionCount: sections.length,
        codeBlockCount: codeBlocks,
      },
      badges: {
        content: badges,
        count: badges.split(" ").length,
      },
      validation: {
        valid: validation.valid,
        errors: validation.errors,
      },
      analysis: {
        hasSections: sections.length > 0,
        hasCodeBlocks: codeBlocks > 0,
        hasBadges: newReadme.includes("shields.io"),
        requiredSections: {
          total: requiredSections.length,
          found: foundSections.length,
          missing: requiredSections.filter((s) => !foundSections.includes(s)),
        },
      },
      tests: {
        markdownValid: validation.valid,
        hasHeadings: newReadme.includes("#"),
        hasCodeBlocks: codeBlocks > 0,
        meetsMinLength: newReadme.length >= 100,
        hasRequiredSections: foundSections.length >= 4,
        allTestsPassed:
          validation.valid &&
          newReadme.includes("#") &&
          codeBlocks > 0 &&
          newReadme.length >= 100 &&
          foundSections.length >= 4,
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
