import { Component, Input } from '@angular/core';

@Component({
  selector: 'presentable-column-controls',
  templateUrl: './presentable-column-controls.component.html',
  styleUrl: './presentable-column-controls.component.scss'
})
export class PresentableColumnControlsComponent {

  _showController: boolean = false;

  @Input() columns: any;  

}
