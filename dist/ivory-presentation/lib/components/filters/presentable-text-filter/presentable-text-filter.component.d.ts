import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PresentableTextFilterComponent {
    _keyword: string;
    column: any;
    whenApplied: EventEmitter<any>;
    emitApplied(value: any): void;
    applyFilter(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PresentableTextFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PresentableTextFilterComponent, "presentable-text-filter", never, { "column": { "alias": "column"; "required": false; }; }, { "whenApplied": "whenApplied"; }, never, never, false, never>;
}
