import { openai } from "./client";

/**
 * Use OpenAI to analyze a codebase and identify frameworks/technologies
 * Fallback when dependency files are not available
 */
export async function analyzeCodebaseForSkills(
  repoName: string,
  languages: Record<string, number>,
  readmeContent?: string
): Promise<string[]> {
  const languageList = Object.keys(languages).join(", ");

  const prompt = `Analyze this GitHub repository and identify the frameworks, libraries, and technologies used.

Repository: ${repoName}
Languages: ${languageList}
${readmeContent ? `README:\n${readmeContent.substring(0, 1000)}` : "No README available"}

List ONLY the specific frameworks and technologies (not just programming languages). Examples:
- React, Vue, Angular (not just "JavaScript")
- Django, Flask, FastAPI (not just "Python")
- Express, Next.js, NestJS
- PostgreSQL, MongoDB, Redis
- Docker, Kubernetes
- Tailwind CSS, Bootstrap

Return a JSON array of technology names: ["React", "Node.js", "PostgreSQL"]

If you cannot determine specific frameworks, return an empty array: []`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a code analysis expert. Identify frameworks and technologies from repository information. Return only a JSON array.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return [];
    }

    // Parse JSON response
    const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      const skills = JSON.parse(jsonMatch[0]);
      return Array.isArray(skills) ? skills : [];
    }

    return [];
  } catch (error) {
    console.error("Error analyzing codebase with OpenAI:", error);
    return [];
  }
}
