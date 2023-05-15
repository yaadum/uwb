import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { VyaRestClientService } from 'vya-restclient';

@Injectable()
export class RestApiService {
  myProfileUrl = `/api/users/my-profile`;
  private readonly REFRESH_TOKEN = 'refresh_token';
  apiBaseUrl = environment.API_BASE_URL;

  logInUserUrl = `${this.apiBaseUrl}/api/lr/login/`;
  logOutUrl = `${this.apiBaseUrl}/api/lr/logout`;
  socialUrl =`${this.apiBaseUrl}/api/lr/register/socialLogin/user`;
  refreshTokenUrl = `${this.apiBaseUrl}/api/lr/refresh`;
  passChangeUrl = `${this.apiBaseUrl}/api/lr/login/getEmail`;
  constructor(public restClient: VyaRestClientService) {}

  getMyProfile(): Observable<any> {
    return this.restClient.get(`${this.myProfileUrl}`).pipe(
      map((value: any) => {
        return value;
      }),
      catchError((error) => {
        console.log(error);
        return of(false);
      })
    );
  }

  socialLoginRegister(data: any): Observable<any> {
    return this.restClient.post(`${this.socialUrl}`, data).pipe(
      map(
        (response: any) => {
          return response;
        },
        (error: any) => {
          console.log('Error in user registration: ', JSON.stringify(error));
          return error;
        }
      )
    );
  }

  login(data: any): Observable<any> {
    return this.restClient.post(`${this.logInUserUrl}`, data).pipe(
      map(
        (response: any) => {
          return response;
        },
        (error: any) => {
          console.log('Error in login: ', JSON.stringify(error));
          return error;
        }
      )
    );
  }

  logout(): Observable<any> {
    return this.restClient.post(`${this.logOutUrl}`, {
      refreshToken: this.getRefreshToken()
    }).pipe(
      map(
        (response: any) => {
          return response;
        },
        (error: any) => {
          console.log('Error in logout: ', JSON.stringify(error));
          return error;
        }
      )
    );
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  changeExistingPassword(email: any,password:any): Observable<any> {
    return this.restClient.get(`${this.passChangeUrl}/${email}/${password}`).pipe(
      map(
        (response: any) => {
          return response;
        },
        (error: any) => {
          console.log('Error in login: ', JSON.stringify(error));
          return error;
        }
      )
    );
      }
}
