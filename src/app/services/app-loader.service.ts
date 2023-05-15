import { Injectable } from "@angular/core";

// import { NgxPermissionsService, NgxRolesService } from "ngx-permissions";

// import { AclRepo } from "./acl-repo.store";
import { AppConfigStore } from "./app-config.store";

import { JsonReaderService } from "./json-reader.service";
import { SessionStore } from "./session.store";

@Injectable()
export class AppLoaderService {
  constructor() {}

  initializeApp(): Promise<any> {
    const one = this.loadAppConfig();

    const two = one.then(() => {
      return this.loadAppVersionInfo();
    });

    const three = two.then(() => {
      return this.initSessionStore();
    });

    // const four = three.then(() => {
    //   return this.loadAclConfig();
    // });

    // const five = four.then(() => {
    //   return this.initAclRepoStore();
    // });

    const four = three.then(() => {
      return new Promise((resolve) => {
        console.log("AppLoaderService:: App Initialization done");
        resolve(true);
      });
    });

    return four;
  }

  loadAppConfig() {
    return new Promise((resolve) => {
      JsonReaderService.getAppConfig(
        "./assets/config/app-config.json"
      ).subscribe((data) => {
        AppConfigStore.setConfig(data);
        // console.log('AppLoaderService:: App configuration loaded');
        resolve(true);
      });
    });
  }

  loadAppVersionInfo() {
    return new Promise((resolve) => {
      JsonReaderService.getVersionInfo(
        "./assets/config/version-info.json"
      ).subscribe((data) => {
        AppConfigStore.setVersionInfo(data);
        // console.log('AppLoaderService:: App version info loaded');
        resolve(true);
      });
    });
  }

  initSessionStore() {
    const one = SessionStore.initialize();

    const two = one.then(() => {
      return new Promise((resolve) => {
        // console.log('AppLoaderService:: Session storage loaded');
        resolve(true);
      });
    });

    return two;
  }

  // loadAclConfig() {
  //   return new Promise((resolve) => {
  //     if (!SessionStore.isUserLoggedIn()) {
  //       resolve(true);
  //     }
  //     JsonReaderService.getAclConfig(
  //       "./assets/config/acl-config.json"
  //     ).subscribe((data) => {
  //       AclRepo.setConfig(data);
  //       // console.log('AppLoaderService:: ACL config loaded');
  //       resolve(true);
  //     });
  //   });
  // }

  // initAclRepoStore() {
  //   return new Promise((resolve) => {
  //     if (!SessionStore.isUserLoggedIn()) {
  //       resolve(true);
  //     }

  //     const userRole: string = SessionStore.getUserRole();
  //     const userAcl: any = AclRepo.getPermissionAcl(userRole);
  //     this.permissionsService.loadPermissions(userAcl);
  //     this.rolesService.addRole(userRole, userAcl);
  //     // console.log('AppLoaderService:: AclRepo store configured');
  //     resolve(true);
  //   });
  // }
}
