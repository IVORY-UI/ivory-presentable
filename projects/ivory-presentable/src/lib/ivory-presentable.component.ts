import { Component, Input, ElementRef, Renderer2, Output, EventEmitter, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ivory-presentable',
  templateUrl: './ivory-presentable.component.html',
  styleUrl: './ivory-presentable.component.scss'
})
export class IvoryPresentableComponent {

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

  // Pagination
  _showPagination = false;
  
  _pageCurrent: number = 1;
  _pageGoto: number = 1;
  _pagesTotal: number = 1;
  _recordsTotal: number = 0;

  // Grid rendering
  _isGridReady = false;
  
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

  @ViewChild('dtSelectAll') _dtSelectAll: ElementRef<any> | undefined;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private domSanitizer: DomSanitizer
  ) {} 

  processData() {
    this.processedData = structuredClone(this.dataTrueCopy);
    if (!this.hasPagination) {
      this.currVisibleData =  this.processedData;
    } else {
      this.resetPagination();
      this.calculatePages(this.processedData.length);
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
    this._recordsTotal = totalRecords;
    this._pagesTotal = Math.ceil(this._recordsTotal / this.recordsPerPage);
    this._showPagination = this._recordsTotal > this.recordsPerPage;
  }

  updatePerPageRecords() {
    this.resetPagination(); // Review: this logic needs to be changed
    this._pagesTotal = Math.ceil(this._recordsTotal / this.recordsPerPage);
    this.renderData(0, this.recordsPerPage);
  }

  goto(pageNumber: any) {
    if (pageNumber!==null && pageNumber!==undefined && pageNumber!==this._pageCurrent) { 
      console.log('Selected page - ', pageNumber);
      let startRecord = (pageNumber-1) * this.recordsPerPage;
      let endRecord = ((startRecord+this.recordsPerPage) > this._recordsTotal) ? this._recordsTotal : startRecord + this.recordsPerPage;
      this.renderData(startRecord, endRecord);
      this._pageGoto = this._pageCurrent = pageNumber;
    } else {
      if (this._pageGoto<1) {
        this._pageGoto=1;
      } else if (this._pageGoto>this._pagesTotal) {
        this._pageGoto = this._pagesTotal;
      }
      this.goto(this._pageGoto);
    }
  }

  resetPagination() {
    this._pageGoto = this._pageCurrent = 1;
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
