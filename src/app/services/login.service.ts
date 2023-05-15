import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, mapTo, tap } from "rxjs/operators";
import { AppConfigStore } from "src/app/services/app-config.store";
import { Tokens } from "./auth/token";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private readonly JWT_TOKEN = "JWT_TOKEN";
  private readonly REFRESH_TOKEN = "REFRESH_TOKEN";
  loggedUser: any;

  constructor(private http: HttpClient) {}

  apiBaseUrl = AppConfigStore.getValue("apiConfig", "basicsApiUrl");

  logInUserUrl = `${this.apiBaseUrl}/api/lr/login`;
  logInAdminUrl = `${this.apiBaseUrl}/api/lr/login/admin`;
  logOutUrl = `${this.apiBaseUrl}/api/lr/logout`;
  refreshTokenUrl = `${this.apiBaseUrl}/api/lr/refresh`;

  adminLogin(data: any): Observable<any | boolean> {
    return this.http.post<any>(`${this.logInAdminUrl}`, data).pipe(
      tap((tokens) => this.doLoginUser(data.username, tokens)),
      mapTo(true),
      catchError((error: any) => {
        return error;
      })
    );
  }

  userLogin(data: any): Observable<any | boolean> {
    return this.http.post<any>(`${this.logInUserUrl}`, data).pipe(
      tap((tokens) => this.doLoginUser(data.username, tokens)),
      mapTo(true),
      catchError((error: any) => {
        return error;
      })
    );
  }

  logOut() {
    return this.http
      .post<any>(`${this.logOutUrl}`, {
        refreshToken: this.getRefreshToken(),
      })
      .pipe(
        tap(() => this.doLogoutUser()),
        mapTo(true),
        catchError((error) => {
          return error;
        })
      );
  }

  refreshToken() {
    return this.http
      .post<any>(this.refreshTokenUrl, {
        refreshToken: this.getRefreshToken(),
      })
      .pipe(
        tap((tokens: Tokens) => {
          this.storeJwtToken(tokens.jwt);
        })
      );
  }

  private doLoginUser(username: string, tokens: Tokens) {
    this.loggedUser = username;
    this.storeTokens(tokens);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}
