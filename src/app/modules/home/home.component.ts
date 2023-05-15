import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { HomeService } from '../services/home.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment.prod';
import { TreeDataConverter2 } from 'src/app/default-layout/tree-data-converter';
import { Lightbox } from 'ngx-lightbox';
import { SessionStore } from 'src/app/services/session.store';
import { KeycloakInitOptions } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';
import { NotificationService } from 'src/app/services/notification.service';
import { CartService } from '../services/cart.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import * as moment from 'moment';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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

  // product
  productList:any[]=[];
  item6:any="product"

  //gallery
  galleryList: any[] = [];
  videoList: any[] = [];
  bannerLIst: any[] = [];
  item2: any = "gallery";
  item3 = "Banner";
  faq: any[] = [];
  videoURL: any;

  serviceList: any = [];
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

  // blog
  blogList:any[]=[];
  item5:any="blog";

  
  cid: any;
  menu: boolean = false;
  menuData: any[] = [];
  menuMaster: any[] = [];
  footer: any[] = [];
  footerMaster: any[] = [];
  menuJson: any = [];
  title1: any;
  title2: any;
  _album: any[] = [];
  profileImg = "";

  @ViewChild('appProductCart', { static: false }) appProductCart:
  | CartComponent
  | undefined = undefined;



  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private homeService: HomeService,
    public sanitizer: DomSanitizer,
    private lightbox: Lightbox,
    protected readonly keycloak: KeycloakService,
    private notificationService:NotificationService,
    private cartService:CartService,
    private restApi: RestApiService,
  ) { }

  ngOnInit(): void {
    // this.tinySliderConfig = {
    //   arrowKeys: true,
    //   autoWidth: true,
    //   gutter: 10,
    //   items:3,
    //   // controlsText: ["<", ">"]
    // };
    this.activatedRoute.params.subscribe((params) => {
      console.log('params', params);
    });
    
    this.shopName = localStorage.getItem('shopName');
    if (this.shopName.includes("#")) {
      this.shopName = this.shopName.split("#")[0];
      localStorage.setItem('shopName', this.shopName);
    }

    this.getProductsByShopName(this.shopName, this.limit);
    this.getServicesByShop(this.shopName, this.item, this.limit);
    this.getGalleryByShop(this.shopName, this.item2, this.limit);
    this.getBannerByShop(this.shopName, this.item3, this.limit);
    this.getTestimonialsByShop(this.shopName, this.item4, this.limit);
    this.getBlogsByShop(this.shopName, this.item5, this.limit);
    this.getServicesByShopfaq(this.shopName, this.limit);
    this.getSettings();
    this.companyInfo(this.shopName);

    if (SessionStore.getAccessToken() !== null) {
      this.getUser();
    }

    if (this.shopName) {
      this.companyInfo(this.shopName);
    };
    
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

  getUser() {
    this.restApi.getMyProfile().subscribe((resp: any) => {
      // console.log(resp,"use")
      if (resp) {

        const UserDetail = resp.response.docs[0];
        this.userEmail = UserDetail.email;
        this.username = UserDetail.userName;
        this.userRole = UserDetail.access.role;
        this.userMobile = UserDetail.contact.mobile;
        const profile = resp.response.docs[0].profile;
        this.profileImg = profile.image;
      } else {
        this.profileImg = "assets/images/user.jpg";
      }
    });
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
        this.getServicesFilterCategory();
        this.getServicesFilterCategory2();
      },
      (error: any) => {
        console.log("Error in getting access data: " + JSON.stringify(error));
      }
    );
  }
  getProductsByShopName(shopName: string, limit: any) {
    this.productService.getProductsByShop(shopName, limit).subscribe(
      (resp: any) => {
        if (resp.response.docs.length > 0) {
          const tempProductData: any = [];
          resp.response.docs.forEach((product: any, idx: number) => {
            if (product !== undefined) {
              this.shopData.push(product)
              tempProductData.push({
                _id: product._id,
                itemName: product.productName,
                image: product.productImage,
                imageName: product.image,
                itemCode: product.itemCode,
                description: product.productDescription,
                price: product.price,
                gst: product.gst,
                quantity: 1,
                discount: product.discount || product.price,
                avaliablity: product.stockStatus,
                category: product.categories,
                color: product.color,
                orderOption: product.orderOption || '',
                size: product.size,
                appearIn: product.appearIn,
                cName: this.shopName,
              });
            }
          });
          this.productMasterData = tempProductData;
          this.productData = tempProductData;
          console.log(this.productData,"prod")
          this.nextBookmark = resp.response.bookmark;
        }
      }
    );
  }
  
  getServicesFilterCategory() {
    const filter: any = this.menuJson.filter((item: any) => item.description === "grid data");
    this.title1 = filter[0].category
    this.homeService.filterCategoryService(this.shopName, this.title1).subscribe((result: any) => {
      // console.log(result, "cat2")
      const services: any = [];
      if (result) {
        this.serviceList = result.response.docs;
        result.response.docs.forEach((value: any, i: any) => {
          services.push({
            _id: value._id,
            docType: value.docType,
            title: value.title,
            order: value.order,
            imageLocation: value.imageLocation,
            imageUpload: value.imageUpload,
            shortDescription: value.shortDescription,
            longDescription: value.longDescription,
            category: value.category,
            createdOn: value.createdOn,
          });
        });
        services.sort((a: any, b: any) => Number(a.order) - Number(b.order));
        this.serviceList = services;
        console.log(this.serviceList, "serv")
      }
    })
  }

  getServicesFilterCategory2() {
    const filter: any = this.menuJson.filter((item: any) => item.description === "grid2 data");
    this.title1 = filter[0].category
    this.homeService.filterCategoryService(this.shopName, this.title1).subscribe((result: any) => {
      console.log(result, "cat2")
      const services: any = [];
      if (result) {
        this.serviceList2 = result.response.docs;
        result.response.docs.forEach((value: any, i: any) => {
          services.push({
            _id: value._id,
            docType: value.docType,
            title: value.title,
            order: value.order,
            imageLocation: value.imageLocation,
            imageUpload: value.imageUpload,
            shortDescription: value.shortDescription,
            longDescription: value.longDescription,
            category: value.category,
            createdOn: value.createdOn,
          });
        });
        services.sort((a: any, b: any) => Number(a.order) - Number(b.order));
        this.serviceList2 = services;
        console.log(this.serviceList2, "serv")
      }
    })
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
          // console.log(resp, "service")
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
          console.log(this.serviceList, "services")
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

  addToCart(data: any) {
    let url = window.location.origin;
    if (SessionStore.getAccessToken() === null) {
      // window.location.href = url + "/site/" + this.shopName + "/login";
      const initOptions: KeycloakInitOptions = {
        // onLoad: 'login-required',
        //  checkLoginIframe: true
         onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html'
     }

     this.keycloak.login(initOptions);
    }
    else {
      const data1 = {
        _id: data._id,
        itemName: data.itemName,
        image: data.image,
        imageName: data.imageName,
        itemCode: data.itemCode,
        description: data.description,
        price: data.price,
        quantity: 1, 
        gst: data.gst,
        discount: data.discount || data.price,
        avaliablity: data.stockStatus,
        category: data.categories,
        color: data.color,
        orderOption: data.orderOption || '',
        size: data.size,
        cName: this.shopName,
      }
      this.cartLength += 1;
      this.cartService.addToCart(data1).subscribe(console.log);
      this.cartService.getAllCartItems(this.limit,this.shopName).subscribe((resp: any) => {
      this.notificationService.showSuccess("Item added in cart", "");
        localStorage.setItem('cartLength', resp.items.length);
      });
      this.refreshPage();
    }
  }

  refreshPage() {
    if (this.appProductCart !== undefined) {
      this.appProductCart.calculateTotal();
    }
  }

  getSettings() {
    this.homeService.getCompanySettings(this.shopName).subscribe(
      (resp: any) => {
        this.currency = resp.rows[0].doc.currencyList
      }
    )
  }

  open(index: number): void {
    this.lightbox.open(this._album, index);
  }
 
  close(): void {
    this.lightbox.close();
  }
}
