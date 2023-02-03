import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  async listarEventos(eventos: IEventos, idCampoEclesiastico: number, page: number) {
    const result = await this.http.get<IPage<IEventos>>(`${environment.url}/agendaEvento/getEventList`, { headers: { Authorization: 'Bearer ' + window.localStorage.getItem('token') }, params: new HttpParams().set('idCampoEclesiastico', idCampoEclesiastico!).set('page' ,page!) }).toPromise();
  }
}
