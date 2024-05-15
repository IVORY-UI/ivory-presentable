import { DOCUMENT } from '@angular/common';
import { Directive, EventEmitter, HostBinding, HostListener, Inject, Input, Output, inject } from '@angular/core';
import { Subject, fromEvent, map, switchMap, takeUntil } from 'rxjs';
import { ElementManagerService } from '../../services/element-manager.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/column-sizing.service";
export class ColumnResizeDirective {
    get isColumnResizing() {
        return this.isResizing;
    }
    constructor(zone, columnSizing, elementRef, document) {
        this.zone = zone;
        this.columnSizing = columnSizing;
        this.elementRef = elementRef;
        this.document = document;
        this.minWidth = '';
        this.maxWidth = '';
        this.updatedColumnWidth = new EventEmitter();
        this.mouseDown = new Subject();
        this.mouseMove = new Subject();
        this.mouseUp = new Subject();
        this.columnOffsetLeft = 0;
        this.isResizing = false;
        this.defaultResizerHeight = 0;
        this.destroy$ = new Subject();
        this.elementManager = inject(ElementManagerService);
    }
    ngAfterViewInit() {
        this.defaultResizerHeight = this.elementRef.nativeElement.getBoundingClientRect().height;
        this.mouseDown.pipe(takeUntil(this.destroy$), map((event) => event.clientX), switchMap((startOffset) => this.mouseMove.pipe(takeUntil(this.mouseUp), map((event) => event.clientX - startOffset)))).subscribe((offsetX) => {
            this.isResizing = true;
            this.addColumnResizeStyle();
            const totWidth = this.columnOffsetLeft + offsetX;
            let newWidth = totWidth;
            if (!!this.maxWidth) {
                // newWidth = totWidth > +this.maxWidth! ? +this.maxWidth! : +totWidth;
                newWidth = Math.min(newWidth, +this.maxWidth);
            }
            if (!!this.minWidth) {
                // newWidth = totWidth < +this.minWidth! ? +this.minWidth! : +totWidth;
                newWidth = Math.max(newWidth, +this.minWidth);
            }
            this.updateColumnWidth(newWidth);
            this.updatedColumnWidth.emit(newWidth);
        });
    }
    updateColumnWidth(newWidth) {
        if (this.columnContainerElement)
            this.columnContainerElement.style.width = `${newWidth}px`;
    }
    addColumnResizeStyle() {
        // const datagridHeight = this.elementManager.getDatagridElDimenstions()?.height;
        // if (this.isResizing) {
        //   this.elementRef.nativeElement.style.height = `${datagridHeight - 10}px`;
        // } else {
        //   this.elementRef.nativeElement.style.height = `${datagridHeight}px`;
        // }
    }
    mouseDownEvent(event) {
        event.preventDefault();
        this.columnContainerElement = event.target.parentElement?.parentElement?.parentElement;
        this.columnOffsetLeft = event.clientX - (this.columnContainerElement?.getBoundingClientRect()?.left || 0);
        this.mouseDown.next(event);
    }
    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            fromEvent(this.document.body, 'mousemove').pipe(takeUntil(this.destroy$)).subscribe((event) => {
                event.preventDefault();
                this.mouseMove.next(event);
            });
            fromEvent(this.document.body, 'mouseup').pipe(takeUntil(this.destroy$)).subscribe((event) => {
                event.preventDefault();
                if (this.isResizing) {
                    this.isResizing = false;
                    this.addColumnResizeStyle();
                    this.columnSizing.reCalcWidth.next(true);
                }
                this.mouseUp.next(event);
            });
            fromEvent(window, 'resize').pipe(takeUntil(this.destroy$)).subscribe((event) => {
                event.preventDefault();
                this.columnSizing.reCalcWidth.next(true);
            });
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ColumnResizeDirective, deps: [{ token: i0.NgZone }, { token: i1.ColumnSizingService }, { token: i0.ElementRef }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.1", type: ColumnResizeDirective, selector: "[presentableColumnResizer]", inputs: { minWidth: "minWidth", maxWidth: "maxWidth" }, outputs: { updatedColumnWidth: "updatedColumnWidth" }, host: { listeners: { "mousedown": "mouseDownEvent($event)" }, properties: { "class.resizing": "this.isColumnResizing" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ColumnResizeDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[presentableColumnResizer]'
                }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i1.ColumnSizingService }, { type: i0.ElementRef }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }], propDecorators: { minWidth: [{
                type: Input
            }], maxWidth: [{
                type: Input
            }], updatedColumnWidth: [{
                type: Output
            }], isColumnResizing: [{
                type: HostBinding,
                args: ['class.resizing']
            }], mouseDownEvent: [{
                type: HostListener,
                args: ['mousedown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlc2VudGFibGUtY29sdW1uLXJlc2l6ZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaXZvcnktcHJlc2VudGFibGUvc3JjL2xpYi9jb21wb25lbnRzL3ByZXNlbnRhYmxlLWNvbHVtbi1yZXNpemVyL3ByZXNlbnRhYmxlLWNvbHVtbi1yZXNpemVyLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFpQixTQUFTLEVBQWMsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBa0IsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3SixPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBTyxNQUFNLE1BQU0sQ0FBQztBQUcxRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQzs7O0FBSy9FLE1BQU0sT0FBTyxxQkFBcUI7SUFRaEMsSUFDSSxnQkFBZ0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFhRCxZQUNTLElBQVksRUFDWCxZQUFpQyxFQUNqQyxVQUFzQixFQUNMLFFBQWtCO1FBSHBDLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWCxpQkFBWSxHQUFaLFlBQVksQ0FBcUI7UUFDakMsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUNMLGFBQVEsR0FBUixRQUFRLENBQVU7UUExQnBDLGFBQVEsR0FBZ0MsRUFBRSxDQUFDO1FBRTNDLGFBQVEsR0FBZ0MsRUFBRSxDQUFDO1FBRTFDLHVCQUFrQixHQUF5QixJQUFJLFlBQVksRUFBRSxDQUFDO1FBT3hFLGNBQVMsR0FBaUIsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUN4QyxjQUFTLEdBQWlCLElBQUksT0FBTyxFQUFFLENBQUM7UUFDeEMsWUFBTyxHQUFpQixJQUFJLE9BQU8sRUFBRSxDQUFDO1FBQ3RDLHFCQUFnQixHQUFXLENBQUMsQ0FBQztRQUM3QixlQUFVLEdBQVksS0FBSyxDQUFDO1FBQzVCLHlCQUFvQixHQUFXLENBQUMsQ0FBQztRQUVqQyxhQUFRLEdBQXFCLElBQUksT0FBTyxFQUFFLENBQUM7UUFFM0MsbUJBQWMsR0FBMEIsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFTdEUsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFFekYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQ2pCLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQ3hCLEdBQUcsQ0FBQyxDQUFDLEtBQWlCLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFDekMsU0FBUyxDQUFDLENBQUMsV0FBbUIsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQ3BELFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQ3ZCLEdBQUcsQ0FBQyxDQUFDLEtBQWlCLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDLENBQ3RELENBQ0YsQ0FDRixDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQzVCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUE7WUFDaEQsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ25CLHVFQUF1RTtnQkFDdkUsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVMsQ0FBQyxDQUFDO2FBQ2hEO1lBQ0QsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbkIsdUVBQXVFO2dCQUN2RSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUyxDQUFDLENBQUM7YUFDaEQ7WUFDRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxRQUFnQjtRQUNoQyxJQUFJLElBQUksQ0FBQyxzQkFBc0I7WUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRSxHQUFHLFFBQVEsSUFBSSxDQUFDO0lBQzVGLENBQUM7SUFFRCxvQkFBb0I7UUFDbEIsaUZBQWlGO1FBQ2pGLHlCQUF5QjtRQUN6Qiw2RUFBNkU7UUFDN0UsV0FBVztRQUNYLHdFQUF3RTtRQUN4RSxJQUFJO0lBQ04sQ0FBQztJQUdELGNBQWMsQ0FBQyxLQUFpQjtRQUM5QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLHNCQUFzQixHQUFJLEtBQUssQ0FBQyxNQUFzQixDQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUUsYUFBYSxDQUFDO1FBQ3hHLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLHFCQUFxQixFQUFFLEVBQUUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7WUFDL0IsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FDN0MsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDekIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDcEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3QixDQUFDLENBQUMsQ0FBQztZQUVILFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQzNDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQ3pCLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ3BCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO29CQUNuQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztvQkFDeEIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7b0JBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDMUM7Z0JBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0IsQ0FBQyxDQUFDLENBQUM7WUFFSCxTQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FDOUIsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDekIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDcEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUN2QixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDM0MsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7OEdBL0dVLHFCQUFxQixxR0E0QnRCLFFBQVE7a0dBNUJQLHFCQUFxQjs7MkZBQXJCLHFCQUFxQjtrQkFIakMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO2lCQUN2Qzs7MEJBNkJJLE1BQU07MkJBQUMsUUFBUTt5Q0ExQlQsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVJLGtCQUFrQjtzQkFBM0IsTUFBTTtnQkFHSCxnQkFBZ0I7c0JBRG5CLFdBQVc7dUJBQUMsZ0JBQWdCO2dCQW9FN0IsY0FBYztzQkFEYixZQUFZO3VCQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBIb3N0QmluZGluZywgSG9zdExpc3RlbmVyLCBJbmplY3QsIElucHV0LCBOZ1pvbmUsIE9uSW5pdCwgT3V0cHV0LCBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QsIGZyb21FdmVudCwgbWFwLCBzd2l0Y2hNYXAsIHRha2VVbnRpbCwgdGFwIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENvbHVtblNpemluZ1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb2x1bW4tc2l6aW5nLnNlcnZpY2UnO1xuaW1wb3J0IHsgRWxlbWVudE1hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZWxlbWVudC1tYW5hZ2VyLnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbcHJlc2VudGFibGVDb2x1bW5SZXNpemVyXSdcbn0pXG5leHBvcnQgY2xhc3MgQ29sdW1uUmVzaXplRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0e1xuXG4gIEBJbnB1dCgpIG1pbldpZHRoOiBudW1iZXIgfCBzdHJpbmcgfCB1bmRlZmluZWQgPSAnJztcblxuICBASW5wdXQoKSBtYXhXaWR0aDogbnVtYmVyIHwgc3RyaW5nIHwgdW5kZWZpbmVkID0gJyc7XG5cbiAgQE91dHB1dCgpIHVwZGF0ZWRDb2x1bW5XaWR0aDogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5yZXNpemluZycpXG4gIGdldCBpc0NvbHVtblJlc2l6aW5nKCkge1xuICAgIHJldHVybiB0aGlzLmlzUmVzaXppbmc7XG4gIH1cblxuICBtb3VzZURvd246IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7XG4gIG1vdXNlTW92ZTogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3QoKTtcbiAgbW91c2VVcDogU3ViamVjdDxhbnk+ID0gbmV3IFN1YmplY3QoKTtcbiAgY29sdW1uT2Zmc2V0TGVmdDogbnVtYmVyID0gMDtcbiAgaXNSZXNpemluZzogYm9vbGVhbiA9IGZhbHNlO1xuICBkZWZhdWx0UmVzaXplckhlaWdodDogbnVtYmVyID0gMDtcblxuICBkZXN0cm95JDogU3ViamVjdDxib29sZWFuPiA9IG5ldyBTdWJqZWN0KCk7XG4gIGNvbHVtbkNvbnRhaW5lckVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCB8IHVuZGVmaW5lZDtcbiAgZWxlbWVudE1hbmFnZXI6IEVsZW1lbnRNYW5hZ2VyU2VydmljZSA9IGluamVjdChFbGVtZW50TWFuYWdlclNlcnZpY2UpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB6b25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBjb2x1bW5TaXppbmc6IENvbHVtblNpemluZ1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHB1YmxpYyBkb2N1bWVudDogRG9jdW1lbnQsXG4gICkge1xuXG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5kZWZhdWx0UmVzaXplckhlaWdodCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcbiAgICBcbiAgICB0aGlzLm1vdXNlRG93bi5waXBlKFxuICAgICAgdGFrZVVudGlsKHRoaXMuZGVzdHJveSQpLFxuICAgICAgbWFwKChldmVudDogTW91c2VFdmVudCkgPT4gZXZlbnQuY2xpZW50WCksXG4gICAgICBzd2l0Y2hNYXAoKHN0YXJ0T2Zmc2V0OiBudW1iZXIpID0+IHRoaXMubW91c2VNb3ZlLnBpcGUoXG4gICAgICAgIHRha2VVbnRpbCh0aGlzLm1vdXNlVXApLFxuICAgICAgICBtYXAoKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiBldmVudC5jbGllbnRYIC0gc3RhcnRPZmZzZXQpXG4gICAgICAgIClcbiAgICAgIClcbiAgICApLnN1YnNjcmliZSgob2Zmc2V0WCkgPT4ge1xuICAgICAgdGhpcy5pc1Jlc2l6aW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuYWRkQ29sdW1uUmVzaXplU3R5bGUoKTtcbiAgICAgIGNvbnN0IHRvdFdpZHRoID0gdGhpcy5jb2x1bW5PZmZzZXRMZWZ0ICsgb2Zmc2V0WFxuICAgICAgbGV0IG5ld1dpZHRoID0gdG90V2lkdGg7XG4gICAgICBpZiAoISF0aGlzLm1heFdpZHRoKSB7XG4gICAgICAgIC8vIG5ld1dpZHRoID0gdG90V2lkdGggPiArdGhpcy5tYXhXaWR0aCEgPyArdGhpcy5tYXhXaWR0aCEgOiArdG90V2lkdGg7XG4gICAgICAgIG5ld1dpZHRoID0gTWF0aC5taW4obmV3V2lkdGgsICt0aGlzLm1heFdpZHRoISk7XG4gICAgICB9XG4gICAgICBpZiAoISF0aGlzLm1pbldpZHRoKSB7XG4gICAgICAgIC8vIG5ld1dpZHRoID0gdG90V2lkdGggPCArdGhpcy5taW5XaWR0aCEgPyArdGhpcy5taW5XaWR0aCEgOiArdG90V2lkdGg7XG4gICAgICAgIG5ld1dpZHRoID0gTWF0aC5tYXgobmV3V2lkdGgsICt0aGlzLm1pbldpZHRoISk7XG4gICAgICB9XG4gICAgICB0aGlzLnVwZGF0ZUNvbHVtbldpZHRoKG5ld1dpZHRoKTtcbiAgICAgIHRoaXMudXBkYXRlZENvbHVtbldpZHRoLmVtaXQobmV3V2lkdGgpO1xuICAgIH0pXG4gIH1cblxuICB1cGRhdGVDb2x1bW5XaWR0aChuZXdXaWR0aDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuY29sdW1uQ29udGFpbmVyRWxlbWVudCkgdGhpcy5jb2x1bW5Db250YWluZXJFbGVtZW50LnN0eWxlLndpZHRoID1gJHtuZXdXaWR0aH1weGA7XG4gIH1cblxuICBhZGRDb2x1bW5SZXNpemVTdHlsZSgpIHtcbiAgICAvLyBjb25zdCBkYXRhZ3JpZEhlaWdodCA9IHRoaXMuZWxlbWVudE1hbmFnZXIuZ2V0RGF0YWdyaWRFbERpbWVuc3Rpb25zKCk/LmhlaWdodDtcbiAgICAvLyBpZiAodGhpcy5pc1Jlc2l6aW5nKSB7XG4gICAgLy8gICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHtkYXRhZ3JpZEhlaWdodCAtIDEwfXB4YDtcbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7ZGF0YWdyaWRIZWlnaHR9cHhgO1xuICAgIC8vIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50J10pXG4gIG1vdXNlRG93bkV2ZW50KGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLmNvbHVtbkNvbnRhaW5lckVsZW1lbnQgPSAoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5wYXJlbnRFbGVtZW50Py5wYXJlbnRFbGVtZW50Py5wYXJlbnRFbGVtZW50O1xuICAgIHRoaXMuY29sdW1uT2Zmc2V0TGVmdCA9IGV2ZW50LmNsaWVudFggLSAodGhpcy5jb2x1bW5Db250YWluZXJFbGVtZW50Py5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKT8ubGVmdCB8fCAwKTtcbiAgICB0aGlzLm1vdXNlRG93bi5uZXh0KGV2ZW50KTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBmcm9tRXZlbnQodGhpcy5kb2N1bWVudC5ib2R5LCAnbW91c2Vtb3ZlJykucGlwZShcbiAgICAgICAgdGFrZVVudGlsKHRoaXMuZGVzdHJveSQpXG4gICAgICApLnN1YnNjcmliZSgoZXZlbnQpID0+IHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdGhpcy5tb3VzZU1vdmUubmV4dChldmVudCk7XG4gICAgICB9KTtcblxuICAgICAgZnJvbUV2ZW50KHRoaXMuZG9jdW1lbnQuYm9keSwgJ21vdXNldXAnKS5waXBlKFxuICAgICAgICB0YWtlVW50aWwodGhpcy5kZXN0cm95JClcbiAgICAgICkuc3Vic2NyaWJlKChldmVudCkgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAodGhpcy5pc1Jlc2l6aW5nKSB7XG4gICAgICAgICAgdGhpcy5pc1Jlc2l6aW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5hZGRDb2x1bW5SZXNpemVTdHlsZSgpO1xuICAgICAgICAgIHRoaXMuY29sdW1uU2l6aW5nLnJlQ2FsY1dpZHRoLm5leHQodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tb3VzZVVwLm5leHQoZXZlbnQpO1xuICAgICAgfSk7XG5cbiAgICAgIGZyb21FdmVudCh3aW5kb3csICdyZXNpemUnKS5waXBlKFxuICAgICAgICB0YWtlVW50aWwodGhpcy5kZXN0cm95JClcbiAgICAgICkuc3Vic2NyaWJlKChldmVudCkgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLmNvbHVtblNpemluZy5yZUNhbGNXaWR0aC5uZXh0KHRydWUpO1xuICAgICAgfSk7XG4gICAgfSlcbiAgfVxufVxuIl19