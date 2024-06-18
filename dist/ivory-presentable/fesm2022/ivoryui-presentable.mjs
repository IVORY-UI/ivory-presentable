import * as i0 from '@angular/core';
import { EventEmitter, Directive, Output, HostListener, Injectable, inject, Inject, Input, HostBinding, Component, ViewChild, NgModule } from '@angular/core';
import * as i2 from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Subject, takeUntil, map, switchMap, fromEvent, BehaviorSubject, delay } from 'rxjs';
import * as i2$1 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

class ClickOutsideDirective {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.clickOutside = new EventEmitter();
    }
    onClick(event) {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.clickOutside.emit(event);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ClickOutsideDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.1", type: ClickOutsideDirective, selector: "[presentableClickOutside]", outputs: { clickOutside: "clickOutside" }, host: { listeners: { "document:click": "onClick($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ClickOutsideDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[presentableClickOutside]'
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { clickOutside: [{
                type: Output
            }], onClick: [{
                type: HostListener,
                args: ['document:click', ['$event']]
            }] } });

class ElementManagerService {
    registerDatagridEl(datagrid) {
        this.datagrid = datagrid;
    }
    getDatagridEl() {
        return this.datagrid;
    }
    getDatagridElDimenstions() {
        return this.datagrid?.getBoundingClientRect() || {};
    }
    registerDatagridHeaderEl(datagridHeader) {
        this.datagridHeader = datagridHeader;
    }
    getDatagridHeaderEl() {
        return this.datagridHeader;
    }
    registerDatagridSelectAllEl(datagridHeader) {
        this.datagridSelectAll = datagridHeader;
    }
    getDatagridSelectAllEl() {
        return this.datagridSelectAll;
    }
    getDatagridHeaderElDimenstions() {
        return this.datagridHeader?.getBoundingClientRect() || {};
    }
    registerDatagridBodyEl(datagridBody) {
        this.datagridBody = datagridBody;
    }
    getDatagridBodyEl() {
        return this.datagridBody;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ElementManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ElementManagerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ElementManagerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

const PRESENTABLE_CONFIG = {
    headerSpace: {
        height: 45
    },
    filterSpace: {
        height: 45,
    },
    column: {
        headHeight: 45,
        minWidth: 80
    },
    paginator: {
        height: 45
    }
};

class ColumnSizingService {
    constructor() {
        this.reCalcWidth = new Subject();
        this.elementManager = inject(ElementManagerService);
    }
    processColumnOptions(columns) {
        return columns.map((column) => {
            column.initialWidth = column.width || 0;
            column.minWidth = column.minWidth || PRESENTABLE_CONFIG.column.minWidth;
            column.width = Math.max(column.initialWidth, column.minWidth);
            return column;
        });
    }
    getColumnsTotWidth(columns) {
        let totWidth = 0;
        columns.forEach((column) => {
            if (!column.visible) {
                return;
            }
            totWidth += +(column.width || 0);
        });
        return totWidth;
    }
    getAvailableWidth(columns) {
        let headerEl = this.elementManager.getDatagridEl();
        let recordSelectionEl = this.elementManager.getDatagridSelectAllEl();
        return headerEl.getBoundingClientRect()?.width - this.getColumnsTotWidth(columns) - recordSelectionEl.getBoundingClientRect()?.width;
    }
    reCalcColumnWidth(columns) {
        let spaceAvailable = this.getAvailableWidth(columns);
        let bodyEl = this.elementManager.getDatagridBodyEl();
        let scrollbarWidth = bodyEl ? bodyEl.offsetWidth - bodyEl.clientWidth : 0;
        spaceAvailable -= scrollbarWidth;
        let flexColumns = [], nonFlexColumns = [];
        columns.forEach((column) => {
            if (!column.forcedWidth) {
                if (!!column.widthGrow && !column.initialWidth)
                    flexColumns.push(column);
                else
                    nonFlexColumns.push(column);
            }
        });
        flexColumns.forEach((column) => {
            const currentWidth = +(column.width || 1);
            const newWidth = (currentWidth * (column.widthGrow || 1));
            column.width = newWidth;
            spaceAvailable -= (newWidth - currentWidth);
        });
        if (spaceAvailable > 0) {
            if (nonFlexColumns.length) {
                let dividedWidth = Math.floor(spaceAvailable / nonFlexColumns?.length);
                nonFlexColumns.forEach((column) => {
                    const currentWidth = +(column.width || 0);
                    column.width = currentWidth + dividedWidth;
                });
            }
        }
        return columns;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ColumnSizingService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ColumnSizingService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ColumnSizingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });

class ColumnResizeDirective {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ColumnResizeDirective, deps: [{ token: i0.NgZone }, { token: ColumnSizingService }, { token: i0.ElementRef }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.1", type: ColumnResizeDirective, selector: "[presentableColumnResizer]", inputs: { minWidth: "minWidth", maxWidth: "maxWidth" }, outputs: { updatedColumnWidth: "updatedColumnWidth" }, host: { listeners: { "mousedown": "mouseDownEvent($event)" }, properties: { "class.resizing": "this.isColumnResizing" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ColumnResizeDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[presentableColumnResizer]'
                }]
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: ColumnSizingService }, { type: i0.ElementRef }, { type: Document, decorators: [{
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

class PresentableColumnResizerComponent {
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
  `, isInline: true, styles: [".ivpt-resize-anchor{cursor:ew-resize;width:2px;height:1.2rem;background-color:#c9d7e1}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: ColumnResizeDirective, selector: "[presentableColumnResizer]", inputs: ["minWidth", "maxWidth"], outputs: ["updatedColumnWidth"] }] }); }
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

class PresentableColumnControlsComponent {
    constructor(columnSizing) {
        this.columnSizing = columnSizing;
        this._showController = false;
        this.isDraggingOver = false;
        this.updatedColumns = new EventEmitter;
    }
    onDragStart(event, item) {
        console.log('drag started');
        this.draggingItem = item;
    }
    onDragOver(event) {
        event.preventDefault();
        console.log('dragging');
    }
    onDrop(event, index) {
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
    getDropIndex(event) {
        const target = event.target;
        const targetIndex = Array.from(target.parentNode.children).indexOf(target);
        return targetIndex;
    }
    toggleColumn(column) {
        column.visible = !column.visible;
        this.columnSizing.reCalcWidth.next(true);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PresentableColumnControlsComponent, deps: [{ token: ColumnSizingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.2.1", type: PresentableColumnControlsComponent, selector: "presentable-column-controls", inputs: { columns: "columns" }, outputs: { updatedColumns: "updatedColumns" }, ngImport: i0, template: "<div class=\"ivpt-column-controller\">\n  <button class=\"ivpt-column-controller-handle\" (click)=\"_showController=!_showController\">\n    Columns\n  </button>\n  \n  <div \n    class=\"ivpt-column-controller-modal\"\n    [ngStyle]=\"{'visibility': _showController ? 'visible' : 'hidden'}\"\n  >\n    <div class=\"ivpt-column-select-container\">\n      @for (colItem of columns; track colItem; let i=$index) {\n        <div \n          class=\"ivpt-column-select-item\" \n          [ngClass]=\"{'highlighted': isDraggingOver}\"\n          [style.top.rem]=\"(i * 2.4)\"\n          draggable=\"true\"\n          (dragstart)=\"onDragStart($event, colItem)\"\n          (dragover)=\"onDragOver($event)\"\n          (drop)=\"onDrop($event, i)\"\n        >\n          <input \n            type=\"checkbox\" \n            id=\"colItem.field\" \n            value=\"colItem.field\" \n            [checked]=\"colItem.visible\"\n            (change)=\"toggleColumn(colItem)\"\n          >\n          <label for=\"colItem.field\">{{colItem.title}}</label>\n      </div>\n      }\n    </div>\n  </div>\n</div>\n", styles: ["*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box;color:#212529;font-size:14px}.ivpt-flex-cell{flex:1}.ivpt-select-cell{display:flex;width:36px;justify-content:center;align-items:center}.ivpt-button{border:none;border-radius:.25rem;background-color:#c8dbee;height:1.5rem;line-height:1.5rem;padding:0 .5rem;cursor:pointer}.ivpt-column-controller{display:flex;height:100%;align-items:center;padding:0 1rem}.ivpt-column-controller-handle{border:none;border-radius:.25rem;background-color:#c8dbee;height:1.5rem;line-height:1.5rem;padding:0 .5rem;cursor:pointer}.ivpt-column-controller-handle:hover,.ivpt-column-controller-handle:focus{background-color:#859fb4}.ivpt-column-controller-modal{position:absolute;top:45px;background-color:#fff;width:15rem;z-index:9999;right:0;height:calc(100% - 45px);border:1px solid #CDD4D9;border-radius:0 0 .4rem}.ivpt-column-controller .ivpt-column-select-container{position:relative;height:100%}.ivpt-column-controller .ivpt-column-select-item{cursor:move;position:absolute;left:.5rem;width:calc(100% - 1rem);height:2rem;border:1px solid #ccc;border-radius:5px;background-color:#eef3f8;transition:transform .2s ease-in-out}.ivpt-column-controller .ivpt-column-select-item label{padding-left:.5rem;line-height:2rem}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PresentableColumnControlsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'presentable-column-controls', template: "<div class=\"ivpt-column-controller\">\n  <button class=\"ivpt-column-controller-handle\" (click)=\"_showController=!_showController\">\n    Columns\n  </button>\n  \n  <div \n    class=\"ivpt-column-controller-modal\"\n    [ngStyle]=\"{'visibility': _showController ? 'visible' : 'hidden'}\"\n  >\n    <div class=\"ivpt-column-select-container\">\n      @for (colItem of columns; track colItem; let i=$index) {\n        <div \n          class=\"ivpt-column-select-item\" \n          [ngClass]=\"{'highlighted': isDraggingOver}\"\n          [style.top.rem]=\"(i * 2.4)\"\n          draggable=\"true\"\n          (dragstart)=\"onDragStart($event, colItem)\"\n          (dragover)=\"onDragOver($event)\"\n          (drop)=\"onDrop($event, i)\"\n        >\n          <input \n            type=\"checkbox\" \n            id=\"colItem.field\" \n            value=\"colItem.field\" \n            [checked]=\"colItem.visible\"\n            (change)=\"toggleColumn(colItem)\"\n          >\n          <label for=\"colItem.field\">{{colItem.title}}</label>\n      </div>\n      }\n    </div>\n  </div>\n</div>\n", styles: ["*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box;color:#212529;font-size:14px}.ivpt-flex-cell{flex:1}.ivpt-select-cell{display:flex;width:36px;justify-content:center;align-items:center}.ivpt-button{border:none;border-radius:.25rem;background-color:#c8dbee;height:1.5rem;line-height:1.5rem;padding:0 .5rem;cursor:pointer}.ivpt-column-controller{display:flex;height:100%;align-items:center;padding:0 1rem}.ivpt-column-controller-handle{border:none;border-radius:.25rem;background-color:#c8dbee;height:1.5rem;line-height:1.5rem;padding:0 .5rem;cursor:pointer}.ivpt-column-controller-handle:hover,.ivpt-column-controller-handle:focus{background-color:#859fb4}.ivpt-column-controller-modal{position:absolute;top:45px;background-color:#fff;width:15rem;z-index:9999;right:0;height:calc(100% - 45px);border:1px solid #CDD4D9;border-radius:0 0 .4rem}.ivpt-column-controller .ivpt-column-select-container{position:relative;height:100%}.ivpt-column-controller .ivpt-column-select-item{cursor:move;position:absolute;left:.5rem;width:calc(100% - 1rem);height:2rem;border:1px solid #ccc;border-radius:5px;background-color:#eef3f8;transition:transform .2s ease-in-out}.ivpt-column-controller .ivpt-column-select-item label{padding-left:.5rem;line-height:2rem}\n"] }]
        }], ctorParameters: () => [{ type: ColumnSizingService }], propDecorators: { columns: [{
                type: Input
            }], updatedColumns: [{
                type: Output
            }] } });

class PageManagerService {
    constructor() {
        this.currentPageSub = new BehaviorSubject(1);
        this.currentPage$ = this.currentPageSub.asObservable();
    }
    updateCurrentPage(value) {
        this.currentPageSub.next(value);
    }
    resetPagination() {
        this.updateCurrentPage(1);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PageManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PageManagerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PageManagerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

class PresentablePaginatorComponent {
    set recordsPerPageOptions(value) {
        this._records.options = value;
    }
    set recordsPerPage(value) {
        this._records.perPage = value;
    }
    set recordsTotal(value) {
        this._records.total = value;
        this._page.total = Math.ceil(this._records.total / this._records.perPage);
        this._showPagination = this._records.total > this._records.perPage;
    }
    constructor(pageManager) {
        this.pageManager = pageManager;
        this._showPagination = false;
        this._records = {};
        this._page = {
            'total': 1,
            'current': 1,
            'goto': 1
        };
        this.pageChange = new EventEmitter();
    }
    ngOnInit() {
        // The below current page subscription is being used only for the pagination reset usecase
        this.pageManager.currentPage$.subscribe((value) => {
            this._page.current = this._page.goto = value;
        });
    }
    updatePerPageRecords() {
        this._page.goto = this._page.current = 1;
        this._page.total = Math.ceil(this._records.total / this._records.perPage);
        this.pageChange.emit({ 'from': 1, 'to': this._records.perPage });
    }
    goto(pageNumber) {
        if (pageNumber !== null && pageNumber !== undefined && pageNumber !== this._page.current) {
            const startRecord = (pageNumber - 1) * this._records.perPage;
            const endRecord = ((startRecord + this._records.perPage) > this._records.total) ? this._records.total : startRecord + this._records.perPage;
            this.pageChange.emit({ 'from': startRecord, 'to': endRecord });
            this._page.goto = this._page.current = pageNumber;
        }
        else {
            if (this._page.goto < 1) {
                this._page.goto = 1;
            }
            else if (this._page.goto > this._page.total) {
                this._page.goto = this._page.total;
            }
            this.goto(this._page.goto);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PresentablePaginatorComponent, deps: [{ token: PageManagerService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.2.1", type: PresentablePaginatorComponent, selector: "presentable-paginator", inputs: { recordsPerPageOptions: "recordsPerPageOptions", recordsPerPage: "recordsPerPage", recordsTotal: "recordsTotal" }, outputs: { pageChange: "pageChange" }, ngImport: i0, template: "<div class=\"ivpt-records-summary\" role=\"status\">\n  <span>\n    {{((_page.current-1)*_records.perPage)+1}}\n  </span>\n  &nbsp;\n  <span> to </span>\n  &nbsp;\n  <span>\n    @if (_records.total < (_page.current*_records.perPage)) {\n      {{_records.total}}\n    } @else {\n      {{_page.current * _records.perPage}}\n    }\n  </span>\n  &nbsp;\n  <span> of </span>\n  &nbsp;\n  <span>\n    {{_records.total}}\n  </span>\n</div>\n\n<div class=\"ivpt-records-options\" role=\"presentation\">\n  <label for=\"records-per-page\" aria-hidden=\"false\">\n    Records per page: \n  </label>\n  &nbsp;\n  <select name=\"perPageOptions\" \n    id=\"records-per-page\" \n    tabindex=\"0\"\n    [(ngModel)]=\"_records.perPage\" \n    (change)=\"updatePerPageRecords()\"\n  >\n    @for (p of _records.options; track p) {\n      <option [ngValue]=\"p\">\n        {{ p }}\n      </option>\n    }\n  </select>\n</div>\n\n<div class=\"ivpt-records-paging\">\n  @if (_showPagination) {\n    <button type=\"button\" \n      aria-label=\"First page\" \n      tabindex=\"0\"\n      class=\"ivpt-paginator-button\" \n      [disabled]=\"_page.current===1\"\n      [attr.aria-disabled]=\"_page.current===1\"\n      (click)=\"goto(1)\"\n    >\n      &laquo;\n    </button>\n    \n    <button type=\"button\" \n      aria-label=\"Previous page\" \n      tabindex=\"0\"\n      class=\"ivpt-paginator-button\" \n      [disabled]=\"_page.current===1\"\n      [attr.aria-disabled]=\"_page.current===1\" \n      (click)=\"goto(_page.current-1)\"\n    >\n      &lsaquo;\n    </button>\n\n    <input\n      class=\"ivpt-paging-input\"\n      type=\"number\"\n      size=\"2\"\n      [(ngModel)]=\"_page.goto\"\n      (keydown.enter)=\"goto(null)\"\n    />\n    <span>{{ ' / '+_page.total }}</span>\n\n    <button type=\"button\"\n      aria-label=\"Next page\" \n      tabindex=\"0\"\n      class=\"ivpt-paginator-button\" \n      [disabled]=\"_page.current===_page.total\" \n      [attr.aria-disabled]=\"_page.current===_page.total\" \n      (click)=\"goto(_page.current+1)\"\n    >\n      &rsaquo;\n    </button>\n\n    <button type=\"button\"\n      aria-label=\"Last page\" \n      tabindex=\"0\"\n      class=\"ivpt-paginator-button\" \n      [disabled]=\"_page.current===_page.total\" \n      [attr.aria-disabled]=\"_page.current===_page.total\" \n      (click)=\"goto(_page.total)\"\n    >\n      &raquo;\n    </button>\n  }\n</div>\n", styles: [".ivpt-records-paging,.ivpt-records-options,.ivpt-records-summary{display:flex;flex:1;align-items:center}:host{display:flex;width:100%;justify-content:space-between}.ivpt-records-options{justify-content:center}.ivpt-records-paging{justify-content:flex-end}.ivpt-paging-input{width:24px;margin:0 .5rem;-moz-appearance:textfield}.ivpt-paging-input::-webkit-inner-spin-button,.ivpt-paging-input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.ivpt-paginator-button{border:none;border-radius:.25rem;background-color:#c8dbee;height:1.5rem;line-height:1.5rem;padding:0 .5rem;cursor:pointer;margin:0 0 0 12px}.ivpt-paginator-button:hover,.ivpt-paginator-button:focus{background-color:#859fb4}\n"], dependencies: [{ kind: "directive", type: i2$1.NgSelectOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i2$1.ɵNgSelectMultipleOption, selector: "option", inputs: ["ngValue", "value"] }, { kind: "directive", type: i2$1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2$1.NumberValueAccessor, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]" }, { kind: "directive", type: i2$1.SelectControlValueAccessor, selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]", inputs: ["compareWith"] }, { kind: "directive", type: i2$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PresentablePaginatorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'presentable-paginator', template: "<div class=\"ivpt-records-summary\" role=\"status\">\n  <span>\n    {{((_page.current-1)*_records.perPage)+1}}\n  </span>\n  &nbsp;\n  <span> to </span>\n  &nbsp;\n  <span>\n    @if (_records.total < (_page.current*_records.perPage)) {\n      {{_records.total}}\n    } @else {\n      {{_page.current * _records.perPage}}\n    }\n  </span>\n  &nbsp;\n  <span> of </span>\n  &nbsp;\n  <span>\n    {{_records.total}}\n  </span>\n</div>\n\n<div class=\"ivpt-records-options\" role=\"presentation\">\n  <label for=\"records-per-page\" aria-hidden=\"false\">\n    Records per page: \n  </label>\n  &nbsp;\n  <select name=\"perPageOptions\" \n    id=\"records-per-page\" \n    tabindex=\"0\"\n    [(ngModel)]=\"_records.perPage\" \n    (change)=\"updatePerPageRecords()\"\n  >\n    @for (p of _records.options; track p) {\n      <option [ngValue]=\"p\">\n        {{ p }}\n      </option>\n    }\n  </select>\n</div>\n\n<div class=\"ivpt-records-paging\">\n  @if (_showPagination) {\n    <button type=\"button\" \n      aria-label=\"First page\" \n      tabindex=\"0\"\n      class=\"ivpt-paginator-button\" \n      [disabled]=\"_page.current===1\"\n      [attr.aria-disabled]=\"_page.current===1\"\n      (click)=\"goto(1)\"\n    >\n      &laquo;\n    </button>\n    \n    <button type=\"button\" \n      aria-label=\"Previous page\" \n      tabindex=\"0\"\n      class=\"ivpt-paginator-button\" \n      [disabled]=\"_page.current===1\"\n      [attr.aria-disabled]=\"_page.current===1\" \n      (click)=\"goto(_page.current-1)\"\n    >\n      &lsaquo;\n    </button>\n\n    <input\n      class=\"ivpt-paging-input\"\n      type=\"number\"\n      size=\"2\"\n      [(ngModel)]=\"_page.goto\"\n      (keydown.enter)=\"goto(null)\"\n    />\n    <span>{{ ' / '+_page.total }}</span>\n\n    <button type=\"button\"\n      aria-label=\"Next page\" \n      tabindex=\"0\"\n      class=\"ivpt-paginator-button\" \n      [disabled]=\"_page.current===_page.total\" \n      [attr.aria-disabled]=\"_page.current===_page.total\" \n      (click)=\"goto(_page.current+1)\"\n    >\n      &rsaquo;\n    </button>\n\n    <button type=\"button\"\n      aria-label=\"Last page\" \n      tabindex=\"0\"\n      class=\"ivpt-paginator-button\" \n      [disabled]=\"_page.current===_page.total\" \n      [attr.aria-disabled]=\"_page.current===_page.total\" \n      (click)=\"goto(_page.total)\"\n    >\n      &raquo;\n    </button>\n  }\n</div>\n", styles: [".ivpt-records-paging,.ivpt-records-options,.ivpt-records-summary{display:flex;flex:1;align-items:center}:host{display:flex;width:100%;justify-content:space-between}.ivpt-records-options{justify-content:center}.ivpt-records-paging{justify-content:flex-end}.ivpt-paging-input{width:24px;margin:0 .5rem;-moz-appearance:textfield}.ivpt-paging-input::-webkit-inner-spin-button,.ivpt-paging-input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.ivpt-paginator-button{border:none;border-radius:.25rem;background-color:#c8dbee;height:1.5rem;line-height:1.5rem;padding:0 .5rem;cursor:pointer;margin:0 0 0 12px}.ivpt-paginator-button:hover,.ivpt-paginator-button:focus{background-color:#859fb4}\n"] }]
        }], ctorParameters: () => [{ type: PageManagerService }], propDecorators: { recordsPerPageOptions: [{
                type: Input
            }], recordsPerPage: [{
                type: Input
            }], recordsTotal: [{
                type: Input
            }], pageChange: [{
                type: Output
            }] } });

class PresentableTextFilterComponent {
    constructor() {
        this._keyword = '';
        this.whenApplied = new EventEmitter();
    }
    emitApplied(value) {
        this.whenApplied.emit(value);
    }
    applyFilter() {
        console.log('The keyword is - ', this._keyword);
        this.emitApplied({ 'column': this.column['field'], 'type': this.column['filterType'], 'keyword': this._keyword });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PresentableTextFilterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.2.1", type: PresentableTextFilterComponent, selector: "presentable-text-filter", inputs: { column: "column" }, outputs: { whenApplied: "whenApplied" }, ngImport: i0, template: `
    <input 
      class="ivpt-filter-input"
      type="text" 
      [name]="column.field"
      id="{{column.field}}"
      [(ngModel)]="_keyword"
      (keydown.enter)="applyFilter()" 
    />
  `, isInline: true, styles: [".ivpt-filter-input{width:100%}\n"], dependencies: [{ kind: "directive", type: i2$1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PresentableTextFilterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'presentable-text-filter', template: `
    <input 
      class="ivpt-filter-input"
      type="text" 
      [name]="column.field"
      id="{{column.field}}"
      [(ngModel)]="_keyword"
      (keydown.enter)="applyFilter()" 
    />
  `, styles: [".ivpt-filter-input{width:100%}\n"] }]
        }], propDecorators: { column: [{
                type: Input
            }], whenApplied: [{
                type: Output
            }] } });

class FilterManagerService {
    constructor() {
        this.queryModel = {};
    }
    processFilterOptions(arr) {
        let temp = [];
        for (const i of arr) {
            temp.push({ option: i, isSelected: false });
        }
        return temp;
    }
    buildQueryModel(data) {
        if (this.queryModel[data.column] === undefined || this.queryModel[data.column] === null) {
            this.queryModel[data.column] = {};
        }
        if (data.type === 'options') {
            if (data.values.length > 0) {
                this.queryModel[data.column]['type'] = data['type'];
                this.queryModel[data.column]['values'] = data['values'];
            }
            else {
                delete this.queryModel[data.column];
            }
        }
        else if (data.type === 'text') {
            if (data.keyword !== '') {
                this.queryModel[data.column]['type'] = data['type'];
                this.queryModel[data.column]['keyword'] = data['keyword'];
            }
            else {
                delete this.queryModel[data.column];
            }
        }
    }
    getQueryModel() {
        return this.queryModel;
    }
    resetQueryModel() {
        this.queryModel = {};
    }
    filterData(data, query) {
        const filtered = data.filter((item) => {
            for (let key in query) {
                if (query[key]['type'] === 'text') {
                    const regexp = new RegExp(query[key]['keyword'], 'i');
                    if (!regexp.test(item[key])) {
                        return false;
                    }
                }
                else if (query[key]['type'] === 'options') {
                    if (!query[key]['values'].includes(item[key])) {
                        return false;
                    }
                }
            }
            return true;
        });
        return filtered;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: FilterManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: FilterManagerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: FilterManagerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });

class PresentableOptionsFilterComponent {
    set taxonomy(value) {
        this._taxonomy = this.filterManager.processFilterOptions(value);
    }
    get taxonomy() {
        return this._taxonomy;
    }
    emitApplied(value) {
        this.whenApplied.emit(value);
    }
    constructor(filterManager) {
        this.filterManager = filterManager;
        this._showPopover = false;
        this._taxonomy = [];
        this.whenApplied = new EventEmitter();
    }
    toggleFilterPopover() {
        this._showPopover = !this._showPopover;
    }
    applyFilter() {
        this.toggleFilterPopover();
        let appliedObjects = [];
        for (const item of this._taxonomy) {
            if (item['isSelected'] === true) {
                appliedObjects.push(item['option']);
            }
        }
        this.emitApplied({ 'column': this.column['field'], 'type': this.column['filterType'], 'values': appliedObjects });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PresentableOptionsFilterComponent, deps: [{ token: FilterManagerService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.2.1", type: PresentableOptionsFilterComponent, selector: "presentable-options-filter", inputs: { column: "column", taxonomy: "taxonomy" }, outputs: { whenApplied: "whenApplied" }, ngImport: i0, template: "<button \n  class=\"ivpt-filter-trigger\"\n  [id]=\"'filter_handle_'+column.field\"\n  (click)=\"toggleFilterPopover()\"\n>\n  Filter\n</button>\n@if (_showPopover) {\n  <div\n    class=\"ivpt-filter-popover\" \n    aria-label=\"filter options\" \n    role=\"presentation\"\n  >\n    <ul class=\"ivpt-filter-options\">\n      @for (optionItem of _taxonomy; track optionItem) {\n        <li class=\"ivpt-filter-option\">\n          <input \n            type=\"checkbox\" \n            [name]=\"optionItem.option\" \n            id=\"{{column.field}}_{{optionItem.option}}\"\n            [(ngModel)]=\"optionItem.isSelected\"\n          />\n          <label class=\"filter-option-label\" for=\"{{column.field}}_{{optionItem.option}}\">\n            {{optionItem.option}}\n          </label>\n        </li>\n      }\n    </ul>\n    <button class=\"ivpt-filter-apply\" (click)=\"applyFilter()\">Apply</button>\n  </div>\n}\n", styles: ["*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box;color:#212529;font-size:14px}.ivpt-flex-cell{flex:1}.ivpt-select-cell{display:flex;width:36px;justify-content:center;align-items:center}.ivpt-button{border:none;border-radius:.25rem;background-color:#c8dbee;height:1.5rem;line-height:1.5rem;padding:0 .5rem;cursor:pointer}.ivpt-filter-popover{display:block;position:absolute;top:100%;background:#fff;border:1px solid #CDD4D9;z-index:999;padding:1rem;min-width:200px}.ivpt-filter-options{padding:0;margin:0 0 16px;max-height:200px;overflow:scroll}.ivpt-filter-option{list-style:none;line-height:1.5rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n"], dependencies: [{ kind: "directive", type: i2$1.CheckboxControlValueAccessor, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]" }, { kind: "directive", type: i2$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PresentableOptionsFilterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'presentable-options-filter', template: "<button \n  class=\"ivpt-filter-trigger\"\n  [id]=\"'filter_handle_'+column.field\"\n  (click)=\"toggleFilterPopover()\"\n>\n  Filter\n</button>\n@if (_showPopover) {\n  <div\n    class=\"ivpt-filter-popover\" \n    aria-label=\"filter options\" \n    role=\"presentation\"\n  >\n    <ul class=\"ivpt-filter-options\">\n      @for (optionItem of _taxonomy; track optionItem) {\n        <li class=\"ivpt-filter-option\">\n          <input \n            type=\"checkbox\" \n            [name]=\"optionItem.option\" \n            id=\"{{column.field}}_{{optionItem.option}}\"\n            [(ngModel)]=\"optionItem.isSelected\"\n          />\n          <label class=\"filter-option-label\" for=\"{{column.field}}_{{optionItem.option}}\">\n            {{optionItem.option}}\n          </label>\n        </li>\n      }\n    </ul>\n    <button class=\"ivpt-filter-apply\" (click)=\"applyFilter()\">Apply</button>\n  </div>\n}\n", styles: ["*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box;color:#212529;font-size:14px}.ivpt-flex-cell{flex:1}.ivpt-select-cell{display:flex;width:36px;justify-content:center;align-items:center}.ivpt-button{border:none;border-radius:.25rem;background-color:#c8dbee;height:1.5rem;line-height:1.5rem;padding:0 .5rem;cursor:pointer}.ivpt-filter-popover{display:block;position:absolute;top:100%;background:#fff;border:1px solid #CDD4D9;z-index:999;padding:1rem;min-width:200px}.ivpt-filter-options{padding:0;margin:0 0 16px;max-height:200px;overflow:scroll}.ivpt-filter-option{list-style:none;line-height:1.5rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n"] }]
        }], ctorParameters: () => [{ type: FilterManagerService }], propDecorators: { column: [{
                type: Input
            }], taxonomy: [{
                type: Input
            }], whenApplied: [{
                type: Output
            }] } });

class PresentableRowComponent {
    constructor() {
        this.onSelection = new EventEmitter();
    }
    whenRowSelected($event, rowData) {
        this.onSelection.emit({ 'selected': $event.target.checked, 'row': rowData });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PresentableRowComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.2.1", type: PresentableRowComponent, selector: "presentable-row", inputs: { columns: "columns", rowIndex: "rowIndex", rowSelectionEnabled: "rowSelectionEnabled", rowData: "rowData" }, outputs: { onSelection: "onSelection" }, ngImport: i0, template: "<div \n  class=\"ivpt-content-row\" \n  role=\"row\"\n  attr.aria-rowindex=\"{{rowIndex+2}}\" \n  attr.row-index=\"{{rowIndex}}\"\n>\n  @if (rowSelectionEnabled) {\n    <div class=\"ivpt-content-cell\" style=\"width: 36px;\" role=\"gridcell\">\n      <div class=\"ivpt-row-select\" role=\"presentation\" style=\"width: inherit;\">\n        <input type=\"checkbox\"\n          class=\"ivpt-row-select-checkbox\"\n          tabindex=\"-1\"\n          name=\"dt_row_select\"\n          [checked]=\"rowData.dtSelected\"\n          (change)=\"whenRowSelected($event, rowData)\"\n        />\n      </div>\n    </div>\n  }\n  @for (colItem of columns; track colItem; let i=$index) {\n    @if (colItem.visible) {\n      <div \n        class=\"ivpt-content-cell\" \n        role=\"gridcell\" \n        attr.aria-colindex=\"{{i+1}}\" \n        [style.width.px]=\"colItem.width\"\n      >\n        {{rowData[colItem.field]}}\n      </div>\n    }  \n  }\n</div>\n", styles: ["*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box;color:#212529;font-size:14px}.ivpt-flex-cell{flex:1}.ivpt-select-cell{display:flex;width:36px;justify-content:center;align-items:center}.ivpt-button{border:none;border-radius:.25rem;background-color:#c8dbee;height:1.5rem;line-height:1.5rem;padding:0 .5rem;cursor:pointer}.ivpt-content-row{display:flex;flex-direction:row;flex-wrap:nowrap;border-bottom:1px solid #CDD4D9}.ivpt-content-row:hover{background-color:#eaf5ff}.ivpt-content-row .ivpt-content-cell{padding:0 .5rem;line-height:42px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PresentableRowComponent, decorators: [{
            type: Component,
            args: [{ selector: 'presentable-row', template: "<div \n  class=\"ivpt-content-row\" \n  role=\"row\"\n  attr.aria-rowindex=\"{{rowIndex+2}}\" \n  attr.row-index=\"{{rowIndex}}\"\n>\n  @if (rowSelectionEnabled) {\n    <div class=\"ivpt-content-cell\" style=\"width: 36px;\" role=\"gridcell\">\n      <div class=\"ivpt-row-select\" role=\"presentation\" style=\"width: inherit;\">\n        <input type=\"checkbox\"\n          class=\"ivpt-row-select-checkbox\"\n          tabindex=\"-1\"\n          name=\"dt_row_select\"\n          [checked]=\"rowData.dtSelected\"\n          (change)=\"whenRowSelected($event, rowData)\"\n        />\n      </div>\n    </div>\n  }\n  @for (colItem of columns; track colItem; let i=$index) {\n    @if (colItem.visible) {\n      <div \n        class=\"ivpt-content-cell\" \n        role=\"gridcell\" \n        attr.aria-colindex=\"{{i+1}}\" \n        [style.width.px]=\"colItem.width\"\n      >\n        {{rowData[colItem.field]}}\n      </div>\n    }  \n  }\n</div>\n", styles: ["*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box;color:#212529;font-size:14px}.ivpt-flex-cell{flex:1}.ivpt-select-cell{display:flex;width:36px;justify-content:center;align-items:center}.ivpt-button{border:none;border-radius:.25rem;background-color:#c8dbee;height:1.5rem;line-height:1.5rem;padding:0 .5rem;cursor:pointer}.ivpt-content-row{display:flex;flex-direction:row;flex-wrap:nowrap;border-bottom:1px solid #CDD4D9}.ivpt-content-row:hover{background-color:#eaf5ff}.ivpt-content-row .ivpt-content-cell{padding:0 .5rem;line-height:42px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0}\n"] }]
        }], propDecorators: { columns: [{
                type: Input
            }], rowIndex: [{
                type: Input
            }], rowSelectionEnabled: [{
                type: Input
            }], rowData: [{
                type: Input
            }], onSelection: [{
                type: Output
            }] } });

class DataManagerService {
    canSelectAll(dataSet) {
        for (let i = 0; i < dataSet.length; i++) {
            if (!dataSet[i].isSelected) {
                return false;
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: DataManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: DataManagerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: DataManagerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });

class IvoryPresentableComponent {
    set columnDefs(columnDefs) {
        this._columnDefs = this.columnSizing.processColumnOptions(columnDefs);
    }
    get columnDefs() {
        return this._columnDefs;
    }
    set records(value) {
        this.dataTrueCopy = value;
        Object.freeze(this.dataTrueCopy);
        this.processData();
    }
    get records() {
        return this.dataTrueCopy;
    }
    ngAfterViewInit() {
        this.elementManager.registerDatagridEl(this.datagridWrapper.nativeElement);
        this.elementManager.registerDatagridHeaderEl(this.datagridHeaderWrapper.nativeElement);
        this.elementManager.registerDatagridSelectAllEl(this.ivptSelectAllRef.nativeElement);
        this.elementManager.registerDatagridBodyEl(this.datagridBodyWrapper.nativeElement);
        if (this.ivptContentBodyRef) {
            this.ivptContentBodyRef.nativeElement.style.height =
                this.gridDefs.height -
                    (PRESENTABLE_CONFIG.headerSpace.height +
                        PRESENTABLE_CONFIG.column.headHeight +
                        PRESENTABLE_CONFIG.filterSpace.height +
                        PRESENTABLE_CONFIG.paginator.height) +
                    "px";
        }
        this.columnSizing.reCalcWidth.next(true);
    }
    constructor(cdr, columnSizing, elementManager, dataManager, pageManager, filterManager) {
        this.cdr = cdr;
        this.columnSizing = columnSizing;
        this.elementManager = elementManager;
        this.dataManager = dataManager;
        this.pageManager = pageManager;
        this.filterManager = filterManager;
        // Sorting
        this._isSortApplied = false;
        this._sortAppliedOn = "";
        this._sortOrder = null;
        // Filtering
        this._isFilterApplied = false;
        this.filterModel = {};
        this._recordsTotal = 0;
        // Grid rendering
        this._isGridReady = false;
        // data params when the data source is remote (server-side)
        this.remoteDataParams = {
            filterConfig: {},
            sortBy: null,
            orderBy: null,
            recordsFrom: null,
            recordsTo: null
        };
        // Row Selection
        this.selectedRows = [];
        this.columnControls = false;
        this.pagination = false;
        this.recordsPerPage = 0;
        this.recordSelection = false;
        this.dataparams = new EventEmitter();
        this.recordsSelected = new EventEmitter();
    }
    ngOnInit() {
        this.addListeners();
    }
    processData() {
        if (this.gridDefs.dataStream === "server-side") {
            this.processRemoteData();
            this._isGridReady = true;
        }
        else if (this.gridDefs.dataStream === "client-side") {
            this.processLocalData();
            this._isGridReady = true;
        }
        setTimeout(() => {
            this.columnSizing.reCalcWidth.next(true);
        }, 2000);
    }
    processRemoteData(data) {
        this.processedData = data || structuredClone(this.dataTrueCopy);
        this.currVisibleData = this.processedData;
        this._recordsTotal = this.gridDefs.recordsTotal;
        this.pagination = this._recordsTotal > this.processedData.length;
    }
    processLocalData(data) {
        this.processedData = data || structuredClone(this.dataTrueCopy);
        if (!this.pagination) {
            this.currVisibleData = this.processedData;
        }
        else {
            this._recordsTotal = this.processedData.length;
            this.setCurrVisibleData(0, this.recordsPerPage);
        }
    }
    setCurrVisibleData(from, to) {
        this.currVisibleData = this.processedData.slice(from, to);
    }
    addListeners() {
        this.columnSizing.reCalcWidth.pipe(delay(100)).subscribe(() => {
            this.columnSizing.reCalcColumnWidth(this.columnDefs);
            this.cdr.detectChanges();
        });
    }
    updatedColumnWidth(colItem, width) {
        colItem.width = width;
    }
    // Handles sorting
    doSort(appliedField) {
        this.pageManager.resetPagination();
        if (this._isSortApplied && this._sortAppliedOn === appliedField) {
            if (this._sortOrder === "ASC") {
                this._sortOrder = "DESC";
                this.sortBy(appliedField, "DESC");
            }
            else if (this._sortOrder === "DESC") {
                this.resetSort();
            }
        }
        else {
            this._isSortApplied = true;
            this._sortAppliedOn = appliedField;
            this._sortOrder = "ASC";
            this.unSortedCopy = structuredClone(this.processedData);
            this.sortBy(appliedField, "ASC");
        }
    }
    sortBy(theField, orderBy) {
        if (this.gridDefs.dataStream === "server-side") {
            this.remoteDataParams.sortBy = theField;
            this.remoteDataParams.orderBy = orderBy;
            this.remoteDataParams.recordsFrom = 0;
            this.remoteDataParams.recordsTo = null;
            this.dataparams.emit(this.remoteDataParams);
        }
        else if (this.gridDefs.dataStream === "client-side") {
            if (orderBy === "ASC") {
                this.processedData.sort((a, b) => a[theField] > b[theField] ? 1 : -1);
            }
            else if (orderBy === "DESC") {
                this.processedData.sort((a, b) => a[theField] > b[theField] ? -1 : 1);
            }
            this.setCurrVisibleData(0, this.recordsPerPage);
        }
    }
    resetSort() {
        this._isSortApplied = false;
        this._sortAppliedOn = "";
        this._sortOrder = null;
        this.processedData = structuredClone(this.unSortedCopy);
        this.setCurrVisibleData(0, this.recordsPerPage);
    }
    /**
     * Invokes when any filter applied
     * @param data
     */
    handleFilters(data) {
        this.filterManager.buildQueryModel(data);
        if (this.gridDefs.dataStream === "server-side") {
            this.remoteDataParams.filterConfig = this.filterManager.getQueryModel();
            this.remoteDataParams.recordsFrom = 0;
            this.remoteDataParams.recordsTo = this.recordsPerPage;
            this.dataparams.emit(this.remoteDataParams);
        }
        else if (this.gridDefs.dataStream === "client-side") {
            this.processFilter(data);
        }
    }
    processFilter(data) {
        let result = [];
        const queryModel = this.filterManager.getQueryModel();
        if (Object.keys(queryModel).length !== 0) {
            let tempDataSet = structuredClone(this.records);
            result = this.filterManager.filterData(tempDataSet, queryModel);
        }
        else {
            result = structuredClone(this.records);
        }
        this.processLocalData(result);
    }
    resetFiltering() {
        if (this.gridDefs.dataStream === "server-side") {
            this.remoteDataParams.filterConfig = {};
            this.remoteDataParams.recordsFrom = 0;
            this.remoteDataParams.recordsTo = this.recordsPerPage;
            this.dataparams.emit(this.remoteDataParams);
        }
        else if (this.gridDefs.dataStream === "client-side") {
            this.processLocalData();
            this.filterManager.resetQueryModel();
        }
    }
    onPaginationChange(data) {
        if (this.gridDefs.dataStream === "server-side") {
            this.remoteDataParams.recordsFrom = data.from;
            this.remoteDataParams.recordsTo = data.to;
            this.dataparams.emit(this.remoteDataParams);
        }
        else if (this.gridDefs.dataStream === "client-side") {
            this.setCurrVisibleData(data.from, data.to);
        }
    }
    whenSelectAll($event) {
        const status = $event.target.checked;
        for (let item of this.currVisibleData) {
            item["dtSelected"] = status;
            if (status) {
                this.selectedRows.push(item);
            }
        }
        this.recordsSelected.emit(this.selectedRows);
    }
    whenSelectRow(data) {
        if (data.selected) {
            data.row["isSelected"] = true;
            this.selectedRows.push(data.row);
            if (!this.dataManager.canSelectAll(this.currVisibleData)) {
                this.ivptSelectAllRef.nativeElement.children[0].indeterminate = true;
            }
            else {
                this.ivptSelectAllRef.nativeElement.children[0].checked = true;
            }
        }
        else {
            data.row["isSelected"] = false;
            const index = this.selectedRows.indexOf(data.row);
            this.selectedRows.splice(index, 1);
            if (this.selectedRows.length > 0) {
                this.ivptSelectAllRef.nativeElement.children[0].indeterminate = true;
            }
            else {
                this.ivptSelectAllRef.nativeElement.children[0].indeterminate = false;
                this.ivptSelectAllRef.nativeElement.children[0].checked = false;
            }
        }
        this.recordsSelected.emit(this.selectedRows);
    }
    ngOnDestroy() {
        this._isGridReady = false;
        this.remoteDataParams = {};
        this.selectedRows = [];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: IvoryPresentableComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: ColumnSizingService }, { token: ElementManagerService }, { token: DataManagerService }, { token: PageManagerService }, { token: FilterManagerService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.2.1", type: IvoryPresentableComponent, selector: "ivory-presentable", inputs: { gridDefs: "gridDefs", columnDefs: "columnDefs", columnControls: "columnControls", records: "records", pagination: "pagination", recordsPerPage: "recordsPerPage", recordsPerPageOptions: "recordsPerPageOptions", recordSelection: "recordSelection" }, outputs: { dataparams: "dataparams", recordsSelected: "recordsSelected" }, viewQueries: [{ propertyName: "ivptSelectAllRef", first: true, predicate: ["ivptSelectAll"], descendants: true }, { propertyName: "ivptContentBodyRef", first: true, predicate: ["ivptContentBody"], descendants: true }, { propertyName: "datagridWrapper", first: true, predicate: ["datagridWrapper"], descendants: true }, { propertyName: "datagridHeaderWrapper", first: true, predicate: ["datagridHeaderWrapper"], descendants: true }, { propertyName: "datagridBodyWrapper", first: true, predicate: ["datagridBodyWrapper"], descendants: true }], ngImport: i0, template: "<div class=\"ivpt-container\" [ngStyle]=\"{ 'height.px': gridDefs.height }\" #datagridWrapper>\n  @if (!_isGridReady) {\n    <ng-container *ngTemplateOutlet=\"presentableFallbackTemplate\"></ng-container>\n  }\n  @else {\n    <!-- Datatable Header -->\n    <div class=\"ivpt-header\">\n      @if (columnControls) {\n        <presentable-column-controls\n          [columns]=\"columnDefs\"\n        ></presentable-column-controls>\n      }\n    </div>\n\n    <!-- Datatable Content -->\n    <div class=\"ivpt-content\">\n\n      <!-- Column headings of the table -->\n      <div #datagridHeaderWrapper class=\"ivpt-content-head\" role=\"row\" aria-rowindex=\"1\">\n        @if (recordSelection) {\n          <div class=\"ivpt-head-column-cell-wrapper\">\n            <div #ivptSelectAll class=\"ivpt-selectall-cell\">\n              <input type=\"checkbox\"\n                class=\"ivpt-all-select-checkbox\"\n                tabindex=\"-1\"\n                id=\"selectall\"\n                (change)=\"whenSelectAll($event)\"\n              />\n            </div>\n            <div class=\"ivpt-filter-cell\" style=\"width: 36px;\"></div>\n          </div>\n        }\n        @for (colItem of columnDefs; track colItem; let i=$index) {\n          @if (colItem.visible) {\n            <div class=\"ivpt-head-column-cell-wrapper\">\n              <div \n                class=\"ivpt-head-cell\" \n                role=\"columnheader\" \n                attr.aria-colindex=\"{{i+1}}\" \n                (click)=\"doSort(colItem.field)\"\n                [style.width.px]=\"colItem.width\"\n              >\n                <div class=\"ivpt-column-title\">\n                  {{colItem.title}}\n                  @if (_isSortApplied && _sortAppliedOn===colItem.field) {\n                    @if (_sortOrder==='ASC') {\n                      <span class=\"ivpt-sort-identifier\"> &uarr;</span>\n                    }\n                    @else if (_sortOrder==='DESC') {\n                      <span class=\"ivpt-sort-identifier\"> &darr;</span>\n                    }\n                  }\n                </div>\n                <div class=\"ivpt-column-ext\">\n                  <presentable-column-resizer \n                    [resizable]=\"true\" \n                    (updatedColumnWidth)=\"updatedColumnWidth(colItem, $event)\"\n                  ></presentable-column-resizer>\n                </div>\n              </div>\n              <div \n                class=\"ivpt-filter-cell\"\n                [style.width.px]=\"colItem.width\"\n              >\n                @if (colItem.hasFilter && colItem.filterType==='text') {\n                  <presentable-text-filter\n                    [column]=\"colItem\"\n                    (whenApplied)=\"handleFilters($event)\"\n                  ></presentable-text-filter>\n                }\n                @else if (colItem.hasFilter && colItem.filterType==='options') {\n                  <presentable-options-filter\n                    [column]=\"colItem\"\n                    [taxonomy]=\"colItem.filterOptions\"\n                    (whenApplied)=\"handleFilters($event)\"\n                  ></presentable-options-filter>\n                }\n              </div>\n            </div>\n              \n          }\n        }\n      </div>\n\n      <!-- Table rows -->\n      <div #ivptContentBody class=\"ivpt-content-body\" role=\"rowgroup\" #datagridBodyWrapper>\n        @for (dataItem of currVisibleData; track dataItem; let i=$index) {\n          <presentable-row\n            [columns]=\"columnDefs\"\n            [rowIndex]=\"i\"\n            [rowSelectionEnabled]=\"recordSelection\"\n            [rowData]=\"dataItem\"\n            (onSelection)=\"whenSelectRow($event)\"\n          ></presentable-row>\n        }\n      </div>\n\n    </div>\n\n    <!-- Datatable Footer -->\n    <div class=\"ivpt-footer\">\n      @if (pagination) {\n        <presentable-paginator\n          [recordsPerPageOptions]=\"recordsPerPageOptions\"\n          [recordsPerPage]=\"recordsPerPage\"\n          [recordsTotal]=\"_recordsTotal\"\n          (pageChange)=\"onPaginationChange($event)\"\n        ></presentable-paginator>\n      }\n    </div>\n  }\n\n  <ng-template #presentableFallbackTemplate>\n    <div>Loading...</div>\n  </ng-template>\n</div>\n", styles: ["*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box;color:#212529;font-size:14px}.ivpt-flex-cell{flex:1}.ivpt-select-cell{display:flex;width:36px;justify-content:center;align-items:center}.ivpt-button{border:none;border-radius:.25rem;background-color:#c8dbee;height:1.5rem;line-height:1.5rem;padding:0 .5rem;cursor:pointer}.ivpt-container{position:relative;width:100%;border:1px solid #CDD4D9;border-radius:.5rem}.ivpt-container .ivpt-header{display:flex;justify-content:flex-end;height:45px;border-bottom:1px solid #CDD4D9;border-radius:.5rem .5rem 0 0}.ivpt-container .ivpt-content{position:relative;overflow-x:auto}.ivpt-container .ivpt-content-body{width:max-content;position:relative;overflow-y:auto}.ivpt-container .ivpt-footer{position:relative;display:flex;height:45px;border-top:1px solid #CDD4D9;padding:0 1rem;border-radius:0 0 .5rem .5rem}.ivpt-content-head{display:flex;flex-direction:row;flex-wrap:nowrap}.ivpt-head-column-cell-wrapper{border-bottom:1px solid #CDD4D9}.ivpt-head-column-cell-wrapper .ivpt-selectall-cell{position:relative;display:flex;height:45px;line-height:45px;width:36px;justify-content:center;flex-shrink:0;border-bottom:1px solid #CDD4D9;background-color:#eef3f8}.ivpt-head-column-cell-wrapper .ivpt-head-cell{position:relative;display:flex;height:45px;line-height:45px;cursor:pointer;justify-content:space-between;align-items:center;flex-shrink:0;border-bottom:1px solid #CDD4D9;background-color:#eef3f8}.ivpt-head-column-cell-wrapper .ivpt-head-cell:first-child{border-left:none}.ivpt-head-column-cell-wrapper .ivpt-filter-cell{position:relative;display:flex;height:45px;line-height:45px;padding:0 .5rem}.ivpt-head-column-cell-wrapper .ivpt-column-title{display:flex;justify-content:space-between;width:100%;padding:0 .5rem;line-height:2.5rem}.ivpt-head-column-cell-wrapper .ivpt-column-ext{display:flex}.ivpt-head-column-cell-wrapper .ivpt-column-ext .ivpt-sort-identifier{padding:0 5px}\n"], dependencies: [{ kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: PresentableRowComponent, selector: "presentable-row", inputs: ["columns", "rowIndex", "rowSelectionEnabled", "rowData"], outputs: ["onSelection"] }, { kind: "component", type: PresentableTextFilterComponent, selector: "presentable-text-filter", inputs: ["column"], outputs: ["whenApplied"] }, { kind: "component", type: PresentableOptionsFilterComponent, selector: "presentable-options-filter", inputs: ["column", "taxonomy"], outputs: ["whenApplied"] }, { kind: "component", type: PresentableColumnResizerComponent, selector: "presentable-column-resizer", inputs: ["resizable", "minWidth", "maxWidth"], outputs: ["updatedColumnWidth"] }, { kind: "component", type: PresentableColumnControlsComponent, selector: "presentable-column-controls", inputs: ["columns"], outputs: ["updatedColumns"] }, { kind: "component", type: PresentablePaginatorComponent, selector: "presentable-paginator", inputs: ["recordsPerPageOptions", "recordsPerPage", "recordsTotal"], outputs: ["pageChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: IvoryPresentableComponent, decorators: [{
            type: Component,
            args: [{ selector: "ivory-presentable", template: "<div class=\"ivpt-container\" [ngStyle]=\"{ 'height.px': gridDefs.height }\" #datagridWrapper>\n  @if (!_isGridReady) {\n    <ng-container *ngTemplateOutlet=\"presentableFallbackTemplate\"></ng-container>\n  }\n  @else {\n    <!-- Datatable Header -->\n    <div class=\"ivpt-header\">\n      @if (columnControls) {\n        <presentable-column-controls\n          [columns]=\"columnDefs\"\n        ></presentable-column-controls>\n      }\n    </div>\n\n    <!-- Datatable Content -->\n    <div class=\"ivpt-content\">\n\n      <!-- Column headings of the table -->\n      <div #datagridHeaderWrapper class=\"ivpt-content-head\" role=\"row\" aria-rowindex=\"1\">\n        @if (recordSelection) {\n          <div class=\"ivpt-head-column-cell-wrapper\">\n            <div #ivptSelectAll class=\"ivpt-selectall-cell\">\n              <input type=\"checkbox\"\n                class=\"ivpt-all-select-checkbox\"\n                tabindex=\"-1\"\n                id=\"selectall\"\n                (change)=\"whenSelectAll($event)\"\n              />\n            </div>\n            <div class=\"ivpt-filter-cell\" style=\"width: 36px;\"></div>\n          </div>\n        }\n        @for (colItem of columnDefs; track colItem; let i=$index) {\n          @if (colItem.visible) {\n            <div class=\"ivpt-head-column-cell-wrapper\">\n              <div \n                class=\"ivpt-head-cell\" \n                role=\"columnheader\" \n                attr.aria-colindex=\"{{i+1}}\" \n                (click)=\"doSort(colItem.field)\"\n                [style.width.px]=\"colItem.width\"\n              >\n                <div class=\"ivpt-column-title\">\n                  {{colItem.title}}\n                  @if (_isSortApplied && _sortAppliedOn===colItem.field) {\n                    @if (_sortOrder==='ASC') {\n                      <span class=\"ivpt-sort-identifier\"> &uarr;</span>\n                    }\n                    @else if (_sortOrder==='DESC') {\n                      <span class=\"ivpt-sort-identifier\"> &darr;</span>\n                    }\n                  }\n                </div>\n                <div class=\"ivpt-column-ext\">\n                  <presentable-column-resizer \n                    [resizable]=\"true\" \n                    (updatedColumnWidth)=\"updatedColumnWidth(colItem, $event)\"\n                  ></presentable-column-resizer>\n                </div>\n              </div>\n              <div \n                class=\"ivpt-filter-cell\"\n                [style.width.px]=\"colItem.width\"\n              >\n                @if (colItem.hasFilter && colItem.filterType==='text') {\n                  <presentable-text-filter\n                    [column]=\"colItem\"\n                    (whenApplied)=\"handleFilters($event)\"\n                  ></presentable-text-filter>\n                }\n                @else if (colItem.hasFilter && colItem.filterType==='options') {\n                  <presentable-options-filter\n                    [column]=\"colItem\"\n                    [taxonomy]=\"colItem.filterOptions\"\n                    (whenApplied)=\"handleFilters($event)\"\n                  ></presentable-options-filter>\n                }\n              </div>\n            </div>\n              \n          }\n        }\n      </div>\n\n      <!-- Table rows -->\n      <div #ivptContentBody class=\"ivpt-content-body\" role=\"rowgroup\" #datagridBodyWrapper>\n        @for (dataItem of currVisibleData; track dataItem; let i=$index) {\n          <presentable-row\n            [columns]=\"columnDefs\"\n            [rowIndex]=\"i\"\n            [rowSelectionEnabled]=\"recordSelection\"\n            [rowData]=\"dataItem\"\n            (onSelection)=\"whenSelectRow($event)\"\n          ></presentable-row>\n        }\n      </div>\n\n    </div>\n\n    <!-- Datatable Footer -->\n    <div class=\"ivpt-footer\">\n      @if (pagination) {\n        <presentable-paginator\n          [recordsPerPageOptions]=\"recordsPerPageOptions\"\n          [recordsPerPage]=\"recordsPerPage\"\n          [recordsTotal]=\"_recordsTotal\"\n          (pageChange)=\"onPaginationChange($event)\"\n        ></presentable-paginator>\n      }\n    </div>\n  }\n\n  <ng-template #presentableFallbackTemplate>\n    <div>Loading...</div>\n  </ng-template>\n</div>\n", styles: ["*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box;color:#212529;font-size:14px}.ivpt-flex-cell{flex:1}.ivpt-select-cell{display:flex;width:36px;justify-content:center;align-items:center}.ivpt-button{border:none;border-radius:.25rem;background-color:#c8dbee;height:1.5rem;line-height:1.5rem;padding:0 .5rem;cursor:pointer}.ivpt-container{position:relative;width:100%;border:1px solid #CDD4D9;border-radius:.5rem}.ivpt-container .ivpt-header{display:flex;justify-content:flex-end;height:45px;border-bottom:1px solid #CDD4D9;border-radius:.5rem .5rem 0 0}.ivpt-container .ivpt-content{position:relative;overflow-x:auto}.ivpt-container .ivpt-content-body{width:max-content;position:relative;overflow-y:auto}.ivpt-container .ivpt-footer{position:relative;display:flex;height:45px;border-top:1px solid #CDD4D9;padding:0 1rem;border-radius:0 0 .5rem .5rem}.ivpt-content-head{display:flex;flex-direction:row;flex-wrap:nowrap}.ivpt-head-column-cell-wrapper{border-bottom:1px solid #CDD4D9}.ivpt-head-column-cell-wrapper .ivpt-selectall-cell{position:relative;display:flex;height:45px;line-height:45px;width:36px;justify-content:center;flex-shrink:0;border-bottom:1px solid #CDD4D9;background-color:#eef3f8}.ivpt-head-column-cell-wrapper .ivpt-head-cell{position:relative;display:flex;height:45px;line-height:45px;cursor:pointer;justify-content:space-between;align-items:center;flex-shrink:0;border-bottom:1px solid #CDD4D9;background-color:#eef3f8}.ivpt-head-column-cell-wrapper .ivpt-head-cell:first-child{border-left:none}.ivpt-head-column-cell-wrapper .ivpt-filter-cell{position:relative;display:flex;height:45px;line-height:45px;padding:0 .5rem}.ivpt-head-column-cell-wrapper .ivpt-column-title{display:flex;justify-content:space-between;width:100%;padding:0 .5rem;line-height:2.5rem}.ivpt-head-column-cell-wrapper .ivpt-column-ext{display:flex}.ivpt-head-column-cell-wrapper .ivpt-column-ext .ivpt-sort-identifier{padding:0 5px}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: ColumnSizingService }, { type: ElementManagerService }, { type: DataManagerService }, { type: PageManagerService }, { type: FilterManagerService }], propDecorators: { gridDefs: [{
                type: Input
            }], columnDefs: [{
                type: Input
            }], columnControls: [{
                type: Input
            }], records: [{
                type: Input
            }], pagination: [{
                type: Input
            }], recordsPerPage: [{
                type: Input
            }], recordsPerPageOptions: [{
                type: Input
            }], recordSelection: [{
                type: Input
            }], dataparams: [{
                type: Output
            }], recordsSelected: [{
                type: Output
            }], ivptSelectAllRef: [{
                type: ViewChild,
                args: ["ivptSelectAll"]
            }], ivptContentBodyRef: [{
                type: ViewChild,
                args: ["ivptContentBody"]
            }], datagridWrapper: [{
                type: ViewChild,
                args: ["datagridWrapper"]
            }], datagridHeaderWrapper: [{
                type: ViewChild,
                args: ["datagridHeaderWrapper"]
            }], datagridBodyWrapper: [{
                type: ViewChild,
                args: ["datagridBodyWrapper"]
            }] } });

class IvoryPresentableModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: IvoryPresentableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.2.1", ngImport: i0, type: IvoryPresentableModule, declarations: [IvoryPresentableComponent,
            PresentableRowComponent,
            PresentableTextFilterComponent,
            PresentableOptionsFilterComponent,
            PresentableColumnResizerComponent,
            PresentableColumnControlsComponent,
            PresentablePaginatorComponent,
            ClickOutsideDirective,
            ColumnResizeDirective], imports: [BrowserModule,
            FormsModule], exports: [IvoryPresentableComponent,
            PresentableRowComponent,
            PresentableTextFilterComponent,
            PresentableOptionsFilterComponent,
            PresentableColumnResizerComponent,
            PresentableColumnControlsComponent,
            PresentablePaginatorComponent,
            ClickOutsideDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: IvoryPresentableModule, imports: [BrowserModule,
            FormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: IvoryPresentableModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        BrowserModule,
                        FormsModule
                    ],
                    declarations: [
                        IvoryPresentableComponent,
                        PresentableRowComponent,
                        PresentableTextFilterComponent,
                        PresentableOptionsFilterComponent,
                        PresentableColumnResizerComponent,
                        PresentableColumnControlsComponent,
                        PresentablePaginatorComponent,
                        ClickOutsideDirective,
                        ColumnResizeDirective
                    ],
                    exports: [
                        IvoryPresentableComponent,
                        PresentableRowComponent,
                        PresentableTextFilterComponent,
                        PresentableOptionsFilterComponent,
                        PresentableColumnResizerComponent,
                        PresentableColumnControlsComponent,
                        PresentablePaginatorComponent,
                        ClickOutsideDirective
                    ]
                }]
        }] });

/**
 * Public API Surface of ivory-presentable
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ClickOutsideDirective, ColumnResizeDirective, IvoryPresentableComponent, IvoryPresentableModule, PresentableColumnControlsComponent, PresentableColumnResizerComponent, PresentableOptionsFilterComponent, PresentablePaginatorComponent, PresentableRowComponent, PresentableTextFilterComponent };
//# sourceMappingURL=ivoryui-presentable.mjs.map
