import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/dashboard";
  if (!next.startsWith("/")) {
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        console.log("User logged in:", user.id);
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("id", user.id)
          .single();
        if (!existingUser) {
          console.log("Creating new user in database...");
          const { error: insertError } = await supabase.from("users").insert({
            id: user.id,
            github_id: user.user_metadata.provider_id,
            github_username:
              user.user_metadata.user_name ||
              user.user_metadata.preferred_username,
            email: user.email,
            avatar_url: user.user_metadata.avatar_url,
          });

          if (insertError) {
            console.error("Error creating user:", insertError);
          } else {
            console.log("User created successfully!");
          }
        } else {
          console.log("User already exists in database");
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
