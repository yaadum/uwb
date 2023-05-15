import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

import { filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Platform } from '@angular/cdk/platform';
import { HomeService } from './modules/services/home.service';

@Component({
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit  {
  
  title = environment.appName;
  cName: any = localStorage.setItem('shopName', window.location.href.split("/")[4]);
  shopName: any;
  metaTag: any;
  metaName: any[] = [];
  url:any =window.location.origin.split("/")[2];
  // url: any = "shop.balajihardwares.in";
  metaProperty:any
  isBrowser:any;
  isOnline: boolean;
  modalVersion: boolean;
  modalPwaEvent: any;
  modalPwaPlatform: string|undefined;

  constructor(private titleService: Title,private router: Router, private platform: Platform,private meta: Meta,private swUpdate: SwUpdate, private homeService: HomeService,){
    this.isOnline = false;
    this.modalVersion = false;
    this.homeService.getUrlMapper(this.url).subscribe(
      (result: any) => {
        if (result) {
          const urlMapper: any = result.response.docs[0];
          const shopName: any = urlMapper.cName
          const cid:any =urlMapper.cid.charAt(0).toUpperCase()+urlMapper.cid.slice(1);
          localStorage.setItem('cid', cid);
          localStorage.setItem('shopName', shopName);
          this.shopName = window.localStorage.getItem('shopName');
          this.homeService.getCompanyInfo(this.shopName).subscribe(
            (result: any) => {
              console.log(result, "cpmpany")
              if (result) {
                const companyDetail = result.profile.docs[0];
                this.metaTag = JSON.parse(companyDetail.seoTag);
                this.metaName = this.metaTag.Name;
                this.metaProperty = this.metaTag.Property
                console.log(this.metaName);

              }
              this.shopName = this.shopName.replace(/-/g, " ");
              this.shopName = this.shopName.charAt(0).toUpperCase() + this.shopName.slice(1)
              // const appTitle = this.titleService.getTitle();
              this.titleService.setTitle(this.shopName +"-Shop by Inevito");
              // this.router
              //   .events.pipe(
              //     filter(event => event instanceof NavigationEnd),
              //     map(() => {
              //       let child: any = this.activatedRoute.firstChild;
              //       while (child.firstChild) {
              //         child = child.firstChild;
              //       }
              //       if (child.snapshot.data['title']) {
              //         return this.shopName + "-" + child.snapshot.data['title'];
              //       }
              //       return this.shopName + "-" + appTitle;
              //     })
              //   ).subscribe((ttl: string) => {
                  
              //   });
              this.updateDescription();
            },
            (error: any) => {
              console.log("Error in getting access data: " + JSON.stringify(error));
            }
          );
        }
      })
  }
  ngOnInit(){
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter((evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map((evt: any) => {
          console.info(`currentVersion=[${evt.currentVersion} | latestVersion=[${evt.latestVersion}]`);
          this.modalVersion = true;
        }),
      );
    }

    this.loadModalPwa();
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    AOS.init();
    }

    updateDescription() {
      this.metaName.forEach((meta: any) => {
        this.meta.addTag({ name: meta.key, content: meta.value });
      })
      this.metaProperty.forEach((meta: any) => {
        this.meta.addTag({ property: meta.key, content: meta.value });
      })
    }
  
    // private updateOnlineStatus(): void {
    //   this.isOnline = window.navigator.onLine;
    //   console.info(`isOnline=[${this.isOnline}]`);
    // }
  
    public updateVersion(): void {
      this.modalVersion = false;
      window.location.reload();
    }
  
    public closeVersion(): void {
      this.modalVersion = false;
    }
  
    private loadModalPwa(): void {
      if (this.platform.ANDROID) {
        window.addEventListener('beforeinstallprompt', (event: any) => {
          event.preventDefault();
          this.modalPwaEvent = event;
          this.modalPwaPlatform = 'ANDROID';
          setTimeout(() => {
            this.modalPwaEvent.prompt();
          }, 3000);
        });
      }
  
      if (this.platform.IOS && this.platform.SAFARI) {
        const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
        if (!isInStandaloneMode) {
          this.modalPwaPlatform = 'IOS';
          setTimeout(() => {
            this.modalPwaEvent.prompt();
          }, 3000);
        }
      }
    }
  
    public addToHomeScreen(): void {
      this.modalPwaEvent.prompt();
      this.modalPwaPlatform = undefined;
    }
  
    public closePwa(): void {
      this.modalPwaPlatform = undefined;
    }
  
}
