import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {PanelModule} from 'primeng/panel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarModule } from '@fullcalendar/angular';
import {PaginatorModule} from 'primeng/paginator';
import {DialogModule} from 'primeng/dialog';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { AuthInterceptor } from './shared/interceptors/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PanelModule,
    BrowserAnimationsModule,
    FullCalendarModule,
    PaginatorModule,
    DialogModule,
    InputTextareaModule,
    MultiSelectModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
