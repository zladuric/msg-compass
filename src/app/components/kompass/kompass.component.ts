// Libraries
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';
import * as selection from 'd3-selection';
import * as scale from 'd3-scale';
import * as array from 'd3-array';
import * as shape from 'd3-shape';
import * as colors from 'd3-scale-chromatic';
// Module
import { Skill } from '../../models/skill';
import { SkillValidationService } from '../../services/skill-validation.service';

// Some consts
const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 350;

const MARGIN = 30;
const CIRCLE_OPACITY = 0.1;
const OPACITY_AREA = 0.35;
const POINT_RADIUS = 5;


@Component({
  selector: 'msg-kompass',
  templateUrl: './kompass.component.html',
  styleUrls: ['./kompass.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KompassComponent implements OnInit {

  /**
   * Skills input
   */
  @Input() set skills(skills: string | Skill[]) {
    console.log('Checking skills', skills);
    if (!skills) {
      this.hasError = false;
      this._skills = [];
      this.cd.markForCheck();
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
    this.cd.markForCheck();
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

  constructor(private skillValidationService: SkillValidationService,
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
  }

  private render() {
    console.log('Rendering...');
    try {
      this.setupGraph();
    } catch (e) {
      console.log('Error rendering.', e);
      this.hasError = true;
    }
    console.log('...rendering done.');
    this.cd.markForCheck();
  }

  private setupGraph() {
    const allAxes = this._skills.map(s => s.name);
    const total = this._skills.length;
    const radius = Math.min(this.width / 2, this.height / 2);
    const angleSlice = Math.PI * 2 / total;

    // Scale for the radius
    const rScale = scale.scaleLinear()
      .range([0, radius])
      .domain([0, 5]);

    // Remove old compass, if any
    selection.select('.compas').select('svg').remove();

    // Initiate the radar chart SVG
    const svg = selection.select('.compass').append('svg')
      .attr('width', this.width + 2 * MARGIN)
      .attr('height', this.height + 2 * MARGIN)
      .attr('class', '.msg-skill-compass');

    // Append a g element
    const g = svg.append('g')
      .attr('transform', `translate(${ this.width / 2 + MARGIN }, ${ this.height / 2 + MARGIN  })`);

    // Some glow stuff
    const filter = g.append('defs').append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const howManyCircles = 5;

    // Wrapper for the grid & axes
    const axisGrid = g.append('g').attr('class', 'axisWrapper');
    axisGrid.selectAll('.levels')
      // How many circles to draw
      .data(array.range(1, howManyCircles + 1).reverse())
      .enter()
      .append('circle')
      .attr('class', 'gridCircle')
      .attr('r', d => radius / howManyCircles * d)
      .style('fill', '#CDCDCD')
      .style('stroke', '#CDCDCD')
      .style('fill-opacity', CIRCLE_OPACITY)
      .style('filter', 'url(#glow)');

    // Skill level text
    axisGrid.selectAll('.axisLabel')
      .data(array.range(1, howManyCircles + 1).reverse())
      .enter().append('text')
      .attr('class', 'axisLabel')
      .attr('x', 4)
      .attr('y', d => -d * radius / howManyCircles)
      .attr('dy', '0.4em')
      .style('font-size', '10px')
      .attr('fill', '#737373')
      .text(d => d);

    // Now the fun part. Draw axes for each skill
    const axis = axisGrid.selectAll('.axis')
      .data(allAxes)
      .enter()
      .append('g')
      .attr('class', 'axis');
    // Append the lines

    axis.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(howManyCircles * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(howManyCircles * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr('class', 'line')
      .style('stroke', 'white')
      .style('stroke-width', '2px');

    const labelWidth = 60;
    // Append the labels at each axis
    axis.append('text')
      .attr('class', 'legend')


      .style('font-size', '11px')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => rScale(howManyCircles * 1.15) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(howManyCircles * 1.15) * Math.sin(angleSlice * i - Math.PI / 2))
      .text(d => d)
      .call(wrap, labelWidth);


    // Now the data
    // The radial line function
    const radarLine = shape.radialLine()
      .curve(shape.curveLinearClosed)
      .radius((d:any) => rScale(d.level))
      .angle((d, i) => i * angleSlice);

    // Create a wrapper for the blobs
    const blobWrapper = g.selectAll('.radarWrapper')
      .data([this._skills])
      .enter().append('g')
      .attr('class', 'radarWrapper');

    const color = scale.scaleOrdinal(colors.schemeCategory10);

    // Append the backgrounds
    blobWrapper
      .append('path')
      .attr('class', 'radarArea')
      .attr('d', (d:any) => radarLine(d))
      .style('fill', (d, i: any)  => color(i))
      .style('fill-opacity', OPACITY_AREA);

    // Append the Dots for selected skills
    blobWrapper.selectAll('.radarCircle')
      .data(d => d)
      .enter().append('circle')
      .attr('class', 'radarCircle')
      .attr('r', POINT_RADIUS)
      .attr('cx', (d, i)  => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('fill', (d, i, j: any) => color(j))
      .style('fill-opacity', 0.8);


    // Taken from http://bl.ocks.org/mbostock/7555321
    // Wraps SVG text
    function wrap(text, width) {
      text.each(function () {
        const text = selection.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word;
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1.4; // ems
        const y = text.attr('y');
        const x = text.attr('x');
        const dy = parseFloat(text.attr('dy'));
        let tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em');

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(' '));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(' '));
            line = [word];
            tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
          }
        }
      });
    }
  }
}
