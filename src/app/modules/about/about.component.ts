import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { HomeService } from '../services/home.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';
import { TreeDataConverter2 } from 'src/app/default-layout/tree-data-converter';
import { Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  navbar:boolean=false;
  socialLink: any[] = [];
  companyTitle = "";
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

  productData: any[] = [];
  shopName: any = '';
  shopData: any[] = [];

  cartLength = 0;
  showCart = false;
  cartArray: any = [];
  alertMsg: boolean | undefined = undefined;
  errorMsg: boolean | undefined = undefined;
  dataArray: any[] = [];
  cartData: any[] = [];
  sizeArray: any[] = ["S", "M", "L", "XL", "XXL", "XXXL"];

  defaultPagination = environment.pagination;
  limit: any = this.defaultPagination + 1;
  productMasterData: any[] = [];
  appearInData: any[] = [];
  nextBookmark: string = "";
  currency: string = '';

  //gallery
  galleryList: any[] = [];
  videoList: any[] = [];
  bannerLIst: any[] = [];
  item2: any = "gallery";
  item3 = "Banner";
  faq: any[] = [];
  videoURL: any;

  serviceList1: any = [];
  serviceList2: any[] = [];
  serviceBanner: any = {
    imageLocation: "",
  };
  item: any = "service";
  eventList: any = [];
  ipAddress: any;
  watchInfo: any;

  //profile
  username: any;
  userEmail: any;
  userMobile: any;
  userRole: any;
  safeSrc!: SafeResourceUrl;
  viewMode:any = '0';

  //testimonials
  testList: any[] = [];
  item4: any = "testimonials";

  _album: any[] = [];
  
  cid: any;
  menu: boolean = false;
  menuData: any[] = [];
  menuMaster: any[] = [];
  footer: any[] = [];
  footerMaster: any[] = [];
  menuJson: any = [];
  title1: any;
  title2: any;


  itemsPerSlide = 3;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private homeService: HomeService,
    public sanitizer: DomSanitizer,
    private lightbox: Lightbox,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      console.log('params', params);
    });
    
    this.shopName = localStorage.getItem('shopName');

    this.getGalleryByShop(this.shopName, this.item2, this.limit);
    this.getServicesByShop(this.shopName, this.item, this.limit);
    this.getTestimonialsByShop(this.shopName, this.item4, this.limit);
    this.getSettings();
    this.companyInfo(this.shopName);

    if (this.shopName) {
      this.companyInfo(this.shopName);
    }

    }

    companyInfo(shopName: string) {
      this.homeService.getCompanyInfo(shopName).subscribe(
        (result: any) => {
          // console.log(result,"comp")
          if (result) {
            const companyDetail = result.profile.docs[0];
            this.companyTitle = companyDetail.companyName || "";
            this.companyLogo = companyDetail.logo || "N/A";
            this.contactNumber = companyDetail.contactNumber || "";
            this.CompanyEmail = companyDetail.email || "";
            this.address = companyDetail.address || "";
            this.aboutUs = companyDetail.aboutUs || "";
            this.socialLink = companyDetail.socialNetwork || "N/A";
            this.whatsApp = companyDetail.whatsappNumber || "";
          }
        },
        (error: any) => {
          console.log("Error in getting access data: " + JSON.stringify(error));
        }
      );
    }

    getMenu(shopName: string) {
      this.productService.getMenu(shopName, this.cid).subscribe(
        (result: any) => {
          console.log(result, "menu")
          if (result.docs.length === 0) {
            this.menu = true;
          }
          this.menuData = result.docs[0].nav;
          this.menuMaster = TreeDataConverter2.convert(this.menuData)["children"];
          this.footer = this.menuMaster.filter((item: any) => item.menu === "Footer");
          this.menuMaster = this.menuMaster.filter((item: any) => item.menu !== "Footer");
          this.menuJson = JSON.parse(this.menuMaster[0].filter);
          this.menuJson = this.menuJson.homePageContent;
          console.log(this.menuJson, "menujson")
          // this.getServicesFilterCategory();
          // this.getServicesFilterCategory2();
        },
        (error: any) => {
          console.log("Error in getting access data: " + JSON.stringify(error));
        }
      );
    }
  
  
    getBannerByShop(shopName: string, item: string, limit: string) {
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
  
        this.bannerLIst = gallery;
        this.bannerLIst = this.bannerLIst.filter((item: any) => item.galleryGroup === "Banner");
        console.log(this.bannerLIst, "banner")
      });
    }
  
    getGalleryByShop(shopName: string, item: string, limit: string) {
      const gallery: any = [];
      this.homeService.getItemsByShop(shopName, item, limit)
        .subscribe((resp: any) => {
          // console.log(resp, "gal")
          resp.rows.forEach((value: any) => {
            gallery.push({
              id: value.doc._id,
              image: value.doc.galleryUpload,
              order: value.doc.order,
              thumbImage: value.doc.galleryLocation,
              title: value.doc.title,
              alt: value.doc.title,
              galleryGroup: value.doc.galleryGroup,
              description: value.doc.description,
            });
          });
          gallery.sort((a: any, b: any) => Number(a.order) - Number(b.order));
          this.galleryList = gallery;
          this.galleryList.forEach((product: any) =>{
            const album = {
              src: product.image,
              caption:product.title,
              thumb: product.image
           };
           this._album.push(album);
          })
          console.log(this.galleryList, "GAl")
        });
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
            this.serviceList1 = services;
            console.log(this.serviceList1, "service")
          }
        }
      );
    }
  
  
    getServicesByShopfaq(shopName: string, limit: string) {
      const services: any = [];
  
      this.homeService.getAllFAQ(limit, shopName).subscribe(
        (resp: any) => {
          if (resp) {
            resp.rows.forEach((value: any, i: any) => {
              services.push({
                _id: value.doc._id,
                docType: value.doc.docType,
                answer: value.doc.answer,
                category: value.doc.category,
                question: value.doc.question,
                createdOn: value.doc.createdOn,
              });
            });
            services.sort((a: any, b: any) => Number(a.order) - Number(b.order));
            this.faq = services;
            console.log(this.faq, "faq");
          }
        }
        // @ts-ignore
      );
    }
  
    getTestimonialsByShop(shopName: string, item4: string, limit: string) {
      const services: any = [];
      this.homeService.getBlog(shopName, item4, limit).subscribe(
        (resp: any) => {
          // console.log(resp, "test")
          if (resp) {
            resp.rows.forEach((value: any, i: any) => {
              services.push({
                _id: value.doc._id,
                docType: value.doc.docType,
                title: value.doc.name,
                designation: value.doc.designation,
                imageLocation: value.doc.photo,
                imageUpload: value.doc.imageUpload,
                text: value.doc.text,
                shortDescription: value.doc.shortDescription,
                longDescription: value.doc.longDescription,
                createdOn: value.doc.createdOn,
              });
            });
            services.sort((a: any, b: any) => Number(a.order) - Number(b.order));
            this.testList = services;
            console.log(this.testList, "test")
          }
        }
        // @ts-ignore
      );
    }
  
    getSettings() {
      this.homeService.getCompanySettings(this.shopName).subscribe(
        (resp: any) => {
          this.currency = resp.rows[0].doc.currencyList
        }
      )
    }

    onAboutNav(event: any) {
      event.preventDefault();
      if (this.shopName) {
       
        this.router.navigateByUrl("/site/" + this.shopName);
        this.navbar=false;
      } else {
        this.router.navigateByUrl("/contact");
      }
    }

    open(index: number): void {
      this.lightbox.open(this._album, index);
    }
   
    close(): void {
      this.lightbox.close();
    }
}
