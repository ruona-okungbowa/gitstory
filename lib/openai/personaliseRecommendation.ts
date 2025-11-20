import { ProjectTemplate } from "../data/getProjectTemplate";
import { openai } from "./client";

export async function personaliseRecommendation(
  template: ProjectTemplate,
  userSkills: string[],
  gapsFilled: string[]
): Promise<string> {
  const prompt = `
You are a career advisor helping a developer choose their next project.

Current Skills: ${userSkills.join(", ")}
Project: ${template.name}
Skills This Project Teaches: ${template.skillsTaught.join(", ")}
Gaps It Fills: ${gapsFilled.join(", ")}

Write a 2-3 sentence personalized explanation of why this project is valuable for this developer.
Focus on career impact and skill development.
  `;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a career advisor helping developers choose their next project. Provide concise, actionable advice focused on career growth.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      // Fallback to generic description
      return `This project will help you learn ${gapsFilled.slice(0, 3).join(", ")} and strengthen your ${template.category} development skills.`;
    }

    return responseText.trim();
  } catch (error) {
    console.error("Error personalizing recommendation with OpenAI:", error);
    // Fallback to generic description
    return `This project will help you learn ${gapsFilled.slice(0, 3).join(", ")} and strengthen your ${template.category} development skills.`;
  }
}
