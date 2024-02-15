import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { IvoryPresentableComponent } from './ivory-presentable.component';
import { PresentableRowComponent } from './components/presentable-row/presentable-row.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    IvoryPresentableComponent,
    PresentableRowComponent
  ],
  exports: [
    IvoryPresentableComponent
  ]
})
export class IvoryPresentableModule { }
