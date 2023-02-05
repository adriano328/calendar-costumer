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

  async listAllEvents(idCampoEclesiastico: number, initialDate: string, finalDate: string) {
    return await this.http.get<IPage<IEventos>>(`${environment.url}/agendaEvento/findAllEntryDatesAndIdCampoEclesiastico`, {params: new HttpParams().set('idCampoEclesiastico', idCampoEclesiastico!).set('initialDate', initialDate!).set('finalDate', finalDate!)}).toPromise();
  }


}
