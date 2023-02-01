import { Component } from '@angular/core';

@Component({
  selector: 'app-calendarios',
  templateUrl: './calendarios.component.html',
  styleUrls: ['./calendarios.component.scss']
})
export class CalendariosComponent {

  monthsBR: any;
  ano!: any;

  getDaysCalendar(mes: number, ano: number) {
    document.getElementById('mes')!.innerHTML = this.monthsBR[mes];
    document.getElementById('ano')!.innerHTML = ano.toString();

    const tableDays = document.getElementById('dias')!;
    // console.log(tableDays);

    let firstDayOfWeek = new Date(ano, mes, 1).getDay()-1;
    console.log(firstDayOfWeek);

    let getLastDayThisMonth = new Date(ano,mes+1,0).getDate();

    for (var i = -firstDayOfWeek; i < (42-firstDayOfWeek); i++) {
      let dt = new Date(ano, mes, i);
      let dtNow = new Date();
      let dayTable = tableDays!.getElementsByTagName('td')[i];
      console.log(dayTable);
      dayTable.innerHTML = dt.getDate()!.toString()!;
      // dayTable.classList.remove('mes-anterior');
      // dayTable.classList.remove('proximo-mes');
      // dayTable.classList.remove('dia-atual');

      // if (dt.getFullYear() == dtNow.getFullYear() && dt.getMonth() == dtNow.getMonth() && dt.getDate() == dtNow.getDate()) {
      //   dayTable!.classList.add('dia-atual')
      // }
      // if (i < 1) {
      //   dayTable!.classList.add('mes-anterior')
      // }

      // if (i > getLastDayThisMonth) {
      //   dayTable!.classList.add('proximo-mes')
      // }
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
    let now = new Date();
    let mes = now.getMonth();
    let ano = now.getFullYear();
    const botao_proximo = document.getElementById('btn_prev');
    mes++;
    if (mes > 11) {
      mes = 0;
      ano++;
    }
    this.getDaysCalendar(mes, ano)
  }

  mesAnterior() {
    let now = new Date();
    let mes = now.getMonth();
    let ano = now.getFullYear();
    const botao_anterior = document.getElementById('btn_ant');
    mes--;
    if (mes > 0) {
      mes = 11;
      ano++;
    }
    this.getDaysCalendar(mes, ano)
  }

}
