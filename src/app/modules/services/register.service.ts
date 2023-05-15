import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  apiBaseUrl = environment.API_BASE_URL;

  companyRegisterUrl = `${this.apiBaseUrl}/api/lr/register/company`;
  developerRegisterUrl = `${this.apiBaseUrl}/api/lr/register/user`;

  // To Registser a company
  register(data: any, urlFlag: string): Observable<any | boolean> {
    // Decide By urlFlag
    const url = urlFlag === 'company' ? this.companyRegisterUrl : this.developerRegisterUrl;
    return this.http.post<any>(`${url}`, data).pipe(
      map((value: any) => {
        if (value && value.status) {
          return value.status;
        } else {
          return value;
        }
      }),
      catchError((error) => {
        return error;
      })
    );
  }

}
