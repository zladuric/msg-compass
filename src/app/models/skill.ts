/**
 * Some skill levels to generalize
 1 - Fundamental Awareness (basic knowledge) ...
 2 - Novice (limited experience) ...
 3 - Intermediate (practical application) ...
 4 - Advanced (applied theory) ...
 5 - Expert (recognized authority)
 */
export enum SkillLevel {
  BASIC = 1,
  NOVICE = 2,
  INTERMEDIATE = 3,
  ADVANCED = 4,
  EXPERT = 5,
}

/**
 * A named skill
 */
export interface Skill {
  name: string;
  level: SkillLevel;
  value?: number;
}
