import { NextResponse } from "next/server";
import {
  generatePortfolioBio,
  generateProjectDescription,
} from "@/lib/openai/generatePortfolio";
import { generatePortfolioHTML } from "@/lib/templates/portfolio-template";
import { Project } from "@/types";

export async function GET() {
  try {
    console.log("Starting portfolio site test...");

    // Mock projects data
    const mockProjects: Project[] = [
      {
        id: "1",
        userId: "test-user",
        githubRepoId: 123456,
        name: "E-commerce Platform",
        description: "Full-stack online store with cart and checkout",
        url: "https://github.com/testuser/ecommerce",
        languages: {
          TypeScript: 45,
          JavaScript: 30,
          CSS: 15,
          HTML: 10,
        },
        stars: 45,
        forks: 12,
        lastCommitDate: new Date(),
        complexityScore: 85,
        analysedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        userId: "test-user",
        githubRepoId: 789012,
        name: "Task Management API",
        description: "RESTful API with authentication and real-time updates",
        url: "https://github.com/testuser/task-api",
        languages: {
          JavaScript: 60,
          TypeScript: 30,
          Shell: 10,
        },
        stars: 23,
        forks: 5,
        lastCommitDate: new Date(),
        complexityScore: 70,
        analysedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        userId: "test-user",
        githubRepoId: 345678,
        name: "Portfolio Website",
        description: "Personal portfolio built with Next.js",
        url: "https://github.com/testuser/portfolio",
        languages: {
          TypeScript: 60,
          CSS: 30,
          JavaScript: 10,
        },
        stars: 12,
        forks: 3,
        lastCommitDate: new Date(),
        complexityScore: 60,
        analysedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Step 1: Generate bio
    console.log("Generating portfolio bio...");
    const bio = await generatePortfolioBio(mockProjects, "fullstack");
    console.log("Bio generated:", bio);

    // Step 2: Generate project descriptions (with delay to avoid rate limits)
    console.log("Generating project descriptions...");
    const projectsWithDescriptions = [];
    for (const project of mockProjects) {
      const description = await generateProjectDescription(project);
      console.log(`Description for ${project.name}:`, description);
      projectsWithDescriptions.push({
        ...project,
        description,
      });
      // Add 1 second delay between requests to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Step 3: Extract skills
    const skillsSet = new Set<string>();
    mockProjects.forEach((project) => {
      if (project.languages) {
        Object.keys(project.languages).forEach((lang) => skillsSet.add(lang));
      }
    });
    const skills = Array.from(skillsSet);
    console.log("Skills extracted:", skills);

    // Step 4: Generate HTML
    console.log("Generating portfolio HTML...");
    const htmlContent = generatePortfolioHTML(
      "Test Developer",
      bio,
      "testuser",
      projectsWithDescriptions,
      skills,
      "test@example.com",
      "https://github.com/testuser.png"
    );

    console.log("HTML generated successfully!");
    console.log("HTML length:", htmlContent.length, "characters");

    // Return HTML for preview
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Test failed",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
