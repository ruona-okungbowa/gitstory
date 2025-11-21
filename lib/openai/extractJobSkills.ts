import { openai } from "./client";

export async function extractJobSkills(
  jobDescription: string
): Promise<string[]> {
  const prompt = `Analyze this job description and extract all required technical skills, frameworks, languages, and tools.

Job Description:
${jobDescription}

Return ONLY a JSON array of skill names (e.g., ["React", "TypeScript", "Node.js", "AWS"]).
Be specific and include:
- Programming languages
- Frameworks and libraries
- Databases
- Cloud platforms
- Tools and technologies
- Methodologies (e.g., Agile, CI/CD)

Do not include soft skills or general requirements.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a technical recruiter expert at parsing job descriptions. Return only valid JSON arrays.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  try {
    const parsed = JSON.parse(content);
    const skills = Array.isArray(parsed) ? parsed : parsed.skills || [];
    return skills.map((s: string) => s.trim()).filter(Boolean);
  } catch {
    console.error("Failed to parse OpenAI response:", content);
    throw new Error("Failed to extract skills from job description");
  }
}
