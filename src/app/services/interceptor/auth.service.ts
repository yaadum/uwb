import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { VyaRestClientService } from 'vya-restclient';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiBaseUrl = environment.API_BASE_URL;

  constructor(
    private restClient: VyaRestClientService
  ) { }

  refreshToken(token: string) {
    return this.restClient.post(`${this.apiBaseUrl}/api/lr/refresh`, {
      refreshToken: token
    }).pipe(
      map((value: any) => {
        return value;
      },
      (error: any) => {
        console.log('Error in login: ', JSON.stringify(error));
        return error;
      })
    );
  }
}