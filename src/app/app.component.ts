import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventApi, EventInput } from '@fullcalendar/core';
import { LOCALE_ID } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import momentPlugin from '@fullcalendar/moment';
import timeGridPlugin from '@fullcalendar/timegrid';
import * as moment from 'moment';
import { Paginator } from 'primeng/paginator';
import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';

import { INITIAL_EVENTS, createEventId } from './event-utils';
import { CalendarService } from './shared/services/calendar.service';
import { IEventos } from './shared/interfaces/IEventos';
import { LoginService } from './shared/services/login.service';
import { ISetor } from './shared/interfaces/ISetor';
import { EventService } from './shared/services/event.service';
import { IEventoDetalhe } from './shared/interfaces/IEventoDetalhe';
import { IPage } from './shared/interfaces/Ipage';
registerLocaleData(localePT);

interface City {
  name: string,
  code: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-br' },
  ]
})

export class AppComponent implements OnInit {
  @ViewChild('pp') paginator?: Paginator;
  @ViewChild('bb') paginatorb?: Paginator;
  initiateDateSecond!: string;
  detailEvent: IEventos = {} as IEventos;
  detailEventSecond: IEventos = {} as IEventos;
  eventDetailsFirstCalendar: boolean = false;
  eventDetailsSecondCalendar: boolean = false;
  finalDateSecond!: string;
  initialDate!: string;
  finalDate!: string;
  disableListEvents: boolean = false;
  disableListEventsSecond: boolean = false;
  listOfEvents: any[] = [];
  listOfEventsSecond: IEventos[] = [];
  paginationFirstValue = 0;
  paginationSecondValue = 0;
  totalElements = 0;
  totalElementsSecond = 0;
  currentPage = 0;
  disablePaginatorOne: boolean = true;
  disablePaginatoTwo: boolean = true;
  calendarVisible = true;
  initialEvents: any[] = [];
  allEventList: IEventoDetalhe[] = [];
  locale: string = 'pt';
  cities!: City[];
  setor: ISetor[] = [];
  ano!: number;
  agendaNumber!: number;
  events: IEventoDetalhe[] = [];
  localSetor: ISetor[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private calendarSrv: CalendarService,
    private eventSrv: EventService,
    private loginService: LoginService
  ) {
  }
  async ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      this.loginService.tokenIsValid(token).then(tokenIsValid => {
        if (tokenIsValid) {
          localStorage.setItem('token', token);
        } else {
          this.loginService.authenticate({ login: 'orlando.junior', senha: '020484', campoEclesiastico: { id: 1 } }).then(objectToken => {
            localStorage.setItem('token', objectToken.token);
          })
        }
      })
    } else {
      this.loginService.authenticate({ login: 'orlando.junior', senha: '020484', campoEclesiastico: { id: 1 } }).then(objectToken => {
        localStorage.setItem('token', objectToken.token);
      })
    }
    await this.getInitialEvents();

    this.initiateCalendar();


    const result = this.allEventList;
    this.getAgendaEvento();
    this.getAllLocalSetor();
  }

  getAllLocalSetor() {
    this.calendarSrv.getAllLocalSetor().subscribe({
      next: (data => {
        this.setor = data;
      })
    })
  }

  getAgendaEvento() {
    const ano = new Date().getFullYear()
    this.calendarSrv.getAgendaEvento(ano).subscribe({
      next: (data => {
        this.agendaNumber = data.id;
        this.agendaEventoDetalhe(this.agendaNumber)
        this.getInitialEvents(this.agendaNumber)
        this.ano = data.ano;
      })
    })
  }

  agendaEventoDetalhe(agenda: number) {
    this.eventSrv.agendaEventoDetalhe(agenda!).subscribe({
      next: (data => {
        this.events = data.content;
      })
    })
  }

  calendarOptionsOne: CalendarOptions = {

    dayHeaderFormat: {
      weekday: 'short'
    },
    buttonText: {
      today: 'Hoje'
    },
    moreLinkText: 'Todos',
    locale: "pt-br",
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      momentPlugin
    ],
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    eventTextColor: '#000000',
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventDisplay: 'background',
    eventsSet: this.handleEvents.bind(this),
  };

  calendarOptionsTwo: CalendarOptions = {
    initialDate: new Date().getFullYear() + '-' + moment(new Date()).add('month', 1).format('MM'),
    dayHeaderFormat: {
      weekday: 'short'
    },
    buttonText: {
      today: 'Hoje'
    },
    moreLinkText: 'Todos',
    locale: "pt-br",
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      momentPlugin
    ],
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventDisplay: 'background',
    eventsSet: this.handleEvents.bind(this),
  };

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  currentEvents: EventApi[] = [];

  async listAllEventsByMonths($event?: any) {

    let month;
    if (document.getElementsByClassName('calendar-one')) {
      month = document!.getElementsByClassName('calendar-one')[0].textContent;
    }
    if (month) {
      month = this.convertMonthNameToNumberOfMonth(month);
    }
    const date = new Date(`${new Date().getFullYear()}-${month}-01T06:00:00Z`);
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate()
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    this.initialDate = (`${new Date().getFullYear()}-${month}-${firstDay}`);
    this.finalDate = (`${new Date().getFullYear()}-${month}-${lastDay}`);

    let result = null;
    if (!$event) {
      result = await this.eventSrv.listAllEvents(this.initialDate, this.finalDate, 0);
      this.paginator?.changePage(0);
    } else {
      result = await this.eventSrv.listAllEvents(this.initialDate, this.finalDate, $event.page);
    }

    if (result) {
      result?.content.map(data => {
        data.dataInicial = moment(data.dataInicial).utc().format('DD/MM/YYYY');
        data.dataFinal = moment(data.dataFinal).utc().format('DD/MM/YYYY');
      });
      this.listOfEvents = result?.content!;      
      if (this.listOfEvents.length > 0) {
        this.disableListEvents = true;
        this.disablePaginatorOne = true;
      } else {
        this.disableListEvents = false;
        this.disablePaginatorOne = false;
      }
      this.totalElements = result?.totalElements;
    }
  }

  getAllEventByLocalSetor($event: any) {
    let month;
    if (document.getElementsByClassName('calendar-one')) {
      month = document!.getElementsByClassName('calendar-one')[0].textContent;
    }
    if (month) {
      month = this.convertMonthNameToNumberOfMonth(month);
    }
    const date = new Date(`${new Date().getFullYear()}-${month}-01T06:00:00Z`);
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate()
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    this.initialDate = (`${new Date().getFullYear()}-${month}-${firstDay}`);
    this.finalDate = (`${new Date().getFullYear()}-${month}-${lastDay}`);
    const local = this.localSetor.map(e => e.id)[0]
    if(local == undefined) {      
      const result = this.eventSrv.listAllEvents(this.initialDate, this.finalDate, 0);
      
    } else {
      this.eventSrv.getAllEventByLocalSetor(this.initialDate, this.finalDate, local).subscribe({
        next: (data => {
          if (data) {
            this.listOfEvents = data.content;
            const mapedresult = this.listOfEvents.map((item: IEventoDetalhe) => this.convertObjectToEvent(item))
            this.initialEvents = mapedresult;
            if (this.listOfEvents.length > 0) {
              this.disableListEvents = true;
              this.disablePaginatorOne = true;
            } else {
              this.disableListEvents = false;
              this.disablePaginatorOne = false;
            }
            this.totalElements = data?.totalElements;
          }
        })
      })
    }
  }

  async initiateCalendar($event?: any) {
    const date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    this.initialDate = (`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${firstDay}`);
    this.finalDate = (`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${lastDay}`);
    let result = null;
    if (!$event) {
      result = await this.eventSrv.listAllEvents(this.initialDate, this.finalDate, 0);
      this.paginator?.changePage(0);
    } else {
      result = await this.eventSrv.listAllEvents(this.initialDate, this.finalDate, $event.page);
    }
    if (result) {
      result?.content.map(data => {
        data.dataInicial = moment(data.dataInicial).utc().format('DD/MM/YYYY');
        data.dataFinal = moment(data.dataFinal).utc().format('DD/MM/YYYY');
      });
      this.listOfEvents = result?.content!;
      if (this.listOfEvents.length > 0) {
        this.disableListEvents = true;
        this.disablePaginatorOne = true;
      } else {
        this.disableListEvents = false;
        this.disablePaginatorOne = false;
      }
      this.totalElements = result?.totalElements;
    }
  }

  convertMonthNameToNumberOfMonth(month: string): string {
    if (month.includes('janeiro')) {
      return '01';
    } else if (month.includes('fevereiro')) {
      return '02';
    } else if (month.includes('março')) {
      return '03';
    } else if (month.includes('abril')) {
      return '04';
    } else if (month.includes('maio')) {
      return '05';
    } else if (month.includes('junho')) {
      return '06';
    } else if (month.includes('julho')) {
      return '07';
    } else if (month.includes('agosto')) {
      return '08';
    } else if (month.includes('setembro')) {
      return '09';
    } else if (month.includes('outubro')) {
      return '10';
    } else if (month.includes('novembro')) {
      return '11';
    } else if (month.includes('dezembro')) {
      return '12';
    }

    return '00';
  }

  async opentEventModalCalendarFirst(id: number) {
    const result = await this.eventSrv.showEvent(id);
    this.detailEvent = result!;
    if (this.eventDetailsFirstCalendar === true) {
      this.eventDetailsFirstCalendar = false;
    } else {
      this.eventDetailsFirstCalendar = true;
    }
  }

  getInitialEvents(agenda?: number) {
    if (agenda) {
      this.eventSrv.agendaEventoDetalhe(this.agendaNumber).subscribe({
        next: (data => {
          this.allEventList = data.content;         
          const mapedresult = this.allEventList.map((item: IEventoDetalhe) => this.convertObjectToEvent(item))
          this.initialEvents = mapedresult;
        })
      });
    }
    return this.allEventList
  }

  convertObjectToEvent(eventObject: IEventoDetalhe): EventInput {
    const colors = ["#4169E1", "#228B22", "##DAA520", "#F08080", "#FFD700"];
    const random = Math.floor(Math.random() * colors.length);
    return { id: eventObject.id.toString(), title: eventObject.nomeEvento, start: moment(eventObject.dataInicial).utc().format('YYYY-MM-DD'), end: moment(eventObject.dataFinal).utc().format('YYYY-MM-DD'), color: colors[random] }
  }
}
