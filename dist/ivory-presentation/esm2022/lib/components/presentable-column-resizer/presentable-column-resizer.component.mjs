import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./presentable-column-resizer.directive";
export class PresentableColumnResizerComponent {
    constructor() {
        this.resizable = false;
        this.minWidth = '';
        this.maxWidth = '';
        this.updatedColumnWidth = new EventEmitter();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PresentableColumnResizerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.2.1", type: PresentableColumnResizerComponent, selector: "presentable-column-resizer", inputs: { resizable: "resizable", minWidth: "minWidth", maxWidth: "maxWidth" }, outputs: { updatedColumnWidth: "updatedColumnWidth" }, ngImport: i0, template: `
    <div class="ivpt-resize-anchor"
      presentableColumnResizer
      [ngClass]="{'ivpt-resize-handle': resizable, 'ivpt-resize-not-allowed': !resizable}"
      (updatedColumnWidth)="updatedColumnWidth.emit(+$event)"
    ></div>
  `, isInline: true, styles: [".ivpt-resize-anchor{cursor:ew-resize;width:2px;height:1.2rem;background-color:#c9d7e1}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.ColumnResizeDirective, selector: "[presentableColumnResizer]", inputs: ["minWidth", "maxWidth"], outputs: ["updatedColumnWidth"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PresentableColumnResizerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'presentable-column-resizer', template: `
    <div class="ivpt-resize-anchor"
      presentableColumnResizer
      [ngClass]="{'ivpt-resize-handle': resizable, 'ivpt-resize-not-allowed': !resizable}"
      (updatedColumnWidth)="updatedColumnWidth.emit(+$event)"
    ></div>
  `, styles: [".ivpt-resize-anchor{cursor:ew-resize;width:2px;height:1.2rem;background-color:#c9d7e1}\n"] }]
        }], propDecorators: { resizable: [{
                type: Input
            }], minWidth: [{
                type: Input
            }], maxWidth: [{
                type: Input
            }], updatedColumnWidth: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlc2VudGFibGUtY29sdW1uLXJlc2l6ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaXZvcnktcHJlc2VudGFibGUvc3JjL2xpYi9jb21wb25lbnRzL3ByZXNlbnRhYmxlLWNvbHVtbi1yZXNpemVyL3ByZXNlbnRhYmxlLWNvbHVtbi1yZXNpemVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBYXZFLE1BQU0sT0FBTyxpQ0FBaUM7SUFYOUM7UUFhVyxjQUFTLEdBQVksS0FBSyxDQUFDO1FBRTNCLGFBQVEsR0FBZ0MsRUFBRSxDQUFDO1FBRTNDLGFBQVEsR0FBZ0MsRUFBRSxDQUFDO1FBRTFDLHVCQUFrQixHQUF5QixJQUFJLFlBQVksRUFBRSxDQUFDO0tBRXpFOzhHQVZZLGlDQUFpQztrR0FBakMsaUNBQWlDLHlNQVRsQzs7Ozs7O0dBTVQ7OzJGQUdVLGlDQUFpQztrQkFYN0MsU0FBUzsrQkFDRSw0QkFBNEIsWUFDNUI7Ozs7OztHQU1UOzhCQUtRLFNBQVM7c0JBQWpCLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVJLGtCQUFrQjtzQkFBM0IsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3ByZXNlbnRhYmxlLWNvbHVtbi1yZXNpemVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiaXZwdC1yZXNpemUtYW5jaG9yXCJcbiAgICAgIHByZXNlbnRhYmxlQ29sdW1uUmVzaXplclxuICAgICAgW25nQ2xhc3NdPVwieydpdnB0LXJlc2l6ZS1oYW5kbGUnOiByZXNpemFibGUsICdpdnB0LXJlc2l6ZS1ub3QtYWxsb3dlZCc6ICFyZXNpemFibGV9XCJcbiAgICAgICh1cGRhdGVkQ29sdW1uV2lkdGgpPVwidXBkYXRlZENvbHVtbldpZHRoLmVtaXQoKyRldmVudClcIlxuICAgID48L2Rpdj5cbiAgYCxcbiAgc3R5bGVVcmw6ICcuL3ByZXNlbnRhYmxlLWNvbHVtbi1yZXNpemVyLmNvbXBvbmVudC5zY3NzJ1xufSlcbmV4cG9ydCBjbGFzcyBQcmVzZW50YWJsZUNvbHVtblJlc2l6ZXJDb21wb25lbnQge1xuXG4gIEBJbnB1dCgpIHJlc2l6YWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIG1pbldpZHRoOiBudW1iZXIgfCBzdHJpbmcgfCB1bmRlZmluZWQgPSAnJztcblxuICBASW5wdXQoKSBtYXhXaWR0aDogbnVtYmVyIHwgc3RyaW5nIHwgdW5kZWZpbmVkID0gJyc7XG5cbiAgQE91dHB1dCgpIHVwZGF0ZWRDb2x1bW5XaWR0aDogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbn1cbiJdfQ==