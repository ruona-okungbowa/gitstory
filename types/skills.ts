export type Role = "frontend" | "backend" | "fullstack" | "devops";

export interface Requirements {
  title: string;
  essential: string[];
  preferred: string[];
  niceToHave: string[];
}

export type skillCategory = "essential" | "preferred" | "niceToHave";

export interface UserSkills {
  userId: string;
  skills: string[];
  analysedAt: Date;
}

export interface GapAnalysis {
  role: Role;
  presentSkills: string[];
  missingSkills: {
    essential: string[];
    preferred: string[];
    niceToHave: string[];
  };
  coveragePercentage: number;
}
