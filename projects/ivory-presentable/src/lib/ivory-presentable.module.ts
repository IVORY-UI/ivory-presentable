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

@NgModule({
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
})
export class IvoryPresentableModule { }
