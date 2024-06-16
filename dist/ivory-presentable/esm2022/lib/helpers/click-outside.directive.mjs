import { Directive, Output, EventEmitter, HostListener } from '@angular/core';
import * as i0 from "@angular/core";
export class ClickOutsideDirective {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.clickOutside = new EventEmitter();
    }
    onClick(event) {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.clickOutside.emit(event);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ClickOutsideDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.1", type: ClickOutsideDirective, selector: "[presentableClickOutside]", outputs: { clickOutside: "clickOutside" }, host: { listeners: { "document:click": "onClick($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: ClickOutsideDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[presentableClickOutside]'
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }], propDecorators: { clickOutside: [{
                type: Output
            }], onClick: [{
                type: HostListener,
                args: ['document:click', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2stb3V0c2lkZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9pdm9yeS1wcmVzZW50YWJsZS9zcmMvbGliL2hlbHBlcnMvY2xpY2stb3V0c2lkZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxNQUFNLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFLMUYsTUFBTSxPQUFPLHFCQUFxQjtJQUVoQyxZQUNVLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFHdEIsaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBUyxDQUFDO0lBRi9DLENBQUM7SUFLTCxPQUFPLENBQUMsS0FBWTtRQUNsQixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0I7SUFDSCxDQUFDOzhHQWRVLHFCQUFxQjtrR0FBckIscUJBQXFCOzsyRkFBckIscUJBQXFCO2tCQUhqQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSwyQkFBMkI7aUJBQ3RDOytFQU9XLFlBQVk7c0JBQXJCLE1BQU07Z0JBR1AsT0FBTztzQkFETixZQUFZO3VCQUFDLGdCQUFnQixFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1twcmVzZW50YWJsZUNsaWNrT3V0c2lkZV0nXG59KVxuZXhwb3J0IGNsYXNzIENsaWNrT3V0c2lkZURpcmVjdGl2ZSB7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmXG4gICkgeyB9XG5cbiAgQE91dHB1dCgpIGNsaWNrT3V0c2lkZSA9IG5ldyBFdmVudEVtaXR0ZXI8RXZlbnQ+KCk7XG5cbiAgQEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6Y2xpY2snLCBbJyRldmVudCddKVxuICBvbkNsaWNrKGV2ZW50OiBFdmVudCkge1xuICAgIGNvbnN0IGNsaWNrZWRJbnNpZGUgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpO1xuICAgIGlmICghY2xpY2tlZEluc2lkZSkge1xuICAgICAgdGhpcy5jbGlja091dHNpZGUuZW1pdChldmVudCk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==