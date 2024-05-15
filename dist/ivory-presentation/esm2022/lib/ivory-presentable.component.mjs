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
            pageConfig: {},
            filterConfig: {},
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
        if (this.gridDefs.dataSource === "remote") {
            // process remote data
        }
        else if (this.gridDefs.dataSource === "local") {
            this.processLocalData();
            this._isGridReady = true;
        }
        setTimeout(() => {
            this.columnSizing.reCalcWidth.next(true);
        }, 2000);
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
        if (this.gridDefs.dataSource === "remote") {
            // emit the data params
        }
        else if (this.gridDefs.dataSource === "local") {
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
        if (this.gridDefs.dataSource === "remote") {
            this.remoteDataParams.filterConfig = this.filterManager.getQueryModel();
            this.dataparams.emit(this.remoteDataParams);
        }
        else if (this.gridDefs.dataSource === "local") {
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
        if (this.gridDefs.dataSource === "remote") {
            this.remoteDataParams.filterConfig = {};
            this.dataparams.emit(this.remoteDataParams);
        }
        else if (this.gridDefs.dataSource === "local") {
            this.processLocalData();
            this.filterManager.resetQueryModel();
        }
    }
    onPaginationChange(data) {
        if (this.gridDefs.dataSource === "remote") {
            // emit the data params
        }
        else if (this.gridDefs.dataSource === "local") {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXZvcnktcHJlc2VudGFibGUuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvaXZvcnktcHJlc2VudGFibGUvc3JjL2xpYi9pdm9yeS1wcmVzZW50YWJsZS5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9pdm9yeS1wcmVzZW50YWJsZS9zcmMvbGliL2l2b3J5LXByZXNlbnRhYmxlLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsS0FBSyxFQUVMLE1BQU0sRUFDTixZQUFZLEVBQ1osU0FBUyxHQUtWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFN0IsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0saUJBQWlCLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBWXJELE1BQU0sT0FBTyx5QkFBeUI7SUFxQ3BDLElBQWEsVUFBVSxDQUFDLFVBQWU7UUFDckMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDRCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUlELElBQWEsT0FBTyxDQUFDLEtBQVU7UUFDN0IsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQztJQXdCRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENB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a0JBQWtCO3NCQUEvQyxTQUFTO3VCQUFDLGlCQUFpQjtnQkFFRSxlQUFlO3NCQUE1QyxTQUFTO3VCQUFDLGlCQUFpQjtnQkFFUSxxQkFBcUI7c0JBQXhELFNBQVM7dUJBQUMsdUJBQXVCO2dCQUVBLG1CQUFtQjtzQkFBcEQsU0FBUzt1QkFBQyxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBFbGVtZW50UmVmLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgVmlld0NoaWxkLFxuICBPbkluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBPbkRlc3Ryb3ksXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBkZWxheSB9IGZyb20gXCJyeGpzXCI7XG5cbmltcG9ydCB7IFBSRVNFTlRBQkxFX0NPTkZJRyB9IGZyb20gXCIuL2NvbmZpZy9jb25maWdcIjtcbmltcG9ydCB7IERhdGFNYW5hZ2VyU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL2RhdGEtbWFuYWdlci5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBQYWdlTWFuYWdlclNlcnZpY2UgfSBmcm9tIFwiLi9zZXJ2aWNlcy9wYWdlLW1hbmFnZXIuc2VydmljZVwiO1xuaW1wb3J0IHsgQ29sdW1uU2l6aW5nU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL2NvbHVtbi1zaXppbmcuc2VydmljZVwiO1xuaW1wb3J0IHsgRWxlbWVudE1hbmFnZXJTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvZWxlbWVudC1tYW5hZ2VyLnNlcnZpY2VcIjtcbmltcG9ydCB7IEZpbHRlck1hbmFnZXJTZXJ2aWNlIH0gZnJvbSBcIi4vc2VydmljZXMvZmlsdGVyLW1hbmFnZXIuc2VydmljZVwiO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwiaXZvcnktcHJlc2VudGFibGVcIixcbiAgdGVtcGxhdGVVcmw6IFwiLi9pdm9yeS1wcmVzZW50YWJsZS5jb21wb25lbnQuaHRtbFwiLFxuICBzdHlsZVVybDogXCIuL2l2b3J5LXByZXNlbnRhYmxlLmNvbXBvbmVudC5zY3NzXCIsXG59KVxuZXhwb3J0IGNsYXNzIEl2b3J5UHJlc2VudGFibGVDb21wb25lbnRcbiAgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdFxue1xuICAvLyBSZWNvcmRzIERhdGFcbiAgZGF0YVRydWVDb3B5OiBhbnk7XG4gIHByb2Nlc3NlZERhdGE6IGFueTtcbiAgY3VyclZpc2libGVEYXRhOiBhbnk7XG4gIHVuU29ydGVkQ29weTogYW55O1xuXG4gIC8vIFNvcnRpbmdcbiAgX2lzU29ydEFwcGxpZWQgPSBmYWxzZTtcbiAgX3NvcnRBcHBsaWVkT24gPSBcIlwiO1xuICBfc29ydE9yZGVyOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvLyBGaWx0ZXJpbmdcbiAgX2lzRmlsdGVyQXBwbGllZCA9IGZhbHNlO1xuICBmaWx0ZXJNb2RlbDogYW55ID0ge307XG5cbiAgX3JlY29yZHNUb3RhbDogbnVtYmVyID0gMDtcblxuICAvLyBHcmlkIHJlbmRlcmluZ1xuICBfaXNHcmlkUmVhZHkgPSBmYWxzZTtcblxuICAvLyBkYXRhIHBhcmFtcyB3aGVuIHRoZSBkYXRhIHNvdXJjZSBpcyByZW1vdGUgKHNlcnZlci1zaWRlKVxuICByZW1vdGVEYXRhUGFyYW1zOiBhbnkgPSB7XG4gICAgcGFnZUNvbmZpZzoge30sXG4gICAgZmlsdGVyQ29uZmlnOiB7fSxcbiAgfTtcblxuICAvLyBSb3cgU2VsZWN0aW9uXG4gIHNlbGVjdGVkUm93czogYW55ID0gW107XG5cbiAgQElucHV0KCkgZ3JpZERlZnM6IGFueTtcblxuICAvLyBASW5wdXQoKSBjb2x1bW5EZWZzOiBhbnk7XG4gIF9jb2x1bW5EZWZzOiBhbnk7XG5cbiAgQElucHV0KCkgc2V0IGNvbHVtbkRlZnMoY29sdW1uRGVmczogYW55KSB7XG4gICAgdGhpcy5fY29sdW1uRGVmcyA9IHRoaXMuY29sdW1uU2l6aW5nLnByb2Nlc3NDb2x1bW5PcHRpb25zKGNvbHVtbkRlZnMpO1xuICB9XG4gIGdldCBjb2x1bW5EZWZzKCkge1xuICAgIHJldHVybiB0aGlzLl9jb2x1bW5EZWZzO1xuICB9XG5cbiAgQElucHV0KCkgY29sdW1uQ29udHJvbHM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBASW5wdXQoKSBzZXQgcmVjb3Jkcyh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5kYXRhVHJ1ZUNvcHkgPSB2YWx1ZTtcbiAgICBPYmplY3QuZnJlZXplKHRoaXMuZGF0YVRydWVDb3B5KTtcbiAgICB0aGlzLnByb2Nlc3NEYXRhKCk7XG4gIH1cbiAgZ2V0IHJlY29yZHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVRydWVDb3B5O1xuICB9XG5cbiAgQElucHV0KCkgcGFnaW5hdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBJbnB1dCgpIHJlY29yZHNQZXJQYWdlOiBudW1iZXIgPSAwO1xuXG4gIEBJbnB1dCgpIHJlY29yZHNQZXJQYWdlT3B0aW9uczogYW55O1xuXG4gIEBJbnB1dCgpIHJlY29yZFNlbGVjdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKSBkYXRhcGFyYW1zID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQE91dHB1dCgpIHJlY29yZHNTZWxlY3RlZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIEBWaWV3Q2hpbGQoXCJpdnB0U2VsZWN0QWxsXCIpIGl2cHRTZWxlY3RBbGxSZWYhOiBFbGVtZW50UmVmO1xuXG4gIEBWaWV3Q2hpbGQoXCJpdnB0Q29udGVudEJvZHlcIikgaXZwdENvbnRlbnRCb2R5UmVmOiBFbGVtZW50UmVmIHwgdW5kZWZpbmVkO1xuXG4gIEBWaWV3Q2hpbGQoXCJkYXRhZ3JpZFdyYXBwZXJcIikgZGF0YWdyaWRXcmFwcGVyITogRWxlbWVudFJlZjtcblxuICBAVmlld0NoaWxkKFwiZGF0YWdyaWRIZWFkZXJXcmFwcGVyXCIpIGRhdGFncmlkSGVhZGVyV3JhcHBlciE6IEVsZW1lbnRSZWY7XG5cbiAgQFZpZXdDaGlsZChcImRhdGFncmlkQm9keVdyYXBwZXJcIikgZGF0YWdyaWRCb2R5V3JhcHBlciE6IEVsZW1lbnRSZWY7XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuZWxlbWVudE1hbmFnZXIucmVnaXN0ZXJEYXRhZ3JpZEVsKHRoaXMuZGF0YWdyaWRXcmFwcGVyLm5hdGl2ZUVsZW1lbnQpO1xuICAgIHRoaXMuZWxlbWVudE1hbmFnZXIucmVnaXN0ZXJEYXRhZ3JpZEhlYWRlckVsKFxuICAgICAgdGhpcy5kYXRhZ3JpZEhlYWRlcldyYXBwZXIubmF0aXZlRWxlbWVudFxuICAgICk7XG4gICAgdGhpcy5lbGVtZW50TWFuYWdlci5yZWdpc3RlckRhdGFncmlkU2VsZWN0QWxsRWwoXG4gICAgICB0aGlzLml2cHRTZWxlY3RBbGxSZWYubmF0aXZlRWxlbWVudFxuICAgICk7XG4gICAgdGhpcy5lbGVtZW50TWFuYWdlci5yZWdpc3RlckRhdGFncmlkQm9keUVsKFxuICAgICAgdGhpcy5kYXRhZ3JpZEJvZHlXcmFwcGVyLm5hdGl2ZUVsZW1lbnRcbiAgICApO1xuXG4gICAgaWYgKHRoaXMuaXZwdENvbnRlbnRCb2R5UmVmKSB7XG4gICAgICB0aGlzLml2cHRDb250ZW50Qm9keVJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9XG4gICAgICAgIHRoaXMuZ3JpZERlZnMuaGVpZ2h0IC1cbiAgICAgICAgKFBSRVNFTlRBQkxFX0NPTkZJRy5oZWFkZXJTcGFjZS5oZWlnaHQgK1xuICAgICAgICAgIFBSRVNFTlRBQkxFX0NPTkZJRy5jb2x1bW4uaGVhZEhlaWdodCArXG4gICAgICAgICAgUFJFU0VOVEFCTEVfQ09ORklHLmZpbHRlclNwYWNlLmhlaWdodCArXG4gICAgICAgICAgUFJFU0VOVEFCTEVfQ09ORklHLnBhZ2luYXRvci5oZWlnaHQpICtcbiAgICAgICAgXCJweFwiO1xuICAgIH1cbiAgICB0aGlzLmNvbHVtblNpemluZy5yZUNhbGNXaWR0aC5uZXh0KHRydWUpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgY29sdW1uU2l6aW5nOiBDb2x1bW5TaXppbmdTZXJ2aWNlLFxuICAgIHByaXZhdGUgZWxlbWVudE1hbmFnZXI6IEVsZW1lbnRNYW5hZ2VyU2VydmljZSxcbiAgICBwdWJsaWMgZGF0YU1hbmFnZXI6IERhdGFNYW5hZ2VyU2VydmljZSxcbiAgICBwdWJsaWMgcGFnZU1hbmFnZXI6IFBhZ2VNYW5hZ2VyU2VydmljZSxcbiAgICBwdWJsaWMgZmlsdGVyTWFuYWdlcjogRmlsdGVyTWFuYWdlclNlcnZpY2VcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuYWRkTGlzdGVuZXJzKCk7XG4gIH1cblxuICBwcm9jZXNzRGF0YSgpIHtcbiAgICBpZiAodGhpcy5ncmlkRGVmcy5kYXRhU291cmNlID09PSBcInJlbW90ZVwiKSB7XG4gICAgICAvLyBwcm9jZXNzIHJlbW90ZSBkYXRhXG4gICAgfSBlbHNlIGlmICh0aGlzLmdyaWREZWZzLmRhdGFTb3VyY2UgPT09IFwibG9jYWxcIikge1xuICAgICAgdGhpcy5wcm9jZXNzTG9jYWxEYXRhKCk7XG4gICAgICB0aGlzLl9pc0dyaWRSZWFkeSA9IHRydWU7XG4gICAgfVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5jb2x1bW5TaXppbmcucmVDYWxjV2lkdGgubmV4dCh0cnVlKTtcbiAgICB9LCAyMDAwKTtcbiAgfVxuXG4gIHByb2Nlc3NMb2NhbERhdGEoZGF0YT86IGFueSkge1xuICAgIHRoaXMucHJvY2Vzc2VkRGF0YSA9IGRhdGEgfHwgc3RydWN0dXJlZENsb25lKHRoaXMuZGF0YVRydWVDb3B5KTtcbiAgICBpZiAoIXRoaXMucGFnaW5hdGlvbikge1xuICAgICAgdGhpcy5jdXJyVmlzaWJsZURhdGEgPSB0aGlzLnByb2Nlc3NlZERhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3JlY29yZHNUb3RhbCA9IHRoaXMucHJvY2Vzc2VkRGF0YS5sZW5ndGg7XG4gICAgICB0aGlzLnNldEN1cnJWaXNpYmxlRGF0YSgwLCB0aGlzLnJlY29yZHNQZXJQYWdlKTtcbiAgICB9XG4gIH1cblxuICBzZXRDdXJyVmlzaWJsZURhdGEoZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyKSB7XG4gICAgdGhpcy5jdXJyVmlzaWJsZURhdGEgPSB0aGlzLnByb2Nlc3NlZERhdGEuc2xpY2UoZnJvbSwgdG8pO1xuICB9XG5cbiAgYWRkTGlzdGVuZXJzKCkge1xuICAgIHRoaXMuY29sdW1uU2l6aW5nLnJlQ2FsY1dpZHRoLnBpcGUoZGVsYXkoMTAwKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuY29sdW1uU2l6aW5nLnJlQ2FsY0NvbHVtbldpZHRoKHRoaXMuY29sdW1uRGVmcyk7XG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVkQ29sdW1uV2lkdGgoY29sSXRlbTogYW55LCB3aWR0aDogYW55KSB7XG4gICAgY29sSXRlbS53aWR0aCA9IHdpZHRoO1xuICB9XG5cbiAgLy8gSGFuZGxlcyBzb3J0aW5nXG4gIGRvU29ydChhcHBsaWVkRmllbGQ6IHN0cmluZykge1xuICAgIHRoaXMucGFnZU1hbmFnZXIucmVzZXRQYWdpbmF0aW9uKCk7XG4gICAgaWYgKHRoaXMuX2lzU29ydEFwcGxpZWQgJiYgdGhpcy5fc29ydEFwcGxpZWRPbiA9PT0gYXBwbGllZEZpZWxkKSB7XG4gICAgICBpZiAodGhpcy5fc29ydE9yZGVyID09PSBcIkFTQ1wiKSB7XG4gICAgICAgIHRoaXMuX3NvcnRPcmRlciA9IFwiREVTQ1wiO1xuICAgICAgICB0aGlzLnNvcnRCeShhcHBsaWVkRmllbGQsIFwiREVTQ1wiKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fc29ydE9yZGVyID09PSBcIkRFU0NcIikge1xuICAgICAgICB0aGlzLnJlc2V0U29ydCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pc1NvcnRBcHBsaWVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3NvcnRBcHBsaWVkT24gPSBhcHBsaWVkRmllbGQ7XG4gICAgICB0aGlzLl9zb3J0T3JkZXIgPSBcIkFTQ1wiO1xuICAgICAgdGhpcy51blNvcnRlZENvcHkgPSBzdHJ1Y3R1cmVkQ2xvbmUodGhpcy5wcm9jZXNzZWREYXRhKTtcbiAgICAgIHRoaXMuc29ydEJ5KGFwcGxpZWRGaWVsZCwgXCJBU0NcIik7XG4gICAgfVxuICB9XG5cbiAgc29ydEJ5KHRoZUZpZWxkOiBhbnksIG9yZGVyQnk6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmdyaWREZWZzLmRhdGFTb3VyY2UgPT09IFwicmVtb3RlXCIpIHtcbiAgICAgIC8vIGVtaXQgdGhlIGRhdGEgcGFyYW1zXG4gICAgfSBlbHNlIGlmICh0aGlzLmdyaWREZWZzLmRhdGFTb3VyY2UgPT09IFwibG9jYWxcIikge1xuICAgICAgaWYgKG9yZGVyQnkgPT09IFwiQVNDXCIpIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzZWREYXRhLnNvcnQoKGE6IGFueSwgYjogYW55KSA9PlxuICAgICAgICAgIGFbdGhlRmllbGRdID4gYlt0aGVGaWVsZF0gPyAxIDogLTFcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAob3JkZXJCeSA9PT0gXCJERVNDXCIpIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzZWREYXRhLnNvcnQoKGE6IGFueSwgYjogYW55KSA9PlxuICAgICAgICAgIGFbdGhlRmllbGRdID4gYlt0aGVGaWVsZF0gPyAtMSA6IDFcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0Q3VyclZpc2libGVEYXRhKDAsIHRoaXMucmVjb3Jkc1BlclBhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0U29ydCgpIHtcbiAgICB0aGlzLl9pc1NvcnRBcHBsaWVkID0gZmFsc2U7XG4gICAgdGhpcy5fc29ydEFwcGxpZWRPbiA9IFwiXCI7XG4gICAgdGhpcy5fc29ydE9yZGVyID0gbnVsbDtcbiAgICB0aGlzLnByb2Nlc3NlZERhdGEgPSBzdHJ1Y3R1cmVkQ2xvbmUodGhpcy51blNvcnRlZENvcHkpO1xuICAgIHRoaXMuc2V0Q3VyclZpc2libGVEYXRhKDAsIHRoaXMucmVjb3Jkc1BlclBhZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludm9rZXMgd2hlbiBhbnkgZmlsdGVyIGFwcGxpZWRcbiAgICogQHBhcmFtIGRhdGFcbiAgICovXG4gIGhhbmRsZUZpbHRlcnMoZGF0YTogYW55KSB7XG4gICAgdGhpcy5maWx0ZXJNYW5hZ2VyLmJ1aWxkUXVlcnlNb2RlbChkYXRhKTtcbiAgICBpZiAodGhpcy5ncmlkRGVmcy5kYXRhU291cmNlID09PSBcInJlbW90ZVwiKSB7XG4gICAgICB0aGlzLnJlbW90ZURhdGFQYXJhbXMuZmlsdGVyQ29uZmlnID0gdGhpcy5maWx0ZXJNYW5hZ2VyLmdldFF1ZXJ5TW9kZWwoKTtcbiAgICAgIHRoaXMuZGF0YXBhcmFtcy5lbWl0KHRoaXMucmVtb3RlRGF0YVBhcmFtcyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmdyaWREZWZzLmRhdGFTb3VyY2UgPT09IFwibG9jYWxcIikge1xuICAgICAgdGhpcy5wcm9jZXNzRmlsdGVyKGRhdGEpO1xuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3NGaWx0ZXIoZGF0YTogYW55KSB7XG4gICAgbGV0IHJlc3VsdDogYW55ID0gW107XG4gICAgY29uc3QgcXVlcnlNb2RlbCA9IHRoaXMuZmlsdGVyTWFuYWdlci5nZXRRdWVyeU1vZGVsKCk7XG4gICAgaWYgKE9iamVjdC5rZXlzKHF1ZXJ5TW9kZWwpLmxlbmd0aCAhPT0gMCkge1xuICAgICAgbGV0IHRlbXBEYXRhU2V0ID0gc3RydWN0dXJlZENsb25lKHRoaXMucmVjb3Jkcyk7XG4gICAgICByZXN1bHQgPSB0aGlzLmZpbHRlck1hbmFnZXIuZmlsdGVyRGF0YSh0ZW1wRGF0YVNldCwgcXVlcnlNb2RlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdCA9IHN0cnVjdHVyZWRDbG9uZSh0aGlzLnJlY29yZHMpO1xuICAgIH1cbiAgICB0aGlzLnByb2Nlc3NMb2NhbERhdGEocmVzdWx0KTtcbiAgfVxuXG4gIHJlc2V0RmlsdGVyaW5nKCkge1xuICAgIGlmICh0aGlzLmdyaWREZWZzLmRhdGFTb3VyY2UgPT09IFwicmVtb3RlXCIpIHtcbiAgICAgIHRoaXMucmVtb3RlRGF0YVBhcmFtcy5maWx0ZXJDb25maWcgPSB7fVxuICAgICAgdGhpcy5kYXRhcGFyYW1zLmVtaXQodGhpcy5yZW1vdGVEYXRhUGFyYW1zKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ3JpZERlZnMuZGF0YVNvdXJjZSA9PT0gXCJsb2NhbFwiKSB7XG4gICAgICB0aGlzLnByb2Nlc3NMb2NhbERhdGEoKTtcbiAgICAgIHRoaXMuZmlsdGVyTWFuYWdlci5yZXNldFF1ZXJ5TW9kZWwoKTtcbiAgICB9XG4gIH1cblxuICBvblBhZ2luYXRpb25DaGFuZ2UoZGF0YTogYW55KSB7XG4gICAgaWYgKHRoaXMuZ3JpZERlZnMuZGF0YVNvdXJjZSA9PT0gXCJyZW1vdGVcIikge1xuICAgICAgLy8gZW1pdCB0aGUgZGF0YSBwYXJhbXNcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ3JpZERlZnMuZGF0YVNvdXJjZSA9PT0gXCJsb2NhbFwiKSB7XG4gICAgICB0aGlzLnNldEN1cnJWaXNpYmxlRGF0YShkYXRhLmZyb20sIGRhdGEudG8pO1xuICAgIH1cbiAgfVxuXG4gIHdoZW5TZWxlY3RBbGwoJGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBzdGF0dXMgPSAkZXZlbnQudGFyZ2V0LmNoZWNrZWQ7XG4gICAgZm9yIChsZXQgaXRlbSBvZiB0aGlzLmN1cnJWaXNpYmxlRGF0YSkge1xuICAgICAgaXRlbVtcImR0U2VsZWN0ZWRcIl0gPSBzdGF0dXM7XG4gICAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRSb3dzLnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucmVjb3Jkc1NlbGVjdGVkLmVtaXQodGhpcy5zZWxlY3RlZFJvd3MpO1xuICB9XG5cbiAgd2hlblNlbGVjdFJvdyhkYXRhOiBhbnkpIHtcbiAgICBpZiAoZGF0YS5zZWxlY3RlZCkge1xuICAgICAgZGF0YS5yb3dbXCJpc1NlbGVjdGVkXCJdID0gdHJ1ZTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRSb3dzLnB1c2goZGF0YS5yb3cpO1xuICAgICAgaWYgKCF0aGlzLmRhdGFNYW5hZ2VyLmNhblNlbGVjdEFsbCh0aGlzLmN1cnJWaXNpYmxlRGF0YSkpIHtcbiAgICAgICAgdGhpcy5pdnB0U2VsZWN0QWxsUmVmLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0uaW5kZXRlcm1pbmF0ZSA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLml2cHRTZWxlY3RBbGxSZWYubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5jaGVja2VkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YS5yb3dbXCJpc1NlbGVjdGVkXCJdID0gZmFsc2U7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuc2VsZWN0ZWRSb3dzLmluZGV4T2YoZGF0YS5yb3cpO1xuICAgICAgdGhpcy5zZWxlY3RlZFJvd3Muc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkUm93cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuaXZwdFNlbGVjdEFsbFJlZi5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdLmluZGV0ZXJtaW5hdGUgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pdnB0U2VsZWN0QWxsUmVmLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0uaW5kZXRlcm1pbmF0ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLml2cHRTZWxlY3RBbGxSZWYubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5jaGVja2VkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMucmVjb3Jkc1NlbGVjdGVkLmVtaXQodGhpcy5zZWxlY3RlZFJvd3MpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5faXNHcmlkUmVhZHkgPSBmYWxzZTtcbiAgICB0aGlzLnJlbW90ZURhdGFQYXJhbXMgPSB7fTtcbiAgICB0aGlzLnNlbGVjdGVkUm93cyA9IFtdO1xuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwiaXZwdC1jb250YWluZXJcIiBbbmdTdHlsZV09XCJ7ICdoZWlnaHQucHgnOiBncmlkRGVmcy5oZWlnaHQgfVwiICNkYXRhZ3JpZFdyYXBwZXI+XG4gIEBpZiAoIV9pc0dyaWRSZWFkeSkge1xuICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJwcmVzZW50YWJsZUZhbGxiYWNrVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgfVxuICBAZWxzZSB7XG4gICAgPCEtLSBEYXRhdGFibGUgSGVhZGVyIC0tPlxuICAgIDxkaXYgY2xhc3M9XCJpdnB0LWhlYWRlclwiPlxuICAgICAgQGlmIChjb2x1bW5Db250cm9scykge1xuICAgICAgICA8cHJlc2VudGFibGUtY29sdW1uLWNvbnRyb2xzXG4gICAgICAgICAgW2NvbHVtbnNdPVwiY29sdW1uRGVmc1wiXG4gICAgICAgID48L3ByZXNlbnRhYmxlLWNvbHVtbi1jb250cm9scz5cbiAgICAgIH1cbiAgICA8L2Rpdj5cblxuICAgIDwhLS0gRGF0YXRhYmxlIENvbnRlbnQgLS0+XG4gICAgPGRpdiBjbGFzcz1cIml2cHQtY29udGVudFwiPlxuXG4gICAgICA8IS0tIENvbHVtbiBoZWFkaW5ncyBvZiB0aGUgdGFibGUgLS0+XG4gICAgICA8ZGl2ICNkYXRhZ3JpZEhlYWRlcldyYXBwZXIgY2xhc3M9XCJpdnB0LWNvbnRlbnQtaGVhZFwiIHJvbGU9XCJyb3dcIiBhcmlhLXJvd2luZGV4PVwiMVwiPlxuICAgICAgICBAaWYgKHJlY29yZFNlbGVjdGlvbikge1xuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpdnB0LWhlYWQtY29sdW1uLWNlbGwtd3JhcHBlclwiPlxuICAgICAgICAgICAgPGRpdiAjaXZwdFNlbGVjdEFsbCBjbGFzcz1cIml2cHQtc2VsZWN0YWxsLWNlbGxcIj5cbiAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJpdnB0LWFsbC1zZWxlY3QtY2hlY2tib3hcIlxuICAgICAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgICAgIGlkPVwic2VsZWN0YWxsXCJcbiAgICAgICAgICAgICAgICAoY2hhbmdlKT1cIndoZW5TZWxlY3RBbGwoJGV2ZW50KVwiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpdnB0LWZpbHRlci1jZWxsXCIgc3R5bGU9XCJ3aWR0aDogMzZweDtcIj48L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgfVxuICAgICAgICBAZm9yIChjb2xJdGVtIG9mIGNvbHVtbkRlZnM7IHRyYWNrIGNvbEl0ZW07IGxldCBpPSRpbmRleCkge1xuICAgICAgICAgIEBpZiAoY29sSXRlbS52aXNpYmxlKSB7XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaXZwdC1oZWFkLWNvbHVtbi1jZWxsLXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgPGRpdiBcbiAgICAgICAgICAgICAgICBjbGFzcz1cIml2cHQtaGVhZC1jZWxsXCIgXG4gICAgICAgICAgICAgICAgcm9sZT1cImNvbHVtbmhlYWRlclwiIFxuICAgICAgICAgICAgICAgIGF0dHIuYXJpYS1jb2xpbmRleD1cInt7aSsxfX1cIiBcbiAgICAgICAgICAgICAgICAoY2xpY2spPVwiZG9Tb3J0KGNvbEl0ZW0uZmllbGQpXCJcbiAgICAgICAgICAgICAgICBbc3R5bGUud2lkdGgucHhdPVwiY29sSXRlbS53aWR0aFwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaXZwdC1jb2x1bW4tdGl0bGVcIj5cbiAgICAgICAgICAgICAgICAgIHt7Y29sSXRlbS50aXRsZX19XG4gICAgICAgICAgICAgICAgICBAaWYgKF9pc1NvcnRBcHBsaWVkICYmIF9zb3J0QXBwbGllZE9uPT09Y29sSXRlbS5maWVsZCkge1xuICAgICAgICAgICAgICAgICAgICBAaWYgKF9zb3J0T3JkZXI9PT0nQVNDJykge1xuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaXZwdC1zb3J0LWlkZW50aWZpZXJcIj4gJnVhcnI7PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIEBlbHNlIGlmIChfc29ydE9yZGVyPT09J0RFU0MnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpdnB0LXNvcnQtaWRlbnRpZmllclwiPiAmZGFycjs8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaXZwdC1jb2x1bW4tZXh0XCI+XG4gICAgICAgICAgICAgICAgICA8cHJlc2VudGFibGUtY29sdW1uLXJlc2l6ZXIgXG4gICAgICAgICAgICAgICAgICAgIFtyZXNpemFibGVdPVwidHJ1ZVwiIFxuICAgICAgICAgICAgICAgICAgICAodXBkYXRlZENvbHVtbldpZHRoKT1cInVwZGF0ZWRDb2x1bW5XaWR0aChjb2xJdGVtLCAkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgID48L3ByZXNlbnRhYmxlLWNvbHVtbi1yZXNpemVyPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBcbiAgICAgICAgICAgICAgICBjbGFzcz1cIml2cHQtZmlsdGVyLWNlbGxcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS53aWR0aC5weF09XCJjb2xJdGVtLndpZHRoXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIEBpZiAoY29sSXRlbS5oYXNGaWx0ZXIgJiYgY29sSXRlbS5maWx0ZXJUeXBlPT09J3RleHQnKSB7XG4gICAgICAgICAgICAgICAgICA8cHJlc2VudGFibGUtdGV4dC1maWx0ZXJcbiAgICAgICAgICAgICAgICAgICAgW2NvbHVtbl09XCJjb2xJdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgKHdoZW5BcHBsaWVkKT1cImhhbmRsZUZpbHRlcnMoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICA+PC9wcmVzZW50YWJsZS10ZXh0LWZpbHRlcj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgQGVsc2UgaWYgKGNvbEl0ZW0uaGFzRmlsdGVyICYmIGNvbEl0ZW0uZmlsdGVyVHlwZT09PSdvcHRpb25zJykge1xuICAgICAgICAgICAgICAgICAgPHByZXNlbnRhYmxlLW9wdGlvbnMtZmlsdGVyXG4gICAgICAgICAgICAgICAgICAgIFtjb2x1bW5dPVwiY29sSXRlbVwiXG4gICAgICAgICAgICAgICAgICAgIFt0YXhvbm9teV09XCJjb2xJdGVtLmZpbHRlck9wdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICAod2hlbkFwcGxpZWQpPVwiaGFuZGxlRmlsdGVycygkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgID48L3ByZXNlbnRhYmxlLW9wdGlvbnMtZmlsdGVyPlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICA8L2Rpdj5cblxuICAgICAgPCEtLSBUYWJsZSByb3dzIC0tPlxuICAgICAgPGRpdiAjaXZwdENvbnRlbnRCb2R5IGNsYXNzPVwiaXZwdC1jb250ZW50LWJvZHlcIiByb2xlPVwicm93Z3JvdXBcIiAjZGF0YWdyaWRCb2R5V3JhcHBlcj5cbiAgICAgICAgQGZvciAoZGF0YUl0ZW0gb2YgY3VyclZpc2libGVEYXRhOyB0cmFjayBkYXRhSXRlbTsgbGV0IGk9JGluZGV4KSB7XG4gICAgICAgICAgPHByZXNlbnRhYmxlLXJvd1xuICAgICAgICAgICAgW2NvbHVtbnNdPVwiY29sdW1uRGVmc1wiXG4gICAgICAgICAgICBbcm93SW5kZXhdPVwiaVwiXG4gICAgICAgICAgICBbcm93U2VsZWN0aW9uRW5hYmxlZF09XCJyZWNvcmRTZWxlY3Rpb25cIlxuICAgICAgICAgICAgW3Jvd0RhdGFdPVwiZGF0YUl0ZW1cIlxuICAgICAgICAgICAgKG9uU2VsZWN0aW9uKT1cIndoZW5TZWxlY3RSb3coJGV2ZW50KVwiXG4gICAgICAgICAgPjwvcHJlc2VudGFibGUtcm93PlxuICAgICAgICB9XG4gICAgICA8L2Rpdj5cblxuICAgIDwvZGl2PlxuXG4gICAgPCEtLSBEYXRhdGFibGUgRm9vdGVyIC0tPlxuICAgIDxkaXYgY2xhc3M9XCJpdnB0LWZvb3RlclwiPlxuICAgICAgQGlmIChwYWdpbmF0aW9uKSB7XG4gICAgICAgIDxwcmVzZW50YWJsZS1wYWdpbmF0b3JcbiAgICAgICAgICBbcmVjb3Jkc1BlclBhZ2VPcHRpb25zXT1cInJlY29yZHNQZXJQYWdlT3B0aW9uc1wiXG4gICAgICAgICAgW3JlY29yZHNQZXJQYWdlXT1cInJlY29yZHNQZXJQYWdlXCJcbiAgICAgICAgICBbcmVjb3Jkc1RvdGFsXT1cIl9yZWNvcmRzVG90YWxcIlxuICAgICAgICAgIChwYWdlQ2hhbmdlKT1cIm9uUGFnaW5hdGlvbkNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgPjwvcHJlc2VudGFibGUtcGFnaW5hdG9yPlxuICAgICAgfVxuICAgIDwvZGl2PlxuICB9XG5cbiAgPG5nLXRlbXBsYXRlICNwcmVzZW50YWJsZUZhbGxiYWNrVGVtcGxhdGU+XG4gICAgPGRpdj5Mb2FkaW5nLi4uPC9kaXY+XG4gIDwvbmctdGVtcGxhdGU+XG48L2Rpdj5cbiJdfQ==