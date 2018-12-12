// Libraries
import { Component, HostBinding, Input, OnInit } from '@angular/core';

// Module
import { Skill } from '../../models/skill';
import { SkillValidationService } from '../../services/skill-validation.service';

@Component({
  selector: 'msg-kompass',
  templateUrl: './kompass.component.html',
  styleUrls: ['./kompass.component.scss']
})
export class KompassComponent implements OnInit {

  /**
   * Skills input
   */
  @Input() set skills(skills: string | Skill[]) {
    if (!skills) {
      this.hasError = false;
      this._skills = [];
      return;
    }
    // Validate input first
    try {
      this._skills = this.skillValidationService.parseSkills(skills);
      this.render();
    } catch (e) {
      this.hasError = true;
      this._skills = [];
    }
  }

  /**
   * Indicator of input error
   */
  @HostBinding('class.skills-error') hasError = false;

  private _skills: Skill[] = [];

  constructor(private skillValidationService: SkillValidationService) { }

  ngOnInit() {
  }

  private render() {}
}
