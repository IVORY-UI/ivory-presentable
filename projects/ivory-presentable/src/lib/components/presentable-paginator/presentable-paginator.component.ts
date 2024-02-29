import { Component, Input, Output, EventEmitter } from '@angular/core';

import { PageManagerService } from '../../services/page-manager.service';

@Component({
  selector: 'presentable-paginator',
  templateUrl: './presentable-paginator.component.html',
  styleUrl: './presentable-paginator.component.scss'
})
export class PresentablePaginatorComponent {

  _showPagination: boolean = false;
  _records: any = {};
  _page: any = {
    'total': 1,
    'current': 1,
    'goto': 1
  };

  @Input() 
  set recordsPerPageOptions(value: any) {
    this._records.options = value;
  }

  @Input() 
  set recordsPerPage(value: number) {
    this._records.perPage = value;
  }

  @Input() 
  set recordsTotal(value: number) {
    this._records.total = value;
    this._page.total = Math.ceil(this._records.total / this._records.perPage);
    this._showPagination = this._records.total > this._records.perPage;
  }

  @Output() pageChange: EventEmitter<any> = new EventEmitter();

  constructor(
    public pageManager: PageManagerService
  ) {}

  ngOnInit() {
    this.pageManager.currentPage$.subscribe((value: number) => {
      this._page.current = this._page.goto = value;
    });
  }

  updatePerPageRecords() {
    this._page.goto = this._page.current = 1;
    this._page.total = Math.ceil(this._records.total / this._records.perPage);
    this.pageChange.emit({ 'from': 1, 'to': this._records.perPage })
  }
  
  goto(pageNumber: number | null) {
    if (pageNumber!==null && pageNumber!==undefined && pageNumber!==this._page.current) { 
      const startRecord = (pageNumber-1) * this._records.perPage;
      const endRecord = ((startRecord+this._records.perPage) > this._records.total) ? this._records.total : startRecord + this._records.perPage;
      this.pageChange.emit({ 'from': startRecord, 'to': endRecord });

      this._page.goto = this._page.current = pageNumber;
    } else {
      if (this._page.goto < 1) {
        this._page.goto = 1;
      } else if (this._page.goto > this._page.total) {
        this._page.goto = this._page.total;
      }
      this.goto(this._page.goto);
    }
  }

}
