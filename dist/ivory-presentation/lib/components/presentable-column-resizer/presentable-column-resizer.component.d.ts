import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PresentableColumnResizerComponent {
    resizable: boolean;
    minWidth: number | string | undefined;
    maxWidth: number | string | undefined;
    updatedColumnWidth: EventEmitter<number>;
    static ɵfac: i0.ɵɵFactoryDeclaration<PresentableColumnResizerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PresentableColumnResizerComponent, "presentable-column-resizer", never, { "resizable": { "alias": "resizable"; "required": false; }; "minWidth": { "alias": "minWidth"; "required": false; }; "maxWidth": { "alias": "maxWidth"; "required": false; }; }, { "updatedColumnWidth": "updatedColumnWidth"; }, never, never, false, never>;
}
