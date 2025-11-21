import { NextResponse } from "next/server";
import { generatePortfolioHTML } from "@/lib/templates/portfolio-template";
import { Project } from "@/types";

/**
 * Test endpoint that generates portfolio HTML without calling OpenAI
 * This is faster and doesn't hit rate limits
 */
export async function GET() {
  try {
    console.log("Starting portfolio HTML test (no AI calls)...");

    // Mock projects with pre-written descriptions
    const mockProjects: Project[] = [
      {
        id: "1",
        userId: "test-user",
        githubRepoId: 123456,
        name: "E-commerce Platform",
        description:
          "A comprehensive full-stack online store featuring cart management, secure checkout with Stripe integration, and an intuitive admin dashboard built with Next.js and TypeScript.",
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
        description:
          "A robust RESTful API with JWT authentication and real-time updates using WebSockets, enabling seamless task collaboration and productivity tracking.",
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
        description:
          "A modern, responsive portfolio showcasing projects and skills with smooth animations, built using Next.js, TypeScript, and Tailwind CSS for optimal performance.",
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
      {
        id: "4",
        userId: "test-user",
        githubRepoId: 456789,
        name: "Weather Dashboard",
        description:
          "An interactive weather application with real-time forecasts, location-based search, and beautiful data visualizations using React and OpenWeather API.",
        url: "https://github.com/testuser/weather-app",
        languages: {
          JavaScript: 70,
          CSS: 20,
          HTML: 10,
        },
        stars: 18,
        forks: 7,
        lastCommitDate: new Date(),
        complexityScore: 65,
        analysedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Pre-written bio
    const bio =
      "A passionate full-stack developer with expertise in building scalable web applications. I specialize in TypeScript, React, and Node.js, creating innovative solutions that drive user engagement and business growth. Always eager to learn new technologies and tackle challenging problems.";

    // Extract skills
    const skillsSet = new Set<string>();
    mockProjects.forEach((project) => {
      if (project.languages) {
        Object.keys(project.languages).forEach((lang) => skillsSet.add(lang));
      }
    });
    const skills = Array.from(skillsSet);

    console.log("Skills extracted:", skills);

    // Generate HTML
    console.log("Generating portfolio HTML...");
    const htmlContent = generatePortfolioHTML(
      "Jane Developer",
      bio,
      "janedev",
      mockProjects,
      skills,
      "jane@example.com",
      "https://github.com/janedev.png"
    );

    console.log("HTML generated successfully!");
    console.log("HTML length:", htmlContent.length, "characters");
    console.log("Projects included:", mockProjects.length);

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
