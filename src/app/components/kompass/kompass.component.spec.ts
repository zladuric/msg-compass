import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KompassComponent } from './kompass.component';

const mockSkills = require('../../models/skills.mock.json');

describe('KompassComponent', () => {
  let component: KompassComponent;
  let fixture: ComponentFixture<KompassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KompassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KompassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('with invalid input', function () {
    it('should render nothing for less then 3 skills', function () {
      component.skills = [];
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('svg')).toBeFalsy();
      component.skills = [mockSkills.skill1];
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('svg')).toBeFalsy();
      component.skills = [mockSkills.skill1, mockSkills.skill2];
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('svg')).toBeFalsy();
    });

    it('should recognize duplicate skill names as well', function () {
      component.skills = [mockSkills.skill1, mockSkills.skill2, mockSkills.duplicateSkill1];
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('svg')).toBeFalsy();
    });

    it('should not accept more than 5 levels of skill', function () {
      component.skills = [mockSkills.skill1, mockSkills.skill2, mockSkills.invalidLevelSkill];
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('svg')).toBeFalsy();
    });

    it('should render nothing for more then 5 skills', function () {
      component.skills = [mockSkills.skill1, mockSkills.skill2, mockSkills.skill3, mockSkills.skill4, mockSkills.skill5, mockSkills.skill6];
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('svg')).toBeFalsy();
    });

    it('should have an "skills-error" class when input is invalid', function () {
      component.skills = [mockSkills.skill1, mockSkills.skill2, mockSkills.duplicateSkill1];
      fixture.detectChanges();
      console.log('el', fixture.nativeElement, fixture.nativeElement.classList);
      expect(fixture.nativeElement.classList.contains('skills-error')).toBeTruthy();
    });
  });

  describe('with valid input', () => {
    it('should render a skill compass with 3 skills provided', function () {
      component.skills = [mockSkills.skill1, mockSkills.skill2, mockSkills.skill3];
      fixture.detectChanges();
      expect(fixture.nativeElement.classList.contains('skills-error')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('svg')).toBeTruthy();
    });
  });
});

