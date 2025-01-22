import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPage } from '../interfaces/Ipage';
import { IEventoDetalhe } from '../interfaces/IEventoDetalhe';
import { environment } from 'src/environments/environment';
import { IEventos } from '../interfaces/IEventos';
import { IEnvioLocalSetor } from '../interfaces/IEnvioLocalSetor';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    private http: HttpClient
  ) { }

  agendaEventoDetalhe(agendaNumber: number) {
    return this.http.get<IEventoDetalhe[]>(`${environment.url}/agendaEventoDetalhe/getByAgendaEventoId/${agendaNumber}`)
  }

  listAllEvents(dataInicio: string, dataFim: string) {
    return this.http.get<IPage<IEventos>>(`${environment.url}/agendaEventoDetalhe/findAllEntryDatesPaginaded`, { params: new HttpParams().set('dataInicio', dataInicio!).set('dataFim', dataFim!)});
  }

  async showEvent(id: number) {
    return await this.http.get<IEventos>(`${environment.url}/agendaEventoDetalhe/getById/${id}`).toPromise();
  }

  getAllEventByLocalSetor(buscaLocalSetor: IEnvioLocalSetor) {
    return this.http.post<IEventoDetalhe[]>(`${environment.url}/agendaEventoDetalhe/findAllEntryDatesByLocalSetor`, buscaLocalSetor);
  }

  getEventByClick(buscaLocalSetor: IEnvioLocalSetor) {
    return this.http.post<IEventoDetalhe[]>(`${environment.url}/agendaEventoDetalhe/findAllEntryDatesByLocalSetorClickData`, buscaLocalSetor);
  }

}
