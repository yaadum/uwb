import { HttpClient } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map } from "rxjs/operators";

// import { Batch } from "../model/batch.model";
// import { MasterMenuDataDefault } from "../modules/master/master-menu-default.model";
// import { MasterMenuDocType } from "../modules/master/master-menu-doctype.model";

import { InjectorInstance } from "./shared-injector.service";

// import { SyncUpdate } from "../modules/common/sync-update/sync-update.model";
// import { mapJsonToObject } from "../utils/json2object";

export class JsonReaderService {
  static getAppConfig(jsonFile: string): Observable<object> {
    const httpService = InjectorInstance.get<HttpClient>(HttpClient);

    return httpService.get(jsonFile).pipe(
      map(
        (response: any) => {
          const jsonStr: string = JSON.stringify(response.config);
          const jsonObj: object = JSON.parse(jsonStr);
          return jsonObj;
        },
        (error: any) => {
          console.log("Error in reading app config: ", JSON.stringify(error));
          return throwError("Error in getting app config file: " + jsonFile);
        }
      )
    );
  }

  // static getSyncUpdate(jsonFile: string): Observable<SyncUpdate[]> {
  //   const httpService = InjectorInstance.get<HttpClient>(HttpClient);

  //   return httpService.get(jsonFile).pipe(
  //     map(
  //       (response: any) => {
  //         const syncUpdate: SyncUpdate[] = mapJsonToObject(
  //           response,
  //           SyncUpdate
  //         );
  //         return syncUpdate;
  //       },
  //       (error: any) => {
  //         console.log("Error in getting sync Update: " + JSON.stringify(error));
  //         return throwError(error);
  //       }
  //     )
  //   );
  // }

  static getVersionInfo(jsonFile: string): Observable<object> {
    const httpService = InjectorInstance.get<HttpClient>(HttpClient);

    return httpService.get(jsonFile).pipe(
      map(
        (response: any) => {
          const jsonStr: string = JSON.stringify(response);
          const jsonObj: object = JSON.parse(jsonStr);
          return jsonObj;
        },
        (error: any) => {
          console.log(
            "Error in reading app version info: ",
            JSON.stringify(error)
          );
          return throwError("Error in getting app version info: " + jsonFile);
        }
      )
    );
  }

  // static getAclConfig(jsonFile: string): Observable<object> {
  //   const httpService = InjectorInstance.get<HttpClient>(HttpClient);

  //   return httpService.get(jsonFile).pipe(
  //     map(
  //       (response: any) => {
  //         const jsonStr: string = JSON.stringify(response["acls"]);
  //         const jsonObj: object = JSON.parse(jsonStr);
  //         return jsonObj;
  //       },
  //       (error: any) => {
  //         console.log("Error in reading acl config: ", JSON.stringify(error));
  //         return throwError("Error in getting acl config: " + jsonFile);
  //       }
  //     )
  //   );
  // }

  /*
  static getRecentUpdate(jsonFile: string): Observable<RecentUpdate[]> {
    const httpService = InjectorInstance.get<HttpClient>(HttpClient);

    return httpService.get(jsonFile).pipe(
      map(
        (response: any) => {
          const recentUpdate: RecentUpdate[] = mapJsonToObject(response['data'], RecentUpdate);
          return recentUpdate;
        },
        (error: any) => {
          console.log('Error in getting chart list: ', JSON.stringify(error));
          return throwError(error);
        }
      )
    );
  } */

  // static getMasterMenuDocType(
  //   jsonFile: string
  // ): Observable<MasterMenuDocType[]> {
  //   const httpService = InjectorInstance.get<HttpClient>(HttpClient);

  //   return httpService.get(jsonFile).pipe(
  //     map(
  //       (response: any) => {
  //         const masterMenuDoctype: MasterMenuDocType[] = mapJsonToObject(
  //           response,
  //           MasterMenuDocType
  //         );
  //         return masterMenuDoctype;
  //       },
  //       (error: any) => {
  //         console.log(
  //           "Error in getting master menu doctype: " + JSON.stringify(error)
  //         );
  //         return throwError(error);
  //       }
  //     )
  //   );
  // }

  // static getWebsiteMasterDefaultData(
  //   jsonFile: string
  // ): Observable<MasterMenuDataDefault[]> {
  //   const httpService = InjectorInstance.get<HttpClient>(HttpClient);

  //   return httpService.get(jsonFile).pipe(
  //     map(
  //       (response: any) => {
  //         const masterMenu: MasterMenuDataDefault[] = mapJsonToObject(
  //           response,
  //           MasterMenuDataDefault
  //         );
  //         return masterMenu;
  //       },
  //       (error: any) => {
  //         console.log("Error in getting master menu: " + JSON.stringify(error));
  //         return throwError(error);
  //       }
  //     )
  //   );
  // }

  // static getBatch(jsonFile: string): Observable<Batch[]> {
  //   const httpService = InjectorInstance.get<HttpClient>(HttpClient);

  //   return httpService.get(jsonFile).pipe(
  //     map(
  //       (response: any) => {
  //         const batch: Batch[] = mapJsonToObject(response["batch"], Batch);
  //         return batch;
  //       },
  //       (error: any) => {
  //         console.log("Error in getting batch list: " + JSON.stringify(error));
  //         return throwError(error);
  //       }
  //     )
  //   );
  // }
}
