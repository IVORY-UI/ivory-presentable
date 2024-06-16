import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class PageManagerService {
    constructor() {
        this.currentPageSub = new BehaviorSubject(1);
        this.currentPage$ = this.currentPageSub.asObservable();
    }
    updateCurrentPage(value) {
        this.currentPageSub.next(value);
    }
    resetPagination() {
        this.updateCurrentPage(1);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PageManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PageManagerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PageManagerService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pdm9yeS1wcmVzZW50YWJsZS9zcmMvbGliL3NlcnZpY2VzL3BhZ2UtbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFLdkMsTUFBTSxPQUFPLGtCQUFrQjtJQUgvQjtRQUtVLG1CQUFjLEdBQTRCLElBQUksZUFBZSxDQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzFFLGlCQUFZLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztLQVUxRDtJQVJDLGlCQUFpQixDQUFDLEtBQWE7UUFDN0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUIsQ0FBQzs4R0FYVSxrQkFBa0I7a0hBQWxCLGtCQUFrQixjQUZqQixNQUFNOzsyRkFFUCxrQkFBa0I7a0JBSDlCLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFBhZ2VNYW5hZ2VyU2VydmljZSB7XG5cbiAgcHJpdmF0ZSBjdXJyZW50UGFnZVN1YjogQmVoYXZpb3JTdWJqZWN0PG51bWJlcj4gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcj4oMSk7XG4gIHB1YmxpYyBjdXJyZW50UGFnZSQgPSB0aGlzLmN1cnJlbnRQYWdlU3ViLmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHVwZGF0ZUN1cnJlbnRQYWdlKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLmN1cnJlbnRQYWdlU3ViLm5leHQodmFsdWUpO1xuICB9XG5cbiAgcmVzZXRQYWdpbmF0aW9uKCkge1xuICAgIHRoaXMudXBkYXRlQ3VycmVudFBhZ2UoMSk7XG4gIH1cblxufVxuIl19