import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { LoginService } from '../services/login.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private loginService: LoginService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request: HttpRequest<any> = req;

    const token = {
      token: this.loginService.getAuthorizationToken()
  };

  if (token) {
    request = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token.token}`)
    });
  }

    return next.handle(request);
  }
}
