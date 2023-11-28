import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IEventos } from '../interfaces/IEventos';
import { IPage } from '../interfaces/Ipage';
import { IAgenda } from '../interfaces/IAgenda';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(
    private http: HttpClient
  ) { }

  getAgendaEvento(year: number) {
    return this.http.get<IAgenda>(`${environment.url}/agendaEvento/getByAno/${year}`)
  }

  getAllLocalSetor(){
    return this.http.get<any>(`${environment.url}/localsetor/getAllList`)
  }

}
