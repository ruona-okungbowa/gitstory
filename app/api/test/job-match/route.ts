import { NextResponse } from "next/server";
import { extractJobSkills } from "@/lib/openai/extractJobSkills";
import { calculateJobMatch } from "@/lib/analysis/calculateJobMatch";
import { Project } from "@/types";

export async function GET() {
  try {
    // Mock job description
    const jobDescription = `
We are looking for a Senior Full Stack Developer to join our team.

Requirements:
- 5+ years of experience with React and TypeScript
- Strong knowledge of Node.js and Express
- Experience with PostgreSQL and database design
- Familiarity with AWS services (EC2, S3, Lambda)
- Experience with Docker and CI/CD pipelines
- Knowledge of REST API design
- Experience with Git and Agile methodologies

Nice to have:
- Next.js experience
- GraphQL knowledge
- Redis caching
- Kubernetes experience
    `;

    // Extract skills using AI
    console.log("Extracting skills from job description...");
    const requiredSkills = await extractJobSkills(jobDescription);
    console.log("Extracted skills:", requiredSkills);

    // Mock user projects
    const mockProjects: Project[] = [
      {
        id: "1",
        userId: "test-user",
        githubRepoId: 123,
        name: "E-commerce Platform",
        description: "Full-stack e-commerce app",
        url: "https://github.com/user/ecommerce",
        languages: {
          TypeScript: 40,
          JavaScript: 30,
          "Node.js": 15,
          PostgreSQL: 10,
          CSS: 5,
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
        githubRepoId: 456,
        name: "Task Management API",
        description: "RESTful API with authentication",
        url: "https://github.com/user/task-api",
        languages: {
          JavaScript: 70,
          "Node.js": 20,
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
        githubRepoId: 789,
        name: "Portfolio Website",
        description: "Personal portfolio built with Next.js",
        url: "https://github.com/user/portfolio",
        languages: {
          TypeScript: 60,
          React: 30,
          CSS: 10,
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

    // Calculate job match
    console.log("Calculating job match...");
    const matchResult = calculateJobMatch(requiredSkills, mockProjects);

    return NextResponse.json({
      success: true,
      test: "Job Match Scoring",
      jobTitle: "Senior Full Stack Developer",
      requiredSkills,
      userProjects: mockProjects.map((p) => ({
        name: p.name,
        languages: p.languages,
      })),
      matchResult: {
        matchPercentage: matchResult.matchPercentage,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills,
        recommendedProjects: matchResult.recommendedProjects,
        breakdown: matchResult.breakdown,
      },
      interpretation: {
        rating:
          matchResult.matchPercentage >= 80
            ? "Excellent Match"
            : matchResult.matchPercentage >= 60
              ? "Good Match"
              : matchResult.matchPercentage >= 40
                ? "Fair Match"
                : "Needs Improvement",
        message:
          matchResult.matchPercentage >= 60
            ? "You have most of the required skills for this role!"
            : "Consider building projects to learn the missing skills.",
      },
    });
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Test failed",
      },
      { status: 500 }
    );
  }
}
