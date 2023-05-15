import { Injectable } from '@angular/core';
import { VyaConstant } from 'src/app/utils/vya-constant';

@Injectable({
  providedIn: 'root'
})

export class TokenStorageService {

  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: any): void {
    let tokenValue  = {
      access_token: token.jwt,
      refresh_token: token.refreshToken
    };

    localStorage.setItem(VyaConstant.loginUserToken, JSON.stringify(tokenValue));
  }

  public getToken() {
    if (localStorage.getItem(VyaConstant.loginUserToken) === null) {
      return null;
    }
    let val: any = localStorage.getItem(VyaConstant.loginUserToken);
    val = JSON.parse(val);
    // @ts-ignore TS2532 (#29642)
    return val.access_token;
  }

  public saveRefreshToken(token: any): void {
    let tokenValue  = {
      access_token: token.jwt,
      refresh_token: token.refreshToken
    };

    localStorage.setItem(VyaConstant.loginUserToken, JSON.stringify(tokenValue));
  }

  public getRefreshToken(): string | null {
    if (localStorage.getItem(VyaConstant.loginUserToken) === null) {
      return null;
    }
    let val: any = localStorage.getItem(VyaConstant.loginUserToken);
    val = JSON.parse(val);
    // @ts-ignore TS2532 (#29642)
    return val.refresh_token;
  }

  public saveUser(user: any): void {
    localStorage.setItem(VyaConstant.loginUser, JSON.stringify(user));
  }

  public getUser(): any {
    return localStorage.getItem(VyaConstant.loginUser);
  }
}