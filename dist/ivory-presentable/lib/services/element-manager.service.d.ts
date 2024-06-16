import * as i0 from "@angular/core";
export declare class ElementManagerService {
    datagrid: HTMLElement | undefined;
    datagridHeader: HTMLElement | undefined;
    datagridBody: HTMLElement | undefined;
    datagridSelectAll: HTMLElement | undefined;
    registerDatagridEl(datagrid: HTMLElement): void;
    getDatagridEl(): HTMLElement | undefined;
    getDatagridElDimenstions(): any;
    registerDatagridHeaderEl(datagridHeader: HTMLElement): void;
    getDatagridHeaderEl(): HTMLElement | undefined;
    registerDatagridSelectAllEl(datagridHeader: HTMLElement): void;
    getDatagridSelectAllEl(): HTMLElement | undefined;
    getDatagridHeaderElDimenstions(): any;
    registerDatagridBodyEl(datagridBody: HTMLElement): void;
    getDatagridBodyEl(): HTMLElement | undefined;
    static ɵfac: i0.ɵɵFactoryDeclaration<ElementManagerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ElementManagerService>;
}
