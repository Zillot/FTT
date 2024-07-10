import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from '../components/home/home.component';
import { FormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';
import { DataTableComponent } from '../controls/dataTable/dataTable.component';
import { IsBusyComponent } from '../controls/isBusy/isBusy.component';
import { DatePipe } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    AppComponent,

    //pages
    HomeComponent,

    //controlls
    DataTableComponent,
    IsBusyComponent
  ],
  imports: [
    FormsModule,
    BrowserModule, 
    HttpClientModule,
    AppRoutingModule,
    NgPipesModule,
    ScrollingModule,
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() { }
}

