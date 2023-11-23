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
import { CalendarService } from './services/calendar.service';
import { IEventos } from './shared/interfaces/IEventos';
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
  listOfEvents: IEventos[] = [];
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
  allEventList: IEventos[] = [];
  locale: string = 'pt';
  cities!: City[];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private calendarSrv: CalendarService
  ) {
  }
  async ngOnInit() {
    this.prepareDates()
    this.initiateCalendar();
    this.initiateCalendarSecond();
    const result = await this.getInitialEvents();
    const mapedresult = result.map(item => this.convertObjectToEvent(item))
    this.initialEvents = mapedresult;
    
  }

  prepareDates() {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
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
    const idCampoEclesiastico = JSON.parse(localStorage.getItem('idCampoEclesiastico')!);
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
      result = await this.calendarSrv.listAllEvents(idCampoEclesiastico, this.initialDate, this.finalDate, 0);
      this.paginator?.changePage(0);
    } else {
      result = await this.calendarSrv.listAllEvents(idCampoEclesiastico, this.initialDate, this.finalDate, $event.page);
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

  async initiateCalendar($event?: any) {
    const idCampoEclesiastico = JSON.parse(localStorage.getItem('idCampoEclesiastico')!);
    const date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    this.initialDate = (`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${firstDay}`);
    this.finalDate = (`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${lastDay}`);
    let result = null;
    if (!$event) {
      result = await this.calendarSrv.listAllEvents(idCampoEclesiastico, this.initialDate, this.finalDate, 0);
      this.paginator?.changePage(0);
    } else {
      result = await this.calendarSrv.listAllEvents(idCampoEclesiastico, this.initialDate, this.finalDate, $event.page);
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

  async listAllEventsByMonthsSecond($event?: any) {
    const idCampoEclesiastico = JSON.parse(localStorage.getItem('idCampoEclesiastico')!);
    let month;
    if (document.getElementsByClassName('calendar-two')) {
      month = document!.getElementsByClassName('calendar-two')[0].textContent;
    }
    if (month) {
      month = this.convertMonthNameToNumberOfMonth(month);
    }
    const date = new Date(`${new Date().getFullYear()}-${month}-01T06:00:00Z`);
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate()
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    this.initiateDateSecond = (`${new Date().getFullYear()}-${month}-${firstDay}`);
    this.finalDateSecond = (`${new Date().getFullYear()}-${month}-${lastDay}`);
    let result = null;
    if (!$event) {
      result = await this.calendarSrv.listAllEvents(idCampoEclesiastico, this.initiateDateSecond, this.finalDateSecond, 0);
      this.paginatorb?.changePage(0);
    } else {
      result = await this.calendarSrv.listAllEvents(idCampoEclesiastico, this.initiateDateSecond, this.finalDateSecond, $event.page);
    }
    if (result) {
      result?.content.map(data => {
        data.dataInicial = moment(data.dataInicial).utc().format('DD/MM/YYYY');
        data.dataFinal = moment(data.dataFinal).utc().format('DD/MM/YYYY');
      });

      this.listOfEventsSecond = result?.content!;
      if (this.listOfEventsSecond.length > 0) {
        this.disableListEventsSecond = true;
        this.disablePaginatoTwo = true;
      } else {
        this.disableListEventsSecond = false;
        this.disablePaginatoTwo = false;
      }
      this.totalElementsSecond = result?.totalElements!;
    }
  }

  async opentEventModalCalendarFirst(id: number) {
    const result = await this.calendarSrv.showEvent(id);
    this.detailEvent = result!;
    if (this.eventDetailsFirstCalendar === true) {
      this.eventDetailsFirstCalendar = false;
    } else {
      this.eventDetailsFirstCalendar = true;
    }
  }

  async opentEventModalCalendarSecond(id: number) {
    const result = await this.calendarSrv.showEvent(id);
    this.detailEventSecond = result!;
    if (this.eventDetailsSecondCalendar === true) {
      this.eventDetailsSecondCalendar = false;
    } else {
      this.eventDetailsSecondCalendar = true;
    }
  }

  async initiateCalendarSecond($event?: any) {
    const idCampoEclesiastico = JSON.parse(localStorage.getItem('idCampoEclesiastico')!);
    const date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    this.initialDate = (`${new Date().getFullYear()}-${new Date().getMonth() + 2}-${firstDay}`);
    this.finalDate = (`${new Date().getFullYear()}-${new Date().getMonth() + 2}-${lastDay}`);
    let result = null;
    if (!$event) {
      result = await this.calendarSrv.listAllEvents(idCampoEclesiastico, this.initiateDateSecond, this.finalDateSecond, 0);
      this.paginatorb?.changePage(0);
    } else {
      result = await this.calendarSrv.listAllEvents(idCampoEclesiastico, this.initiateDateSecond, this.finalDateSecond, $event.page);
    }
    if (result) {
      result?.content.map(data => {
        data.dataInicial = moment(data.dataInicial).utc().format('DD/MM/YYYY');
        data.dataFinal = moment(data.dataFinal).utc().format('DD/MM/YYYY');
      });

      this.listOfEventsSecond = result?.content!;
      if (this.listOfEventsSecond.length > 0) {
        this.disableListEventsSecond = true;
        this.disablePaginatoTwo = true;
      } else {
        this.disableListEventsSecond = false;
        this.disablePaginatoTwo = false;
      }
      this.totalElementsSecond = result?.totalElements!;
    }
  }

  async getInitialEvents(): Promise<IEventos[]> {
    const TODAY_STR = new Date("2023-02-01").toISOString().replace(/T.*$/, '');
    const END_EVENT = new Date("2023-02-06").toISOString().replace(/T.*$/, '');

    const idCampoeclesiastico = localStorage.getItem('idCampoEclesiastico');

    if (idCampoeclesiastico) {
      const result = await this.calendarSrv.listAllEventsByCampoEclesiastico(parseInt(idCampoeclesiastico));

      if (result) {
        this.allEventList = result.content;
      }

    }

    return this.allEventList;
  }

  convertObjectToEvent(eventObject: IEventos): EventInput {
    const colors = ["#4169E1", "#228B22", "##DAA520", "#F08080", "#FFD700"];
    const random = Math.floor(Math.random() * colors.length);
    return { id: eventObject.id.toString(), title: eventObject.nome, start: moment(eventObject.dataInicial).utc().format('YYYY-MM-DD'), end: moment(eventObject.dataFinal).utc().format('YYYY-MM-DD'), color: colors[random] }
  }
}
