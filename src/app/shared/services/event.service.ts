import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPage } from '../interfaces/Ipage';
import { IEventoDetalhe } from '../interfaces/IEventoDetalhe';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient
  ) { }

  agendaEventoDetalhe(agendaNumber: number) {
    return this.http.get<IPage<IEventoDetalhe>>(`${environment.url}/agendaEventoDetalhe/getByAgendaEventoId/${agendaNumber}`)
  }

}
