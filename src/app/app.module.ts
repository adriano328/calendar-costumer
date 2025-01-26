import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PanelModule} from 'primeng/panel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarModule } from '@fullcalendar/angular';
import {PaginatorModule} from 'primeng/paginator';
import {DialogModule} from 'primeng/dialog';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { AuthInterceptor } from './shared/interceptors/auth-interceptor';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {ButtonModule} from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { IConfig, NgxMaskModule } from 'ngx-mask';
import { CarouselModule } from 'primeng/carousel';

const maskConfig: Partial<IConfig> = {
  validation: true, // Validação habilitada
};

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
    MultiSelectModule,
    TableModule,
    ProgressSpinnerModule,
    ButtonModule,
    TagModule,
    NgxMaskModule.forRoot(), 
    CarouselModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
