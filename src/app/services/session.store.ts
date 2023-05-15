// @ts-ignore TS7016
import createStorageGuest from "cross-domain-storage/guest";
import { environment } from "src/environments/environment.prod";

import { VyaConstant } from "../utils/vya-constant";
// import { AppConfigStore } from "./app-config.store";
// import { JsonConvert } from "json2typescript";

export class SessionStore {
  private static guestLocalStorage = undefined;
  private static loginPortalUrl = "";
  private static isLoggedIn = false;
  private static loginUser: { [key: string]: any } = {};
  public static accessToken: string | undefined = undefined;
  private static refreshToken: string | undefined = undefined;

  constructor() {}

  static initialize() {
    SessionStore.loginPortalUrl = environment.loginPortal;
    const one = SessionStore.setupCrossDomainAccess();

    const two = one.then(() => {
      return SessionStore.loadIsLoggedIn();
    });

    const three = two.then(() => {
      return SessionStore.loadToken();
    });

    const four = three.then(() => {
      return SessionStore.loadLoginUser();
    });

    const five = four.then(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("SessionStore:: Initialization done");
          resolve(true);
        }, 1);
      });
    });

    return five;
  }

  private static setupCrossDomainAccess() {
    return new Promise((resolve) => {
      SessionStore.guestLocalStorage = createStorageGuest(
        SessionStore.loginPortalUrl
      );
      console.log("SessionStore:: Cross storage setup done");
      resolve(true);
    });
  }

  private static loadIsLoggedIn() {
    return new Promise((resolve) => {
      // @ts-ignore TS2532 (#29642)
      SessionStore.guestLocalStorage.get(
        VyaConstant.loggedIn,
        (error: any, value: any) => {
          if (value) {
            const parsedValue = JSON.parse(value);
            console.log(parsedValue);
            SessionStore.isLoggedIn = parsedValue;
          } else if (error) {
            console.error("Error: " + JSON.stringify(error));
          }
          console.log("SessionStore:: Loaded user logged data done");
          resolve(true);
        }
      );
    });
  }

  public static loadToken() {
    return new Promise((resolve) => {
      if (!SessionStore.isLoggedIn) {
        resolve(true);
      }
      // @ts-ignore TS2532 (#29642)
      SessionStore.guestLocalStorage.get(
        VyaConstant.loginUserToken,
        (error: any, value: any) => {
          if (value) {
            const parsedValue = JSON.parse(value);
            console.log(parsedValue);
            SessionStore.accessToken = parsedValue.access_token;
            SessionStore.refreshToken = parsedValue.refresh_token;
          } else if (error) {
            console.error("Error: " + JSON.stringify(error));
          }
          // console.log('SessionStore:: Loaded user token data done');
          resolve(true);
        }
      );
    });
  }

  private static loadLoginUser() {
    return new Promise((resolve) => {
      if (!SessionStore.isLoggedIn) {
        resolve(true);
      }
      // @ts-ignore TS2532 (#29642)
      SessionStore.guestLocalStorage.get(
        VyaConstant.loginUser,
        (error: any, value: any) => {
          if (value) {
            const parsedValue = JSON.parse(value);
            console.log(parsedValue)
            SessionStore.loginUser = parsedValue;
          } else if (error) {
            console.error("Error: " + JSON.stringify(error));
          }
          // console.log('SessionStore:: Loaded user profile data done');
          resolve(true);
        }
      );
    });
  }

  /*  static getSubscriptionCid(): string {
    const sub = SessionStore.loginUser['subscription'];
    if (sub && sub.length > 0) {
      return sub[0].cid;
    }

    return '';
  } */

  static getSubscriptionCid(): string {
    const access = SessionStore.loginUser;
    if (access) {
      return access.cid;
    }
    return "";
  }

  // static getSchoolName(): string {
  //   const access: { [key: string]: string } = SessionStore.loginUser["access"];
  //   if (access) {
  //     return access["schoolName"];
  //   }
  //   return "";
  // }

  static isUserLoggedIn(): boolean {
    return SessionStore.isLoggedIn;
  }

  static getAccessToken(): string | null {
    if (localStorage.getItem(VyaConstant.loginUserToken) === null) {
      return null;
    }
    let val: any = localStorage.getItem(VyaConstant.loginUserToken);
    val = JSON.parse(val);
    // console.log(val, "valll")
    // @ts-ignore TS2532 (#29642)
    return val.access_token;
  }

  static getRefreshToken(): string | undefined {
    return SessionStore.refreshToken;
  }

  static getUserProfile(): { [key: string]: any } {
    return SessionStore.loginUser;
  }

  static getCompanyName(): string {
    const access = SessionStore.loginUser;
    if (access) {
      return access.companyName;
    }
    return "";
  }

  static getUserRole(): string {
    //    const access: { [key: string]: string } = SessionStore.loginUser['access'];
    const access = SessionStore.loginUser;
    if (access) {
      return access.role;
    }
    return "";
  }
}
