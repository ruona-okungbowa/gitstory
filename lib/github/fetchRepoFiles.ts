import { Octokit } from "octokit";

interface DependencyFiles {
  packageJson?: Record<string, unknown>;
  requirementsTxt?: string;
  pomXml?: string;
  gemfile?: string;
  goMod?: string;
  composerJson?: Record<string, unknown>;
  cargoToml?: string;
}

/**
 * Fetch dependency files from a GitHub repository
 * Checks for package.json, requirements.txt, pom.xml, etc.
 */
export async function fetchDependencyFiles(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<DependencyFiles> {
  const files: DependencyFiles = {};

  // List of dependency files to check
  const dependencyFiles = [
    { name: "package.json", key: "packageJson", parse: true },
    { name: "requirements.txt", key: "requirementsTxt", parse: false },
    { name: "pom.xml", key: "pomXml", parse: false },
    { name: "Gemfile", key: "gemfile", parse: false },
    { name: "go.mod", key: "goMod", parse: false },
    { name: "composer.json", key: "composerJson", parse: true },
    { name: "Cargo.toml", key: "cargoToml", parse: false },
  ];

  for (const file of dependencyFiles) {
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: file.name,
      });

      if ("content" in data) {
        const content = Buffer.from(data.content, "base64").toString("utf-8");

        if (file.parse) {
          try {
            (files as Record<string, unknown>)[file.key] = JSON.parse(content);
          } catch (parseError) {
            console.error(`Error parsing ${file.name}:`, parseError);
            (files as Record<string, unknown>)[file.key] = null;
          }
        } else {
          (files as Record<string, string>)[file.key] = content;
        }
      }
    } catch {
      // File doesn't exist, skip silently
      continue;
    }
  }

  return files;
}
