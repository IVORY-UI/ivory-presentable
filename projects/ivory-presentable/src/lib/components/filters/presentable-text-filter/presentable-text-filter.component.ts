import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'presentable-text-filter',
  template: `
    <input 
      class="ivpt-filter-input"
      type="text" 
      [name]="column.field"
      id="{{column.field}}"
      [(ngModel)]="_keyword"
      (keydown.enter)="applyFilter()" 
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

  @Output() whenApplied = new EventEmitter<any>();
  emitApplied(value: any) {
    this.whenApplied.emit(value);
  }

  applyFilter() {
    console.log('The keyword is - ', this._keyword);
    this.emitApplied({'column': this.column['field'], 'type': this.column['filterType'], 'keyword': this._keyword});
  }

}
