import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { environment } from "src/environments/environment.prod";

// import { AclRepo } from "../acl-repo.store";
import { AppConfigStore } from "../app-config.store";
import { SessionStore } from "../session.store";

@Injectable()
export class AuthGuardService implements CanActivate {
  redirectCounterMax = 3;
  unauthorizedRedirectCounter = 0;

  loginPortalUrl: string = environment.loginPortal;

  constructor() {}

  isLoggedIn = SessionStore.isUserLoggedIn();
  // console.log('AuthGuard.canActivate:: isUserLoggedIn: ' + isLoggedIn);

  canActivate() {
    const isLoggedIn = SessionStore.isUserLoggedIn();
    // console.log('AuthGuard.canActivate:: isUserLoggedIn: ' + isLoggedIn);

    // if (!isLoggedIn) {
    //   window.location.href = this.loginPortalUrl;
    //   return false;
    // }

    const hasAccess = SessionStore.getAccessToken();

    if (hasAccess) {
      return true;
    } else {
      window.location.href = this.loginPortalUrl;
      return false;
    }
  }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   const isLoggedIn = SessionStore.isUserLoggedIn();
  //   // console.log('AuthGuard.canActivate:: isUserLoggedIn: ' + isLoggedIn);

  //   if (!isLoggedIn) {
  //     window.location.href = this.loginPortalUrl;
  //     return true;
  //   }

  //   // user logged-in
  //   const currentUserRole: string = SessionStore.getUserRole();
  //   const allowedPath: Array<string> = AclRepo.getPathAcl(currentUserRole);

  //   // if ( allowedPath === undefined || allowedPath.length ===0 || (!allowedPath.includes(currentPath))  ) {
  //   console.log(state.url);
  //   // console.log(allowedPath);
  //   if (!this.validatePathAcl(allowedPath, state.url)) {
  //     // role not authorised so redirect to unauthorized page
  //     console.log(
  //       "Your are not authorised to access this page 1",
  //       currentUserRole
  //     );
  //     if (
  //       route.data.unauthorizedRedirectPath !== undefined &&
  //       route.data.unauthorizedRedirectPath.length > 0 &&
  //       this.unauthorizedRedirectCounter < this.redirectCounterMax
  //     ) {
  //       this.router.navigate([route.data.unauthorizedRedirectPath]);
  //     } else {
  //       this.router.navigate(["/unauthorized"]);
  //     }
  //     return false;
  //   }

  //   this.unauthorizedRedirectCounter = 0;
  //   return true;
  // }

  // private validatePathAcl(
  //   allowedPath: Array<string>,
  //   reqPath: string
  // ): boolean {
  //   if (allowedPath === undefined) {
  //     this.unauthorizedRedirectCounter += 1;
  //     return false;
  //   }
  //   if (allowedPath.length === 0) {
  //     this.unauthorizedRedirectCounter += 1;
  //     return false;
  //   }

  //   if (
  //     allowedPath.length === 1 &&
  //     allowedPath.includes(AclRepo.PATH_WILD_CARD)
  //   ) {
  //     return true;
  //   }

  //   reqPath = reqPath.split("?")[0];
  //   reqPath = reqPath.replace(/\//gi, "_");
  //   reqPath = reqPath.toUpperCase();
  //   reqPath = AclRepo.PATH_PREFIX + reqPath;

  //   if (allowedPath.includes(reqPath)) {
  //     return true;
  //   }

  //   this.unauthorizedRedirectCounter += 1;
  //   return false;
  // }

  // // @ts-ignore TS6133
  // canActivateChild(
  //   childRoute: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ) {
  //   const isLoggedIn = SessionStore.isUserLoggedIn();
  //   // console.log('AuthGuard.canActivateChild:: isUserLoggedIn: ' + isLoggedIn);

  //   if (!isLoggedIn) {
  //     window.location.href = this.loginPortalUrl;
  //     return true;
  //   }

  //   // user logged-in
  //   const currentUserRole: string = SessionStore.getUserRole();
  //   const allowedPath: Array<string> = AclRepo.getPathAcl(currentUserRole);

  //   // 	console.log(allowedPath);
  //   // 	console.log(state.url);
  //   // if (allowedRoles === undefined || (allowedRoles && !allowedRoles.includes(currentUserRole))) {
  //   if (!this.validatePathAcl(allowedPath, state.url)) {
  //     // role not authorised so redirect to unauthorized page
  //     console.log(
  //       "Your are not authorised to access this page",
  //       currentUserRole
  //     );

  //     if (
  //       childRoute.data.unauthorizedRedirectPath !== undefined &&
  //       childRoute.data.unauthorizedRedirectPath.length > 0 &&
  //       this.unauthorizedRedirectCounter < this.redirectCounterMax
  //     ) {
  //       this.router.navigate([childRoute.data.unauthorizedRedirectPath]);
  //     } else {
  //       this.router.navigate(["/unauthorized"]);
  //     }
  //     return false;
  //   }

  //   this.unauthorizedRedirectCounter = 0;
  //   return true;
  // }
}
