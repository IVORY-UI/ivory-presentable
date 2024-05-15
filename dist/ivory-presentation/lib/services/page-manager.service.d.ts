import * as i0 from "@angular/core";
export declare class PageManagerService {
    private currentPageSub;
    currentPage$: import("rxjs").Observable<number>;
    updateCurrentPage(value: number): void;
    resetPagination(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PageManagerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PageManagerService>;
}
