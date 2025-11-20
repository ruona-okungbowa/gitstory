import { Octokit } from "octokit";
import { fetchDependencyFiles } from "@/lib/github/fetchRepoFiles";
import { extractSkillsFromDependencies } from "./parseDependencies";
import { analyzeCodebaseForSkills } from "@/lib/openai/analyzeCodebase";

interface Project {
  name: string;
  description?: string;
  languages?: Record<string, number>;
  url?: string;
  github_repo_id?: number;
}

/**
 * Extract skills from user's projects
 * Strategy:
 * 1. Extract from languages field
 * 2. Try to fetch and parse dependency files (package.json, requirements.txt, etc.)
 * 3. Fallback to OpenAI analysis if no dependency files found
 */
export async function extractSkillsFromProjects(
  projects: Project[],
  githubToken?: string
): Promise<string[]> {
  const skills = new Set<string>();
  const octokit = githubToken ? new Octokit({ auth: githubToken }) : null;

  for (const project of projects) {
    // 1. Extract from languages field
    if (project.languages) {
      Object.keys(project.languages).forEach((lang) => {
        const normalized = normalizeSkillName(lang);
        if (normalized) {
          skills.add(normalized);
        }
      });
    }

    // Extract owner and repo from URL
    let owner: string | null = null;
    let repo: string | null = null;

    if (project.url) {
      const match = project.url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        owner = match[1];
        repo = match[2];
      }
    }

    // 2. Try to fetch and parse dependency files
    if (octokit && owner && repo) {
      try {
        console.log(`Fetching dependency files for ${owner}/${repo}...`);
        const depFiles = await fetchDependencyFiles(octokit, owner, repo);

        const depSkills = extractSkillsFromDependencies(depFiles);
        console.log(
          `Found ${depSkills.length} skills from dependencies:`,
          depSkills
        );

        depSkills.forEach((skill) => skills.add(skill));

        // If we found dependencies, skip OpenAI for this project
        if (depSkills.length > 0) {
          continue;
        }
      } catch (error) {
        console.log(
          `Could not fetch dependency files for ${owner}/${repo}, will try OpenAI`
        );
      }
    }

    // 3. Fallback to OpenAI analysis
    try {
      console.log(`Using OpenAI to analyze ${project.name}...`);
      const aiSkills = await analyzeCodebaseForSkills(
        project.name,
        project.languages || {},
        project.description
      );
      console.log(`OpenAI found ${aiSkills.length} skills:`, aiSkills);

      aiSkills.forEach((skill) => skills.add(skill));
    } catch (aiError) {
      console.error(`OpenAI analysis failed for ${project.name}:`, aiError);
    }

    // 4. Also check description for quick wins
    if (project.description) {
      const detectedSkills = detectSkillsInText(project.description);
      detectedSkills.forEach((skill) => skills.add(skill));
    }
  }

  return Array.from(skills);
}

/**
 * Normalize skill names to standard format
 */
function normalizeSkillName(skill: string): string {
  const normalized = skill.trim();

  // Map common variations to standard names
  const skillMap: Record<string, string> = {
    javascript: "JavaScript",
    js: "JavaScript",
    typescript: "TypeScript",
    ts: "TypeScript",
    python: "Python",
    py: "Python",
    java: "Java",
    csharp: "C#",
    "c#": "C#",
    cpp: "C++",
    "c++": "C++",
    html: "HTML",
    css: "CSS",
    sql: "SQL",
    go: "Go",
    golang: "Go",
    rust: "Rust",
    ruby: "Ruby",
    php: "PHP",
    swift: "Swift",
    kotlin: "Kotlin",
    dart: "Dart",
    shell: "Shell",
    bash: "Bash",
  };

  const lower = normalized.toLowerCase();
  return skillMap[lower] || normalized;
}

/**
 * Detect skills/frameworks mentioned in text
 */
function detectSkillsInText(text: string): string[] {
  const skills: string[] = [];
  const lowerText = text.toLowerCase();

  // Common frameworks and tools to detect
  const skillPatterns: Record<string, string[]> = {
    // Frontend frameworks
    React: ["react", "reactjs", "react.js"],
    "Next.js": ["next", "nextjs", "next.js"],
    Vue: ["vue", "vuejs", "vue.js"],
    Angular: ["angular"],
    Svelte: ["svelte"],
    "Tailwind CSS": ["tailwind", "tailwindcss"],
    Bootstrap: ["bootstrap"],

    // Backend frameworks
    "Node.js": ["node", "nodejs", "node.js"],
    Express: ["express", "expressjs"],
    Django: ["django"],
    Flask: ["flask"],
    FastAPI: ["fastapi"],
    Spring: ["spring", "spring boot"],
    Laravel: ["laravel"],
    Rails: ["rails", "ruby on rails"],

    // Databases
    MongoDB: ["mongodb", "mongo"],
    PostgreSQL: ["postgresql", "postgres"],
    MySQL: ["mysql"],
    Redis: ["redis"],
    Firebase: ["firebase"],
    Supabase: ["supabase"],
    SQLite: ["sqlite"],

    // Cloud & DevOps
    Docker: ["docker"],
    Kubernetes: ["kubernetes", "k8s"],
    AWS: ["aws", "amazon web services"],
    Azure: ["azure"],
    GCP: ["gcp", "google cloud"],
    Vercel: ["vercel"],
    Netlify: ["netlify"],

    // Tools
    Git: ["git"],
    "CI/CD": ["ci/cd", "cicd", "continuous integration"],
    Webpack: ["webpack"],
    Vite: ["vite"],
    Jest: ["jest"],
    Testing: ["testing", "unit test", "integration test"],

    // State Management
    Redux: ["redux"],
    Zustand: ["zustand"],

    // APIs
    "REST API": ["rest", "rest api", "restful"],
    GraphQL: ["graphql"],

    // Mobile
    "React Native": ["react native"],
  };

  // Check for each skill pattern
  Object.entries(skillPatterns).forEach(([skill, patterns]) => {
    for (const pattern of patterns) {
      if (lowerText.includes(pattern)) {
        skills.push(skill);
        break; // Only add once per skill
      }
    }
  });

  return skills;
}
