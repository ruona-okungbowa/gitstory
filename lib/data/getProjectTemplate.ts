import templatesData from "./project-templates.json";

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  difficulty: string;
  timeEstimate: string;
  skillsTaught: string[];
  category: string;
  features: string[];
  learningResources: Resources[];
}

export interface Resources {
  title: string;
  url: string;
  type: string;
}

export function getAllTemplates(): ProjectTemplate[] {
  return templatesData.templates as ProjectTemplate[];
}

export function getTemplatesByCategory(category: string): ProjectTemplate[] {
  const allTemplates = templatesData.templates as ProjectTemplate[];
  return allTemplates.filter((template) => template.category === category);
}

export function getTemplatesByDifficulty(
  difficulty: string
): ProjectTemplate[] {
  const allTemplates = templatesData.templates as ProjectTemplate[];
  return allTemplates.filter((template) => template.difficulty === difficulty);
}
