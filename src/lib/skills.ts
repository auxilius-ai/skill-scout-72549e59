import skillsData from "@/data/skills.json";

export interface Capability {
  text: string;
  index: number;
}

export interface Skill {
  name: string;
  key: string;
  capabilities: Capability[];
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export type RatingLevel = "none" | "basic" | "intermediate" | "advanced" | "expert";
export type LastUsed = "currently" | "within_past_year" | "1_3_years" | "3_plus_years";

export const RATING_LABELS: Record<RatingLevel, string> = {
  none: "No Experience",
  basic: "Basic",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export const LAST_USED_LABELS: Record<LastUsed, string> = {
  currently: "Currently using",
  within_past_year: "Within past year",
  "1_3_years": "1–3 years ago",
  "3_plus_years": "3+ years ago",
};

export const RATING_LEVELS: RatingLevel[] = ["none", "basic", "intermediate", "advanced", "expert"];

export function getSkillCategories(): SkillCategory[] {
  return skillsData.map((cat) => ({
    category: cat.category,
    skills: cat.skills.map((skill) => ({
      name: skill.name,
      key: skill.name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      capabilities: skill.capabilities.map((text, index) => ({ text, index })),
    })),
  }));
}

export function getSkillByKey(key: string): Skill | undefined {
  for (const cat of getSkillCategories()) {
    const skill = cat.skills.find((s) => s.key === key);
    if (skill) return skill;
  }
  return undefined;
}

export function generateCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
