import { EventEmitter } from '@angular/core';
import { PageManagerService } from '../../services/page-manager.service';
import * as i0 from "@angular/core";
type Page = {
    total: number;
    current: number;
    goto: number;
};
export declare class PresentablePaginatorComponent {
    pageManager: PageManagerService;
    _showPagination: boolean;
    _records: any;
    _page: Page;
    set recordsPerPageOptions(value: any);
    set recordsPerPage(value: number);
    set recordsTotal(value: number);
    pageChange: EventEmitter<any>;
    constructor(pageManager: PageManagerService);
    ngOnInit(): void;
    updatePerPageRecords(): void;
    goto(pageNumber: number | null): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PresentablePaginatorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PresentablePaginatorComponent, "presentable-paginator", never, { "recordsPerPageOptions": { "alias": "recordsPerPageOptions"; "required": false; }; "recordsPerPage": { "alias": "recordsPerPage"; "required": false; }; "recordsTotal": { "alias": "recordsTotal"; "required": false; }; }, { "pageChange": "pageChange"; }, never, never, false, never>;
}
export {};
