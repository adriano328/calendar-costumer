import { ChangeDetectorRef, Component } from '@angular/core';
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
export class AppComponent {

  disableListEvents: boolean = true;
  listOfEvents: IEventos[] = [];
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

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  currentEvents: EventApi[] = [];

  ngOnInit(): void {
    this.listAllEventsByMonths();
  }

  async listAllEventsByMonths() {
  }

  test(){
    let month;

    if(document.getElementsByClassName('fc-toolbar-title')){
      month = document.getElementsByClassName('fc-toolbar-title')[0].textContent;
    }

    if(month){
      month = this.convertMonthNameToNumberOfMonth(month);
    }


    const date = new Date(`${new Date().getFullYear()}-${month}-01T06:00:00Z`);
    let firstDay = new Date( date.getFullYear() ,date.getMonth(), 1).getDate()
    let lastDay = new Date( date.getFullYear() ,date.getMonth() + 1, 0).getDate()
    console.log(firstDay, lastDay);



// const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
// console.log(lastDay);

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

}
