import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'presentable-row',
  templateUrl: './presentable-row.component.html',
  styleUrl: './presentable-row.component.scss'
})
export class PresentableRowComponent {

  @Input() columns: any;

  @Input() rowIndex: any;

  @Input() rowSelectionEnabled: any;

  @Input() rowData: any;

  @Output() onSelection = new EventEmitter<any>();

  whenRowSelected($event: any, rowData: any) {
    this.onSelection.emit({'selected': $event.target.checked, 'row': rowData});
  }

}
