import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCompletion } from "@/lib/openai/client";
import { PROMPTS, buildStoryPrompt } from "@/lib/openai/prompts";
import {
  getCachedContent,
  setCachedContent,
  generateCacheKey,
} from "@/lib/openai/cache";

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Get the project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check cache first
    const cacheKey = generateCacheKey("story", projectId);
    const cachedStory = getCachedContent(cacheKey);

    if (cachedStory) {
      console.log("Returning cached story for project:", project.name);
      return NextResponse.json({
        story: cachedStory,
        cached: true,
      });
    }

    // Generate story with OpenAI
    console.log("Generating story for project:", project.name);

    const story = await generateCompletion(
      [
        { role: "system", content: PROMPTS.story },
        { role: "user", content: buildStoryPrompt(project) },
      ],
      {
        model: "gpt-4o-mini",
        temperature: 0.7,
        maxTokens: 800,
      }
    );

    // Parse and validate STAR format
    const parsedStory = parseStarStory(story);

    if (!parsedStory.isValid) {
      console.error("Generated story missing STAR components");
      return NextResponse.json(
        { error: "Failed to generate valid STAR story" },
        { status: 500 }
      );
    }

    // Cache the story
    setCachedContent(cacheKey, story);

    // Store in database
    const { error: insertError } = await supabase
      .from("generated_content")
      .insert({
        project_id: projectId,
        content_type: "story",
        content: story,
        metadata: {
          wordCount: story.split(/\s+/).length,
          hasAllComponents: parsedStory.isValid,
          components: parsedStory.components,
        },
      });

    if (insertError) {
      console.error("Error storing story:", insertError);
      // Don't fail the request if storage fails
    }

    return NextResponse.json({
      story,
      cached: false,
      metadata: {
        wordCount: story.split(/\s+/).length,
        components: parsedStory.components,
      },
    });
  } catch (error: unknown) {
    console.error("Error generating story:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to generate story" },
      { status: 500 }
    );
  }
}

// Helper function to parse and validate STAR format
function parseStarStory(story: string): {
  isValid: boolean;
  components: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
  };
} {
  const lowerStory = story.toLowerCase();

  const components = {
    situation: lowerStory.includes("situation") || lowerStory.includes("**s"),
    task: lowerStory.includes("task") || lowerStory.includes("**t"),
    action: lowerStory.includes("action") || lowerStory.includes("**a"),
    result: lowerStory.includes("result") || lowerStory.includes("**r"),
  };

  const isValid = Object.values(components).every((present) => present);

  return { isValid, components };
}
