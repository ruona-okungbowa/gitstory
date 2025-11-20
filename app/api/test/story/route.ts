import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCompletion } from "@/lib/openai/client";
import { PROMPTS, buildStoryPrompt } from "@/lib/openai/prompts";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    // Get first project
    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .limit(1);

    if (!projects || projects.length === 0) {
      return NextResponse.json({ error: "No projects found" }, { status: 404 });
    }

    const project = projects[0];

    console.log("Generating story for:", project.name);

    // Generate story directly
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

    return NextResponse.json({
      project: project.name,
      story,
      wordCount: story.split(/\s+/).length,
    });
  } catch (error: unknown) {
    console.error("Test story error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
