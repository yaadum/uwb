import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { NotificationService } from 'src/app/services/notification.service';
import { NotificationService } from '../../services/notification.service';
import { RestApiService } from '../../services/rest-api.service';
import { HomeService } from '../services/home.service';
import { SessionStore } from 'src/app/services/session.store';
import { VyaConstant } from 'src/app/utils/vya-constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});
  loginFailure: string | undefined = undefined;
  submitted = false;
  requestedData: any = [];
  storageHost: any;
  shopName: any;
  username:any;

  item2 = "Banner";
  galleryList: any[] = [];
  limit = '20';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private homeService: HomeService,
    private restApiService: RestApiService
  ) { }

  ngOnInit(): void {
    this.shopName = localStorage.getItem('shopName')
    this.getGalleryByShop(this.shopName,this.item2 ,this.limit);

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]],
      password: ['', Validators.required]
    });
  }

  onCancel() {
    console.log('canceled');
  }

  get f() {
    return this.loginForm.controls;
  }

  forgotPassword() {
    this.router.navigate(['/password/forgot-password']);
  }

  onSubmit(data: any) {
    this.submitted = true;
    // console.log(data);

    if (this.loginForm.invalid) {
      return;
    }

    this.restApiService.login(data).subscribe(
      (result: any) => {
        if(result.success ||result.err)
        {
          this.notificationService.showError("Login not sucessfull", "");
        }
        else{ 
          this.restApiService.getMyProfile().subscribe((resp: any) => {
            console.log(resp,"use")
            if (resp) {    
          //     const UserDetail = resp.response.docs[0];
          //       this.username =UserDetail.userName;
          //   }
            this.notificationService.showSuccess("Welcome " +this.username, "");  
          }});
          this.setLoginSession({
            access_token: result.jwt,
            refresh_token: result.refreshToken
          });
          this.setUserProfile(result.user.access);
          
        }
        },
       

      (error) => {
        console.log('Login failed: ', JSON.stringify(error));
        // this.loginFailure = error["response"]["error"]["response"]["message"];
        return error;
      }
    );
  }

  private setLoginSession(token: object) {
    localStorage.setItem(VyaConstant.loggedIn, 'true');
    localStorage.setItem(VyaConstant.loginUserToken, JSON.stringify(token));
    let shopName = localStorage.getItem('shopName');
    let url = window.location.origin;
    window.location.href = url+"/site/"+shopName;
  }

  private setUserProfile(user: object) {
    localStorage.setItem(VyaConstant.loginUser, JSON.stringify(user));
  }

  getGalleryByShop(shopName: string, item: string, limit: string) {
    const gallery: any[] = [];
    this.homeService.getBanner(shopName, item, limit).subscribe((resp: any) => {
      resp.rows.forEach((value: any) => {
        gallery.push({
          image: value.doc.productImage[0],
          order: value.doc.order,
          thumbImage: value.doc.productImage,
          title: value.doc.title,
          alt: value.doc.title,
          galleryGroup: value.doc.group
        });
      });
      gallery.sort((a: any, b: any) => Number(a.order) - Number(b.order));
     
      this.galleryList = gallery;
      this.galleryList=this.galleryList.filter((item:any)=>  item.galleryGroup=== "Banner");
      console.log(this.galleryList,"banner")
      });
    }

    onRegNav(event: any) {
      event.preventDefault();
      if (this.shopName) {
        this.router.navigateByUrl("/site/" + this.shopName + "/register");
      } else {
        this.router.navigateByUrl("/register");
      }
    }
  
    onIndexNav(event: any) {
      event.preventDefault();
      if (this.shopName) {
        this.router.navigateByUrl("/site/" + this.shopName);
      } else {
        this.router.navigateByUrl("/");
      }
    }

}
