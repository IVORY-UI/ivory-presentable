import { Component, Input } from '@angular/core';

@Component({
  selector: 'ivory-presentable-row',
  templateUrl: './presentable-row.component.html',
  styleUrl: './presentable-row.component.scss'
})
export class PresentableRowComponent {

  @Input() columns: any;

  @Input() rowIndex: any;

  @Input() rowSelectionEnabled: any;

  @Input() rowData: any;

  onRowSelectionChange($event: any, rowData: any) {
    console.log('Event - ', $event);
    console.log('Row Data - ', rowData);
  }

}
