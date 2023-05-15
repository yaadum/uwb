import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../services/home.service';
import { TreeDataConverter2 } from 'src/app/default-layout/tree-data-converter';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {

  navbar:boolean=false;
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

  // 

  productData: any[] = [];
  shopData: any[] = [];


  cartLength = 0;
  showCart = false;
  cartArray: any = [];
  alertMsg: boolean | undefined = undefined;
  errorMsg: boolean | undefined = undefined;
  dataArray: any[] = [];
  cartData: any[] = [];
  productMasterData: any[] = [];
  appearInData: any[] = [];
  nextBookmark: string = "";
  currency: string = '';

  //gallery
  galleryList: any[] = [];
  videoList: any[] = [];
  item2: any = "gallery";

  serviceList2: any[] = [];
  serviceBanner: any = {
    imageLocation: "",
  };

  blogList:any[]=[];
  item5:any = "blog"

  //profile
  username: any;
  userEmail: any;
  userMobile: any;
  userRole: any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService,
    private productService: ProductService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      console.log('params', params);
    });
    
    this.shopName = localStorage.getItem('shopName');

    // this.getProductsByShopName(this.shopName, this.limit);
    this.getGalleryByShop(this.shopName, this.item2, this.limit);
    this.getServicesByShop(this.shopName, this.item, this.limit);
    this.getBlogsByShop(this.shopName, this.item5, this.limit);
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
          this.bannerTitle = companyDetail.companyName || "";
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
      },
      (error: any) => {
        console.log("Error in getting access data: " + JSON.stringify(error));
      }
    );
  }


  getGalleryByShop(shopName: string, item: string, limit: string) {
    const gallery: any = [];
    this.homeService
      .getItemsByShop(shopName, item, limit)
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
            description: value.doc.description,
            galleryGroup: value.doc.galleryGroup
          });
        });
        gallery.sort((a: any, b: any) => Number(a.order) - Number(b.order));
        this.galleryList = gallery;
        console.log(this.galleryList, "gal")
      });
  }

  getBlogsByShop(shopName: string, item: string, limit: string) {
    const blog: any = [];

    this.homeService.getBlog(shopName, item, limit).subscribe(
      (resp: any) => {
        if (resp) {
          // console.log(resp, "blog")
          resp.rows.forEach((value: any, i: any) => {
            blog.push({
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
          });
          blog.sort((a: any, b: any) => Number(a.order) - Number(b.order));
          this.blogList = blog;
          console.log(this.blogList, "blog")
        }
      }
    );
  }


  getServicesByShop(shopName: string, item: string, limit: string) {
    const services: any = [];

    this.homeService.getBlog(shopName, item, limit).subscribe(
      (resp: any) => {
        if (resp) {
          // console.log(resp, "blog")
          resp.rows.forEach((value: any, i: any) => {
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
          });
          services.sort((a: any, b: any) => Number(a.order) - Number(b.order));
          this.serviceList = services;
          console.log(this.serviceList, "service")
        }
      }
    );
  }

  onBlogNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
      this.router.navigateByUrl("/site/" + this.shopName);
      this.navbar=false;
    } else {
      this.router.navigateByUrl("/contact");
    }
  }

}
