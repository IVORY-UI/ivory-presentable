import { Component, Input, ElementRef, Renderer2, Output, EventEmitter, ViewChild, OnInit, AfterViewInit, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { PRESENTABLE_CONFIG } from './config/config';
import { PageManagerService } from './services/page-manager.service';
import { ColumnSizingService } from './services/column-sizing.service';
import { ElementManagerService } from './services/element-manager.service';
import { delay } from 'rxjs';

@Component({
  selector: 'ivory-presentable',
  templateUrl: './ivory-presentable.component.html',
  styleUrl: './ivory-presentable.component.scss'
})
export class IvoryPresentableComponent implements OnInit, AfterViewInit {

  // Records Data
  dataTrueCopy: any;
  processedData: any;
  currVisibleData: any;

  // Sorting
  _isSortApplied = false;
  _sortAppliedOn = '';
  _sortType = '';

  // Filtering
  _isFilterApplied = false;
  filterModel: any = {};

  _recordsTotal: number = 0;

  // Grid rendering
  _isGridReady = false;

  // data params when the data source is remote (server-side)
  dataParams: any = {
    page: {},
    filter: {}
  };

  @Input() gridDefs: any;
  
  // @Input() columnDefs: any;
  _columnDefs: any;
  @Input() set columnDefs(columnDefs: any) {
    this._columnDefs = this.columnSizing.processColumnOptions(columnDefs);
  }
  get columnDefs() {
    return this._columnDefs;
  }

  @Input() columnControls: boolean = false;

  @Input() set records(value: any) {
    this.dataTrueCopy = value;
    this._recordsTotal = this.dataTrueCopy.length;
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

  @ViewChild('ivptSelectAll') ivptSelectAllRef: ElementRef | undefined;

  @ViewChild('ivptContentBody') ivptContentBodyRef: ElementRef | undefined;

  @ViewChild('datagridWrapper') datagridWrapper!: ElementRef;

  @ViewChild('datagridHeaderWrapper') datagridHeaderWrapper!: ElementRef;
  
  @ViewChild('datagridBodyWrapper') datagridBodyWrapper!: ElementRef;

  @ViewChild('recordSelectionWrapper') recordSelectionWrapper!: ElementRef;

  ngAfterViewInit() {
    this.elementManager.registerDatagridEl(this.datagridWrapper.nativeElement);
    this.elementManager.registerDatagridHeaderEl(this.datagridHeaderWrapper.nativeElement);
    this.elementManager.registerDatagridRecordSelectionEl(this.recordSelectionWrapper.nativeElement);
    this.elementManager.registerDatagridBodyEl(this.datagridBodyWrapper.nativeElement);

    if (this.ivptContentBodyRef) {
      this.ivptContentBodyRef.nativeElement.style.height = (this.gridDefs.height -
        (PRESENTABLE_CONFIG.headerSpace.height +
          PRESENTABLE_CONFIG.column.headHeight +
          PRESENTABLE_CONFIG.filterSpace.height +
          PRESENTABLE_CONFIG.paginator.height))+'px';
    }
    this.columnSizing.reCalcWidth.next(true);
  }

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private domSanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private columnSizing: ColumnSizingService,
    private elementManager: ElementManagerService,
    public pageManager: PageManagerService
  ) {}

  ngOnInit() {
    this.addListeners();
  }

  processData() {
    if (this.gridDefs.dataSource==='remote') {

    } else if (this.gridDefs.dataSource==='local') {
      this.processedData = structuredClone(this.dataTrueCopy);
      if (!this.pagination) {
        this.currVisibleData =  this.processedData;
      } else {
        this.renderData(0, this.recordsPerPage);
      }
      this._isGridReady = true;
    }
    setTimeout(() => {
      this.columnSizing.reCalcWidth.next(true);
    }, 2000)
  }

  renderData(from: number, to: number) {
    this.currVisibleData =  this.processedData.slice(from, to);
  }

  viewManager() {
    // Helper method to manage the view while renderData
  }

  // Handles sorting
  doSort(appliedField: string) {
    this.resetPagination();
    if (this._isSortApplied && this._sortAppliedOn === appliedField) {
      if (this._sortType === 'ASC') {
        this._sortType = 'DESC';
        this.sortBy(appliedField, 'DESC');
      } else if (this._sortType === 'DESC') {
        this.resetSort();
      }
    } else {
      this._isSortApplied = true;
      this._sortAppliedOn = appliedField;
      this._sortType = 'ASC';
      this.sortBy(appliedField, 'ASC');
    }
  }

  sortBy(theField: any, orderBy: string) {
    if (orderBy === 'ASC') {
      this.processedData.sort((a: any, b: any) => a[theField] > b[theField] ? 1 : -1);
    } else if (orderBy === 'DESC') {
      this.processedData.sort((a: any, b: any) => a[theField] > b[theField] ? -1 : 1);
    }
    this.renderData(0, this.recordsPerPage);
  }

  resetSort() {
    this._isSortApplied = false;
    this._sortAppliedOn = '';
    this._sortType = '';
    this.processedData = structuredClone(this.dataTrueCopy);
    this.renderData(0, this.recordsPerPage);
  }

  // Handles filter
  applyFilter($event: any, filterType: string, column: string) {
    if (this.gridDefs.dataSource==='remote') {

    } else if (this.gridDefs.dataSource==='local') {
      
      // Review: Logic to updated based on the data source is client side or server side
      this.records = this.doQueryFilter(column, this.filterModel[column]['keyword']);
    }
  }

  doQueryFilter(column: string, query: string) {
    let tempDataSet = structuredClone(this.records);
    return tempDataSet.filter(function (item: any) {
      return item[column].includes(query) !== -1;
    });
  }

  resetFiltering() {
    // Helper method to reset the applied filters
  }

  onPaginationChange(data: any) {
    if (this.gridDefs.dataSource==='remote') {

    } else if (this.gridDefs.dataSource==='local') {
      this.renderData(data.from, data.to);
    }
  }

  resetPagination() {
    this.pageManager.updateCurrentPage(1);
  }

  // Row Selection
  selectedRows: any = [];

  whenSelectAll($event: any): void {
    const status = $event.target.checked;
    this.selectedRows = [];
    for (let item of this.currVisibleData) {
      item['dtSelected'] = status;
      if (status) {
        this.selectedRows.push(item);
      }
    }
    this.recordsSelected.emit(this.selectedRows);
  }

  whenSelectRow($event: any, row: any) {
    if (this.recordSelection) {
      if ($event.target.checked) {
        row['dtSelected'] = true;
        this.selectedRows.push(row);
        if (this.ivptSelectAllRef) {
          this.ivptSelectAllRef.nativeElement.indeterminate = true; 
        }
      } else {
        row['dtSelected'] = false;
        const index = this.selectedRows.indexOf(row);
        if (index !== -1) {
          this.selectedRows.splice(index, 1);
        }
      }
    }
    this.recordsSelected.emit(this.selectedRows);
  }

  addListeners() {
    this.columnSizing.reCalcWidth.pipe(
      delay(100)
    ).subscribe(() => {
      this.columnSizing.reCalcColumnWidth(this.columnDefs);
      this.cdr.detectChanges();
    })
  }

  updatedColumnWidth(colItem: any, width: any) {
    colItem.width = width;
  }
}
