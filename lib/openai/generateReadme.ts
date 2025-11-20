import { Project } from "@/types";
import { openai } from "./client";
import { fetchReadMe } from "../github/fetchReadme";
import { Octokit } from "octokit";

export async function generateReadme(
  project: Project,
  githubToken?: string,
  owner?: string,
  repo?: string
): Promise<string> {
  let existingReadme: string | null = null;

  if (githubToken && owner && repo) {
    const octokit = new Octokit({ auth: githubToken });
    existingReadme = await fetchReadMe(octokit, owner, repo);
  }
  const prompt = `Generate a professional README.md for this GitHub project:

Project Name: ${project.name}
Description: ${project.description || "No description"}
Languages: ${Object.keys(project.languages || {}).join(", ")}
Stars: ${project.stars}
URL: ${project.url}

${existingReadme ? `Existing README:\n${existingReadme.substring(0, 1000)}\n\nEnhance and improve this README.` : "Create a new README from scratch."}

Generate a complete README.md following this structure:

# Project Title
[Add badges using shields.io]

## About The Project
[2-3 sentence description explaining what the project does and why it's useful]

## Built With
* Technology 1
* Technology 2
* Technology 3

## Features
- Feature 1
- Feature 2
- Feature 3

## Getting Started

### Prerequisites
\`\`\`bash
npm install npm@latest -g
\`\`\`

### Installation
1. Clone the repo
   \`\`\`bash
   git clone ${project.url}
   \`\`\`
2. Install NPM packages
   \`\`\`bash
   npm install
   \`\`\`
3. Run the project
   \`\`\`bash
   npm start
   \`\`\`

## Usage
Provide examples of how to use the project with code snippets.

## Roadmap
- [ ] Feature 1
- [ ] Feature 2

## Contributing
1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License
Distributed under the MIT License.

Return ONLY the Markdown content, no wrapper code blocks or explanations.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical writer who creates professional README files for GitHub projects. Generate clear, well-structured Markdown documentation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    return responseText.trim();
  } catch (error) {
    console.error("Error generating readme", error);
    return `# ${project.name}
    ${project.description || "A software project"}
    ## Tech Stack
    ${Object.keys(project.languages || {}).join(", ")}`;
  }
}
