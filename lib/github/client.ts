import { Octokit } from "octokit";
import { createClient } from "../supabase/server";

export function createGitHubClient(accessToken: string) {
  const octokit = new Octokit({
    auth: accessToken,
  });

  // return the octokit to use later
  return octokit;
}

// Helper to get user's GitHub token from Supabase session
export async function getGitHubToken(userId: string) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const githubToken = session?.provider_token;

  return githubToken;
}

// Get rate limit status for the authenticated user
export async function checkRateLimit(octokit: Octokit) {
  const { data } = await octokit.rest.rateLimit.get();

  return {
    remaining: data.rate.remaining,
    limit: data.rate.limit,
    reset: new Date(data.rate.reset * 1000), // Convert Unix times
  };
}
