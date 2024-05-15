import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export class PresentableTextFilterComponent {
    constructor() {
        this._keyword = '';
        this.whenApplied = new EventEmitter();
    }
    emitApplied(value) {
        this.whenApplied.emit(value);
    }
    applyFilter() {
        console.log('The keyword is - ', this._keyword);
        this.emitApplied({ 'column': this.column['field'], 'type': this.column['filterType'], 'keyword': this._keyword });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PresentableTextFilterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.2.1", type: PresentableTextFilterComponent, selector: "presentable-text-filter", inputs: { column: "column" }, outputs: { whenApplied: "whenApplied" }, ngImport: i0, template: `
    <input 
      class="ivpt-filter-input"
      type="text" 
      [name]="column.field"
      id="{{column.field}}"
      [(ngModel)]="_keyword"
      (keydown.enter)="applyFilter()" 
    />
  `, isInline: true, styles: [".ivpt-filter-input{width:100%}\n"], dependencies: [{ kind: "directive", type: i1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: PresentableTextFilterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'presentable-text-filter', template: `
    <input 
      class="ivpt-filter-input"
      type="text" 
      [name]="column.field"
      id="{{column.field}}"
      [(ngModel)]="_keyword"
      (keydown.enter)="applyFilter()" 
    />
  `, styles: [".ivpt-filter-input{width:100%}\n"] }]
        }], propDecorators: { column: [{
                type: Input
            }], whenApplied: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlc2VudGFibGUtdGV4dC1maWx0ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvaXZvcnktcHJlc2VudGFibGUvc3JjL2xpYi9jb21wb25lbnRzL2ZpbHRlcnMvcHJlc2VudGFibGUtdGV4dC1maWx0ZXIvcHJlc2VudGFibGUtdGV4dC1maWx0ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7OztBQW9CdkUsTUFBTSxPQUFPLDhCQUE4QjtJQWxCM0M7UUFvQkUsYUFBUSxHQUFXLEVBQUUsQ0FBQztRQUlaLGdCQUFXLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztLQVVqRDtJQVRDLFdBQVcsQ0FBQyxLQUFVO1FBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxXQUFXO1FBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQztJQUNsSCxDQUFDOzhHQWRVLDhCQUE4QjtrR0FBOUIsOEJBQThCLHNJQWhCL0I7Ozs7Ozs7OztHQVNUOzsyRkFPVSw4QkFBOEI7a0JBbEIxQyxTQUFTOytCQUNFLHlCQUF5QixZQUN6Qjs7Ozs7Ozs7O0dBU1Q7OEJBV1EsTUFBTTtzQkFBZCxLQUFLO2dCQUVJLFdBQVc7c0JBQXBCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdwcmVzZW50YWJsZS10ZXh0LWZpbHRlcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGlucHV0IFxuICAgICAgY2xhc3M9XCJpdnB0LWZpbHRlci1pbnB1dFwiXG4gICAgICB0eXBlPVwidGV4dFwiIFxuICAgICAgW25hbWVdPVwiY29sdW1uLmZpZWxkXCJcbiAgICAgIGlkPVwie3tjb2x1bW4uZmllbGR9fVwiXG4gICAgICBbKG5nTW9kZWwpXT1cIl9rZXl3b3JkXCJcbiAgICAgIChrZXlkb3duLmVudGVyKT1cImFwcGx5RmlsdGVyKClcIiBcbiAgICAvPlxuICBgLFxuICBzdHlsZXM6IGBcbiAgICAuaXZwdC1maWx0ZXItaW5wdXQge1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuICBgXG59KVxuZXhwb3J0IGNsYXNzIFByZXNlbnRhYmxlVGV4dEZpbHRlckNvbXBvbmVudCB7XG5cbiAgX2tleXdvcmQ6IHN0cmluZyA9ICcnO1xuXG4gIEBJbnB1dCgpIGNvbHVtbjogYW55O1xuXG4gIEBPdXRwdXQoKSB3aGVuQXBwbGllZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBlbWl0QXBwbGllZCh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy53aGVuQXBwbGllZC5lbWl0KHZhbHVlKTtcbiAgfVxuXG4gIGFwcGx5RmlsdGVyKCkge1xuICAgIGNvbnNvbGUubG9nKCdUaGUga2V5d29yZCBpcyAtICcsIHRoaXMuX2tleXdvcmQpO1xuICAgIHRoaXMuZW1pdEFwcGxpZWQoeydjb2x1bW4nOiB0aGlzLmNvbHVtblsnZmllbGQnXSwgJ3R5cGUnOiB0aGlzLmNvbHVtblsnZmlsdGVyVHlwZSddLCAna2V5d29yZCc6IHRoaXMuX2tleXdvcmR9KTtcbiAgfVxuXG59XG4iXX0=