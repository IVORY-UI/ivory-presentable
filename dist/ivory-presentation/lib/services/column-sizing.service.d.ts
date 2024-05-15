import { Subject } from 'rxjs';
import { ElementManagerService } from './element-manager.service';
import * as i0 from "@angular/core";
export declare class ColumnSizingService {
    reCalcWidth: Subject<any>;
    elementManager: ElementManagerService;
    constructor();
    processColumnOptions(columns: any): any;
    getColumnsTotWidth(columns: any): number;
    getAvailableWidth(columns: any): number;
    reCalcColumnWidth(columns: any): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<ColumnSizingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ColumnSizingService>;
}
