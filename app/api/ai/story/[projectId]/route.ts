import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Get existing stories for this project
    const { data: stories, error } = await supabase
      .from("generated_content")
      .select("*")
      .eq("project_id", projectId)
      .eq("content_type", "story")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ stories: stories || [] });
  } catch (error: unknown) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
