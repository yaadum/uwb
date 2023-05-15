import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from 'src/app/modules/services/home.service';
import { ProductService } from 'src/app/modules/services/product.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TreeDataConverter2 } from './tree-data-converter';
import { RestApiService } from 'src/app/services/rest-api.service';
import { VyaConstant } from "src/app/utils/vya-constant";
import { SessionStore } from 'src/app/services/session.store';
import { RegisterService } from '../modules/services/register.service';
import { KeycloakService } from 'keycloak-angular';
import * as moment from 'moment';
import { KeycloakInitOptions } from 'keycloak-js';

@Component({
  selector: 'app-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.css']
})
export class DefaultLayoutComponent implements OnInit {

  submitted = false;
  companyName = "";

  newsLetterForm: FormGroup = new FormGroup({});
  notifyForm: FormGroup = new FormGroup({});
  aboutUs: any;
  companyLogo: string = "";
  socialNetwork: any[]= [];

  // route param
  shopName:any = "";

  // routeUrl
  whatWeDoUrl = "/what-we-do";
  menu:boolean=false;
  navbar:boolean=false;

  menuData: any[]= [];
  menuMaster: any[]= [];
  footer:any[]= [];
  footerMaster:any[]= [];
  cid:any;
  email: any;
  socialLink: any[]= [];
  address: string = '';  
  contactNo: string = "";

  // aanother
  companyProfile: any = {
   city: "N/A",
   mobile: "N/A",
   address: "N/A",
   email: "N/A",
 };
 contactNumber: string= "";
 CompanyEmail :string ="";
 whatsApp:string ="";
 cartLength: any = 0;

    //profile
    user:boolean=false;
    username:any;
    userEmail:any;
    userMobile:any;
    userRole:any;

    isLoggedIn = SessionStore.isUserLoggedIn();
    loginForm: FormGroup = new FormGroup({});
    myForm: FormGroup = new FormGroup({});
    userDetails: any = [];
    userprofile: any = [];
    userName: any;
    userRoles: any;
    loggedIn: any;
    registerForm: FormGroup = new FormGroup({});

  constructor(
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService,
    private router: Router,
    private productService: ProductService,
    private notificationService: NotificationService,
    protected readonly keycloak: KeycloakService,
    private restApi: RestApiService,
    private registerService: RegisterService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.intializeKeycloak()
    localStorage.setItem('shopName', location.href.split("/")[4]);
    this.shopName = localStorage.getItem('shopName')
    if(this.shopName.includes("#")){
      this.shopName =this.shopName.split("#")[0];
      localStorage.setItem('shopName', this.shopName);
    }
    this.cid = window.localStorage.getItem('cid');
    if(this.cid ===null){
      this.cid ="Web"
    }
    this.shopName = localStorage.getItem('shopName')
      this.companyInfo(this.shopName);
      this.getMenu(this.shopName);
      this.newsLetterForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]),
    });

    this.notifyForm = new FormGroup({
      mobile: new FormControl("", [Validators.required, Validators.pattern('[0-9_-]{10}')]),
    });

    if (this.shopName) {
      this.companyInfo(this.shopName);
    }

    if (this.activatedRoute.snapshot.paramMap.get("name")) {
      this.shopName = this.activatedRoute.snapshot.paramMap.get("name");
      this.companyInfo(this.shopName);
    }

    this.cartLength = localStorage.getItem('cartLength');
    if (this.shopName) {
      this.companyInfo(this.shopName);
    }

    if(SessionStore.getAccessToken() !== null){
      // this.getAllDetails();
      this.getUser();
      // this.calculateTotal();
    }
  }

  companyInfo(shopName: string) {
    this.homeService.getCompanyInfo(shopName).subscribe(
      (result: any) => {
        if (result) {
          const companyDetail = result.profile.docs[0];
          console.log(companyDetail)
          this.companyName = companyDetail.companyName || "";
          this.aboutUs = companyDetail.aboutUs || "N/A";
          this.companyLogo = companyDetail.logo || "N/A";
          this.socialNetwork = companyDetail.socialNetwork || "N/A";
          this.contactNo = companyDetail.contactNumber || "";
          this.address =companyDetail.address || "N/A";
          this.email =companyDetail.email || "N/A";
        }
        console.log(this.socialNetwork)
      },
      (error: any) => {
        console.log("Error in getting access data: " + JSON.stringify(error));
      }
    );
  }

  getMenu(shopName: string){
    this.productService.getMenu(shopName,this.cid).subscribe(
      (result: any) => {
        console.log(result,"menu")
        if(result.docs.length ===0){
          this.menu=true;
        }
        this.menuData = result.docs[0].nav;
        
        this.menuMaster = TreeDataConverter2.convert(this.menuData)["children"];
        this.footer=this.menuMaster.filter((item:any)=>  item.menu === "Footer");
        this.menuMaster=this.menuMaster.filter((item:any)=>  item.menu !== "Footer");
        // console.log(this.menuMaster,"menu2")
        // console.log(this.footer,"foot");
      },
      (error: any) => {
        console.log("Error in getting access data: " + JSON.stringify(error));
      }
    );
   }

  getUser(){
    this.restApi.getMyProfile().subscribe((resp: any) => {
      this.user =true
      // console.log(resp,"use")
      if (resp) {
        const UserDetail = resp.response.docs[0];
          this.userEmail =UserDetail.email;
          this.username =UserDetail.userName;
          this.userRole =UserDetail.access.role;
          this.userMobile=UserDetail.contact.mobile;
      } 
    });
  }

  onLoginNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
      // this.router.navigateByUrl("/site/" + this.shopName +"/login");
      const initOptions: KeycloakInitOptions = {
        redirectUri: window.location.origin + "/site/" + this.shopName,
        onLoad: 'login-required',
        checkLoginIframe: true,
        enableLogging:true
      }
      this.keycloak.login(initOptions);
    } else {
      this.router.navigateByUrl("/");
    }
  }


  intializeKeycloak(){
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve( this.keycloak
        .isLoggedIn()
        .then(result => {
          this.loggedIn = result;
          console.log(this.loggedIn,"agree");
          if (this.loggedIn) {
            if (SessionStore.getAccessToken() === null) {
              this.userName = this.keycloak.getUsername();
              this.userDetails = this.keycloak.loadUserProfile();
              this.userDetails = this.userDetails.__zone_symbol__value;
              if (!this.userDetails.attributes.mobile) {
                this.registerForm = this.formBuilder.group({
                  email: [this.userDetails.email],
                  userName: [this.userDetails.username],
                  password: [this.userDetails.username],
                  confirmPassword: [this.userDetails.username],
                  firstName: [this.userDetails.firstName],
                  lastName: [this.userDetails.lastName],
                  dob: [moment().format('MMMM Do YYYY')],
                  gender: ["default"],
                  mobile: [this.userDetails.username],
                  agree: [true]
                });
    
              }
              else {
                this.registerForm = this.formBuilder.group({
                  email: [this.userDetails.email],
                  userName: [this.userDetails.username],
                  password: [this.userDetails.username],
                  confirmPassword: [this.userDetails.username],
                  firstName: [this.userDetails.firstName],
                  lastName: [this.userDetails.lastName],
                  dob: [this.userDetails.attributes.dob[0]],
                  gender: [this.userDetails.attributes.gender[0]],
                  mobile: [this.userDetails.attributes.mobile[0]],
                  agree: [true]
                });
              }
    
              this.userprofile.agree = true;
              this.loginForm = this.formBuilder.group({
                email: [this.userDetails.email],
                password: [this.userDetails.username]
              });
              this.onSubmitKeycloak(this.loginForm.value);
              
              // console.log(this.userprofile, "log");
              // console.log(this.userName, "use");
            }
            else {
              console.log("user not logged in")
            }
          }
        })), 7000);
     
    });
   
  }

  onSubmitKeycloak(data: any) {
    // this.submitted = true;
    // const data: any = [];
    // data.email ="tam@gmail.com";
    // data.password="tamils";
    console.log(data);
    // this.restApiService.changeExistingPassword(data.email,data.password).subscribe(result: any) => {
    //   console.log(resp);
    //   if (resp) {
    //     console.log(resp);
    //   }
    // })
    this.restApi.changeExistingPassword(data.email, data.password).subscribe((result: any) => {
      this.setLoginSession2({
        access_token: result.jwt,
        refresh_token: result.refreshToken
      });
      this.setUserProfile(result.user.access);
      this.getUser();
    },
      (error) => {
        console.log('Login failed: ', JSON.stringify(error));
        this.registerService.register(this.registerForm.value, 'deverloper').subscribe((resp: any) => {
          console.log(resp);
          if (resp) {
            // const loginData = {
            //   email: data.email,
            //   password: data.password,
            // };
            // this.loginService.userLogin(loginData).subscribe((success) => {
            //   if (success) {
            //     localStorage.setItem('ACCESS_PRIVILEGE', 'Developer');
            //   }
            // });
            this.onSubmitKeycloak(this.loginForm.value);
            this.getUser();
            // this.notificationService.showSuccess("User created", "");
          } else {
            console.log('Error: please try again');
            // this.notificationService.showError("Registration not succesfull", "");
          }
        });
        // this.loginFailure = error["response"]["error"]["response"]["message"];
        return error;
      }
    );
  }

  private setLoginSession2(token: object) {
    localStorage.setItem(VyaConstant.loggedIn, 'true');
    localStorage.setItem(VyaConstant.loginUserToken, JSON.stringify(token));
    // let shopName = localStorage.getItem('shopName');
    // let url = window.location.origin;
    // window.location.href = url+"/site/"+shopName;
  }

  private setUserProfile(user: object) {
    localStorage.setItem(VyaConstant.loginUser, JSON.stringify(user));
  }

  logOut() {
    this.keycloak.logout();
    localStorage.removeItem(VyaConstant.loginUser);
    localStorage.removeItem(VyaConstant.loginUserToken);
    localStorage.removeItem(VyaConstant.loggedIn);

    // let url = window.location.origin;
    // window.location.href = url + "/site/" + this.shopName;
  }

  onHomeNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
      
      this.router.navigateByUrl("/site/" + this.shopName);
      this.navbar=false;
    } else {
      this.router.navigateByUrl("/");
    }
  }


  get f() {
    return this.newsLetterForm.controls;
  }

  onNotifySubmit(data: any) {
    console.log(data);
    this.submitted = true;
    if (this.notifyForm.invalid) {
      this.notificationService.showError("Error", "");
      return;
    }

    this.notificationService.showSuccess("Saved Successfully", "");
    console.log(data);

    const postData = Object.assign({}, data, {
      cName: this.shopName,
      pageUrl: window.location.href,
      site: window.location.href.split("/")[2],
    });
    this.homeService.notify(postData).subscribe((res)=>{
      if(res){
        this.notifyForm.reset();
      }
    });
  }

  onNewLetterSubmit(data: any) {
    this.submitted = true;

    if (this.newsLetterForm.invalid) {
      this.notificationService.showError("Error", "");
      return;
    }

    this.notificationService.showSuccess("Saved Successfully", "");

    console.log(data);
    const postData = Object.assign({}, data, {
      cName: this.shopName,
      pageUrl: window.location.href,
      site: window.location.href.split("/")[2],
    });
    this.homeService.notify(postData).subscribe((res)=>{
      if(res){
        this.newsLetterForm.reset();
      }
    })
  }
  // @ts-ignore

  onTermsNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
      this.router.navigateByUrl("/site/" + this.shopName + "/terms");
    } else {
      this.router.navigateByUrl("/terms");
    }
  }


  onHomeNav2(event: any, path: any,filter:any,category:any) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    })
    event.preventDefault();
    if (path === "") {
      
      this.router.navigateByUrl("/site/" + this.shopName);
    }
    else {
      if (this.shopName) {
        this.router.routeReuseStrategy.shouldReuseRoute = function() {
          return false;
      };
      this.router.navigate(['/site/' + this.shopName+ path], {
        queryParams: { 'params': filter , 'category': category},
      });
      } else {
        this.router.navigateByUrl("");
      }
    }
  }

  // @ts-ignore
  onWhatWeDoNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
      this.router.navigateByUrl("/site/" + this.shopName + "/what-we-do");
    } else {
      this.router.navigateByUrl("/what-we-do");
    }
  }
  // @ts-ignore
  onArchiveNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
      this.router.navigateByUrl("/site/" + this.shopName + "/archive");
    } else {
      this.router.navigateByUrl("/archive");
    }
  }
  // @ts-ignore
  onProductNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
      this.router.navigateByUrl("/site/" + this.shopName + "/product");
    } else {
      this.router.navigateByUrl("/archive");
    }
  }
  // @ts-ignore
  onContactNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
      
      this.router.navigateByUrl("/site/" + this.shopName + "/contact");
      this.navbar=false;
    } else {
      this.router.navigateByUrl("/about-us");
    }
  }

  onBlogNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
      
      this.router.navigateByUrl("/site/" + this.shopName + "/blog");
      this.navbar=false;
    } else {
      this.router.navigateByUrl("blog");
    }
  }

  onAboutNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
     
      this.router.navigateByUrl("/site/" + this.shopName + "/about");
      this.navbar=false;
    } else {
      this.router.navigateByUrl("/contact");
    }
  }
  onRoomNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
     
      this.router.navigateByUrl("/site/" + this.shopName + "/room");
      this.navbar=false;
    } else {
      this.router.navigateByUrl("/contact");
    }
  }
  onRestorantNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
     
      this.router.navigateByUrl("/site/" + this.shopName + "/resto");
      this.navbar=false;
    } else {
      this.router.navigateByUrl("/contact");
    }
  }
  onBlogsNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
     
      this.router.navigateByUrl("/site/" + this.shopName + "/blogs");
      this.navbar=false;
    } else {
      this.router.navigateByUrl("/contact");
    }
  }

  onCartNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
      // this.router.navigateByUrl("/site/" + this.shopName + "/cart");
      const initOptions: KeycloakInitOptions = {
        redirectUri: window.location.origin + "/site/" + this.shopName + "/cart",
        onLoad: 'login-required',
        checkLoginIframe: true,
        enableLogging:true
      }
      this.keycloak.login(initOptions);
    } else {
      this.router.navigateByUrl("/cart");
    }
  }

}



