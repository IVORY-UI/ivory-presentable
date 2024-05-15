import * as i0 from "@angular/core";
export declare class FilterManagerService {
    queryModel: any;
    constructor();
    processFilterOptions(arr: any): {
        option: any;
        isSelected: boolean;
    }[];
    buildQueryModel(data: any): void;
    getQueryModel(): any;
    resetQueryModel(): void;
    filterData(data: any, query: any): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<FilterManagerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FilterManagerService>;
}
