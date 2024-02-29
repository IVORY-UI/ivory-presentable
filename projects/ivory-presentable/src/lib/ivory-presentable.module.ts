import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { IvoryPresentableComponent } from './ivory-presentable.component';
import { PresentableRowComponent } from './components/presentable-row/presentable-row.component';
import { PresentableOptionsFilterComponent } from './components/presentable-options-filter/presentable-options-filter.component';
import { PresentableColumnResizerComponent } from './components/presentable-column-resizer/presentable-column-resizer.component';
import { PresentableColumnControlsComponent } from './components/presentable-column-controls/presentable-column-controls.component';
import { PresentablePaginatorComponent } from './components/presentable-paginator/presentable-paginator.component';

import { ClickOutsideDirective } from './helpers/click-outside.directive';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    IvoryPresentableComponent,
    PresentableRowComponent,
    PresentableOptionsFilterComponent,
    PresentableColumnResizerComponent,
    PresentableColumnControlsComponent,
    PresentablePaginatorComponent,
    ClickOutsideDirective
  ],
  exports: [
    IvoryPresentableComponent,
    PresentableRowComponent,
    PresentableOptionsFilterComponent,
    PresentableColumnResizerComponent,
    PresentableColumnControlsComponent,
    PresentablePaginatorComponent,
    ClickOutsideDirective
  ]
})
export class IvoryPresentableModule { }
