import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPage } from '../interfaces/Ipage';
import { IEventoDetalhe } from '../interfaces/IEventoDetalhe';
import { environment } from 'src/environments/environment';
import { IEventos } from '../interfaces/IEventos';

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

  async listAllEvents(dataInicio: string, dataFim: string, page?: number) {
    return await this.http.get<IPage<IEventos>>(`${environment.url}/agendaEventoDetalhe/findAllEntryDates`, { params: new HttpParams().set('dataInicio', dataInicio!).set('dataFim', dataFim!).set('page', page!) }).toPromise();
  }

  async showEvent(id: number) {
    return await this.http.get<IEventos>(`${environment.url}/agendaEvento/findById/${id}`).toPromise();
  }

  getAllEventByLocalSetor(dataInicio: string, dataFim: string, localSetorId: number, page?: number) {
    return this.http.get<IPage<IEventoDetalhe>>(`${environment.url}/agendaEventoDetalhe/findAllEntryDatesByLocalSetor`, { params: new HttpParams().set('dataInicio', dataInicio!).set('dataFim', dataFim!).set('localSetorId', localSetorId).set('page', page!) });
  }

}
