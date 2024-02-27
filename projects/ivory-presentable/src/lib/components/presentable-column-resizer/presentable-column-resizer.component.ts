import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'presentable-column-resizer',
  template: `
    <div class="ivpt-resize-anchor"
      presentableColumnResizer
      [ngClass]="{'ivpt-resize-handle': resizable, 'ivpt-resize-not-allowed': !resizable}"
      (updatedColumnWidth)="updatedColumnWidth.emit(+$event)"
    ></div>
  `,
  styles: `
    @import '../../styles/variables.scss';

    .ivpt-resize-anchor {
      cursor: ew-resize;
      width: 2px;
      height: 1.2rem;
      background-color: $ivpt-border-color-resize;
    }
  `
})
export class PresentableColumnResizerComponent {

  @Input() resizable: boolean = false;

  @Input() minWidth: number | string | undefined = '';

  @Input() maxWidth: number | string | undefined = '';

  @Output() updatedColumnWidth: EventEmitter<number> = new EventEmitter();

}
