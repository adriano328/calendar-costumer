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

  async listAllEvents(idCampoEclesiastico: number, initialDate: string, finalDate: string, page?: number) {
    return await this.http.get<IPage<IEventos>>(`${environment.url}/agendaEvento/findAllEntryDatesAndIdCampoEclesiastico`, {params: new HttpParams().set('idCampoEclesiastico', idCampoEclesiastico!).set('initialDate', initialDate!).set('finalDate', finalDate!).set('page', page!)}).toPromise();
  }

  async listAllEventsByCampoEclesiastico(idCampoEclesiastico: number){
    return this.http.get<IPage<IEventos>>(`${environment.url}/agendaEvento/findAllBycampoEclesiastico/${idCampoEclesiastico}`).toPromise();
  }

  async showEvent(id: number) {
    return await this.http.get<IEventos>(`${environment.url}/agendaEvento/findById/${id}`).toPromise();
  }

  getAgendaEvento(year: number) {
    return this.http.get<IAgenda>(`${environment.url}/agendaEvento/getByAno/${year}`)
  }

  getAllLocalSetor(){
    return this.http.get<any>(`${environment.url}/localsetor/getAllList`)
  }

}
