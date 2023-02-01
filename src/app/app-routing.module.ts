import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: 'calendario', pathMatch: 'full'
  },
  {
    path: 'calendario', loadChildren: ()=> import('./modules/calendar/calendar.module').then(m => m.CalendarModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
