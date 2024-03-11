import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Inject, Input, NgZone, OnInit, Output, inject } from '@angular/core';
import { Subject, fromEvent, map, switchMap, takeUntil, tap } from 'rxjs';

import { ColumnSizingService } from '../../services/column-sizing.service';
import { ElementManagerService } from '../../services/element-manager.service';

@Directive({
  selector: '[presentableColumnResizer]'
})
export class ColumnResizeDirective implements OnInit, AfterViewInit{

  @Input() minWidth: number | string | undefined = '';

  @Input() maxWidth: number | string | undefined = '';

  @Output() updatedColumnWidth: EventEmitter<number> = new EventEmitter();

  @HostBinding('class.resizing')
  get isColumnResizing() {
    return this.isResizing;
  }

  mouseDown: Subject<any> = new Subject();
  mouseMove: Subject<any> = new Subject();
  mouseUp: Subject<any> = new Subject();
  columnOffsetLeft: number = 0;
  isResizing: boolean = false;
  defaultResizerHeight: number = 0;

  destroy$: Subject<boolean> = new Subject();
  columnContainerElement: HTMLElement | null | undefined;
  elementManager: ElementManagerService = inject(ElementManagerService);

  constructor(
    public zone: NgZone,
    private columnSizing: ColumnSizingService,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) public document: Document,
  ) {

  }

  ngAfterViewInit(): void {
    this.defaultResizerHeight = this.elementRef.nativeElement.getBoundingClientRect().height;
    
    this.mouseDown.pipe(
      takeUntil(this.destroy$),
      map((event: MouseEvent) => event.clientX),
      switchMap((startOffset: number) => this.mouseMove.pipe(
        takeUntil(this.mouseUp),
        map((event: MouseEvent) => event.clientX - startOffset)
        )
      )
    ).subscribe((offsetX) => {
      this.isResizing = true;
      this.addColumnResizeStyle();
      const totWidth = this.columnOffsetLeft + offsetX
      let newWidth = totWidth;
      if (!!this.maxWidth) {
        // newWidth = totWidth > +this.maxWidth! ? +this.maxWidth! : +totWidth;
        newWidth = Math.min(newWidth, +this.maxWidth!);
      }
      if (!!this.minWidth) {
        // newWidth = totWidth < +this.minWidth! ? +this.minWidth! : +totWidth;
        newWidth = Math.max(newWidth, +this.minWidth!);
      }
      this.updateColumnWidth(newWidth);
      this.updatedColumnWidth.emit(newWidth);
    })
  }

  updateColumnWidth(newWidth: number) {
    if (this.columnContainerElement) this.columnContainerElement.style.width =`${newWidth}px`;
  }

  addColumnResizeStyle() {
    // const datagridHeight = this.elementManager.getDatagridElDimenstions()?.height;
    // if (this.isResizing) {
    //   this.elementRef.nativeElement.style.height = `${datagridHeight - 10}px`;
    // } else {
    //   this.elementRef.nativeElement.style.height = `${datagridHeight}px`;
    // }
  }

  @HostListener('mousedown', ['$event'])
  mouseDownEvent(event: MouseEvent) {
    event.preventDefault();
    this.columnContainerElement = (event.target as HTMLElement).parentElement?.parentElement?.parentElement;
    this.columnOffsetLeft = event.clientX - (this.columnContainerElement?.getBoundingClientRect()?.left || 0);
    this.mouseDown.next(event);
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      fromEvent(this.document.body, 'mousemove').pipe(
        takeUntil(this.destroy$)
      ).subscribe((event) => {
        event.preventDefault();
        this.mouseMove.next(event);
      });

      fromEvent(this.document.body, 'mouseup').pipe(
        takeUntil(this.destroy$)
      ).subscribe((event) => {
        event.preventDefault();
        if (this.isResizing) {
          this.isResizing = false;
          this.addColumnResizeStyle();
          this.columnSizing.reCalcWidth.next(true);
        }
        this.mouseUp.next(event);
      });

      fromEvent(window, 'resize').pipe(
        takeUntil(this.destroy$)
      ).subscribe((event) => {
        event.preventDefault();
        this.columnSizing.reCalcWidth.next(true);
      });
    })
  }
}
