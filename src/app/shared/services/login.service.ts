import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ICampoEclesiastico } from '../interfaces/ICampoEclesiastico';
import { ILogin } from '../interfaces/ILogin';
import { IPage } from '../interfaces/Ipage';
import { Observable } from 'rxjs';
import { ISetor } from '../interfaces/ISetor';
import { IChangePass } from './IChangePass';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) {

  }

  async getAll() {
    const result = await this.http.get<IPage<ICampoEclesiastico>>(`${environment.url}/campoEclesiastico/findAll`).toPromise();
    return result;
  }

  async authenticate(login: ILogin) {
    return await this.http.post<any>(`${environment.url}/autenticacao/autenticar`, login).toPromise();
    // console.log(result);

  }

  getAuthorizationToken(): string {
    const token = window.localStorage.getItem('token');
    return token!;
  }

  async tokenIsValid(token: string) {
    const queryParams = new HttpParams().append('token', token);
    return await this.http.post<boolean>(`${environment.url}/autenticacao/validar`, '', { params: queryParams }).toPromise();
  }

  async logoff(): Promise<void> {
    window.localStorage.clear()

    setTimeout(() => {
      document.location.reload()
    }, 500);
  }

  async forgotPassword(login: ILogin) {
    const result = await this.http.post<any>(`${environment.url}/autenticacao/forgotPassword`, login).toPromise()
  }

  async changePassword(change: IChangePass) {
    const result = await this.http.post<IChangePass>(`${environment.url}/autenticacao/changePassword`, change).toPromise();
  }

  getLocalSetorSecretario(idSetor: number): Observable<IPage<any>>{
    return this.http.get<IPage<any>>(`${environment.url}/localsetor/getLocalSetorSecretario/${idSetor}`)
  }

  async findLocalSetor(id: number) {
    const result = this.http.get<ISetor>(`${environment.url}/localsetor/findById/${id}`).toPromise();
    return result;
  }
}
