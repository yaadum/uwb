import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulesRoutingModule } from './modules-routing.module';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { BlogsComponent } from './blogs/blogs.component';
import { RestorantComponent } from './restorant/restorant.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ContactComponent } from './contact/contact.component';

import { CarouselModule } from 'ngx-bootstrap/carousel';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { LightboxModule } from 'ngx-lightbox';
import {NgxTinySliderModule} from 'ngx-tiny-slider';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from './cart/cart.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { NotificationService } from 'src/app/services/notification.service';

@NgModule({
  declarations: [
    AboutComponent,
    HomeComponent,
    BlogsComponent,
    RestorantComponent,
    RoomsComponent,
    ContactComponent,
    LoginComponent,
    CartComponent,
  ],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    CarouselModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(),
    LightboxModule,
    NgxTinySliderModule,
    
    HttpClientModule,
    NgxPayPalModule
  ],
  providers: [ NotificationService
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeKeycloak,
    //   multi: true,
    //   deps: [KeycloakService]
    // }
  ],
  exports: [HomeComponent],
})
export class ModulesModule { }
