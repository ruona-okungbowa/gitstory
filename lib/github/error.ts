export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public retryAfter?: number
  ) {
    super(message);
    this.name = "GitHubAPIError";
  }
}

export function handlesGitHubError(error: any): never {
  if (error.status === 403) {
    throw new GitHubAPIError(
      "GitHub API rate limit exceeded",
      403,
      error.response?.headers?.["x-ratelimit-reset"]
    );
  }

  if (error.status === 404) {
    throw new GitHubAPIError("Repository not found", 404);
  }

  if (error.status === 401) {
    throw new GitHubAPIError("Github authentication failed", 401);
  }

  throw new GitHubAPIError(error.message || "Unknown GitHub API error");
}
