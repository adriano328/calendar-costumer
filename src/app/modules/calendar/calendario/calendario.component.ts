import { Component } from '@angular/core';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent {

  meses: string[] = [];
  listaNumeros: any;
  diasDoMes!: number;
  constructor() {
    this.meses = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro'
    ]
  }

  ngOnInit(): void {
    this.pegarDia();
  }

  diasNoMes(mes: number, ano: number) {
    return new Date(ano, mes, 0).getDate();
  }

  pegarDia() {
    let date = new Date();
    let mes = date.getMonth() + 1;
    let ano = date.getFullYear();
    this.diasDoMes = this.diasNoMes(mes, ano);
    this.listaNumeros = Array(this.diasDoMes).map((i) => i);
  }
}
