export type Role = "frontend" | "backend" | "fullstack" | "devops";
import roleReq from "./role-requirements.json";

export interface Requirements {
  title: string;
  essential: string[];
  preferred: string[];
  niceToHave: string[];
}

export function getRoleRequirements(role: Role): Requirements | null {
  if (role in roleReq) {
    return roleReq[role];
  }

  return null;
}

export function getAllRoles(): Role[] {
  return Object.keys(roleReq) as Role[];
}
