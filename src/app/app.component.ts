import { Component } from '@angular/core';

@Component({
  selector: 'msg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  skills = [
    {
      name: 'angular',
      level: 5,
    },
    {
      name: 'd3',
      level: 2,
    },
    {
      name: 'web components',
      level: 4,
    },
    {
      name: 'javascript',
      level: '5',
    },
  ];
}
