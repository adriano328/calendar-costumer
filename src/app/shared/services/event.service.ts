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

  async listAllEvents(dataInicio: string, dataFim: string) {
    return await this.http.get<IEventos[]>(`${environment.url}/agendaEventoDetalhe/findAllEntryDates`, { params: new HttpParams().set('dataInicio', dataInicio!).set('dataFim', dataFim!)}).toPromise();
  }

  async showEvent(id: number) {
    return await this.http.get<IEventos>(`${environment.url}/agendaEvento/findById/${id}`).toPromise();
  }

  getAllEventByLocalSetor(buscaLocalSetor: IEnvioLocalSetor) {
    return this.http.post<IEventoDetalhe[]>(`${environment.url}/agendaEventoDetalhe/findAllEntryDatesByLocalSetor`, buscaLocalSetor);
  }

}
