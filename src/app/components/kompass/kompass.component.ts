// Libraries
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import * as selection from 'd3-selection';
import * as scale from 'd3-scale';


// Module
import { Skill } from '../../models/skill';
import { SkillValidationService } from '../../services/skill-validation.service';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

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
  get skills(): string | Skill[] {
    return this._skills;
  }

  /**
   * Indicator of input error
   */
  @HostBinding('class.skills-error') hasError = false;

  /**
   * Graph width
   */
  @Input() width = DEFAULT_WIDTH;
  /**
   * Graph height
   */
  @Input() height = DEFAULT_HEIGHT;

  // local input data
  private _skills: Skill[] = [];

  // d3 layers
  private svg: any;
  private axes: any;
  private points: any;
  private fill: any;

  // d3 helper vars
  private x;
  private y;

  constructor(private skillValidationService: SkillValidationService) { }

  ngOnInit() {
  }

  private render() {
    console.log('Rendering...');
    try {
      this.setupGraph();
      this.drawAxes();
    } catch (e) {
      console.log('Error rendering.', e);
      this.hasError = true;
    }
    console.log('...rendering done.');
  }

  /**
   * Draws the base graph layers.
   */
  private setupGraph() {
    this.x = this.width / 2;
    this.y = this.height / 2;
    this.svg = selection.select('.compass')
      .append('svg:svg')
      .attr('height', this.height)
      .attr('width', this.width)
      .attr('class', 'msg-skill-compass')
      .append('g')
      .attr('height', this.height)
      .attr('width', this.width)
      .attr('transform', `translate(${ this.x }, ${ this.y })`);
    this.axes = this.svg.append('g').attr('class', 'msg-skill-axes');
    this.points = this.svg.append('g').attr('class', 'msg-skill-points');
    this.fill = this.svg.append('g').attr('class', 'msg-skill-fill');

    return this.svg;
  }

  private altDrawAxes() {
    const s = scale.scaleOrdinal()
      .range(['#58D6C7','#CC333F','#00A0B0']);
    
  }

  /**
   * Draws and labels the axes
   */
  private drawAxes() {
    const pi = Math.PI;
    const count = this._skills.length;

    const arc = 2 * pi / count;
    const axisData = this._skills.map((s, idx) => ({
      name: s.name,
      level: s.level,
      x: this.x - Math.cos(idx * arc) * this.x,
      y: this.y - Math.sin(idx * arc) * this.y,
    }));
    this.axes = this.axes
      .selectAll('g')
      .data(axisData);

    this.axes
      .enter()
      .append('g')
      .attr('title', d => d.name);

    this.axes.enter()
      .append('line')
      .attr('x0', this.x)
      .attr('y0', this.y)
      .attr('x1', d => {
        console.log('D', d);
        return d.x;
      })
      .attr('y1', d => d.y);
  }
}
