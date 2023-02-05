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
  calendarVisible = true;

  calendarOptions: CalendarOptions = {
       dayHeaderFormat: {
      weekday: 'short'
    },
    buttonText: {
      today: 'Hoje'
    },

    locale: "pt-br",
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      momentPlugin
    ],

    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventsSet: this.handleEvents.bind(this),
  };

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  currentEvents: EventApi[] = [];

  ngOnInit(): void {
  }
}
