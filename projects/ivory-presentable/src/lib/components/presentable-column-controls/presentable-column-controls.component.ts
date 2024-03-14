import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'presentable-column-controls',
  templateUrl: './presentable-column-controls.component.html',
  styleUrl: './presentable-column-controls.component.scss'
})
export class PresentableColumnControlsComponent {

  _showController: boolean = false;
  draggedItem: any;

  @Input() columns: any;

  @Output() updatedColumns = new EventEmitter; 
  
  applyControls() {
    this._showController = !this._showController;
    this.updatedColumns.emit(this.columns);
  }

  onDragStart(event: any, item: any) {
    console.log('drag started');
    this.draggedItem = item;
    event.dataTransfer?.setData('text/plain', '');
  }

  onDragOver(event: any) {
    event.preventDefault();
    console.log('dragging');
  }

  onDrop(event: any) {
    event.preventDefault();
    console.log('dropped');
    const droppedItem = this.draggedItem;
    const index = this.columns.indexOf(droppedItem);
    if (index !== -1) {
      this.columns.splice(index, 1);
      const dropIndex = this.getDropIndex(event);
      this.columns.splice(dropIndex, 0 , droppedItem);
    }
  }

  getDropIndex(event: any) {
    const target = event.target as HTMLElement;
    const targetIndex = Array.from(target.parentNode!.children).indexOf(target);
    return targetIndex;
  }

  clickme() {
    console.log('Clicked me');
  }
}
