import type { SkillAnalysis } from "@/types/skills";
import type { ProjectTemplate } from "@/lib/data/getProjectTemplate";

export interface ProjectMatch {
  template: ProjectTemplate;
  gapsFilled: {
    essential: string[];
    preferred: string[];
    niceToHave: string[];
    total: number;
  };
  priorityScore: number;
  matchPercentage: number;
}

/**
 * Match project templates to user's skill gaps
 * Requirements: 5.1, 5.2, 5.4
 * Property 6: Recommendations ordered by gaps filled (descending)
 */
export function matchProjectsToGaps(
  skillGaps: SkillAnalysis,
  templates: ProjectTemplate[]
): ProjectMatch[] {
  const recommendations: ProjectMatch[] = [];

  for (const template of templates) {
    // Find which essential gaps this project fills
    const essentialFilled = findMatchingSkills(
      template.skillsTaught,
      skillGaps.missingSkills.essential
    );

    // Find which preferred gaps this project fills
    const preferredFilled = findMatchingSkills(
      template.skillsTaught,
      skillGaps.missingSkills.preferred
    );

    // Find which nice-to-have gaps this project fills
    const niceToHaveFilled = findMatchingSkills(
      template.skillsTaught,
      skillGaps.missingSkills.niceToHave
    );

    const totalFilled =
      essentialFilled.length + preferredFilled.length + niceToHaveFilled.length;

    // Skip projects that don't fill any gaps
    if (totalFilled === 0) {
      continue;
    }

    // Calculate priority score (essential gaps worth 3x, preferred 2x, nice-to-have 1x)
    const priorityScore =
      essentialFilled.length * 3 +
      preferredFilled.length * 2 +
      niceToHaveFilled.length * 1;

    // Calculate match percentage (how many of the project's skills fill gaps)
    const totalGaps =
      skillGaps.missingSkills.essential.length +
      skillGaps.missingSkills.preferred.length +
      skillGaps.missingSkills.niceToHave.length;

    const matchPercentage = Math.round((totalFilled / totalGaps) * 100);

    recommendations.push({
      template,
      gapsFilled: {
        essential: essentialFilled,
        preferred: preferredFilled,
        niceToHave: niceToHaveFilled,
        total: totalFilled,
      },
      priorityScore,
      matchPercentage,
    });
  }

  // Sort by priority score (descending) - Property 6
  recommendations.sort((a, b) => b.priorityScore - a.priorityScore);

  return recommendations;
}

/**
 * Find skills that match between two arrays (case-insensitive, partial matching)
 */
function findMatchingSkills(
  skillsTaught: string[],
  missingSkills: string[]
): string[] {
  const matches: string[] = [];

  for (const missing of missingSkills) {
    const missingLower = missing.toLowerCase().trim();

    for (const taught of skillsTaught) {
      const taughtLower = taught.toLowerCase().trim();

      // Exact match
      if (missingLower === taughtLower) {
        matches.push(missing);
        break;
      }

      // Partial match (e.g., "React" matches "React Framework")
      if (
        missingLower.includes(taughtLower) ||
        taughtLower.includes(missingLower)
      ) {
        matches.push(missing);
        break;
      }
    }
  }

  return matches;
}

/**
 * Get top N recommendations
 */
export function getTopRecommendations(
  matches: ProjectMatch[],
  count: number = 5
): ProjectMatch[] {
  return matches.slice(0, count);
}

/**
 * Filter recommendations by difficulty
 */
export function filterByDifficulty(
  matches: ProjectMatch[],
  difficulty: "beginner" | "intermediate" | "advanced"
): ProjectMatch[] {
  return matches.filter((match) => match.template.difficulty === difficulty);
}

/**
 * Filter recommendations by category
 */
export function filterByCategory(
  matches: ProjectMatch[],
  category: "frontend" | "backend" | "fullstack" | "devops"
): ProjectMatch[] {
  return matches.filter((match) => match.template.category === category);
}
