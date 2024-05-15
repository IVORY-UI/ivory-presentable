import { EventEmitter } from '@angular/core';
import { ColumnSizingService } from '../../services/column-sizing.service';
import * as i0 from "@angular/core";
export declare class PresentableColumnControlsComponent {
    columnSizing: ColumnSizingService;
    _showController: boolean;
    draggingItem: any;
    isDraggingOver: boolean;
    columns: any;
    updatedColumns: EventEmitter<any>;
    constructor(columnSizing: ColumnSizingService);
    onDragStart(event: DragEvent, item: any): void;
    onDragOver(event: DragEvent): void;
    onDrop(event: DragEvent, index: number): void;
    getDropIndex(event: any): number;
    toggleColumn(column: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PresentableColumnControlsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PresentableColumnControlsComponent, "presentable-column-controls", never, { "columns": { "alias": "columns"; "required": false; }; }, { "updatedColumns": "updatedColumns"; }, never, never, false, never>;
}
