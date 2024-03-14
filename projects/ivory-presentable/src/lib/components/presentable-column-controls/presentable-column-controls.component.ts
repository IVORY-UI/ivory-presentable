import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'presentable-column-controls',
  templateUrl: './presentable-column-controls.component.html',
  styleUrl: './presentable-column-controls.component.scss'
})
export class PresentableColumnControlsComponent {

  _showController: boolean = false;
  draggingItem: any;
  isDraggingOver = false;

  @Input() columns: any;

  @Output() updatedColumns = new EventEmitter; 

  onDragStart(event: DragEvent, item: any) {
    console.log('drag started');
    this.draggingItem = item;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    console.log('dragging');
  }

  onDrop(event: DragEvent, index: number) {
    console.log('dropped', index);
    if (this.draggingItem) {
      const draggingIndex = this.columns.indexOf(this.draggingItem);
      if (draggingIndex > -1) {
        this.columns.splice(draggingIndex, 1);
        this.columns.splice(index, 0, this.draggingItem);
        this.draggingItem = null;
      }
    }
  }

  getDropIndex(event: any) {
    const target = event.target as HTMLElement;
    const targetIndex = Array.from(target.parentNode!.children).indexOf(target);
    return targetIndex;
  }

}
