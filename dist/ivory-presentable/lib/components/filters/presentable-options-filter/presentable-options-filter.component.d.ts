import { EventEmitter } from '@angular/core';
import { FilterManagerService } from '../../../services/filter-manager.service';
import * as i0 from "@angular/core";
export declare class PresentableOptionsFilterComponent {
    filterManager: FilterManagerService;
    _showPopover: boolean;
    _taxonomy: any;
    column: any;
    set taxonomy(value: any);
    get taxonomy(): any;
    whenApplied: EventEmitter<any>;
    emitApplied(value: any): void;
    constructor(filterManager: FilterManagerService);
    toggleFilterPopover(): void;
    applyFilter(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PresentableOptionsFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PresentableOptionsFilterComponent, "presentable-options-filter", never, { "column": { "alias": "column"; "required": false; }; "taxonomy": { "alias": "taxonomy"; "required": false; }; }, { "whenApplied": "whenApplied"; }, never, never, false, never>;
}
