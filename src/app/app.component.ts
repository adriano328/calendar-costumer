import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CalendarService } from './services/calendar.service';
import { IEventos } from './shared/interfaces/IEventos';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import momentPlugin from '@fullcalendar/moment';
import { DayHeader } from '@fullcalendar/core/internal';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  initiateDateSecond!: string;
  finalDateSecond!: string;
  initialDate!: string;
  finalDate!: string;
  disableListEvents: boolean = false;
  disableListEventsSecond: boolean = false;
  listOfEvents: IEventos[] = [];
  listOfEventsSecond: IEventos[] = [];
  calendarVisible = true;
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
    initialEvents: INITIAL_EVENTS,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
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
    eventsSet: this.handleEvents.bind(this),
  };

  constructor(
    private changeDetector: ChangeDetectorRef,
    private calendarSrv: CalendarService
  ) {
  }
  ngOnInit(): void {
    this.initiateCalendar();
    this.initiateCalendarSecond();
  }
  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  currentEvents: EventApi[] = [];

 async listAllEventsByMonths(){
  const idCampoEclesiastico = JSON.parse(localStorage.getItem('idCampoEclesiastico')!);
    let month;
    if(document.getElementsByClassName('fc-toolbar-title')){
      month = document!.getElementsByClassName('fc-toolbar-title')[0].textContent;
    }
    if(month){
      month = this.convertMonthNameToNumberOfMonth(month);
    }
    const date = new Date(`${new Date().getFullYear()}-${month}-01T06:00:00Z`);
    let firstDay = new Date( date.getFullYear() ,date.getMonth(), 1).getDate()
    let lastDay = new Date( date.getFullYear() ,date.getMonth() + 1, 0).getDate()
    this.initialDate = (`${new Date().getFullYear()}-${month}-${firstDay}`);
    this.finalDate = (`${new Date().getFullYear()}-${month}-${lastDay}`);

   const result = await this.calendarSrv.listAllEvents(idCampoEclesiastico, this.initialDate, this.finalDate);
   result?.content.map(data => {
    data.dataInicial = moment(data.dataInicial).utc().format('DD/MM/YYYY');
    data.dataFinal = moment(data.dataFinal).utc().format('DD/MM/YYYY');
   })
   this.listOfEvents = result?.content!;
   if(this.listOfEvents.length > 0) {
    this.disableListEvents = true;
   } else {
    this.disableListEvents = false;
   }
  }

  async initiateCalendar() {
    const idCampoEclesiastico = JSON.parse(localStorage.getItem('idCampoEclesiastico')!);
    const date = new Date();
    let firstDay = new Date( date.getFullYear() ,date.getMonth(), 1).getDate();
     let lastDay = new Date( date.getFullYear() ,date.getMonth() + 1, 0).getDate();
    this.initialDate = (`${new Date().getFullYear()}-${new Date().getMonth()+1}-${firstDay}`);
    this.finalDate = (`${new Date().getFullYear()}-${new Date().getMonth()+1}-${lastDay}`);
    const result = await this.calendarSrv.listAllEvents(idCampoEclesiastico, this.initialDate, this.finalDate);
    result?.content.map(data => {
      data.dataInicial = moment(data.dataInicial).utc().format('DD/MM/YYYY');
      data.dataFinal = moment(data.dataFinal).utc().format('DD/MM/YYYY');
     })
   this.listOfEvents = result?.content!;
   if(this.listOfEvents.length > 0) {
    this.disableListEvents = true;
   } else {
    this.disableListEvents = false;
   }
  }


  convertMonthNameToNumberOfMonth(month: string): string {
    if(month.includes('janeiro')){
      return '01';
    } else if(month.includes('fevereiro')){
      return '02';
    } else if(month.includes('março')){
      return '03';
    } else if(month.includes('abril')){
      return '04';
    } else if(month.includes('maio')){
      return '05';
    } else if(month.includes('junho')){
      return '06';
    } else if(month.includes('julho')){
      return '07';
    } else if(month.includes('agosto')){
      return '08';
    } else if(month.includes('setembro')){
      return '09';
    } else if(month.includes('outubro')){
      return '10';
    } else if(month.includes('novembro')){
      return '11';
    } else if(month.includes('dezembro')){
      return '12';
    }

    return '00';
  }

  async listAllEventsByMonthsSecond(){
    const idCampoEclesiastico = JSON.parse(localStorage.getItem('idCampoEclesiastico')!);
      let month;
      if(document.getElementsByClassName('fc-toolbar-title')){
        month = document!.getElementsByClassName('fc-toolbar-title')[0].textContent;
      }
      if(month){
        month = this.convertMonthNameToNumberOfMonth(month);
      }
      const date = new Date(`${new Date().getFullYear()}-${month}-01T06:00:00Z`);
      let firstDay = new Date( date.getFullYear() ,date.getMonth(), 1).getDate()
      let lastDay = new Date( date.getFullYear() ,date.getMonth() + 1, 0).getDate()
      this.initiateDateSecond = (`${new Date().getFullYear()}-${month}-${firstDay}`);
      this.finalDateSecond = (`${new Date().getFullYear()}-${month}-${lastDay}`);

     const result = await this.calendarSrv.listAllEvents(idCampoEclesiastico, this.initialDate, this.finalDate);
     result?.content.map(data => {
      data.dataInicial = moment(data.dataInicial).utc().format('DD/MM/YYYY');
      data.dataFinal = moment(data.dataFinal).utc().format('DD/MM/YYYY');
     })
     this.listOfEventsSecond = result?.content!;
     if(this.listOfEventsSecond.length > 0) {
      this.disableListEventsSecond = true;
     } else {
      this.disableListEventsSecond = false;
     }
    }

    async initiateCalendarSecond() {
      const idCampoEclesiastico = JSON.parse(localStorage.getItem('idCampoEclesiastico')!);
      const date = new Date();
      let firstDay = new Date( date.getFullYear() ,date.getMonth(), 1).getDate();
       let lastDay = new Date( date.getFullYear() ,date.getMonth() + 1, 0).getDate();
      this.initialDate = (`${new Date().getFullYear()}-${new Date().getMonth()+2}-${firstDay}`);
      this.finalDate = (`${new Date().getFullYear()}-${new Date().getMonth()+2}-${lastDay}`);
      console.log(this.initialDate);
      console.log(this.finalDate);
      const result = await this.calendarSrv.listAllEvents(idCampoEclesiastico, this.initialDate, this.finalDate);
      result?.content.map(data => {
        data.dataInicial = moment(data.dataInicial).utc().format('DD/MM/YYYY');
        data.dataFinal = moment(data.dataFinal).utc().format('DD/MM/YYYY');
       })
     this.listOfEventsSecond = result?.content!;
     if(this.listOfEventsSecond.length > 0) {
      this.disableListEventsSecond = true;
     } else {
      this.disableListEventsSecond = false;
     }
    }
}
