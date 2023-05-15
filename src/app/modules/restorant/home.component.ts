import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TreeDataConverter2 } from 'src/app/default-layout/tree-data-converter';
import { HomeService } from '../services/home.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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
  faq: any[] = [];
  faq1: boolean = true;
  faq2: boolean = false;
  faq3: boolean = false;

  //Service
  serviceList: any[] = [];
  serviceList2: any[] = [];
  serviceBanner: any[] = [];
  limit: any = "26";
  itemS: any = "service";
// blog
  blogList: any[] = [];
  item5 = "blog";
  //gallery
  galleryList: any[] = [];
  item2: any = "gallery";

  banerList: any[] = [];

  //promotion
  bannerLIst: any[] = [];
  item3: any = "banner";

  //testimonials
  testList: any[] = [];
  homepage: any[] = [];
  item4: any = "testimonials";
  pathName: string = location.href.split("/")[5];

  cid: any;
  menu: boolean = false;
  menuData: any[] = [];
  menuMaster: any[] = [];
  footer: any[] = [];
  footerMaster: any[] = [];
  menuJson: any = [];
  title1: any;
  title2: any;

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

    // this.http.get('./assets/homepage.json').subscribe((result: any)=>{
    //   console.log(result,"http")
    //   this.homepage = result.homePageContent;
    // });

    this.cid = window.localStorage.getItem('cid');
    if (this.cid === null) {
      this.cid = "Web"
    }
    // if (this.activatedRoute.snapshot.queryParamMap.get('params')) {
    //   //@ts-ignore
    //   this.menuJson = this.activatedRoute.snapshot.queryParamMap.get('params');
    //   this.menuJson = JSON.parse(this.menuJson);
    //   this.menuJson = this.menuJson.homePageContent;
    //   console.log(this.menuJson, "json");
    // }
    this.shopName = localStorage.getItem('shopName');

    this.getMenu(this.shopName);
    this.companyInfo(this.shopName);
    
    // has no data getBannerByShop
    this.getBannerByShop(this.shopName, this.item3, this.limit)
    this.getTestimonialsByShop(this.shopName, this.item4, this.limit);
    this.getServicesByShop(this.shopName, this.itemS, this.limit)
    
    this.getBlogByShop(this.shopName, this.item5, this.limit)
    this.getGalleryByShop1(this.shopName, this.item2, this.limit);

    if (this.shopName) {
      this.companyInfo(this.shopName);
    }
  }
  
  companyInfo(shopName: string) {
    this.homeService.getCompanyInfo(shopName).subscribe(
      (result: any) => {
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

  // onfaq2(item:any) {
  //   // do something with selected item
  //  const data =item;
  //   this.router.navigate([ this.faq2 == true ], {
  //     queryParams: { '-id': data._id.split('::')[1] },
  //   });
  //   window.scrollTo(0, 0);
  // }

  // onfaq2(event:any){
  //   if(this.faq2 = event){
  //     this.faq2 === true;
  //     console.log("true")
  //   }
  //   else{
  //     console.log("false")
  //   }

  // }
  

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

  getBlogByShop(shopName: string, item5: string, limit: string) {
    const services: any = [];

    this.homeService.getBlog(shopName, item5, limit).subscribe(
      (resp: any) => {
        // console.log(resp, "blog")
        if (resp) {
          resp.rows.forEach((value: any, i: any) => {
            services.push({
              _id: value.doc._id,
              docType: value.doc.docType,
              title: value.doc.blogTitle,
              category: value.doc.blogCategory,
              imageLocation: value.doc.imageUpload,
              shortDescription: value.doc.shortDescription,
              longDescription: value.doc.longDescription,
              createdOn: value.doc.createdOn,
            });
          });
          services.sort((a: any, b: any) => Number(a.order) - Number(b.order));
          this.blogList = services;
          console.log(this.blogList, "blog")
        }
      }
      // @ts-ignore
    );
  }
  getServicesByShop(shopName: string, itemS: string, limit: string) {
    const homepage: any = this.menuJson.filter((item: any) => item.services === "item");
    console.log(homepage);
    this.homeService.getItemsByShop(shopName, itemS, limit).subscribe(
      (resp: any) => {
        // console.log("resp", resp);
        if (resp) {
          const services: any = [];
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
          this.serviceList = this.serviceList.filter((item: any) => item.category === "Academics");
          console.log(this.serviceBanner, "Service");
        }
      }
      // @ts-ignore
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
      // console.log(result, "cat2")
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


  getGalleryByShop(shopName: string, item: string, limit: string) {
    const gallery: any = [];
    this.homeService.getItemsByShop(shopName, item, limit).subscribe((resp: any) => {
        console.log(resp, "gal")
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
        console.log(this.galleryList, "GAl")
      });
  }


  getBannerByShop(shopName: string, item3: string, limit: string) {
    const banner: any[] = [];
    this.homeService.getBanner(shopName, item3, limit).subscribe((resp: any) => {
      // console.log("respzzzzz", resp)
      resp.rows.forEach((value: any) => {
        banner.push({
          image: value.doc.productImage[0],
          order: value.doc.order,
          thumbImage: value.doc.productImage,
          title: value.doc.title,
          alt: value.doc.title,
          galleryGroup: value.doc.group
        });
      });
      banner.sort((a: any, b: any) => Number(a.order) - Number(b.order));
      this.bannerLIst = banner;
      console.log(this.bannerLIst, "Banner")
    });
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
          this.testList = this.testList.filter((item: any) => item.text === "management");
          console.log(this.testList, "test")
        }
      }
      // @ts-ignore
    );
  }

  getFaqByShop(shopName: string, limit: string) {
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

  getGalleryByShop1(shopName: string, item2: string, limit: string) {
    const gallery: any[] = [];
    this.homeService.getBanner(shopName, item2, limit).subscribe((resp: any) => {
      // console.log(resp, "bannerr");
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

      this.banerList = gallery;
      this.banerList = this.banerList.filter((item: any) => item.galleryGroup === "Banner");
      console.log(this.banerList, "galleryList")
    });
  }

  onServiceSelect(_id: string) {
    this.router.navigate(['/site/' + this.shopName + '/detail'], {
      queryParams: { 'params': _id },
    });
  }

}
