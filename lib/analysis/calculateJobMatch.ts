import { Project } from "@/types";

export interface JobMatchResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendedProjects: string[];
  breakdown: {
    essentialMatch: number;
    totalRequired: number;
    totalMatched: number;
  };
}

/**
 * Calculate job match percentage based on user's skills vs required skills
 */
export function calculateJobMatch(
  requiredSkills: string[],
  userProjects: Project[]
): JobMatchResult {
  // Extract all skills from user's projects
  const userSkills = new Set<string>();

  userProjects.forEach((project) => {
    // Add languages from project
    if (project.languages) {
      Object.keys(project.languages).forEach((lang) => {
        userSkills.add(lang.toLowerCase());
      });
    }
  });

  // Normalize required skills for comparison
  const normalizedRequired = requiredSkills.map((s) => s.toLowerCase());
  const normalizedUser = Array.from(userSkills);

  // Find matched and missing skills
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  normalizedRequired.forEach((required) => {
    const isMatch = normalizedUser.some((user) => {
      // Exact match or partial match (e.g., "React" matches "ReactJS")
      return (
        user === required || user.includes(required) || required.includes(user)
      );
    });

    if (isMatch) {
      // Find original casing from requiredSkills
      const original = requiredSkills.find((s) => s.toLowerCase() === required);
      matchedSkills.push(original || required);
    } else {
      const original = requiredSkills.find((s) => s.toLowerCase() === required);
      missingSkills.push(original || required);
    }
  });

  // Calculate match percentage
  const matchPercentage =
    requiredSkills.length > 0
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 0;

  // Recommend projects that demonstrate matched skills
  const recommendedProjects = userProjects
    .filter((project) => {
      // Check if project uses any of the matched skills
      const projectSkills = new Set<string>();
      if (project.languages) {
        Object.keys(project.languages).forEach((lang) =>
          projectSkills.add(lang.toLowerCase())
        );
      }

      return matchedSkills.some((skill) =>
        Array.from(projectSkills).some(
          (ps) =>
            ps === skill.toLowerCase() ||
            ps.includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(ps)
        )
      );
    })
    .sort((a, b) => (b.stars || 0) - (a.stars || 0)) // Sort by stars
    .slice(0, 5) // Top 5 projects
    .map((p) => p.id);

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
    recommendedProjects,
    breakdown: {
      essentialMatch: matchedSkills.length,
      totalRequired: requiredSkills.length,
      totalMatched: matchedSkills.length,
    },
  };
}
