import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { PRESENTABLE_CONFIG } from '../config/config';
import { ElementManagerService } from './element-manager.service';
import * as i0 from "@angular/core";
export class ColumnSizingService {
    constructor() {
        this.reCalcWidth = new Subject();
        this.elementManager = inject(ElementManagerService);
    }
    processColumnOptions(columns) {
        return columns.map((column) => {
            column.initialWidth = column.width || 0;
            column.minWidth = column.minWidth || PRESENTABLE_CONFIG.column.minWidth;
            column.width = Math.max(column.initialWidth, column.minWidth);
            return column;
        });
    }
    getColumnsTotWidth(columns) {
        let totWidth = 0;
        columns.forEach((column) => {
            if (!column.visible) {
                return;
            }
            totWidth += +(column.width || 0);
        });
        return totWidth;
    }
    getAvailableWidth(columns) {
        let headerEl = this.elementManager.getDatagridEl();
        let recordSelectionEl = this.elementManager.getDatagridSelectAllEl();
        return headerEl.getBoundingClientRect()?.width - this.getColumnsTotWidth(columns) - recordSelectionEl.getBoundingClientRect()?.width;
    }
    reCalcColumnWidth(columns) {
        let spaceAvailable = this.getAvailableWidth(columns);
        let bodyEl = this.elementManager.getDatagridBodyEl();
        let scrollbarWidth = bodyEl ? bodyEl.offsetWidth - bodyEl.clientWidth : 0;
        spaceAvailable -= scrollbarWidth;
        let flexColumns = [], nonFlexColumns = [];
        columns.forEach((column) => {
            if (!column.forcedWidth) {
                if (!!column.widthGrow && !column.initialWidth)
                    flexColumns.push(column);
                else
                    nonFlexColumns.push(column);
            }
        });
        flexColumns.forEach((column) => {
            const currentWidth = +(column.width || 1);
            const newWidth = (currentWidth * (column.widthGrow || 1));
            column.width = newWidth;
            spaceAvailable -= (newWidth - currentWidth);
        });
        if (spaceAvailable > 0) {
            if (nonFlexColumns.length) {
                let dividedWidth = Math.floor(spaceAvailable / nonFlexColumns?.length);
                nonFlexColumns.forEach((column) => {
                    const currentWidth = +(column.width || 0);
                    column.width = currentWidth + dividedWidth;
                });
            }
        }
        return columns;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ColumnSizingService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ColumnSizingService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ColumnSizingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sdW1uLXNpemluZy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaXZvcnktcHJlc2VudGFibGUvc3JjL2xpYi9zZXJ2aWNlcy9jb2x1bW4tc2l6aW5nLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUN0RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7QUFLbEUsTUFBTSxPQUFPLG1CQUFtQjtJQUs5QjtRQUhBLGdCQUFXLEdBQWlCLElBQUksT0FBTyxFQUFFLENBQUM7UUFDMUMsbUJBQWMsR0FBMEIsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFFdEQsQ0FBQztJQUVqQixvQkFBb0IsQ0FBQyxPQUFZO1FBQy9CLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFO1lBQ2pDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFDeEMsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxJQUFJLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDeEUsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdELE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELGtCQUFrQixDQUFDLE9BQVk7UUFDN0IsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE9B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bkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgUFJFU0VOVEFCTEVfQ09ORklHIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZyc7XG5pbXBvcnQgeyBFbGVtZW50TWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL2VsZW1lbnQtbWFuYWdlci5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQ29sdW1uU2l6aW5nU2VydmljZSB7XG5cbiAgcmVDYWxjV2lkdGg6IFN1YmplY3Q8YW55PiA9IG5ldyBTdWJqZWN0KCk7XG4gIGVsZW1lbnRNYW5hZ2VyOiBFbGVtZW50TWFuYWdlclNlcnZpY2UgPSBpbmplY3QoRWxlbWVudE1hbmFnZXJTZXJ2aWNlKTtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIHByb2Nlc3NDb2x1bW5PcHRpb25zKGNvbHVtbnM6IGFueSkge1xuICAgIHJldHVybiBjb2x1bW5zLm1hcCgoY29sdW1uOiBhbnkpID0+IHtcbiAgICAgIGNvbHVtbi5pbml0aWFsV2lkdGggPSBjb2x1bW4ud2lkdGggfHwgMDtcbiAgICAgIGNvbHVtbi5taW5XaWR0aCA9IGNvbHVtbi5taW5XaWR0aCB8fCBQUkVTRU5UQUJMRV9DT05GSUcuY29sdW1uLm1pbldpZHRoO1xuICAgICAgY29sdW1uLndpZHRoID0gTWF0aC5tYXgoY29sdW1uLmluaXRpYWxXaWR0aCxjb2x1bW4ubWluV2lkdGgpO1xuICAgICAgcmV0dXJuIGNvbHVtbjtcbiAgICB9KVxuICB9XG5cbiAgZ2V0Q29sdW1uc1RvdFdpZHRoKGNvbHVtbnM6IGFueSk6IG51bWJlciB7XG4gICAgbGV0IHRvdFdpZHRoID0gMDtcbiAgICBjb2x1bW5zLmZvckVhY2goKGNvbHVtbjogYW55KSA9PiB7XG4gICAgICBpZiAoIWNvbHVtbi52aXNpYmxlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRvdFdpZHRoICs9ICsoY29sdW1uLndpZHRoIHx8IDApO1xuICAgIH0pO1xuICAgIHJldHVybiB0b3RXaWR0aDtcbiAgfVxuXG4gIGdldEF2YWlsYWJsZVdpZHRoKGNvbHVtbnM6IGFueSkge1xuICAgIGxldCBoZWFkZXJFbCA9IHRoaXMuZWxlbWVudE1hbmFnZXIuZ2V0RGF0YWdyaWRFbCgpO1xuICAgIGxldCByZWNvcmRTZWxlY3Rpb25FbCA9IHRoaXMuZWxlbWVudE1hbmFnZXIuZ2V0RGF0YWdyaWRTZWxlY3RBbGxFbCgpO1xuICAgIHJldHVybiAoaGVhZGVyRWwgYXMgSFRNTEVsZW1lbnQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpPy53aWR0aCAtIHRoaXMuZ2V0Q29sdW1uc1RvdFdpZHRoKGNvbHVtbnMpIC0gKHJlY29yZFNlbGVjdGlvbkVsIGFzIEhUTUxFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKT8ud2lkdGg7XG4gIH1cblxuICByZUNhbGNDb2x1bW5XaWR0aChjb2x1bW5zOiBhbnkpIHtcbiAgICBsZXQgc3BhY2VBdmFpbGFibGU6IG51bWJlciA9IHRoaXMuZ2V0QXZhaWxhYmxlV2lkdGgoY29sdW1ucyk7XG4gICAgbGV0IGJvZHlFbCA9IHRoaXMuZWxlbWVudE1hbmFnZXIuZ2V0RGF0YWdyaWRCb2R5RWwoKTtcbiAgICBsZXQgc2Nyb2xsYmFyV2lkdGggPSBib2R5RWwgPyBib2R5RWwub2Zmc2V0V2lkdGggLSBib2R5RWwuY2xpZW50V2lkdGggOiAwO1xuICAgIHNwYWNlQXZhaWxhYmxlIC09IHNjcm9sbGJhcldpZHRoOyAgICBcbiAgICBsZXQgZmxleENvbHVtbnM6IGFueSA9IFtdLCBub25GbGV4Q29sdW1uczogYW55ID0gW107XG4gICAgY29sdW1ucy5mb3JFYWNoKChjb2x1bW46IGFueSkgPT4ge1xuICAgICAgaWYgKCFjb2x1bW4uZm9yY2VkV2lkdGgpIHtcbiAgICAgICAgaWYoISFjb2x1bW4ud2lkdGhHcm93ICYmICFjb2x1bW4uaW5pdGlhbFdpZHRoKSBmbGV4Q29sdW1ucy5wdXNoKGNvbHVtbik7XG4gICAgICAgIGVsc2Ugbm9uRmxleENvbHVtbnMucHVzaChjb2x1bW4pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZmxleENvbHVtbnMuZm9yRWFjaCgoY29sdW1uOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRXaWR0aCA9ICsoY29sdW1uLndpZHRoIHx8IDEpO1xuICAgICAgY29uc3QgbmV3V2lkdGggPSAoY3VycmVudFdpZHRoICogKGNvbHVtbi53aWR0aEdyb3cgfHwgMSkpO1xuICAgICAgY29sdW1uLndpZHRoID0gbmV3V2lkdGg7XG4gICAgICBzcGFjZUF2YWlsYWJsZSAtPSAobmV3V2lkdGggLSBjdXJyZW50V2lkdGgpO1xuICAgIH0pO1xuXG4gICAgaWYgKHNwYWNlQXZhaWxhYmxlID4gMCkge1xuICAgICAgaWYgKG5vbkZsZXhDb2x1bW5zLmxlbmd0aCkge1xuICAgICAgICBsZXQgZGl2aWRlZFdpZHRoID0gTWF0aC5mbG9vcihzcGFjZUF2YWlsYWJsZSAvIG5vbkZsZXhDb2x1bW5zPy5sZW5ndGgpO1xuICAgICAgICBub25GbGV4Q29sdW1ucy5mb3JFYWNoKChjb2x1bW46IGFueSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGN1cnJlbnRXaWR0aCA9ICsoY29sdW1uLndpZHRoIHx8IDApO1xuICAgICAgICAgIGNvbHVtbi53aWR0aCA9IGN1cnJlbnRXaWR0aCArIGRpdmlkZWRXaWR0aDtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb2x1bW5zO1xuICB9XG59XG4iXX0=