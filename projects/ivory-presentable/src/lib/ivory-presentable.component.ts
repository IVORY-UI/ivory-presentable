import { Component, Input, ElementRef, Renderer2, Output, EventEmitter, ViewChild, OnInit, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { PRESENTABLE_CONFIG } from './config/config';

@Component({
  selector: 'ivory-presentable',
  templateUrl: './ivory-presentable.component.html',
  styleUrl: './ivory-presentable.component.scss'
})
export class IvoryPresentableComponent implements OnInit, AfterViewInit {

  // Columns
  columns: any;

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
  filterConfig: any = {};

  _recordsTotal: number = 0;

  // Grid rendering
  _isGridReady = false;

  @Input() gridDefs: any;
  
  @Input() set columnDefs(value: any) {
    this.columns = value;
    for (const colItem of this.columns) {
      if (colItem['hasFilter'] && colItem['filterType']==='options') {
        this.filterConfig['colItem.field'] = {'values': []};
      } else if (colItem['hasFilter'] && colItem['filterType']==='text') {
        this.filterConfig['colItem.field'] = {'keyword': ''};
      }
    }
  }
  get columnDefs() {
    return this.columns;
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

  @Input() hasPagination: boolean = false;

  @Input() recordsPerPage: number = 0;

  @Input() recordsPerPageOptions: any;

  @Input() recordsSelectable: boolean = false;

  @Output() recordsSelected = new EventEmitter();

  @ViewChild('ivptSelectAll') ivptSelectAllRef: ElementRef | undefined;

  @ViewChild('ivptContentBody') ivptContentBodyRef: ElementRef | undefined;

  @ViewChild('ivptFilters') ivptFiltersRef: ElementRef | undefined; 

  @ViewChildren('ivptFilterPopover') ivptFilterPopoversRef: QueryList<ElementRef> | undefined;

  ngAfterViewInit() {
    if (this.ivptContentBodyRef) {
      this.ivptContentBodyRef.nativeElement.style.height = (this.gridDefs.height -
        (PRESENTABLE_CONFIG.headerSpace.height +
          PRESENTABLE_CONFIG.column.headHeight +
          PRESENTABLE_CONFIG.filterSpace.height +
          PRESENTABLE_CONFIG.paginator.height))+'px';
    }
  }

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    
  }

  processData() {
    this.processedData = structuredClone(this.dataTrueCopy);
    if (!this.hasPagination) {
      this.currVisibleData =  this.processedData;
    } else {
      this.resetPagination();
      //this.calculatePages(this.processedData.length);
      this.renderData(0, this.recordsPerPage);
    }
    this._isGridReady = true;
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
    if (filterType==='list') {
      $event.target.parentElement.style['display'] = 'none';
    }
    // Review: Logic to updated based on the data source is client side or server side
    this.records = this.doQueryFilter(column, this.filterConfig[column]['keyword']);
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
    this.renderData(data.from, data.to);
  }

  resetPagination() {
    console.log('Pagination has to be reset');
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
    if (this.recordsSelectable) {
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

}
