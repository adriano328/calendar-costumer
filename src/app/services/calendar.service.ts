import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IEventos } from '../shared/interfaces/IEventos';
import { IPage } from '../shared/interfaces/Ipage';

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

}
