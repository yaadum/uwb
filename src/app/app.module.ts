import { Injector, NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { VyaRestClientModule, VyaRestClientService } from 'vya-restclient';
import { AppLoaderService } from './services/app-loader.service';
import { RestConfigStore } from './services/rest-config.store';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LightboxModule } from "ngx-lightbox";
import {NgxTinySliderModule} from 'ngx-tiny-slider';
import { HttpClientModule } from '@angular/common/http';
import { RestApiService } from './services/rest-api.service';
import { NgxPayPalModule } from 'ngx-paypal';
import { CookieService } from 'ngx-cookie-service';
import { authInterceptorProviders } from './services/interceptor/auth.interceptor';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { SharedInjector } from './services/shared-injector.service';
import { AuthGuardService } from './services/auth/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    CarouselModule.forRoot(),
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgxTinySliderModule,
    LightboxModule,
    HttpClientModule,
    NgxPayPalModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserTransferStateModule,
    KeycloakAngularModule,
    VyaRestClientModule.forRoot({
      clientConfig: {
        provide: "VYA_REST_PARAM_STORE",
        useFactory: RestConfigStoreFactory,
        deps: [AppLoaderService],
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    SwUpdate,
    VyaRestClientService, 
    AppLoaderService, 
    ToastrService, 
    RestApiService,
    CookieService,
    authInterceptorProviders,
    KeycloakService,
    SharedInjector,
    AuthGuardService,
  ],
  bootstrap: [AppComponent]
})


export class AppModule {
  constructor(private injector: Injector, keycloak: KeycloakService) {
    SharedInjector.set(this.injector);
    keycloak.init({
      config: {
      url: 'https://elogin.inevito.com/auth/',
      realm: 'tasks',
      clientId: 'Dailyshop',
      },
      bearerExcludedUrls: ['/assets', '/clients/public'],
      loadUserProfileAtStartUp: true,
      initOptions: {
          // onLoad: 'login-required',
          // checkLoginIframe: true
        // onLoad: 'check-sso',
        // silentCheckSsoRedirectUri:
        //   window.location.origin + '/assets/silent-check-sso.html'
      }
    });
  }
 }

export function RestConfigStoreFactory() {
  return new RestConfigStore();
}
