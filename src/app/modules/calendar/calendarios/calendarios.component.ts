import { Component } from '@angular/core';

@Component({
  selector: 'app-calendarios',
  templateUrl: './calendarios.component.html',
  styleUrls: ['./calendarios.component.scss']
})
export class CalendariosComponent {

  monthsBR: any;
  // ano!: any;
  now = new Date();
  mes = this.now.getMonth();
  ano = this.now.getFullYear();

  getDaysCalendar(mes: number, ano: number) {
    document.getElementById('mes')!.innerHTML = this.monthsBR[mes];
    document.getElementById('ano')!.innerHTML = String(ano);

    const tableDays = document.getElementById('dias')!;

    let firstDayOfWeek = new Date(ano, mes, 1).getDay()-1;

    let getLastDayThisMonth = new Date(ano,mes+1,0).getDate();

    for (var i = -firstDayOfWeek,index = 0; i < (42-firstDayOfWeek); i++, index++) {
      let dt = new Date(ano, mes, i);
      let dtNow = new Date();
      // console.log(index);

      var dayTable = tableDays!.getElementsByTagName('td')[index];

      if(dayTable){
        dayTable.innerHTML = dt.getDate()!.toString()!;

        dayTable.classList.remove('mes-anterior');
        dayTable.classList.remove('proximo-mes');
        dayTable.classList.remove('dia-atual');

        if (dt.getFullYear() == dtNow.getFullYear() && dt.getMonth() == dtNow.getMonth() && dt.getDate() == dtNow.getDate()) {
          dayTable!.classList.add('dia-atual')
        }
        if (i < 1) {
          dayTable!.classList.add('mes-anterior')
        }

        if (i > getLastDayThisMonth) {
          dayTable!.classList.add('proximo-mes')
        }
      }

    }
  }

  constructor() {
    this.monthsBR = ['JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO',
      'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'];
  }

  ngOnInit(): void {
    let now = new Date();
    let mes = now.getMonth();
    let ano = now.getFullYear();
    this.getDaysCalendar(mes, ano);
  }

  proximoMes() {
    this.mes++;

    if (this.mes > 11) {
      this.mes = 0;
      this.ano++;
    }

    this.getDaysCalendar(this.mes, this.ano)
  }

  mesAnterior() {
    this.mes--;
    if (this.mes < 0) {
      this.mes = 11;
      this.ano--;
    }

    this.getDaysCalendar(this.mes, this.ano)
  }
}
