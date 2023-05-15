import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../services/home.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

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
  shopData: any[] = [];
  productMasterData: any[] = [];
  productData: any[] = [];
  nextBookmark: string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService,
    private productService: ProductService,) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      console.log('params', params);
    });
    
    this.shopName = localStorage.getItem('shopName');

    this.getProductsByShopName(this.shopName, this.limit);
    this.getServicesByShop(this.shopName, this.item, this.limit);
    this.companyInfo(this.shopName);

    if (this.shopName) {
      this.companyInfo(this.shopName);
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
          // console.log('nextBookmark', this.nextBookmark);
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
