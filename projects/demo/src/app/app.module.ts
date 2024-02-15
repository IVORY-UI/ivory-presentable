import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { IvoryPresentableModule } from '../../../ivory-presentable/src/public-api'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IvoryPresentableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
