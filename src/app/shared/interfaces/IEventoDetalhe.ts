export interface IEventoDetalhe {
    id: number,
    agendaEventoId: number,
    dataultimaalteracao: Date,
    nomeEvento: string,
    dataInicial: Date,
    dataFinal: Date,
    tipoEvento: string,
    exclusivo: boolean
}