import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarioComponent } from './calendario/calendario.component';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import { CalendariosComponent } from './calendarios/calendarios.component';


@NgModule({
  declarations: [
    CalendarioComponent,
    CalendariosComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    CardModule,
    TableModule
  ]
})
export class CalendarModule { }
