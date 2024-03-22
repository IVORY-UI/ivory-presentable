import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';

import { PRESENTABLE_CONFIG } from '../config/config';
import { ElementManagerService } from './element-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ColumnSizingService {

  reCalcWidth: Subject<any> = new Subject();
  elementManager: ElementManagerService = inject(ElementManagerService);

  constructor() { }

  processColumnOptions(columns: any) {
    return columns.map((column: any) => {
      column.initialWidth = column.width || 0;
      column.minWidth = column.minWidth || PRESENTABLE_CONFIG.column.minWidth;
      column.width = Math.max(column.initialWidth,column.minWidth);
      return column;
    })
  }

  getColumnsTotWidth(columns: any): number {
    let totWidth = 0;
    columns.forEach((column: any) => {
      if (!column.visible) {
        return;
      }
      totWidth += +(column.width || 0);
    });
    return totWidth;
  }

  getAvailableWidth(columns: any) {
    let headerEl = this.elementManager.getDatagridEl();
    let recordSelectionEl = this.elementManager.getDatagridSelectAllEl();
    return (headerEl as HTMLElement).getBoundingClientRect()?.width - this.getColumnsTotWidth(columns) - (recordSelectionEl as HTMLElement).getBoundingClientRect()?.width;
  }

  reCalcColumnWidth(columns: any) {
    let spaceAvailable: number = this.getAvailableWidth(columns);
    let bodyEl = this.elementManager.getDatagridBodyEl();
    let scrollbarWidth = bodyEl ? bodyEl.offsetWidth - bodyEl.clientWidth : 0;
    spaceAvailable -= scrollbarWidth;    
    let flexColumns: any = [], nonFlexColumns: any = [];
    columns.forEach((column: any) => {
      if (!column.forcedWidth) {
        if(!!column.widthGrow && !column.initialWidth) flexColumns.push(column);
        else nonFlexColumns.push(column);
      }
    });

    flexColumns.forEach((column: any) => {
      const currentWidth = +(column.width || 1);
      const newWidth = (currentWidth * (column.widthGrow || 1));
      column.width = newWidth;
      spaceAvailable -= (newWidth - currentWidth);
    });

    if (spaceAvailable > 0) {
      if (nonFlexColumns.length) {
        let dividedWidth = Math.floor(spaceAvailable / nonFlexColumns?.length);
        nonFlexColumns.forEach((column: any) => {
          const currentWidth = +(column.width || 0);
          column.width = currentWidth + dividedWidth;
        });
      }
    }
    return columns;
  }
}
