import { Project } from "@/types";
import { openai } from "./client";

export async function generatePortfolioBio(
  projects: Project[],
  targetRole?: string
): Promise<string> {
  const allLanguages = new Set<string>();
  projects.forEach((project) => {
    if (project.languages) {
      Object.keys(project.languages).forEach((lang) => allLanguages.add(lang));
    }
  });

  const techStack = Array.from(allLanguages).slice(0, 5).join(", ");
  const projectCount = projects.length;

  const prompt = `Create a professional developer bio for someone who:
- Has built ${projectCount} projects
- Works with: ${techStack}
${targetRole ? `- Target role: ${targetRole}` : ""}

Requirements:
- 2-3 sentences maximum
- Professional but personable tone
- Highlight technical expertise
- Emphasize building and innovation
- Make it interview-ready

Return only the bio text, no quotes or extra formatting.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a professional career coach who writes compelling developer bios.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 150,
  });

  const bio = response.choices[0].message.content?.trim() || "";
  return bio;
}

/**
 * Generate a compelling project description for portfolio display
 */
export async function generateProjectDescription(
  project: Project
): Promise<string> {
  const languages = project.languages
    ? Object.keys(project.languages).slice(0, 3).join(", ")
    : "various technologies";

  const prompt = `Create a compelling 1-2 sentence description for this project:

Project Name: ${project.name}
Current Description: ${project.description || "No description provided"}
Technologies: ${languages}
Stars: ${project.stars || 0}

Requirements:
- 1-2 sentences maximum
- Make it interview-ready and impressive
- Highlight technical achievements
- Focus on impact and functionality
- Use action verbs
- Keep it concise and clear

Return only the description text, no quotes or extra formatting.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a technical writer who creates compelling project descriptions for developer portfolios.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 100,
  });

  const description = response.choices[0].message.content?.trim() || "";
  return description;
}
