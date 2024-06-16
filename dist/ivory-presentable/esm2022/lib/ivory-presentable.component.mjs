import { Component, Input, Output, EventEmitter, ViewChild, } from "@angular/core";
import { delay } from "rxjs";
import { PRESENTABLE_CONFIG } from "./config/config";
import * as i0 from "@angular/core";
import * as i1 from "./services/column-sizing.service";
import * as i2 from "./services/element-manager.service";
import * as i3 from "./services/data-manager.service";
import * as i4 from "./services/page-manager.service";
import * as i5 from "./services/filter-manager.service";
import * as i6 from "@angular/common";
import * as i7 from "./components/presentable-row/presentable-row.component";
import * as i8 from "./components/filters/presentable-text-filter/presentable-text-filter.component";
import * as i9 from "./components/filters/presentable-options-filter/presentable-options-filter.component";
import * as i10 from "./components/presentable-column-resizer/presentable-column-resizer.component";
import * as i11 from "./components/presentable-column-controls/presentable-column-controls.component";
import * as i12 from "./components/presentable-paginator/presentable-paginator.component";
export class IvoryPresentableComponent {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: IvoryPresentableComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.ColumnSizingService }, { token: i2.ElementManagerService }, { token: i3.DataManagerService }, { token: i4.PageManagerService }, { token: i5.FilterManagerService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.2.1", type: IvoryPresentableComponent, selector: "ivory-presentable", inputs: { gridDefs: "gridDefs", columnDefs: "columnDefs", columnControls: "columnControls", records: "records", pagination: "pagination", recordsPerPage: "recordsPerPage", recordsPerPageOptions: "recordsPerPageOptions", recordSelection: "recordSelection" }, outputs: { dataparams: "dataparams", recordsSelected: "recordsSelected" }, viewQueries: [{ propertyName: "ivptSelectAllRef", first: true, predicate: ["ivptSelectAll"], descendants: true }, { propertyName: "ivptContentBodyRef", first: true, predicate: ["ivptContentBody"], descendants: true }, { propertyName: "datagridWrapper", first: true, predicate: ["datagridWrapper"], descendants: true }, { propertyName: "datagridHeaderWrapper", first: true, predicate: ["datagridHeaderWrapper"], descendants: true }, { propertyName: "datagridBodyWrapper", first: true, predicate: ["datagridBodyWrapper"], descendants: true }], ngImport: i0, template: "<div class=\"ivpt-container\" [ngStyle]=\"{ 'height.px': gridDefs.height }\" #datagridWrapper>\n  @if (!_isGridReady) {\n    <ng-container *ngTemplateOutlet=\"presentableFallbackTemplate\"></ng-container>\n  }\n  @else {\n    <!-- Datatable Header -->\n    <div class=\"ivpt-header\">\n      @if (columnControls) {\n        <presentable-column-controls\n          [columns]=\"columnDefs\"\n        ></presentable-column-controls>\n      }\n    </div>\n\n    <!-- Datatable Content -->\n    <div class=\"ivpt-content\">\n\n      <!-- Column headings of the table -->\n      <div #datagridHeaderWrapper class=\"ivpt-content-head\" role=\"row\" aria-rowindex=\"1\">\n        @if (recordSelection) {\n          <div class=\"ivpt-head-column-cell-wrapper\">\n            <div #ivptSelectAll class=\"ivpt-selectall-cell\">\n              <input type=\"checkbox\"\n                class=\"ivpt-all-select-checkbox\"\n                tabindex=\"-1\"\n                id=\"selectall\"\n                (change)=\"whenSelectAll($event)\"\n              />\n            </div>\n            <div class=\"ivpt-filter-cell\" style=\"width: 36px;\"></div>\n          </div>\n        }\n        @for (colItem of columnDefs; track colItem; let i=$index) {\n          @if (colItem.visible) {\n            <div class=\"ivpt-head-column-cell-wrapper\">\n              <div \n                class=\"ivpt-head-cell\" \n                role=\"columnheader\" \n                attr.aria-colindex=\"{{i+1}}\" \n                (click)=\"doSort(colItem.field)\"\n                [style.width.px]=\"colItem.width\"\n              >\n                <div class=\"ivpt-column-title\">\n                  {{colItem.title}}\n                  @if (_isSortApplied && _sortAppliedOn===colItem.field) {\n                    @if (_sortOrder==='ASC') {\n                      <span class=\"ivpt-sort-identifier\"> &uarr;</span>\n                    }\n                    @else if (_sortOrder==='DESC') {\n                      <span class=\"ivpt-sort-identifier\"> &darr;</span>\n                    }\n                  }\n                </div>\n                <div class=\"ivpt-column-ext\">\n                  <presentable-column-resizer \n                    [resizable]=\"true\" \n                    (updatedColumnWidth)=\"updatedColumnWidth(colItem, $event)\"\n                  ></presentable-column-resizer>\n                </div>\n              </div>\n              <div \n                class=\"ivpt-filter-cell\"\n                [style.width.px]=\"colItem.width\"\n              >\n                @if (colItem.hasFilter && colItem.filterType==='text') {\n                  <presentable-text-filter\n                    [column]=\"colItem\"\n                    (whenApplied)=\"handleFilters($event)\"\n                  ></presentable-text-filter>\n                }\n                @else if (colItem.hasFilter && colItem.filterType==='options') {\n                  <presentable-options-filter\n                    [column]=\"colItem\"\n                    [taxonomy]=\"colItem.filterOptions\"\n                    (whenApplied)=\"handleFilters($event)\"\n                  ></presentable-options-filter>\n                }\n              </div>\n            </div>\n              \n          }\n        }\n      </div>\n\n      <!-- Table rows -->\n      <div #ivptContentBody class=\"ivpt-content-body\" role=\"rowgroup\" #datagridBodyWrapper>\n        @for (dataItem of currVisibleData; track dataItem; let i=$index) {\n          <presentable-row\n            [columns]=\"columnDefs\"\n            [rowIndex]=\"i\"\n            [rowSelectionEnabled]=\"recordSelection\"\n            [rowData]=\"dataItem\"\n            (onSelection)=\"whenSelectRow($event)\"\n          ></presentable-row>\n        }\n      </div>\n\n    </div>\n\n    <!-- Datatable Footer -->\n    <div class=\"ivpt-footer\">\n      @if (pagination) {\n        <presentable-paginator\n          [recordsPerPageOptions]=\"recordsPerPageOptions\"\n          [recordsPerPage]=\"recordsPerPage\"\n          [recordsTotal]=\"_recordsTotal\"\n          (pageChange)=\"onPaginationChange($event)\"\n        ></presentable-paginator>\n      }\n    </div>\n  }\n\n  <ng-template #presentableFallbackTemplate>\n    <div>Loading...</div>\n  </ng-template>\n</div>\n", styles: ["*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box;color:#212529;font-size:14px}.ivpt-flex-cell{flex:1}.ivpt-select-cell{display:flex;width:36px;justify-content:center;align-items:center}.ivpt-button{border:none;border-radius:.25rem;background-color:#c8dbee;height:1.5rem;line-height:1.5rem;padding:0 .5rem;cursor:pointer}.ivpt-container{position:relative;width:100%;border:1px solid #CDD4D9;border-radius:.5rem}.ivpt-container .ivpt-header{display:flex;justify-content:flex-end;height:45px;border-bottom:1px solid #CDD4D9;border-radius:.5rem .5rem 0 0}.ivpt-container .ivpt-content{position:relative;overflow-x:auto}.ivpt-container .ivpt-content-body{width:max-content;position:relative;overflow-y:auto}.ivpt-container .ivpt-footer{position:relative;display:flex;height:45px;border-top:1px solid #CDD4D9;padding:0 1rem;border-radius:0 0 .5rem .5rem}.ivpt-content-head{display:flex;flex-direction:row;flex-wrap:nowrap}.ivpt-head-column-cell-wrapper{border-bottom:1px solid #CDD4D9}.ivpt-head-column-cell-wrapper .ivpt-selectall-cell{position:relative;display:flex;height:45px;line-height:45px;width:36px;justify-content:center;flex-shrink:0;border-bottom:1px solid #CDD4D9;background-color:#eef3f8}.ivpt-head-column-cell-wrapper .ivpt-head-cell{position:relative;display:flex;height:45px;line-height:45px;cursor:pointer;justify-content:space-between;align-items:center;flex-shrink:0;border-bottom:1px solid #CDD4D9;background-color:#eef3f8}.ivpt-head-column-cell-wrapper .ivpt-head-cell:first-child{border-left:none}.ivpt-head-column-cell-wrapper .ivpt-filter-cell{position:relative;display:flex;height:45px;line-height:45px;padding:0 .5rem}.ivpt-head-column-cell-wrapper .ivpt-column-title{display:flex;justify-content:space-between;width:100%;padding:0 .5rem;line-height:2.5rem}.ivpt-head-column-cell-wrapper .ivpt-column-ext{display:flex}.ivpt-head-column-cell-wrapper .ivpt-column-ext .ivpt-sort-identifier{padding:0 5px}\n"], dependencies: [{ kind: "directive", type: i6.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i6.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i7.PresentableRowComponent, selector: "presentable-row", inputs: ["columns", "rowIndex", "rowSelectionEnabled", "rowData"], outputs: ["onSelection"] }, { kind: "component", type: i8.PresentableTextFilterComponent, selector: "presentable-text-filter", inputs: ["column"], outputs: ["whenApplied"] }, { kind: "component", type: i9.PresentableOptionsFilterComponent, selector: "presentable-options-filter", inputs: ["column", "taxonomy"], outputs: ["whenApplied"] }, { kind: "component", type: i10.PresentableColumnResizerComponent, selector: "presentable-column-resizer", inputs: ["resizable", "minWidth", "maxWidth"], outputs: ["updatedColumnWidth"] }, { kind: "component", type: i11.PresentableColumnControlsComponent, selector: "presentable-column-controls", inputs: ["columns"], outputs: ["updatedColumns"] }, { kind: "component", type: i12.PresentablePaginatorComponent, selector: "presentable-paginator", inputs: ["recordsPerPageOptions", "recordsPerPage", "recordsTotal"], outputs: ["pageChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: IvoryPresentableComponent, decorators: [{
            type: Component,
            args: [{ selector: "ivory-presentable", template: "<div class=\"ivpt-container\" [ngStyle]=\"{ 'height.px': gridDefs.height }\" #datagridWrapper>\n  @if (!_isGridReady) {\n    <ng-container *ngTemplateOutlet=\"presentableFallbackTemplate\"></ng-container>\n  }\n  @else {\n    <!-- Datatable Header -->\n    <div class=\"ivpt-header\">\n      @if (columnControls) {\n        <presentable-column-controls\n          [columns]=\"columnDefs\"\n        ></presentable-column-controls>\n      }\n    </div>\n\n    <!-- Datatable Content -->\n    <div class=\"ivpt-content\">\n\n      <!-- Column headings of the table -->\n      <div #datagridHeaderWrapper class=\"ivpt-content-head\" role=\"row\" aria-rowindex=\"1\">\n        @if (recordSelection) {\n          <div class=\"ivpt-head-column-cell-wrapper\">\n            <div #ivptSelectAll class=\"ivpt-selectall-cell\">\n              <input type=\"checkbox\"\n                class=\"ivpt-all-select-checkbox\"\n                tabindex=\"-1\"\n                id=\"selectall\"\n                (change)=\"whenSelectAll($event)\"\n              />\n            </div>\n            <div class=\"ivpt-filter-cell\" style=\"width: 36px;\"></div>\n          </div>\n        }\n        @for (colItem of columnDefs; track colItem; let i=$index) {\n          @if (colItem.visible) {\n            <div class=\"ivpt-head-column-cell-wrapper\">\n              <div \n                class=\"ivpt-head-cell\" \n                role=\"columnheader\" \n                attr.aria-colindex=\"{{i+1}}\" \n                (click)=\"doSort(colItem.field)\"\n                [style.width.px]=\"colItem.width\"\n              >\n                <div class=\"ivpt-column-title\">\n                  {{colItem.title}}\n                  @if (_isSortApplied && _sortAppliedOn===colItem.field) {\n                    @if (_sortOrder==='ASC') {\n                      <span class=\"ivpt-sort-identifier\"> &uarr;</span>\n                    }\n                    @else if (_sortOrder==='DESC') {\n                      <span class=\"ivpt-sort-identifier\"> &darr;</span>\n                    }\n                  }\n                </div>\n                <div class=\"ivpt-column-ext\">\n                  <presentable-column-resizer \n                    [resizable]=\"true\" \n                    (updatedColumnWidth)=\"updatedColumnWidth(colItem, $event)\"\n                  ></presentable-column-resizer>\n                </div>\n              </div>\n              <div \n                class=\"ivpt-filter-cell\"\n                [style.width.px]=\"colItem.width\"\n              >\n                @if (colItem.hasFilter && colItem.filterType==='text') {\n                  <presentable-text-filter\n                    [column]=\"colItem\"\n                    (whenApplied)=\"handleFilters($event)\"\n                  ></presentable-text-filter>\n                }\n                @else if (colItem.hasFilter && colItem.filterType==='options') {\n                  <presentable-options-filter\n                    [column]=\"colItem\"\n                    [taxonomy]=\"colItem.filterOptions\"\n                    (whenApplied)=\"handleFilters($event)\"\n                  ></presentable-options-filter>\n                }\n              </div>\n            </div>\n              \n          }\n        }\n      </div>\n\n      <!-- Table rows -->\n      <div #ivptContentBody class=\"ivpt-content-body\" role=\"rowgroup\" #datagridBodyWrapper>\n        @for (dataItem of currVisibleData; track dataItem; let i=$index) {\n          <presentable-row\n            [columns]=\"columnDefs\"\n            [rowIndex]=\"i\"\n            [rowSelectionEnabled]=\"recordSelection\"\n            [rowData]=\"dataItem\"\n            (onSelection)=\"whenSelectRow($event)\"\n          ></presentable-row>\n        }\n      </div>\n\n    </div>\n\n    <!-- Datatable Footer -->\n    <div class=\"ivpt-footer\">\n      @if (pagination) {\n        <presentable-paginator\n          [recordsPerPageOptions]=\"recordsPerPageOptions\"\n          [recordsPerPage]=\"recordsPerPage\"\n          [recordsTotal]=\"_recordsTotal\"\n          (pageChange)=\"onPaginationChange($event)\"\n        ></presentable-paginator>\n      }\n    </div>\n  }\n\n  <ng-template #presentableFallbackTemplate>\n    <div>Loading...</div>\n  </ng-template>\n</div>\n", styles: ["*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;-ms-box-sizing:border-box;box-sizing:border-box;color:#212529;font-size:14px}.ivpt-flex-cell{flex:1}.ivpt-select-cell{display:flex;width:36px;justify-content:center;align-items:center}.ivpt-button{border:none;border-radius:.25rem;background-color:#c8dbee;height:1.5rem;line-height:1.5rem;padding:0 .5rem;cursor:pointer}.ivpt-container{position:relative;width:100%;border:1px solid #CDD4D9;border-radius:.5rem}.ivpt-container .ivpt-header{display:flex;justify-content:flex-end;height:45px;border-bottom:1px solid #CDD4D9;border-radius:.5rem .5rem 0 0}.ivpt-container .ivpt-content{position:relative;overflow-x:auto}.ivpt-container .ivpt-content-body{width:max-content;position:relative;overflow-y:auto}.ivpt-container .ivpt-footer{position:relative;display:flex;height:45px;border-top:1px solid #CDD4D9;padding:0 1rem;border-radius:0 0 .5rem .5rem}.ivpt-content-head{display:flex;flex-direction:row;flex-wrap:nowrap}.ivpt-head-column-cell-wrapper{border-bottom:1px solid #CDD4D9}.ivpt-head-column-cell-wrapper .ivpt-selectall-cell{position:relative;display:flex;height:45px;line-height:45px;width:36px;justify-content:center;flex-shrink:0;border-bottom:1px solid #CDD4D9;background-color:#eef3f8}.ivpt-head-column-cell-wrapper .ivpt-head-cell{position:relative;display:flex;height:45px;line-height:45px;cursor:pointer;justify-content:space-between;align-items:center;flex-shrink:0;border-bottom:1px solid #CDD4D9;background-color:#eef3f8}.ivpt-head-column-cell-wrapper .ivpt-head-cell:first-child{border-left:none}.ivpt-head-column-cell-wrapper .ivpt-filter-cell{position:relative;display:flex;height:45px;line-height:45px;padding:0 .5rem}.ivpt-head-column-cell-wrapper .ivpt-column-title{display:flex;justify-content:space-between;width:100%;padding:0 .5rem;line-height:2.5rem}.ivpt-head-column-cell-wrapper .ivpt-column-ext{display:flex}.ivpt-head-column-cell-wrapper .ivpt-column-ext .ivpt-sort-identifier{padding:0 5px}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i1.ColumnSizingService }, { type: i2.ElementManagerService }, { type: i3.DataManagerService }, { type: i4.PageManagerService }, { type: i5.FilterManagerService }], propDecorators: { gridDefs: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXZvcnktcHJlc2VudGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvaXZvcnktcHJlc2VudGFibGUvc3JjL2xpYi9pdm9yeS1wcmVzZW50YWJsZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9pdm9yeS1wcmVzZW50YWJsZS9zcmMvbGliL2l2b3J5LXByZXNlbnRhYmxlLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUVMLE1BQU0sRUFDTixZQUFZLEVBQ1osU0FBUyxHQUtWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFN0IsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUJBQWlCLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBWXJELE1BQU0sT0FBTyx5QkFBeUI7SUF3Q3BDLElBQWEsVUFBVSxDQUFDLFVBQWU7UUFDckMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDRCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUlELElBQWEsT0FBTyxDQUFDLEtBQVU7UUFDN0IsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQXdCRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENB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N0IsS0FBSztnQkFFRyxlQUFlO3NCQUF2QixLQUFLO2dCQUVJLFVBQVU7c0JBQW5CLE1BQU07Z0JBRUcsZUFBZTtzQkFBeEIsTUFBTTtnQkFFcUIsZ0JBQWdCO3NCQUEzQyxTQUFTO3VCQUFDLGVBQWU7Z0JBRUksa0JBQWtCO3NCQUEvQyxTQUFTO3VCQUFDLGlCQUFpQjtnQkFFRSxlQUFlO3NCQUE1QyxTQUFTO3VCQUFDLGlCQUFpQjtnQkFFUSxxQkFBcUI7c0JBQXhELFNBQVM7dUJBQUMsdUJBQXVCO2dCQUVBLG1CQUFtQjtzQkFBcEQsU0FBUzt1QkFBQyxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBFbGVtZW50UmVmLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgVmlld0NoaWxkLFxuICBPbkluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBkZWxheSB9IGZyb20gXCJyeGpzXCI7XG5cbmltcG9ydCB7IFBSRVNFTlRBQkxFX0NPTkZJRyB9IGZyb20gXCIuL2NvbmZpZy9jb25maWdcIjtcbmltcG9ydCB7IERhdGFNYW5hZ2VyU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL2RhdGEtbWFuYWdlci5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBQYWdlTWFuYWdlclNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlcy9wYWdlLW1hbmFnZXIuc2VydmljZVwiO1xuaW1wb3J0IHsgQ29sdW1uU2l6aW5nU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL2NvbHVtbi1zaXppbmcuc2VydmljZVwiO1xuaW1wb3J0IHsgRWxlbWVudE1hbmFnZXJTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvZWxlbWVudC1tYW5hZ2VyLnNlcnZpY2VcIjtcbmltcG9ydCB7IEZpbHRlck1hbmFnZXJTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvZmlsdGVyLW1hbmFnZXIuc2VydmljZVwiO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwiaXZvcnktcHJlc2VudGFibGVcIixcbiAgdGVtcGxhdGVVcmw6IFwiLi9pdm9yeS1wcmVzZW50YWJsZS5jb21wb25lbnQuaHRtbFwiLFxuICBzdHlsZVVybDogXCIuL2l2b3J5LXByZXNlbnRhYmxlLmNvbXBvbmVudC5zY3NzXCIsXG59KVxuZXhwb3J0IGNsYXNzIEl2b3J5UHJlc2VudGFibGVDb21wb25lbnRcbiAgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdFxue1xuICAvLyBSZWNvcmRzIERhdGFcbiAgZGF0YVRydWVDb3B5OiBhbnk7XG4gIHByb2Nlc3NlZERhdGE6IGFueTtcbiAgY3VyclZpc2libGVEYXRhOiBhbnk7XG4gIHVuU29ydGVkQ29weTogYW55O1xuXG4gIC8vIFNvcnRpbmdcbiAgX2lzU29ydEFwcGxpZWQgPSBmYWxzZTtcbiAgX3NvcnRBcHBsaWVkT24gPSBcIlwiO1xuICBfc29ydE9yZGVyOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvLyBGaWx0ZXJpbmdcbiAgX2lzRmlsdGVyQXBwbGllZCA9IGZhbHNlO1xuICBmaWx0ZXJNb2RlbDogYW55ID0ge307XG5cbiAgX3JlY29yZHNUb3RhbDogbnVtYmVyID0gMDtcblxuICAvLyBHcmlkIHJlbmRlcmluZ1xuICBfaXNHcmlkUmVhZHkgPSBmYWxzZTtcblxuICAvLyBkYXRhIHBhcmFtcyB3aGVuIHRoZSBkYXRhIHNvdXJjZSBpcyByZW1vdGUgKHNlcnZlci1zaWRlKVxuICByZW1vdGVEYXRhUGFyYW1zOiBhbnkgPSB7XG4gICAgZmlsdGVyQ29uZmlnOiB7fSxcbiAgICBzb3J0Qnk6IG51bGwsXG4gICAgb3JkZXJCeTogbnVsbCxcbiAgICByZWNvcmRzRnJvbTogbnVsbCxcbiAgICByZWNvcmRzVG86IG51bGxcbiAgfTtcblxuICAvLyBSb3cgU2VsZWN0aW9uXG4gIHNlbGVjdGVkUm93czogYW55ID0gW107XG5cbiAgQElucHV0KCkgZ3JpZERlZnM6IGFueTtcblxuICAvLyBASW5wdXQoKSBjb2x1bW5EZWZzOiBhbnk7XG4gIF9jb2x1bW5EZWZzOiBhbnk7XG5cbiAgQElucHV0KCkgc2V0IGNvbHVtbkRlZnMoY29sdW1uRGVmczogYW55KSB7XG4gICAgdGhpcy5fY29sdW1uRGVmcyA9IHRoaXMuY29sdW1uU2l6aW5nLnByb2Nlc3NDb2x1bW5PcHRpb25zKGNvbHVtbkRlZnMpO1xuICB9XG4gIGdldCBjb2x1bW5EZWZzKCkge1xuICAgIHJldHVybiB0aGlzLl9jb2x1bW5EZWZzO1xuICB9XG5cbiAgQElucHV0KCkgY29sdW1uQ29udHJvbHM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXQoKSBzZXQgcmVjb3Jkcyh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5kYXRhVHJ1ZUNvcHkgPSB2YWx1ZTtcbiAgICBPYmplY3QuZnJlZXplKHRoaXMuZGF0YVRydWVDb3B5KTtcbiAgICB0aGlzLnByb2Nlc3NEYXRhKCk7XG4gIH1cbiAgZ2V0IHJlY29yZHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVRydWVDb3B5O1xuICB9XG5cbiAgQElucHV0KCkgcGFnaW5hdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIHJlY29yZHNQZXJQYWdlOiBudW1iZXIgPSAwO1xuXG4gIEBJbnB1dCgpIHJlY29yZHNQZXJQYWdlT3B0aW9uczogYW55O1xuXG4gIEBJbnB1dCgpIHJlY29yZFNlbGVjdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKSBkYXRhcGFyYW1zID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIHJlY29yZHNTZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBWaWV3Q2hpbGQoXCJpdnB0U2VsZWN0QWxsXCIpIGl2cHRTZWxlY3RBbGxSZWYhOiBFbGVtZW50UmVmO1xuXG4gIEBWaWV3Q2hpbGQoXCJpdnB0Q29udGVudEJvZHlcIikgaXZwdENvbnRlbnRCb2R5UmVmOiBFbGVtZW50UmVmIHwgdW5kZWZpbmVkO1xuXG4gIEBWaWV3Q2hpbGQoXCJkYXRhZ3JpZFdyYXBwZXJcIikgZGF0YWdyaWRXcmFwcGVyITogRWxlbWVudFJlZjtcblxuICBAVmlld0NoaWxkKFwiZGF0YWdyaWRIZWFkZXJXcmFwcGVyXCIpIGRhdGFncmlkSGVhZGVyV3JhcHBlciE6IEVsZW1lbnRSZWY7XG5cbiAgQFZpZXdDaGlsZChcImRhdGFncmlkQm9keVdyYXBwZXJcIikgZGF0YWdyaWRCb2R5V3JhcHBlciE6IEVsZW1lbnRSZWY7XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZWxlbWVudE1hbmFnZXIucmVnaXN0ZXJEYXRhZ3JpZEVsKHRoaXMuZGF0YWdyaWRXcmFwcGVyLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMuZWxlbWVudE1hbmFnZXIucmVnaXN0ZXJEYXRhZ3JpZEhlYWRlckVsKFxuICAgICAgdGhpcy5kYXRhZ3JpZEhlYWRlcldyYXBwZXIubmF0aXZlRWxlbWVudFxuICAgICk7XG4gICAgdGhpcy5lbGVtZW50TWFuYWdlci5yZWdpc3RlckRhdGFncmlkU2VsZWN0QWxsRWwoXG4gICAgICB0aGlzLml2cHRTZWxlY3RBbGxSZWYubmF0aXZlRWxlbWVudFxuICAgICk7XG4gICAgdGhpcy5lbGVtZW50TWFuYWdlci5yZWdpc3RlckRhdGFncmlkQm9keUVsKFxuICAgICAgdGhpcy5kYXRhZ3JpZEJvZHlXcmFwcGVyLm5hdGl2ZUVsZW1lbnRcbiAgICApO1xuXG4gICAgaWYgKHRoaXMuaXZwdENvbnRlbnRCb2R5UmVmKSB7XG4gICAgICB0aGlzLml2cHRDb250ZW50Qm9keVJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9XG4gICAgICAgIHRoaXMuZ3JpZERlZnMuaGVpZ2h0IC1cbiAgICAgICAgKFBSRVNFTlRBQkxFX0NPTkZJRy5oZWFkZXJTcGFjZS5oZWlnaHQgK1xuICAgICAgICAgIFBSRVNFTlRBQkxFX0NPTkZJRy5jb2x1bW4uaGVhZEhlaWdodCArXG4gICAgICAgICAgUFJFU0VOVEFCTEVfQ09ORklHLmZpbHRlclNwYWNlLmhlaWdodCArXG4gICAgICAgICAgUFJFU0VOVEFCTEVfQ09ORklHLnBhZ2luYXRvci5oZWlnaHQpICtcbiAgICAgICAgXCJweFwiO1xuICAgIH1cbiAgICB0aGlzLmNvbHVtblNpemluZy5yZUNhbGNXaWR0aC5uZXh0KHRydWUpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgY29sdW1uU2l6aW5nOiBDb2x1bW5TaXppbmdTZXJ2aWNlLFxuICAgIHByaXZhdGUgZWxlbWVudE1hbmFnZXI6IEVsZW1lbnRNYW5hZ2VyU2VydmljZSxcbiAgICBwdWJsaWMgZGF0YU1hbmFnZXI6IERhdGFNYW5hZ2VyU2VydmljZSxcbiAgICBwdWJsaWMgcGFnZU1hbmFnZXI6IFBhZ2VNYW5hZ2VyU2VydmljZSxcbiAgICBwdWJsaWMgZmlsdGVyTWFuYWdlcjogRmlsdGVyTWFuYWdlclNlcnZpY2VcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuYWRkTGlzdGVuZXJzKCk7XG4gIH1cblxuICBwcm9jZXNzRGF0YSgpIHtcbiAgICBpZiAodGhpcy5ncmlkRGVmcy5kYXRhU3RyZWFtPT09XCJzZXJ2ZXItc2lkZVwiKSB7XG4gICAgICB0aGlzLnByb2Nlc3NSZW1vdGVEYXRhKCk7XG4gICAgICB0aGlzLl9pc0dyaWRSZWFkeSA9IHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdyaWREZWZzLmRhdGFTdHJlYW09PT1cImNsaWVudC1zaWRlXCIpIHtcbiAgICAgIHRoaXMucHJvY2Vzc0xvY2FsRGF0YSgpO1xuICAgICAgdGhpcy5faXNHcmlkUmVhZHkgPSB0cnVlO1xuICAgIH1cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuY29sdW1uU2l6aW5nLnJlQ2FsY1dpZHRoLm5leHQodHJ1ZSk7XG4gICAgfSwgMjAwMCk7XG4gIH1cblxuICBwcm9jZXNzUmVtb3RlRGF0YShkYXRhPzogYW55KSB7XG4gICAgdGhpcy5wcm9jZXNzZWREYXRhID0gZGF0YSB8fCBzdHJ1Y3R1cmVkQ2xvbmUodGhpcy5kYXRhVHJ1ZUNvcHkpO1xuICAgIHRoaXMuY3VyclZpc2libGVEYXRhID0gdGhpcy5wcm9jZXNzZWREYXRhO1xuICAgIHRoaXMuX3JlY29yZHNUb3RhbCA9IHRoaXMuZ3JpZERlZnMucmVjb3Jkc1RvdGFsO1xuICAgIHRoaXMucGFnaW5hdGlvbiA9IHRoaXMuX3JlY29yZHNUb3RhbCA+IHRoaXMucHJvY2Vzc2VkRGF0YS5sZW5ndGg7XG4gIH1cblxuICBwcm9jZXNzTG9jYWxEYXRhKGRhdGE/OiBhbnkpIHtcbiAgICB0aGlzLnByb2Nlc3NlZERhdGEgPSBkYXRhIHx8IHN0cnVjdHVyZWRDbG9uZSh0aGlzLmRhdGFUcnVlQ29weSk7XG4gICAgaWYgKCF0aGlzLnBhZ2luYXRpb24pIHtcbiAgICAgIHRoaXMuY3VyclZpc2libGVEYXRhID0gdGhpcy5wcm9jZXNzZWREYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZWNvcmRzVG90YWwgPSB0aGlzLnByb2Nlc3NlZERhdGEubGVuZ3RoO1xuICAgICAgdGhpcy5zZXRDdXJyVmlzaWJsZURhdGEoMCwgdGhpcy5yZWNvcmRzUGVyUGFnZSk7XG4gICAgfVxuICB9XG5cbiAgc2V0Q3VyclZpc2libGVEYXRhKGZyb206IG51bWJlciwgdG86IG51bWJlcikge1xuICAgIHRoaXMuY3VyclZpc2libGVEYXRhID0gdGhpcy5wcm9jZXNzZWREYXRhLnNsaWNlKGZyb20sIHRvKTtcbiAgfVxuXG4gIGFkZExpc3RlbmVycygpIHtcbiAgICB0aGlzLmNvbHVtblNpemluZy5yZUNhbGNXaWR0aC5waXBlKGRlbGF5KDEwMCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmNvbHVtblNpemluZy5yZUNhbGNDb2x1bW5XaWR0aCh0aGlzLmNvbHVtbkRlZnMpO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlZENvbHVtbldpZHRoKGNvbEl0ZW06IGFueSwgd2lkdGg6IGFueSkge1xuICAgIGNvbEl0ZW0ud2lkdGggPSB3aWR0aDtcbiAgfVxuXG4gIC8vIEhhbmRsZXMgc29ydGluZ1xuICBkb1NvcnQoYXBwbGllZEZpZWxkOiBzdHJpbmcpIHtcbiAgICB0aGlzLnBhZ2VNYW5hZ2VyLnJlc2V0UGFnaW5hdGlvbigpO1xuICAgIGlmICh0aGlzLl9pc1NvcnRBcHBsaWVkICYmIHRoaXMuX3NvcnRBcHBsaWVkT24gPT09IGFwcGxpZWRGaWVsZCkge1xuICAgICAgaWYgKHRoaXMuX3NvcnRPcmRlciA9PT0gXCJBU0NcIikge1xuICAgICAgICB0aGlzLl9zb3J0T3JkZXIgPSBcIkRFU0NcIjtcbiAgICAgICAgdGhpcy5zb3J0QnkoYXBwbGllZEZpZWxkLCBcIkRFU0NcIik7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX3NvcnRPcmRlciA9PT0gXCJERVNDXCIpIHtcbiAgICAgICAgdGhpcy5yZXNldFNvcnQoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faXNTb3J0QXBwbGllZCA9IHRydWU7XG4gICAgICB0aGlzLl9zb3J0QXBwbGllZE9uID0gYXBwbGllZEZpZWxkO1xuICAgICAgdGhpcy5fc29ydE9yZGVyID0gXCJBU0NcIjtcbiAgICAgIHRoaXMudW5Tb3J0ZWRDb3B5ID0gc3RydWN0dXJlZENsb25lKHRoaXMucHJvY2Vzc2VkRGF0YSk7XG4gICAgICB0aGlzLnNvcnRCeShhcHBsaWVkRmllbGQsIFwiQVNDXCIpO1xuICAgIH1cbiAgfVxuXG4gIHNvcnRCeSh0aGVGaWVsZDogYW55LCBvcmRlckJ5OiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5ncmlkRGVmcy5kYXRhU3RyZWFtPT09XCJzZXJ2ZXItc2lkZVwiKSB7XG4gICAgICB0aGlzLnJlbW90ZURhdGFQYXJhbXMuc29ydEJ5ID0gdGhlRmllbGQ7XG4gICAgICB0aGlzLnJlbW90ZURhdGFQYXJhbXMub3JkZXJCeSA9IG9yZGVyQnk7XG4gICAgICB0aGlzLnJlbW90ZURhdGFQYXJhbXMucmVjb3Jkc0Zyb20gPSAwO1xuICAgICAgdGhpcy5yZW1vdGVEYXRhUGFyYW1zLnJlY29yZHNUbyA9IG51bGw7XG4gICAgICB0aGlzLmRhdGFwYXJhbXMuZW1pdCh0aGlzLnJlbW90ZURhdGFQYXJhbXMpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5ncmlkRGVmcy5kYXRhU3RyZWFtPT09XCJjbGllbnQtc2lkZVwiKSB7XG4gICAgICBpZiAob3JkZXJCeSA9PT0gXCJBU0NcIikge1xuICAgICAgICB0aGlzLnByb2Nlc3NlZERhdGEuc29ydCgoYTogYW55LCBiOiBhbnkpID0+XG4gICAgICAgICAgYVt0aGVGaWVsZF0gPiBiW3RoZUZpZWxkXSA/IDEgOiAtMVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIGlmIChvcmRlckJ5ID09PSBcIkRFU0NcIikge1xuICAgICAgICB0aGlzLnByb2Nlc3NlZERhdGEuc29ydCgoYTogYW55LCBiOiBhbnkpID0+XG4gICAgICAgICAgYVt0aGVGaWVsZF0gPiBiW3RoZUZpZWxkXSA/IC0xIDogMVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRDdXJyVmlzaWJsZURhdGEoMCwgdGhpcy5yZWNvcmRzUGVyUGFnZSk7XG4gICAgfVxuICB9XG5cbiAgcmVzZXRTb3J0KCkge1xuICAgIHRoaXMuX2lzU29ydEFwcGxpZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9zb3J0QXBwbGllZE9uID0gXCJcIjtcbiAgICB0aGlzLl9zb3J0T3JkZXIgPSBudWxsO1xuICAgIHRoaXMucHJvY2Vzc2VkRGF0YSA9IHN0cnVjdHVyZWRDbG9uZSh0aGlzLnVuU29ydGVkQ29weSk7XG4gICAgdGhpcy5zZXRDdXJyVmlzaWJsZURhdGEoMCwgdGhpcy5yZWNvcmRzUGVyUGFnZSk7XG4gIH1cblxuICAvKipcbiAgICogSW52b2tlcyB3aGVuIGFueSBmaWx0ZXIgYXBwbGllZFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKi9cbiAgaGFuZGxlRmlsdGVycyhkYXRhOiBhbnkpIHtcbiAgICB0aGlzLmZpbHRlck1hbmFnZXIuYnVpbGRRdWVyeU1vZGVsKGRhdGEpO1xuICAgIGlmICh0aGlzLmdyaWREZWZzLmRhdGFTdHJlYW09PT1cInNlcnZlci1zaWRlXCIpIHtcbiAgICAgIHRoaXMucmVtb3RlRGF0YVBhcmFtcy5maWx0ZXJDb25maWcgPSB0aGlzLmZpbHRlck1hbmFnZXIuZ2V0UXVlcnlNb2RlbCgpO1xuICAgICAgdGhpcy5yZW1vdGVEYXRhUGFyYW1zLnJlY29yZHNGcm9tID0gMDtcbiAgICAgIHRoaXMucmVtb3RlRGF0YVBhcmFtcy5yZWNvcmRzVG8gPSB0aGlzLnJlY29yZHNQZXJQYWdlO1xuICAgICAgdGhpcy5kYXRhcGFyYW1zLmVtaXQodGhpcy5yZW1vdGVEYXRhUGFyYW1zKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ3JpZERlZnMuZGF0YVN0cmVhbT09PVwiY2xpZW50LXNpZGVcIikge1xuICAgICAgdGhpcy5wcm9jZXNzRmlsdGVyKGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3NGaWx0ZXIoZGF0YTogYW55KSB7XG4gICAgbGV0IHJlc3VsdDogYW55ID0gW107XG4gICAgY29uc3QgcXVlcnlNb2RlbCA9IHRoaXMuZmlsdGVyTWFuYWdlci5nZXRRdWVyeU1vZGVsKCk7XG4gICAgaWYgKE9iamVjdC5rZXlzKHF1ZXJ5TW9kZWwpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgbGV0IHRlbXBEYXRhU2V0ID0gc3RydWN0dXJlZENsb25lKHRoaXMucmVjb3Jkcyk7XG4gICAgICByZXN1bHQgPSB0aGlzLmZpbHRlck1hbmFnZXIuZmlsdGVyRGF0YSh0ZW1wRGF0YVNldCwgcXVlcnlNb2RlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IHN0cnVjdHVyZWRDbG9uZSh0aGlzLnJlY29yZHMpO1xuICAgIH1cbiAgICB0aGlzLnByb2Nlc3NMb2NhbERhdGEocmVzdWx0KTtcbiAgfVxuXG4gIHJlc2V0RmlsdGVyaW5nKCkge1xuICAgIGlmICh0aGlzLmdyaWREZWZzLmRhdGFTdHJlYW09PT1cInNlcnZlci1zaWRlXCIpIHtcbiAgICAgIHRoaXMucmVtb3RlRGF0YVBhcmFtcy5maWx0ZXJDb25maWcgPSB7fVxuICAgICAgdGhpcy5yZW1vdGVEYXRhUGFyYW1zLnJlY29yZHNGcm9tID0gMDtcbiAgICAgIHRoaXMucmVtb3RlRGF0YVBhcmFtcy5yZWNvcmRzVG8gPSB0aGlzLnJlY29yZHNQZXJQYWdlO1xuICAgICAgdGhpcy5kYXRhcGFyYW1zLmVtaXQodGhpcy5yZW1vdGVEYXRhUGFyYW1zKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ3JpZERlZnMuZGF0YVN0cmVhbT09PVwiY2xpZW50LXNpZGVcIikge1xuICAgICAgdGhpcy5wcm9jZXNzTG9jYWxEYXRhKCk7XG4gICAgICB0aGlzLmZpbHRlck1hbmFnZXIucmVzZXRRdWVyeU1vZGVsKCk7XG4gICAgfVxuICB9XG5cbiAgb25QYWdpbmF0aW9uQ2hhbmdlKGRhdGE6IGFueSkge1xuICAgIGlmICh0aGlzLmdyaWREZWZzLmRhdGFTdHJlYW09PT1cInNlcnZlci1zaWRlXCIpIHtcbiAgICAgIHRoaXMucmVtb3RlRGF0YVBhcmFtcy5yZWNvcmRzRnJvbSA9IGRhdGEuZnJvbTtcbiAgICAgIHRoaXMucmVtb3RlRGF0YVBhcmFtcy5yZWNvcmRzVG8gPSBkYXRhLnRvO1xuICAgICAgdGhpcy5kYXRhcGFyYW1zLmVtaXQodGhpcy5yZW1vdGVEYXRhUGFyYW1zKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ3JpZERlZnMuZGF0YVN0cmVhbT09PVwiY2xpZW50LXNpZGVcIikge1xuICAgICAgdGhpcy5zZXRDdXJyVmlzaWJsZURhdGEoZGF0YS5mcm9tLCBkYXRhLnRvKTtcbiAgICB9XG4gIH1cblxuICB3aGVuU2VsZWN0QWxsKCRldmVudDogYW55KTogdm9pZCB7XG4gICAgY29uc3Qgc3RhdHVzID0gJGV2ZW50LnRhcmdldC5jaGVja2VkO1xuICAgIGZvciAobGV0IGl0ZW0gb2YgdGhpcy5jdXJyVmlzaWJsZURhdGEpIHtcbiAgICAgIGl0ZW1bXCJkdFNlbGVjdGVkXCJdID0gc3RhdHVzO1xuICAgICAgaWYgKHN0YXR1cykge1xuICAgICAgICB0aGlzLnNlbGVjdGVkUm93cy5wdXNoKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnJlY29yZHNTZWxlY3RlZC5lbWl0KHRoaXMuc2VsZWN0ZWRSb3dzKTtcbiAgfVxuXG4gIHdoZW5TZWxlY3RSb3coZGF0YTogYW55KSB7XG4gICAgaWYgKGRhdGEuc2VsZWN0ZWQpIHtcbiAgICAgIGRhdGEucm93W1wiaXNTZWxlY3RlZFwiXSA9IHRydWU7XG4gICAgICB0aGlzLnNlbGVjdGVkUm93cy5wdXNoKGRhdGEucm93KTtcbiAgICAgIGlmICghdGhpcy5kYXRhTWFuYWdlci5jYW5TZWxlY3RBbGwodGhpcy5jdXJyVmlzaWJsZURhdGEpKSB7XG4gICAgICAgIHRoaXMuaXZwdFNlbGVjdEFsbFJlZi5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdLmluZGV0ZXJtaW5hdGUgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pdnB0U2VsZWN0QWxsUmVmLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0uY2hlY2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEucm93W1wiaXNTZWxlY3RlZFwiXSA9IGZhbHNlO1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnNlbGVjdGVkUm93cy5pbmRleE9mKGRhdGEucm93KTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRSb3dzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICBpZiAodGhpcy5zZWxlY3RlZFJvd3MubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLml2cHRTZWxlY3RBbGxSZWYubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5pbmRldGVybWluYXRlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuaXZwdFNlbGVjdEFsbFJlZi5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdLmluZGV0ZXJtaW5hdGUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5pdnB0U2VsZWN0QWxsUmVmLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0uY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnJlY29yZHNTZWxlY3RlZC5lbWl0KHRoaXMuc2VsZWN0ZWRSb3dzKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2lzR3JpZFJlYWR5ID0gZmFsc2U7XG4gICAgdGhpcy5yZW1vdGVEYXRhUGFyYW1zID0ge307XG4gICAgdGhpcy5zZWxlY3RlZFJvd3MgPSBbXTtcbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cIml2cHQtY29udGFpbmVyXCIgW25nU3R5bGVdPVwieyAnaGVpZ2h0LnB4JzogZ3JpZERlZnMuaGVpZ2h0IH1cIiAjZGF0YWdyaWRXcmFwcGVyPlxuICBAaWYgKCFfaXNHcmlkUmVhZHkpIHtcbiAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwicHJlc2VudGFibGVGYWxsYmFja1RlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gIH1cbiAgQGVsc2Uge1xuICAgIDwhLS0gRGF0YXRhYmxlIEhlYWRlciAtLT5cbiAgICA8ZGl2IGNsYXNzPVwiaXZwdC1oZWFkZXJcIj5cbiAgICAgIEBpZiAoY29sdW1uQ29udHJvbHMpIHtcbiAgICAgICAgPHByZXNlbnRhYmxlLWNvbHVtbi1jb250cm9sc1xuICAgICAgICAgIFtjb2x1bW5zXT1cImNvbHVtbkRlZnNcIlxuICAgICAgICA+PC9wcmVzZW50YWJsZS1jb2x1bW4tY29udHJvbHM+XG4gICAgICB9XG4gICAgPC9kaXY+XG5cbiAgICA8IS0tIERhdGF0YWJsZSBDb250ZW50IC0tPlxuICAgIDxkaXYgY2xhc3M9XCJpdnB0LWNvbnRlbnRcIj5cblxuICAgICAgPCEtLSBDb2x1bW4gaGVhZGluZ3Mgb2YgdGhlIHRhYmxlIC0tPlxuICAgICAgPGRpdiAjZGF0YWdyaWRIZWFkZXJXcmFwcGVyIGNsYXNzPVwiaXZwdC1jb250ZW50LWhlYWRcIiByb2xlPVwicm93XCIgYXJpYS1yb3dpbmRleD1cIjFcIj5cbiAgICAgICAgQGlmIChyZWNvcmRTZWxlY3Rpb24pIHtcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaXZwdC1oZWFkLWNvbHVtbi1jZWxsLXdyYXBwZXJcIj5cbiAgICAgICAgICAgIDxkaXYgI2l2cHRTZWxlY3RBbGwgY2xhc3M9XCJpdnB0LXNlbGVjdGFsbC1jZWxsXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgIGNsYXNzPVwiaXZwdC1hbGwtc2VsZWN0LWNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICAgICAgICBpZD1cInNlbGVjdGFsbFwiXG4gICAgICAgICAgICAgICAgKGNoYW5nZSk9XCJ3aGVuU2VsZWN0QWxsKCRldmVudClcIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaXZwdC1maWx0ZXItY2VsbFwiIHN0eWxlPVwid2lkdGg6IDM2cHg7XCI+PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIH1cbiAgICAgICAgQGZvciAoY29sSXRlbSBvZiBjb2x1bW5EZWZzOyB0cmFjayBjb2xJdGVtOyBsZXQgaT0kaW5kZXgpIHtcbiAgICAgICAgICBAaWYgKGNvbEl0ZW0udmlzaWJsZSkge1xuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIml2cHQtaGVhZC1jb2x1bW4tY2VsbC13cmFwcGVyXCI+XG4gICAgICAgICAgICAgIDxkaXYgXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJpdnB0LWhlYWQtY2VsbFwiIFxuICAgICAgICAgICAgICAgIHJvbGU9XCJjb2x1bW5oZWFkZXJcIiBcbiAgICAgICAgICAgICAgICBhdHRyLmFyaWEtY29saW5kZXg9XCJ7e2krMX19XCIgXG4gICAgICAgICAgICAgICAgKGNsaWNrKT1cImRvU29ydChjb2xJdGVtLmZpZWxkKVwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLndpZHRoLnB4XT1cImNvbEl0ZW0ud2lkdGhcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIml2cHQtY29sdW1uLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICB7e2NvbEl0ZW0udGl0bGV9fVxuICAgICAgICAgICAgICAgICAgQGlmIChfaXNTb3J0QXBwbGllZCAmJiBfc29ydEFwcGxpZWRPbj09PWNvbEl0ZW0uZmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgQGlmIChfc29ydE9yZGVyPT09J0FTQycpIHtcbiAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIml2cHQtc29ydC1pZGVudGlmaWVyXCI+ICZ1YXJyOzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBAZWxzZSBpZiAoX3NvcnRPcmRlcj09PSdERVNDJykge1xuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaXZwdC1zb3J0LWlkZW50aWZpZXJcIj4gJmRhcnI7PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIml2cHQtY29sdW1uLWV4dFwiPlxuICAgICAgICAgICAgICAgICAgPHByZXNlbnRhYmxlLWNvbHVtbi1yZXNpemVyIFxuICAgICAgICAgICAgICAgICAgICBbcmVzaXphYmxlXT1cInRydWVcIiBcbiAgICAgICAgICAgICAgICAgICAgKHVwZGF0ZWRDb2x1bW5XaWR0aCk9XCJ1cGRhdGVkQ29sdW1uV2lkdGgoY29sSXRlbSwgJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICA+PC9wcmVzZW50YWJsZS1jb2x1bW4tcmVzaXplcj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJpdnB0LWZpbHRlci1jZWxsXCJcbiAgICAgICAgICAgICAgICBbc3R5bGUud2lkdGgucHhdPVwiY29sSXRlbS53aWR0aFwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBAaWYgKGNvbEl0ZW0uaGFzRmlsdGVyICYmIGNvbEl0ZW0uZmlsdGVyVHlwZT09PSd0ZXh0Jykge1xuICAgICAgICAgICAgICAgICAgPHByZXNlbnRhYmxlLXRleHQtZmlsdGVyXG4gICAgICAgICAgICAgICAgICAgIFtjb2x1bW5dPVwiY29sSXRlbVwiXG4gICAgICAgICAgICAgICAgICAgICh3aGVuQXBwbGllZCk9XCJoYW5kbGVGaWx0ZXJzKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgPjwvcHJlc2VudGFibGUtdGV4dC1maWx0ZXI+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIEBlbHNlIGlmIChjb2xJdGVtLmhhc0ZpbHRlciAmJiBjb2xJdGVtLmZpbHRlclR5cGU9PT0nb3B0aW9ucycpIHtcbiAgICAgICAgICAgICAgICAgIDxwcmVzZW50YWJsZS1vcHRpb25zLWZpbHRlclxuICAgICAgICAgICAgICAgICAgICBbY29sdW1uXT1cImNvbEl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICBbdGF4b25vbXldPVwiY29sSXRlbS5maWx0ZXJPcHRpb25zXCJcbiAgICAgICAgICAgICAgICAgICAgKHdoZW5BcHBsaWVkKT1cImhhbmRsZUZpbHRlcnMoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICA+PC9wcmVzZW50YWJsZS1vcHRpb25zLWZpbHRlcj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgPC9kaXY+XG5cbiAgICAgIDwhLS0gVGFibGUgcm93cyAtLT5cbiAgICAgIDxkaXYgI2l2cHRDb250ZW50Qm9keSBjbGFzcz1cIml2cHQtY29udGVudC1ib2R5XCIgcm9sZT1cInJvd2dyb3VwXCIgI2RhdGFncmlkQm9keVdyYXBwZXI+XG4gICAgICAgIEBmb3IgKGRhdGFJdGVtIG9mIGN1cnJWaXNpYmxlRGF0YTsgdHJhY2sgZGF0YUl0ZW07IGxldCBpPSRpbmRleCkge1xuICAgICAgICAgIDxwcmVzZW50YWJsZS1yb3dcbiAgICAgICAgICAgIFtjb2x1bW5zXT1cImNvbHVtbkRlZnNcIlxuICAgICAgICAgICAgW3Jvd0luZGV4XT1cImlcIlxuICAgICAgICAgICAgW3Jvd1NlbGVjdGlvbkVuYWJsZWRdPVwicmVjb3JkU2VsZWN0aW9uXCJcbiAgICAgICAgICAgIFtyb3dEYXRhXT1cImRhdGFJdGVtXCJcbiAgICAgICAgICAgIChvblNlbGVjdGlvbik9XCJ3aGVuU2VsZWN0Um93KCRldmVudClcIlxuICAgICAgICAgID48L3ByZXNlbnRhYmxlLXJvdz5cbiAgICAgICAgfVxuICAgICAgPC9kaXY+XG5cbiAgICA8L2Rpdj5cblxuICAgIDwhLS0gRGF0YXRhYmxlIEZvb3RlciAtLT5cbiAgICA8ZGl2IGNsYXNzPVwiaXZwdC1mb290ZXJcIj5cbiAgICAgIEBpZiAocGFnaW5hdGlvbikge1xuICAgICAgICA8cHJlc2VudGFibGUtcGFnaW5hdG9yXG4gICAgICAgICAgW3JlY29yZHNQZXJQYWdlT3B0aW9uc109XCJyZWNvcmRzUGVyUGFnZU9wdGlvbnNcIlxuICAgICAgICAgIFtyZWNvcmRzUGVyUGFnZV09XCJyZWNvcmRzUGVyUGFnZVwiXG4gICAgICAgICAgW3JlY29yZHNUb3RhbF09XCJfcmVjb3Jkc1RvdGFsXCJcbiAgICAgICAgICAocGFnZUNoYW5nZSk9XCJvblBhZ2luYXRpb25DaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgID48L3ByZXNlbnRhYmxlLXBhZ2luYXRvcj5cbiAgICAgIH1cbiAgICA8L2Rpdj5cbiAgfVxuXG4gIDxuZy10ZW1wbGF0ZSAjcHJlc2VudGFibGVGYWxsYmFja1RlbXBsYXRlPlxuICAgIDxkaXY+TG9hZGluZy4uLjwvZGl2PlxuICA8L25nLXRlbXBsYXRlPlxuPC9kaXY+XG4iXX0=