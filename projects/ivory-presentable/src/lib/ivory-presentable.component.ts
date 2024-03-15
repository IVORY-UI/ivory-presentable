import {
  Component,
  Input,
  ElementRef,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { delay } from "rxjs";

import { PRESENTABLE_CONFIG } from "./config/config";
import { DataManagerService } from "./services/data-manager.service";
import { PageManagerService } from "./services/page-manager.service";
import { ColumnSizingService } from "./services/column-sizing.service";
import { ElementManagerService } from "./services/element-manager.service";
import { FilterManagerService } from "./services/filter-manager.service";

@Component({
  selector: "ivory-presentable",
  templateUrl: "./ivory-presentable.component.html",
  styleUrl: "./ivory-presentable.component.scss",
})
export class IvoryPresentableComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  // Records Data
  dataTrueCopy: any;
  processedData: any;
  currVisibleData: any;
  unSortedCopy: any;

  // Sorting
  _isSortApplied = false;
  _sortAppliedOn = "";
  _sortOrder: string | null = null;

  // Filtering
  _isFilterApplied = false;
  filterModel: any = {};

  _recordsTotal: number = 0;

  // Grid rendering
  _isGridReady = false;

  // data params when the data source is remote (server-side)
  dataParams: any = {
    page: {},
    filter: {},
  };

  // Row Selection
  selectedRows: any = [];

  @Input() gridDefs: any;

  // @Input() columnDefs: any;
  _columnDefs: any;

  @Input() set columnDefs(columnDefs: any) {
    // if (this.gridDefs.dataSource==='local') {
    //   this.filterManager.structFilterModel(columnDefs);
    // }
    this._columnDefs = this.columnSizing.processColumnOptions(columnDefs);
  }
  get columnDefs() {
    return this._columnDefs;
  }

  @Input() columnControls: boolean = false;

  @Input() set records(value: any) {
    this.dataTrueCopy = value;
    Object.freeze(this.dataTrueCopy);
    this.processData();
  }
  get records() {
    return this.dataTrueCopy;
  }

  @Input() pagination: boolean = false;

  @Input() recordsPerPage: number = 0;

  @Input() recordsPerPageOptions: any;

  @Input() recordSelection: boolean = false;

  @Output() recordsSelected = new EventEmitter();

  @ViewChild("ivptSelectAll") ivptSelectAllRef!: ElementRef;

  @ViewChild("ivptContentBody") ivptContentBodyRef: ElementRef | undefined;

  @ViewChild("datagridWrapper") datagridWrapper!: ElementRef;

  @ViewChild("datagridHeaderWrapper") datagridHeaderWrapper!: ElementRef;

  @ViewChild("datagridBodyWrapper") datagridBodyWrapper!: ElementRef;

  ngAfterViewInit() {
    this.elementManager.registerDatagridEl(this.datagridWrapper.nativeElement);
    this.elementManager.registerDatagridHeaderEl(
      this.datagridHeaderWrapper.nativeElement
    );
    this.elementManager.registerDatagridSelectAllEl(
      this.ivptSelectAllRef.nativeElement
    );
    this.elementManager.registerDatagridBodyEl(
      this.datagridBodyWrapper.nativeElement
    );

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

  constructor(
    private cdr: ChangeDetectorRef,
    private columnSizing: ColumnSizingService,
    private elementManager: ElementManagerService,
    public dataManager: DataManagerService,
    public pageManager: PageManagerService,
    public filterManager: FilterManagerService
  ) {}

  ngOnInit() {
    this.addListeners();
  }

  processData() {
    if (this.gridDefs.dataSource === "remote") {
    } else if (this.gridDefs.dataSource === "local") {
      this.processLocalData();
      this._isGridReady = true;
    }
    setTimeout(() => {
      this.columnSizing.reCalcWidth.next(true);
    }, 2000);
  }

  processLocalData(data?: any) {
    this.processedData = data ? data : structuredClone(this.dataTrueCopy);
    if (!this.pagination) {
      this.currVisibleData = this.processedData;
    } else {
      this._recordsTotal = this.processedData.length;
      this.setCurrVisibleData(0, this.recordsPerPage);
    }
  }

  setCurrVisibleData(from: number, to: number) {
    this.currVisibleData = this.processedData.slice(from, to);
  }

  addListeners() {
    this.columnSizing.reCalcWidth.pipe(delay(100)).subscribe(() => {
      this.columnSizing.reCalcColumnWidth(this.columnDefs);
      this.cdr.detectChanges();
    });
  }

  updatedColumnWidth(colItem: any, width: any) {
    colItem.width = width;
  }

  // Handles sorting
  doSort(appliedField: string) {
    this.pageManager.resetPagination();
    if (this._isSortApplied && this._sortAppliedOn === appliedField) {
      if (this._sortOrder === "ASC") {
        this._sortOrder = "DESC";
        this.sortBy(appliedField, "DESC");
      } else if (this._sortOrder === "DESC") {
        this.resetSort();
      }
    } else {
      this._isSortApplied = true;
      this._sortAppliedOn = appliedField;
      this._sortOrder = "ASC";
      this.unSortedCopy = structuredClone(this.processedData);
      this.sortBy(appliedField, "ASC");
    }
  }

  sortBy(theField: any, orderBy: string) {
    if (orderBy === "ASC") {
      this.processedData.sort((a: any, b: any) =>
        a[theField] > b[theField] ? 1 : -1
      );
    } else if (orderBy === "DESC") {
      this.processedData.sort((a: any, b: any) =>
        a[theField] > b[theField] ? -1 : 1
      );
    }
    this.setCurrVisibleData(0, this.recordsPerPage);
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
  handleFilters(data: any) {
    if (this.gridDefs.dataSource === "remote") {
      // emit the data params
    } else if (this.gridDefs.dataSource === "local") {
      this.processFilter(data);
    }
  }

  processFilter(data: any) {
    let result: any = [];
    this.filterManager.buildQueryModel(data);
    const queryModel = this.filterManager.getQueryModel();
    if (Object.keys(queryModel).length !== 0) {
      let tempDataSet = structuredClone(this.records);
      result = this.filterManager.filterData(tempDataSet, queryModel);
    } else {
      result = structuredClone(this.records);
    }
    this.processLocalData(result);
  }

  resetFiltering() {
    if (this.gridDefs.dataSource === "remote") {
      // emit the data params
    } else if (this.gridDefs.dataSource === "local") {
      this.processLocalData();
      this.filterManager.resetQueryModel();
    }
  }

  onPaginationChange(data: any) {
    if (this.gridDefs.dataSource === "remote") {
    } else if (this.gridDefs.dataSource === "local") {
      this.setCurrVisibleData(data.from, data.to);
    }
  }

  whenSelectAll($event: any): void {
    const status = $event.target.checked;
    for (let item of this.currVisibleData) {
      item["dtSelected"] = status;
      if (status) {
        this.selectedRows.push(item);
      }
    }
    this.recordsSelected.emit(this.selectedRows);
  }

  whenSelectRow(data: any) {
    if (data.selected) {
      data.row["isSelected"] = true;
      this.selectedRows.push(data.row);
      if (!this.dataManager.canSelectAll(this.currVisibleData)) {
        this.ivptSelectAllRef.nativeElement.children[0].indeterminate = true;
      } else {
        this.ivptSelectAllRef.nativeElement.children[0].checked = true;
      }
    } else {
      data.row["isSelected"] = false;
      const index = this.selectedRows.indexOf(data.row);
      this.selectedRows.splice(index, 1);
      if (this.selectedRows.length > 0) {
        this.ivptSelectAllRef.nativeElement.children[0].indeterminate = true;
      } else {
        this.ivptSelectAllRef.nativeElement.children[0].indeterminate = false;
        this.ivptSelectAllRef.nativeElement.children[0].checked = false;
      }
    }
    this.recordsSelected.emit(this.selectedRows);
  }

  ngOnDestroy() {
    this._isGridReady = false;
    this.selectedRows = [];
  }
}
