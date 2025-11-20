import { openai } from "./client";

interface Project {
  name: string;
  description?: string;
  languages?: Record<string, number>;
  stars?: number;
  forks?: number;
  url: string;
}

interface ResumeBullet {
  text: string;
  emphasis: "technical" | "impact" | "collaboration";
  characterCount: number;
  actionVerb: string;
}

/**
 * Generate professional resume bullet points for a project
 * Requirements: 3.1, 3.2, 3.3, 3.4
 *
 * Generates 3-5 variations with different emphasis:
 * - Technical depth (technologies, architecture)
 * - Impact (metrics, results, outcomes)
 * - Collaboration (teamwork, open source)
 */
export async function generateResumeBullets(
  project: Project
): Promise<ResumeBullet[]> {
  // Extract tech stack
  const techStack = project.languages
    ? Object.keys(project.languages).slice(0, 5).join(", ")
    : "various technologies";

  // Build context for AI
  const context = `
Project: ${project.name}
Description: ${project.description || "No description provided"}
Tech Stack: ${techStack}
GitHub Stars: ${project.stars || 0}
GitHub Forks: ${project.forks || 0}
URL: ${project.url}
  `.trim();

  const prompt = `You are a professional resume writer helping a software engineer create compelling resume bullet points.

${context}

Generate 3-5 resume bullet points for this project. Follow these strict requirements:

1. **Action Verbs**: Start each bullet with a strong action verb (Developed, Implemented, Built, Designed, Optimized, Created, Engineered, Architected)
2. **Quantified Achievements**: Include metrics when possible (e.g., "serving 100+ users", "reduced load time by 40%", "handling 1000+ requests/day")
3. **Technical Specificity**: Mention specific technologies and frameworks
4. **Length Constraint**: Each bullet MUST be 150 characters or less
5. **Professional Tone**: Use professional language suitable for a resume
6. **Variety**: Provide different emphasis:
   - 2 bullets emphasizing technical depth (architecture, technologies, implementation)
   - 2 bullets emphasizing impact (metrics, results, user value)
   - 1 bullet emphasizing collaboration or open source (if applicable)

Format your response as a JSON array of objects with this structure:
[
  {
    "text": "Developed a full-stack web app using React and Node.js, serving 500+ active users with 99.9% uptime",
    "emphasis": "impact",
    "actionVerb": "Developed"
  },
  ...
]

CRITICAL: Every bullet MUST be 150 characters or less. If a bullet exceeds this, make it shorter.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer specializing in software engineering resumes. You create concise, impactful bullet points that highlight technical skills and quantifiable achievements.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8, // Higher creativity for varied bullets
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    // Parse JSON response
    const bullets = parseResumeBullets(responseText);

    // Validate and enforce character limit
    const validatedBullets = bullets.map((bullet) => {
      const characterCount = bullet.text.length;

      // If bullet exceeds 150 characters, truncate intelligently
      if (characterCount > 150) {
        const truncated = truncateBullet(bullet.text, 150);
        return {
          ...bullet,
          text: truncated,
          characterCount: truncated.length,
        };
      }

      return {
        ...bullet,
        characterCount,
      };
    });

    return validatedBullets;
  } catch (error) {
    console.error("Error generating resume bullets:", error);
    throw new Error(
      `Failed to generate resume bullets: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Parse resume bullets from OpenAI response
 */
function parseResumeBullets(responseText: string): ResumeBullet[] {
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonText = jsonMatch ? jsonMatch[1] : responseText;

    const parsed = JSON.parse(jsonText);

    if (!Array.isArray(parsed)) {
      throw new Error("Response is not an array");
    }

    return parsed.map((item: any) => ({
      text: item.text || "",
      emphasis: item.emphasis || "technical",
      characterCount: (item.text || "").length,
      actionVerb: item.actionVerb || extractActionVerb(item.text || ""),
    }));
  } catch (error) {
    console.error("Error parsing resume bullets:", error);
    throw new Error("Failed to parse resume bullets from AI response");
  }
}

/**
 * Extract action verb from bullet text
 */
function extractActionVerb(text: string): string {
  const words = text.trim().split(/\s+/);
  return words[0] || "";
}

/**
 * Intelligently truncate a bullet to fit character limit
 * Tries to preserve meaning by removing less important words
 */
function truncateBullet(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  // Strategy 1: Remove trailing phrases after commas
  const parts = text.split(",");
  if (parts.length > 1) {
    for (let i = parts.length - 1; i > 0; i--) {
      const truncated = parts.slice(0, i).join(",");
      if (truncated.length <= maxLength) {
        return truncated;
      }
    }
  }

  // Strategy 2: Simple truncation with ellipsis
  return text.substring(0, maxLength - 3) + "...";
}
