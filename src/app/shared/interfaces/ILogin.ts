import { ICampoEclesiastico } from "./ICampoEclesiastico";

export interface ILogin {
  login: string;
  senha: string;
  campoEclesiastico: ICampoEclesiastico;
}
