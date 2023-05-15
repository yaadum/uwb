import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../services/home.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notification.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  myForm: FormGroup = new FormGroup({});
  shopName: any = "";
  bannerTitle = "";
  socialNetwork: any[] = [];
  companyLogo: string = "";
  companyProfile: any = {
    city: "N/A",
    mobile: "N/A",
    address: "N/A",
    email: "N/A",
  };
  
  contactNumber: string = "";
  CompanyEmail: string = "";
  address: string = "";
  aboutUs: string = "";
  whatsApp: string = "";
  socialLink: any[] = [];

  serviceList: any[] = [];
  item: any = "service";

  bannerLIst: any[] = [];
  item3: any = "banner";
  limit:any="26";

  cid: any;
  menu: boolean = false;
  menuData: any[] = [];
  menuMaster: any[] = [];
  footer: any[] = [];
  footerMaster: any[] = [];
  menuJson: any = [];
  title1: any;
  title2: any;

  companyName = "";
  contactNo: string = "";
  email: string = "";
  id: any = '';
  submitted = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService,
    private router: Router,
    private notificationService: NotificationService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      console.log('params', params);
    });
    
    this.shopName = localStorage.getItem('shopName');

    this.getServicesByShop(this.shopName, this.item, this.limit);
    this.companyInfo(this.shopName);

    if (this.shopName) {
      this.companyInfo(this.shopName);
    }

    this.myForm = new FormGroup({
      emails: new FormControl("", Validators.required),
      name: new FormControl("", Validators.required), 
      subject: new FormControl(this.id),
      message: new FormControl("", Validators.required),
    });
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

  onContactNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
      this.router.navigateByUrl("/site/" + this.shopName + "/contact");
    } else {
      this.router.navigateByUrl("/contact");
    }
  }

  get f() {
    return this.myForm.controls;
  }



  onFormSubmit(data: any) {
    this.submitted = true;

    const postData = Object.assign({}, data, {
      cName: this.shopName,
      pageUrl: window.location.href,
      site: window.location.href.split("/")[2],
    });

    if (this.myForm.invalid) {
      this.notificationService.showWarning("Fill all the required fields", "");
    }
    if(this.myForm.valid){
    this.homeService.contactUs(postData).subscribe((res)=>{
      if(res){
        this.router.navigateByUrl("/site/" + this.shopName + "/contact");
        this.notificationService.showSuccess("Successfully send...", "")
      }else{
        this.notificationService.showError("Something went wrong. Try again later...", "");
      }
    });
  }
  }

  getServicesByShop(shopName: string, item: string, limit: string) {
    const services: any = [];

    this.homeService.getBlog(shopName, item, limit).subscribe(
      (resp: any) => {
        if (resp) {
          // console.log(resp, "blog")
          resp.rows.forEach((value: any, i: any) => {
            // if (value) {
              services.push({
                _id: value.doc._id,
              docType: value.doc.docType,
              title: value.doc.title,
              order: value.doc.order,
              imageLocation: value.doc.imageLocation,
              imageUpload: value.doc.imageUpload,
              shortDescription: value.doc.shortDescription,
              longDescription: value.doc.longDescription,
              category: value.doc.category,
              createdOn: value.doc.createdOn,
              moreImages: value.doc.moreImages,
              });
            // }

          });
          services.sort((a: any, b: any) => Number(a.order) - Number(b.order));
          this.serviceList = services;
          console.log(this.serviceList, "service")
        }
      }
    );
  }
  


}
