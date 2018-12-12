import { Injectable } from '@angular/core';
import { Skill } from '../models/skill';

const INVALID_INPUT = 'Invalid skills input.';
const VALID_SKILL_LEVELS = [1, 2, 3, 4, 5];

@Injectable({
  providedIn: 'root'
})
/**
 * Service that provides utilities for validating skills
 */
export class SkillValidationService {

  constructor() { }

  /**
   * Validates the input.
   * @param input input data. Can be an array directly, or string passed via Web Components API
   */
  parseSkills(input: string | any[]): Skill[] {
    if (typeof input === 'undefined') {
      return;
    }
    const skills: Skill[] = [];
    let rawSkills = input;
    if (typeof input === 'string') {
      try {
        rawSkills = JSON.parse(input);
      } catch (e) {
        // Invalid input
        throw new Error(INVALID_INPUT);
      }
    } else if (!Array.isArray(input)) {
      throw new Error(INVALID_INPUT);
    } else if (rawSkills.length < 3 || rawSkills.length > 5) {
      throw new Error(INVALID_INPUT);
    }

    const names: any = {};
    /**
     * Extract relevant data. Check for duplicate names and valid skill levels.
     */
    for (const skill of rawSkills) {
      const { name, level } = skill;
      // check for duplicate name
      if (!name || names[name]) {
        throw new Error(INVALID_INPUT);
      } else {
        names[name] = true;
      }
      names[name] = true;

      // check for good level
      if (VALID_SKILL_LEVELS.indexOf(parseInt(level, 10)) === -1) {
        throw new Error(INVALID_INPUT);
      }
      // all checks out
      skills.push({ name, level, value: level });
    }
    return skills;
  }
}
