import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { TokenStorageService } from './token.service';
import { AuthService } from './auth.service';
import { VyaConstant } from 'src/app/utils/vya-constant';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  guestLocalStorage = undefined;
  cookieValue: any;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private tokenService: TokenStorageService, 
    private authService: AuthService, 
    private cookieService: CookieService
  ) { 
    this.cookieValue = this.cookieService.get(VyaConstant.loginUserToken) || "";
    if(this.cookieValue !== "") {
      localStorage.setItem(VyaConstant.loggedIn, 'true');
      localStorage.setItem(VyaConstant.loginUserToken,this.cookieValue);
      
      localStorage.setItem(VyaConstant.loginUser, this.cookieService.get(VyaConstant.loginUser));

      this.cookieService.delete(VyaConstant.loginUserToken, '/', 'inevito.com');
      this.cookieService.delete(VyaConstant.loginUser, '/', 'inevito.com');
      this.cookieService.delete(VyaConstant.loggedIn, '/', 'inevito.com');
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = req;
    const token = this.tokenService.getToken();

    if (token != null) {
      authReq = this.addTokenHeader(req,token);
    }

    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(authReq, next);
      }

      return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.tokenService.getRefreshToken();

      if (token) 
        return this.authService.refreshToken(token).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.tokenService.saveToken(token);
            this.refreshTokenSubject.next(token.jwt);
            
            return next.handle(this.addTokenHeader(request, token.jwt));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            
            this.tokenService.signOut();
            return throwError(err);
          })
        );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    request.headers.set('Content-Type', 'application/json');
    request.headers.set('Accept', 'application/json');
    return request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];