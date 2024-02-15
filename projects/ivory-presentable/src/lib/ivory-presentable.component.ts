import { Component, Input, ElementRef, Renderer2, Output, EventEmitter, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ivory-presentable',
  templateUrl: './ivory-presentable.component.html',
  styleUrl: './ivory-presentable.component.scss'
})
export class IvoryPresentableComponent {

  /** Variables */
  _isGridReady = false;

  // For sort
  _isSortApplied = false;
  _sortAppliedOn = '';
  _sortType = '';

  // For filter
  _isFilterApplied = false;
  filterConfig: any = {};

  /** Inputs */
  columns: any;
  @Input() set columnDefs(value: any) {
    this.columns = value;
    for (const colItem of this.columns) {
      if (
        colItem['hasFilter'] &&
        colItem['filterOptions'] !== undefined &&
        colItem['filterOptions'] !== null &&
        colItem['filterOptions'].length > 0
      ) {
        this.filterConfig[colItem.field] = {
          type: 'list',
          options: this.processFilterOptions(colItem['filterOptions']),
        };
      } else if (colItem['hasFilter']) {
        this.filterConfig[colItem.field] = { type: 'text', keyword: '' };
      }
    }
  }
  get columnDefs() {
    return this.columns;
  }

  // For Pagination
  page: any = {}
  _hasPagination = false;
  _showPagination = false;  

  @Input() set recordsPerPage(value: any) {
    this.page.size = value;
    this._hasPagination = true;
  }
  get recordsPerPage() {
    return this.page.size;
  }

  @Input() set recordsPerPageOptions(value: any) {
    this.page.sizeOptions = value;
  }
  get recordsPerPageOptions() {
    return this.page.sizeOptions;
  }

  // Data
  dataTrueCopy: any;
  processedData: any;
  currVisibleData: any;
  @Input() set records(value: any) {
    this.dataTrueCopy = value;
    Object.freeze(this.dataTrueCopy);
    this.processData();
  }
  get records() {
    return this.dataTrueCopy;
  }

  @Input() recordSelectionEnabled: boolean = false;

  @Output() recordsSelected = new EventEmitter();

  @ViewChild('dtSelectAll') _dtSelectAll: ElementRef<any> | undefined;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private domSanitizer: DomSanitizer
  ) {} 

  processData() {
    this.processedData = structuredClone(this.dataTrueCopy);
    if (!this._hasPagination) {
      this.currVisibleData =  this.processedData;
    } else {
      this.resetPagination();
      this.calculatePages(this.processedData.length);
      this.renderData(0, this.page.size);
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
    this.renderData(0, this.page.size);
  }

  resetSort() {
    this._isSortApplied = false;
    this._sortAppliedOn = '';
    this._sortType = '';
    this.processedData = structuredClone(this.dataTrueCopy);
    this.renderData(0, this.page.size);
  }

  // Handles filter
  processFilterOptions(arr: any) {
    let temp = [];
    for (const i of arr) {
      temp.push({ option: i, isSelected: false });
    }
    return temp;
  }

  toggleFilterPopover($event: any) {
    $event.target.parentElement.children[1].style['display'] =
      $event.target.parentElement.children[1].style['display'] !== 'block'
        ? 'block'
        : 'none';
  }

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

  // Handles Pagination
  calculatePages(totalRecords: number) {
    this.page.totalRecords = totalRecords;
    this.page.totalPages = Math.ceil(this.page.totalRecords / this.page.size);
    this._showPagination = this.page.totalRecords > this.page.size;
  }

  updatePerPageRecords() {
    this.resetPagination(); // Review: this logic needs to be changed
    this.page.totalPages = Math.ceil(this.page.totalRecords / this.page.size);
    this.renderData(0, this.page.size);
  }

  goto(pageNumber: any) {
    if (pageNumber!==null && pageNumber!==undefined && pageNumber!==this.page.current) { 
      console.log('Selected page - ', pageNumber);
      let startRecord = (pageNumber-1) * this.page.size;
      let endRecord = ((startRecord+this.page.size) > this.page.totalRecords) ? this.page.totalRecords : startRecord + this.page.size;
      this.renderData(startRecord, endRecord);
      this.page.goto = this.page.current = pageNumber;
    } else {
      if (this.page.goto<1) {
        this.page.goto=1;
      } else if (this.page.goto>this.page.totalPages) {
        this.page.goto = this.page.totalPages;
      }
      this.goto(this.page.goto);
    }
  }

  resetPagination() {
    this.page.goto = this.page.current = 1;
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
    if (this.recordSelectionEnabled) {
      if ($event.target.checked) {
        row['dtSelected'] = true;
        this.selectedRows.push(row);
        if (this._dtSelectAll) {
          this._dtSelectAll.nativeElement.indeterminate = true; 
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
