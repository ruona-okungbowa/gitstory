import { Octokit } from "octokit";

export async function fetchReadMe(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<string | null> {
  try {
    const { data } = await octokit.rest.repos.getReadme({
      owner,
      repo,
    });

    if ("content" in data) {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }

    return null;
  } catch (error) {
    console.error("Error fetching README", error);
    return null;
  }
}
