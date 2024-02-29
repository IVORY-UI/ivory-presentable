import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FilterManagerService } from '../../../services/filter-manager.service';

@Component({
  selector: 'presentable-options-filter',
  templateUrl: './presentable-options-filter.component.html',
  styleUrl: './presentable-options-filter.component.scss'
})
export class PresentableOptionsFilterComponent {

  _showPopover: boolean = false;

  _taxonomy: any = [];

  @Input() column: any;

  @Input() 
  set taxonomy(value: any) {
    this._taxonomy = this.filterManager.processFilterOptions(value);
  }
  get taxonomy() {
    return this._taxonomy;
  }

  constructor(
    public filterManager: FilterManagerService
  ) {}
  

  toggleFilterPopover($event: any) {
    this._showPopover=!this._showPopover;
  }

  applyFilter() {
    
  }

}
