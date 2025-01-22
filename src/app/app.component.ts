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

import { INITIAL_EVENTS } from './event-utils';
import { CalendarService } from './shared/services/calendar.service';
import { IEventos } from './shared/interfaces/IEventos';
import { LoginService } from './shared/services/login.service';
import { ISetor } from './shared/interfaces/ISetor';
import { EventService } from './shared/services/event.service';
import { IEventoDetalhe } from './shared/interfaces/IEventoDetalhe';
import { IEnvioLocalSetor } from '../app/shared/interfaces/IEnvioLocalSetor';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { SituacaoEvento } from './shared/core/constants/situacaoEvento';

registerLocaleData(localePT);

interface City {
  name: string,
  code: string
}

declare global {
  interface Window {
    myGlobalClickedInfo: any;
  }
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
  spinnerView = false;
  messageReturn = false;
  dataFomat = false;
  imageCampo: any;
  igreja!: string;
  campo!: string;
  data: any;
  monthOption = false;
  dayOption = false;
  situacaoEvento = SituacaoEvento;
  skipHandleEvents: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private calendarSrv: CalendarService,
    public eventSrv: EventService,
    private loginService: LoginService,
    private _sanitizer: DomSanitizer
  ) {
  }
  async ngOnInit() {
    this.spinnerView = true;
    const token = localStorage.getItem('token');
    this.loadToken(token!).then(() => {
      // this.getInitialEvents();
      this.initiateCalendar();
      this.getAgendaEvento();
      this.getAllLocalSetor();
    })
  }

  converteSituacaoEvento(situacao: string) {
    const situacaoConvert = this.situacaoEvento.find(e => e.value == situacao);
    return situacaoConvert?.label;
  }

  async loadToken(token: string): Promise<string> {
    if (token) {
      const tokenIsValid = await this.loginService.tokenIsValid(token);
      if (tokenIsValid) {
        localStorage.setItem('token', token);
      } else {
        const objectToken = await this.loginService.authenticate({
          login: 'orlando.junior',
          senha: '020484',
          campoEclesiastico: { id: 1 },
        });
        localStorage.setItem('token', objectToken.token);
      }
    } else {
      const objectToken = await this.loginService.authenticate({
        login: 'orlando.junior',
        senha: '020484',
        campoEclesiastico: { id: 1 },
      });
      localStorage.setItem('token', objectToken.token);
    }

    return localStorage.getItem('token')!;
  }

  getAllLocalSetor() {
    this.calendarSrv.getAllLocalSetor().subscribe({
      next: (data => {
        this.setor = data;
      })
    })
  }

  convertLocalEvento(local: number) {
    const localConvertido = this.setor.find(e => e.id == local);
    return localConvertido?.nome;
  }

  getAgendaEvento() {
    const ano = new Date().getFullYear()
    this.calendarSrv.getAgendaEvento(ano).subscribe({
      next: (data => {
        this.getInfoCampoEclesiastico(data.campoEclesiastico)
        this.agendaNumber = data.id;
        // this.agendaEventoDetalhe(this.agendaNumber)
        this.getInitialEvents(this.agendaNumber)
        this.ano = data.ano;
      })
    })
  }

  // agendaEventoDetalhe(agenda: number) {
  //   this.eventSrv.agendaEventoDetalhe(agenda!).subscribe({
  //     next: (data => {
  //       this.events = data;
  //     })
  //   })
  // }


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
    dateClick: this.handleDateClick.bind(this),
    eventDisplay: 'background',
    eventsSet: this.handleEvents.bind(this),
  };

  handleEvents(events: EventApi[]) {
    if (this.skipHandleEvents) {
      this.skipHandleEvents = false;
      return;
    }
    if (events) {
      this.listAllEventsByMonths();
    }
  }

  getInfoCampoEclesiastico(agenda?: number) {
    this.calendarSrv.getInfoCampoEclesiastico(agenda!).subscribe({
      next: (data => {
        this.imageCampo = data.logotipocabecalhorelatorio;
        this.imageCampo = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.imageCampo);
        const igreja = data.denominacao;
        this.igreja = igreja.slice(0, 36);
        const campo = data.denominacao;
        this.campo = campo.slice(36, 55)
      })
    })
  }

  currentEvents: EventApi[] = [];

  async listAllEventsByMonths($event?: any) {
    this.dayOption = false;
    this.monthOption = false;
    this.spinnerView = true;
    let data: any;
    if (document.getElementsByClassName('calendar-one')) {
      data = document!.getElementsByClassName('calendar-one')[0].textContent;      
    }
    if (data) {
      data = this.convertMonthNameToNumberAndYear(data);
    }

    console.log(data);
    

    const date = this.getFirstAndLastDayOfMonth(data.month, data.year)
    this.initialDate = date.firstDay;
    this.finalDate = date.lastDay;
    let result = null;
    if (!$event) {
      this.eventSrv.listAllEvents(this.initialDate, this.finalDate).subscribe({
        next: (data) => {
          this.spinnerView = false;
          this.listOfEvents = data.content;
          this.paginator?.changePage(0);

          if (this.listOfEvents.length < 1) {
            this.monthOption = true;
          }
          this.totalElements = data?.length;
        }
      });
    } else {
      this.eventSrv.listAllEvents(this.initialDate, this.finalDate).subscribe({
        next: (data) => {
          this.spinnerView = false;
          this.listOfEvents = data.content;
          this.paginator?.changePage(0);

          if (this.listOfEvents.length < 1) {
            this.monthOption = true;
          }
          this.totalElements = data?.length;
        }
      });    }

    // if (result) {
    //   this.spinnerView = false;
    //   this.listOfEvents = result.content;

    //   if(this.listOfEvents.length < 1) {
    //     this.monthOption = true;
    //   }
    //   this.totalElements = result?.length;
    // }
  }

  getFirstAndLastDayOfMonth(month: string, year: string): { firstDay: string; lastDay: string } {
    const monthIndex = parseInt(month, 10) - 1;
    const firstDayDate = new Date(parseInt(year, 10), monthIndex, 1);
    const lastDayDate = new Date(parseInt(year, 10), monthIndex + 1, 0);
    const firstDay = firstDayDate.toISOString().split('T')[0];
    const lastDay = lastDayDate.toISOString().split('T')[0];

    return { firstDay, lastDay };
  }



  redirectLink(link: string) {
    window.open(link, '_blank');
  }

  getAllEventByLocalSetor($event?: any, tipoSelecionado?: string) {
    this.skipHandleEvents = true;
    
    if ($event.length > 0) {
      this.dayOption = false;
      this.monthOption = false;
      this.spinnerView = true;

      let month;
      if (document.getElementsByClassName('calendar-one')) {
        month = document!.getElementsByClassName('calendar-one')[0].textContent;
      }
      if (month) {
        month = this.convertMonthNameToNumberAndYear(month);
      }

      let data: any;
      if (document.getElementsByClassName('calendar-one')) {
        data = document!.getElementsByClassName('calendar-one')[0].textContent;
      }
      if (data) {
        data = this.convertMonthNameToNumberAndYear(data);
      }

      const date = this.getFirstAndLastDayOfMonth(data.month, data.year)
      this.initialDate = date.firstDay;
      this.finalDate = date.lastDay;
      const local = this.localSetor.map(e => e.id);

      if (local.length < 1) {
        this.dataFomat = false;
      } else {
        this.dataFomat = true;
        const data: IEnvioLocalSetor = {
          initialDate: this.initialDate,
          finalDate: this.finalDate,
          locaisSetoresIds: local
        }
        this.eventSrv.getAllEventByLocalSetor(data).subscribe({
          next: (data => {
            if (data) {
              this.spinnerView = false;
              this.listOfEvents = data;
              const mapedresult = this.listOfEvents.map((item: IEventoDetalhe) => this.convertObjectToEvent(item))
              this.initialEvents = mapedresult;
              this.totalElements = data?.length;
            }
          })
        })
      }
    } else {
      this.getAgendaEvento()
      this.eventSrv.listAllEvents(this.initialDate, this.finalDate).subscribe({
        next: (data) => {
          this.spinnerView = false;
          this.listOfEvents = data.content;
          this.paginator?.changePage(0);

          if (this.listOfEvents.length < 1) {
            this.monthOption = true;
          }
          this.totalElements = data?.length;
        }
      });
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
      this.eventSrv.listAllEvents(this.initialDate, this.finalDate).subscribe({
        next: (data) => {
          this.spinnerView = false;
          this.listOfEvents = data.content;
          this.paginator?.changePage(0);

          if (this.listOfEvents.length < 1) {
            this.monthOption = true;
          }
          this.totalElements = data?.length;
        }
      });
    } else {
      this.eventSrv.listAllEvents(this.initialDate, this.finalDate).subscribe({
        next: (data) => {
          this.spinnerView = false;
          this.listOfEvents = data.content;
          this.paginator?.changePage(0);

          if (this.listOfEvents.length < 1) {
            this.monthOption = true;
          }
          this.totalElements = data?.length;
        }
      });
    }
  }

  handleDateClick(selectInfo: any) {
    this.dayOption = false;
    this.monthOption = false;
    this.data = selectInfo.dateStr;
    const local = this.localSetor?.map((e: any) => e.id);
    const data: IEnvioLocalSetor = {
      data: this.data,
      locaisSetoresIds: local
    }
    this.eventSrv.getEventByClick(data).subscribe({
      next: ((data: any) => {
        this.listOfEvents = data;
        if (this.listOfEvents.length > 0) {
          this.spinnerView = false;
          this.totalElements = data?.length;
        } else {
          this.dayOption = true;
        }
      })
    })

  }

  convertMonthNameToNumberAndYear(input: string): { month: string; year: string } {
    const monthMap = {
      janeiro: '01',
      fevereiro: '02',
      março: '03',
      abril: '04',
      maio: '05',
      junho: '06',
      julho: '07',
      agosto: '08',
      setembro: '09',
      outubro: '10',
      novembro: '11',
      dezembro: '12',
    };

    let month = '00';
    let year = '';

    const yearMatch = input.match(/\d{4}/);
    if (yearMatch) {
      year = yearMatch[0];
    }

    for (const [key, value] of Object.entries(monthMap)) {
      if (input.includes(key)) {
        month = value;
        break;
      }
    }

    return { month, year };
  }

  converterFormatoData(dataFormatoOriginal: string) {
    var partesDaData = dataFormatoOriginal.split("-");
    var dataFormatoNovo = partesDaData[2] + "/" + partesDaData[1] + "/" + partesDaData[0];
    return dataFormatoNovo;
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
          this.allEventList = data;
          const mapedresult = this.allEventList.map((item: IEventoDetalhe) => this.convertObjectToEvent(item))
          this.initialEvents = mapedresult;
        })
      });
    }

    // return this.allEventList;
  }

  convertObjectToEvent(eventObject: IEventoDetalhe): EventInput {
    const colors = ["#4169E1", "#228B22", "##DAA520", "#F08080", "#FFD700"];
    const random = Math.floor(Math.random() * colors.length);
    return { id: eventObject.id.toString(), title: eventObject.nomeEvento, start: moment(eventObject.dataInicial).utc().format('YYYY-MM-DD'), end: moment(eventObject.dataFinal).utc().format('YYYY-MM-DD'), color: colors[random] }
  }
}
