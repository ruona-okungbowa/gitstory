export function generateBadges(project: {
  languages?: Record<string, number>;
  stars?: number;
  forks?: number;
}): string {
  const badges: string[] = [];

  // Language badge
  const topLanguage = Object.keys(project.languages || {})[0];
  if (topLanguage) {
    badges.push(
      `![${topLanguage}](https://img.shields.io/badge/${topLanguage}-blue?style=flat-square)`
    );
  }

  // Stars badge
  if (project.stars && project.stars > 0) {
    badges.push(
      `![Stars](https://img.shields.io/badge/stars-${project.stars}-yellow?style=flat-square)`
    );
  }

  // License badge
  badges.push(
    `![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)`
  );

  return badges.join(" ");
}
