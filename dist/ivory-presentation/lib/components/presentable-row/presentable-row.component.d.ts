import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class PresentableRowComponent {
    columns: any;
    rowIndex: any;
    rowSelectionEnabled: any;
    rowData: any;
    onSelection: EventEmitter<any>;
    whenRowSelected($event: any, rowData: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PresentableRowComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PresentableRowComponent, "presentable-row", never, { "columns": { "alias": "columns"; "required": false; }; "rowIndex": { "alias": "rowIndex"; "required": false; }; "rowSelectionEnabled": { "alias": "rowSelectionEnabled"; "required": false; }; "rowData": { "alias": "rowData"; "required": false; }; }, { "onSelection": "onSelection"; }, never, never, false, never>;
}
