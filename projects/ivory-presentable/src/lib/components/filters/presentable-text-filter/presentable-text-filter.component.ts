import { Component, Input } from '@angular/core';

@Component({
  selector: 'presentable-text-filter',
  template: `
    <input 
      class="ivpt-filter-input"
      type="text" 
      [name]="column.field"
      id="{{column.field}}"
      [(ngModel)]="_keyword"
      (keydown)="applyFilter()" 
    />
  `,
  styles: `
    .ivpt-filter-input {
      width: 100%;
    }
  `
})
export class PresentableTextFilterComponent {

  _keyword: string = '';

  @Input() column: any;

  applyFilter() {

  }

}
