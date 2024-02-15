import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { IvoryPresentableComponent } from './ivory-presentable.component';



@NgModule({
  declarations: [
    IvoryPresentableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    IvoryPresentableComponent
  ]
})
export class IvoryPresentableModule { }
