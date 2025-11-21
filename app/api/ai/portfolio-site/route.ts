import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createGitHubClient } from "@/lib/github/client";
import {
  generatePortfolioBio,
  generateProjectDescription,
} from "@/lib/openai/generatePortfolio";
import { generatePortfolioHTML } from "@/lib/templates/portfolio-template";
import { deployToGitHubPages } from "@/lib/github/deployPortfolio";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }

    const { data: userData } = await supabase
      .from("users")
      .select("github_username, target_role, email, avatar_url")
      .eq("id", user.id)
      .single();

    if (!userData?.github_username) {
      return NextResponse.json(
        { error: "GitHub username not found" },
        { status: 404 }
      );
    }

    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("stars", { ascending: false })
      .limit(6);

    if (projectsError) {
      console.error("Error fetching projects:", projectsError);
      return NextResponse.json(
        { error: "Failed to fetch projects", details: projectsError.message },
        { status: 500 }
      );
    }

    if (!projects || projects.length === 0) {
      return NextResponse.json(
        { error: "No projects found. Please analyze some projects first." },
        { status: 404 }
      );
    }

    console.log("Generating portfolio bio...");
    const bio = await generatePortfolioBio(projects, userData.target_role);

    console.log("Generating project descriptions...");
    const projectsWithDescriptions = await Promise.all(
      projects.map(async (project) => {
        const description = await generateProjectDescription(project);
        return {
          ...project,
          description,
        };
      })
    );

    const skillsSet = new Set<string>();
    projects.forEach((project) => {
      if (project.languages) {
        Object.keys(project.languages).forEach((lang) => skillsSet.add(lang));
      }
    });
    const skills = Array.from(skillsSet);

    console.log("Generating portfolio HTML...");
    const htmlContent = generatePortfolioHTML(
      userData.github_username,
      bio,
      userData.github_username,
      projectsWithDescriptions,
      skills,
      userData.email,
      userData.avatar_url
    );

    console.log("Deploying to GitHub Pages...");
    const { data: session } = await supabase.auth.getSession();
    const githubToken = session.session?.provider_token;

    if (!githubToken) {
      return NextResponse.json(
        {
          error:
            "GitHub token not found. Please reconnect your GitHub account.",
        },
        { status: 401 }
      );
    }

    const octokit = createGitHubClient(githubToken);
    const deployResult = await deployToGitHubPages(
      userData.github_username,
      githubToken,
      htmlContent,
      octokit
    );

    return NextResponse.json({
      success: true,
      url: deployResult.url,
      repoName: deployResult.repoName,
      message: deployResult.message,
      isNewRepo: deployResult.isNewRepo,
      projectsIncluded: projects.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating portfolio website:", error);
    return NextResponse.json(
      {
        error: "Failed to generate portfolio website",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
