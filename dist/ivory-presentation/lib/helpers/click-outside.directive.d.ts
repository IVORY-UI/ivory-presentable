import { ElementRef, EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class ClickOutsideDirective {
    private elementRef;
    constructor(elementRef: ElementRef);
    clickOutside: EventEmitter<Event>;
    onClick(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClickOutsideDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClickOutsideDirective, "[presentableClickOutside]", never, {}, { "clickOutside": "clickOutside"; }, never, never, false, never>;
}
