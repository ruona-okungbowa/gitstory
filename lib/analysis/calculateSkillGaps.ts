import { getRoleRequirements } from "@/lib/data/getRoleRequirements";
import type { Role, SkillGapAnalysis } from "@/types/skills";

/**
 * Calculate skill gaps between user's present skills and target role requirements
 * Requirements: 4.1, 4.2, 4.3
 * Property 5: Skill gaps = required skills - present skills (set difference)
 */
export function calculateSkillGaps(
  presentSkills: string[],
  targetRole: Role
): SkillGapAnalysis {
  const requirements = getRoleRequirements(targetRole);

  if (!requirements) {
    throw new Error(`Invalid role: ${targetRole}`);
  }

  // Normalize all skills to lowercase for comparison
  const normalizedPresent = presentSkills.map((s) => s.toLowerCase().trim());

  // Helper function to check if a skill is present
  const hasSkill = (requiredSkill: string): boolean => {
    const required = requiredSkill.toLowerCase().trim();

    // Check for exact match
    if (normalizedPresent.includes(required)) {
      return true;
    }

    // Check for partial matches (e.g., "React" in "JavaScript Framework (React, Vue or Angular)")
    return normalizedPresent.some((presentSkill) => {
      return required.includes(presentSkill) || presentSkill.includes(required);
    });
  };

  // Calculate gaps (set difference: required - present)
  const missingEssential = requirements.essential.filter(
    (skill) => !hasSkill(skill)
  );

  const missingPreferred = requirements.preferred.filter(
    (skill) => !hasSkill(skill)
  );

  const missingNiceToHave = requirements.niceToHave.filter(
    (skill) => !hasSkill(skill)
  );

  // Calculate coverage percentage (based on essential skills only)
  const essentialMet = requirements.essential.length - missingEssential.length;
  const coveragePercentage = Math.round(
    (essentialMet / requirements.essential.length) * 100
  );

  return {
    role: targetRole,
    presentSkills,
    missingSkills: {
      essential: missingEssential,
      preferred: missingPreferred,
      niceToHave: missingNiceToHave,
    },
    coveragePercentage,
  };
}

/**
 * Get a summary of skill gaps with actionable insights
 */
export function getSkillGapSummary(analysis: SkillGapAnalysis): {
  status: "excellent" | "good" | "needs-work" | "beginner";
  message: string;
  priority: string[];
} {
  const { coveragePercentage, missingSkills } = analysis;

  let status: "excellent" | "good" | "needs-work" | "beginner";
  let message: string;

  if (coveragePercentage >= 90) {
    status = "excellent";
    message = `You have ${coveragePercentage}% of essential skills! Focus on preferred skills to stand out.`;
  } else if (coveragePercentage >= 70) {
    status = "good";
    message = `You have ${coveragePercentage}% of essential skills. Fill the remaining gaps to be job-ready.`;
  } else if (coveragePercentage >= 40) {
    status = "needs-work";
    message = `You have ${coveragePercentage}% of essential skills. Focus on building projects with missing technologies.`;
  } else {
    status = "beginner";
    message = `You have ${coveragePercentage}% of essential skills. Start with beginner-friendly projects to build fundamentals.`;
  }

  // Priority: essential gaps first, then preferred
  const priority = [
    ...missingSkills.essential.slice(0, 3),
    ...missingSkills.preferred.slice(0, 2),
  ];

  return {
    status,
    message,
    priority,
  };
}
