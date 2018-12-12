import { SkillValidationService } from './skill-validation.service';

const mockSkills = require('../models/skills.mock.json');

describe('SkillValidationService', () => {
  let service: SkillValidationService;
  beforeEach(() => service = new SkillValidationService());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should throw error for invalid input', (done) => {
    try {
      service.parseSkills('invalid input here');
      throw new Error('Should have failed.');
    } catch (e) {
      expect(e.message).toEqual('Invalid skills input.');
      done();
    }
  });

  it('should ask for more then 2 skills', function (done) {
    try {
      service.parseSkills([mockSkills.skill1, mockSkills.skill2]);
      throw new Error('Should have failed.');
    } catch (e) {
      expect(e.message).toEqual('Invalid skills input.');
      done();
    }
  });

  it('should ask for less then 6 skills', function (done) {
    try {
      service.parseSkills([mockSkills.skill1, mockSkills.skill2, mockSkills.skill3, mockSkills.skill4, mockSkills.skill5, mockSkills.skill6]);
      throw new Error('Should have failed.');
    } catch (e) {
      expect(e.message).toEqual('Invalid skills input.');
      done();
    }
  });

  it('should ask for unique skill names', function (done) {
    try {
      service.parseSkills([mockSkills.skill1, mockSkills.skill2, mockSkills.duplicateSkill1]);
      throw new Error('Should have failed.');
    } catch (e) {
      expect(e.message).toEqual('Invalid skills input.');
      done();
    }
  });

  it('should ask for skill levels 1-5', function (done) {
    try {
      service.parseSkills([mockSkills.skill1, mockSkills.skill2, mockSkills.invalidLevelSkill]);
      throw new Error('Should have failed.');
    } catch (e) {
      expect(e.message).toEqual('Invalid skills input.');
      done();
    }
  });

  it('should take proper input and return skills nicely done', function () {
    const skills = service.parseSkills([mockSkills.skill1, mockSkills.skill2, mockSkills.skill3]);
    expect(skills.length).toEqual(3);
    const first = skills[0];
    expect(first.name).toEqual('skill 1');
    expect(first.level).toEqual(1);
  });

  it('should take stringified JSON array return parsed skills', function () {
    const input = JSON.stringify([mockSkills.skill1, mockSkills.skill2, mockSkills.skill3, mockSkills.skill4]);
    const skills = service.parseSkills(input);
    expect(skills.length).toEqual(4);
    const first = skills[0];
    expect(first.name).toEqual('skill 1');
    expect(first.level).toEqual(1);
  });
});
