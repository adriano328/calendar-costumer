import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarioComponent } from './calendario/calendario.component';
import { CalendariosComponent } from './calendarios/calendarios.component';

const routes: Routes = [
  {
    path: '', component: CalendarioComponent
  },
  {
    path: 'calendarios', component: CalendariosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
