import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class ElementManagerService {
    registerDatagridEl(datagrid) {
        this.datagrid = datagrid;
    }
    getDatagridEl() {
        return this.datagrid;
    }
    getDatagridElDimenstions() {
        return this.datagrid?.getBoundingClientRect() || {};
    }
    registerDatagridHeaderEl(datagridHeader) {
        this.datagridHeader = datagridHeader;
    }
    getDatagridHeaderEl() {
        return this.datagridHeader;
    }
    registerDatagridSelectAllEl(datagridHeader) {
        this.datagridSelectAll = datagridHeader;
    }
    getDatagridSelectAllEl() {
        return this.datagridSelectAll;
    }
    getDatagridHeaderElDimenstions() {
        return this.datagridHeader?.getBoundingClientRect() || {};
    }
    registerDatagridBodyEl(datagridBody) {
        this.datagridBody = datagridBody;
    }
    getDatagridBodyEl() {
        return this.datagridBody;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ElementManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ElementManagerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ElementManagerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudC1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pdm9yeS1wcmVzZW50YWJsZS9zcmMvbGliL3NlcnZpY2VzL2VsZW1lbnQtbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7O0FBSzNDLE1BQU0sT0FBTyxxQkFBcUI7SUFNaEMsa0JBQWtCLENBQUMsUUFBcUI7UUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUVELHdCQUF3QjtRQUN0QixPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDdEQsQ0FBQztJQUVELHdCQUF3QixDQUFDLGNBQTJCO1FBQ2xELElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxtQkFBbUI7UUFDakIsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFFRCwyQkFBMkIsQ0FBQyxjQUEyQjtRQUNyRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsY0FBYyxDQUFDO0lBQzFDLENBQUM7SUFFRCxzQkFBc0I7UUFDcEIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDaEMsQ0FBQztJQUVELDhCQUE4QjtRQUM1QixPQUFPLElBQUksQ0FBQyxjQUFjLEVBQUUscUJBQXFCLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDNUQsQ0FBQztJQUVELHNCQUFzQixDQUFDLFlBQXlCO1FBQzlDLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO0lBQ25DLENBQUM7SUFFRCxpQkFBaUI7UUFDZixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDM0IsQ0FBQzs4R0E1Q1UscUJBQXFCO2tIQUFyQixxQkFBcUIsY0FGcEIsTUFBTTs7MkZBRVAscUJBQXFCO2tCQUhqQyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgRWxlbWVudE1hbmFnZXJTZXJ2aWNlIHtcbiAgZGF0YWdyaWQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuICBkYXRhZ3JpZEhlYWRlcjogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG4gIGRhdGFncmlkQm9keTogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG4gIGRhdGFncmlkU2VsZWN0QWxsOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICByZWdpc3RlckRhdGFncmlkRWwoZGF0YWdyaWQ6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5kYXRhZ3JpZCA9IGRhdGFncmlkO1xuICB9XG5cbiAgZ2V0RGF0YWdyaWRFbCgpOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YWdyaWQ7XG4gIH1cblxuICBnZXREYXRhZ3JpZEVsRGltZW5zdGlvbnMoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5kYXRhZ3JpZD8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgfHwge307XG4gIH1cblxuICByZWdpc3RlckRhdGFncmlkSGVhZGVyRWwoZGF0YWdyaWRIZWFkZXI6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5kYXRhZ3JpZEhlYWRlciA9IGRhdGFncmlkSGVhZGVyO1xuICB9XG5cbiAgZ2V0RGF0YWdyaWRIZWFkZXJFbCgpOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YWdyaWRIZWFkZXI7XG4gIH1cblxuICByZWdpc3RlckRhdGFncmlkU2VsZWN0QWxsRWwoZGF0YWdyaWRIZWFkZXI6IEhUTUxFbGVtZW50KSB7XG4gICAgdGhpcy5kYXRhZ3JpZFNlbGVjdEFsbCA9IGRhdGFncmlkSGVhZGVyO1xuICB9XG5cbiAgZ2V0RGF0YWdyaWRTZWxlY3RBbGxFbCgpOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YWdyaWRTZWxlY3RBbGw7XG4gIH1cblxuICBnZXREYXRhZ3JpZEhlYWRlckVsRGltZW5zdGlvbnMoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5kYXRhZ3JpZEhlYWRlcj8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkgfHwge307XG4gIH1cblxuICByZWdpc3RlckRhdGFncmlkQm9keUVsKGRhdGFncmlkQm9keTogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLmRhdGFncmlkQm9keSA9IGRhdGFncmlkQm9keTtcbiAgfVxuXG4gIGdldERhdGFncmlkQm9keUVsKCk6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhZ3JpZEJvZHk7XG4gIH1cbn1cbiJdfQ==