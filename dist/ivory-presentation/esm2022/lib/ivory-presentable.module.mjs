import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
/* Components */
import { IvoryPresentableComponent } from './ivory-presentable.component';
import { PresentableRowComponent } from './components/presentable-row/presentable-row.component';
import { PresentableColumnResizerComponent } from './components/presentable-column-resizer/presentable-column-resizer.component';
import { PresentableColumnControlsComponent } from './components/presentable-column-controls/presentable-column-controls.component';
import { PresentablePaginatorComponent } from './components/presentable-paginator/presentable-paginator.component';
import { PresentableTextFilterComponent } from './components/filters/presentable-text-filter/presentable-text-filter.component';
import { PresentableOptionsFilterComponent } from './components/filters/presentable-options-filter/presentable-options-filter.component';
/* Directives */
import { ClickOutsideDirective } from './helpers/click-outside.directive';
import { ColumnResizeDirective } from './components/presentable-column-resizer/presentable-column-resizer.directive';
import * as i0 from "@angular/core";
export class IvoryPresentableModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: IvoryPresentableModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.2.1", ngImport: i0, type: IvoryPresentableModule, declarations: [IvoryPresentableComponent,
            PresentableRowComponent,
            PresentableTextFilterComponent,
            PresentableOptionsFilterComponent,
            PresentableColumnResizerComponent,
            PresentableColumnControlsComponent,
            PresentablePaginatorComponent,
            ClickOutsideDirective,
            ColumnResizeDirective], imports: [BrowserModule,
            FormsModule], exports: [IvoryPresentableComponent,
            PresentableRowComponent,
            PresentableTextFilterComponent,
            PresentableOptionsFilterComponent,
            PresentableColumnResizerComponent,
            PresentableColumnControlsComponent,
            PresentablePaginatorComponent,
            ClickOutsideDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: IvoryPresentableModule, imports: [BrowserModule,
            FormsModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.1", ngImport: i0, type: IvoryPresentableModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        BrowserModule,
                        FormsModule
                    ],
                    declarations: [
                        IvoryPresentableComponent,
                        PresentableRowComponent,
                        PresentableTextFilterComponent,
                        PresentableOptionsFilterComponent,
                        PresentableColumnResizerComponent,
                        PresentableColumnControlsComponent,
                        PresentablePaginatorComponent,
                        ClickOutsideDirective,
                        ColumnResizeDirective
                    ],
                    exports: [
                        IvoryPresentableComponent,
                        PresentableRowComponent,
                        PresentableTextFilterComponent,
                        PresentableOptionsFilterComponent,
                        PresentableColumnResizerComponent,
                        PresentableColumnControlsComponent,
                        PresentablePaginatorComponent,
                        ClickOutsideDirective
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXZvcnktcHJlc2VudGFibGUubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvaXZvcnktcHJlc2VudGFibGUvc3JjL2xpYi9pdm9yeS1wcmVzZW50YWJsZS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTdDLGdCQUFnQjtBQUNoQixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUNqRyxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSw4RUFBOEUsQ0FBQztBQUNqSSxPQUFPLEVBQUUsa0NBQWtDLEVBQUUsTUFBTSxnRkFBZ0YsQ0FBQztBQUNwSSxPQUFPLEVBQUUsNkJBQTZCLEVBQUUsTUFBTSxvRUFBb0UsQ0FBQztBQUNuSCxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxnRkFBZ0YsQ0FBQztBQUNoSSxPQUFPLEVBQUUsaUNBQWlDLEVBQUUsTUFBTSxzRkFBc0YsQ0FBQztBQUV6SSxnQkFBZ0I7QUFDaEIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sbUNBQW1DLENBQUM7QUFDMUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sOEVBQThFLENBQUM7O0FBNkJySCxNQUFNLE9BQU8sc0JBQXNCOzhHQUF0QixzQkFBc0I7K0dBQXRCLHNCQUFzQixpQkFyQi9CLHlCQUF5QjtZQUN6Qix1QkFBdUI7WUFDdkIsOEJBQThCO1lBQzlCLGlDQUFpQztZQUNqQyxpQ0FBaUM7WUFDakMsa0NBQWtDO1lBQ2xDLDZCQUE2QjtZQUM3QixxQkFBcUI7WUFDckIscUJBQXFCLGFBWnJCLGFBQWE7WUFDYixXQUFXLGFBY1gseUJBQXlCO1lBQ3pCLHVCQUF1QjtZQUN2Qiw4QkFBOEI7WUFDOUIsaUNBQWlDO1lBQ2pDLGlDQUFpQztZQUNqQyxrQ0FBa0M7WUFDbEMsNkJBQTZCO1lBQzdCLHFCQUFxQjsrR0FHWixzQkFBc0IsWUF6Qi9CLGFBQWE7WUFDYixXQUFXOzsyRkF3QkYsc0JBQXNCO2tCQTNCbEMsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsYUFBYTt3QkFDYixXQUFXO3FCQUNaO29CQUNELFlBQVksRUFBRTt3QkFDWix5QkFBeUI7d0JBQ3pCLHVCQUF1Qjt3QkFDdkIsOEJBQThCO3dCQUM5QixpQ0FBaUM7d0JBQ2pDLGlDQUFpQzt3QkFDakMsa0NBQWtDO3dCQUNsQyw2QkFBNkI7d0JBQzdCLHFCQUFxQjt3QkFDckIscUJBQXFCO3FCQUN0QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AseUJBQXlCO3dCQUN6Qix1QkFBdUI7d0JBQ3ZCLDhCQUE4Qjt3QkFDOUIsaUNBQWlDO3dCQUNqQyxpQ0FBaUM7d0JBQ2pDLGtDQUFrQzt3QkFDbEMsNkJBQTZCO3dCQUM3QixxQkFBcUI7cUJBQ3RCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG4vKiBDb21wb25lbnRzICovXG5pbXBvcnQgeyBJdm9yeVByZXNlbnRhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi9pdm9yeS1wcmVzZW50YWJsZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgUHJlc2VudGFibGVSb3dDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvcHJlc2VudGFibGUtcm93L3ByZXNlbnRhYmxlLXJvdy5jb21wb25lbnQnO1xuaW1wb3J0IHsgUHJlc2VudGFibGVDb2x1bW5SZXNpemVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ByZXNlbnRhYmxlLWNvbHVtbi1yZXNpemVyL3ByZXNlbnRhYmxlLWNvbHVtbi1yZXNpemVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQcmVzZW50YWJsZUNvbHVtbkNvbnRyb2xzQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ByZXNlbnRhYmxlLWNvbHVtbi1jb250cm9scy9wcmVzZW50YWJsZS1jb2x1bW4tY29udHJvbHMuY29tcG9uZW50JztcbmltcG9ydCB7IFByZXNlbnRhYmxlUGFnaW5hdG9yQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3ByZXNlbnRhYmxlLXBhZ2luYXRvci9wcmVzZW50YWJsZS1wYWdpbmF0b3IuY29tcG9uZW50JztcbmltcG9ydCB7IFByZXNlbnRhYmxlVGV4dEZpbHRlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9maWx0ZXJzL3ByZXNlbnRhYmxlLXRleHQtZmlsdGVyL3ByZXNlbnRhYmxlLXRleHQtZmlsdGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQcmVzZW50YWJsZU9wdGlvbnNGaWx0ZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvZmlsdGVycy9wcmVzZW50YWJsZS1vcHRpb25zLWZpbHRlci9wcmVzZW50YWJsZS1vcHRpb25zLWZpbHRlci5jb21wb25lbnQnO1xuXG4vKiBEaXJlY3RpdmVzICovXG5pbXBvcnQgeyBDbGlja091dHNpZGVEaXJlY3RpdmUgfSBmcm9tICcuL2hlbHBlcnMvY2xpY2stb3V0c2lkZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgQ29sdW1uUmVzaXplRGlyZWN0aXZlIH0gZnJvbSAnLi9jb21wb25lbnRzL3ByZXNlbnRhYmxlLWNvbHVtbi1yZXNpemVyL3ByZXNlbnRhYmxlLWNvbHVtbi1yZXNpemVyLmRpcmVjdGl2ZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBCcm93c2VyTW9kdWxlLFxuICAgIEZvcm1zTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEl2b3J5UHJlc2VudGFibGVDb21wb25lbnQsXG4gICAgUHJlc2VudGFibGVSb3dDb21wb25lbnQsXG4gICAgUHJlc2VudGFibGVUZXh0RmlsdGVyQ29tcG9uZW50LFxuICAgIFByZXNlbnRhYmxlT3B0aW9uc0ZpbHRlckNvbXBvbmVudCxcbiAgICBQcmVzZW50YWJsZUNvbHVtblJlc2l6ZXJDb21wb25lbnQsXG4gICAgUHJlc2VudGFibGVDb2x1bW5Db250cm9sc0NvbXBvbmVudCxcbiAgICBQcmVzZW50YWJsZVBhZ2luYXRvckNvbXBvbmVudCxcbiAgICBDbGlja091dHNpZGVEaXJlY3RpdmUsXG4gICAgQ29sdW1uUmVzaXplRGlyZWN0aXZlXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBJdm9yeVByZXNlbnRhYmxlQ29tcG9uZW50LFxuICAgIFByZXNlbnRhYmxlUm93Q29tcG9uZW50LFxuICAgIFByZXNlbnRhYmxlVGV4dEZpbHRlckNvbXBvbmVudCxcbiAgICBQcmVzZW50YWJsZU9wdGlvbnNGaWx0ZXJDb21wb25lbnQsXG4gICAgUHJlc2VudGFibGVDb2x1bW5SZXNpemVyQ29tcG9uZW50LFxuICAgIFByZXNlbnRhYmxlQ29sdW1uQ29udHJvbHNDb21wb25lbnQsXG4gICAgUHJlc2VudGFibGVQYWdpbmF0b3JDb21wb25lbnQsXG4gICAgQ2xpY2tPdXRzaWRlRGlyZWN0aXZlXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgSXZvcnlQcmVzZW50YWJsZU1vZHVsZSB7IH1cbiJdfQ==