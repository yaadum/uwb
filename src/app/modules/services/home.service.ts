import { Injectable } from "@angular/core";
import { VyaRestClientService } from "vya-restclient";
import { MyPaginationService } from "src/app/lib/pagination/pagination.service";
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  constructor(
    private restClient: VyaRestClientService,
    private paginationService: MyPaginationService,
    private router: Router
  ) {}

  galleryUrl = `/api/public-site/gallery`;
  serviceUrl = `/api/public-site/services`;
  testUrl = `/api/public-site/get/testimonials`;
  serviceCodeUrl = `/api/public-site/serv`;
  serviceCatUrl = `/api/public-site/services`;
  docCatUrl = `/api/public-site/document`;
  categoryUrl=`/api/public-site/master/get`;
  id=`?id=76839d2802711ecf2a0d9cbda90124fd4&pid=INEVITO-EVITO-COMPANY-CATEGORY-MASTER`;
  masterUrl = `/api/public-site/master`;
  itemUrl = `/api/public-site/get`;
  publicSiteUrl = `/api/public-site`;
  contactUsUrl = `/api/public-site/contact-us`;
  companyProfileUrl = `/api/public-site/company/profile`;
  productUrl = `/api/e-commerce`;
  settingsUrl = '/api/public-site/company/settings';
  faqURL=`/api/public-site/get/faq`;
  urlMapperURL=`/api/public-site/get/url`;


  getCompanySettings(shopName:any): Observable<any> {
    return this.restClient.get(`${this.settingsUrl}/${shopName}`).pipe(
      map((value: any) => {
        return value.response;
      }),
      catchError((error: any) => {
        return error;
      })
    );0
  }


  contactUs(data: any): Observable<any> {
    return this.restClient.post(`${this.contactUsUrl}`, data).pipe(
      map((value: any) => {
        return value;
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  newsLetter(data: any): Observable<any> {
    return this.restClient.post(`${this.publicSiteUrl}/lead`, data).pipe(
      map((value: any) => {
        return value;
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  notify(data: any): Observable<any> {
    return this.restClient.post(`${this.publicSiteUrl}/lead`, data).pipe(
      map((value: any) => {
        return value;
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  getGalleryById(id: any): Observable<any> {
    return this.restClient.get(`${this.galleryUrl}/${id}`).pipe(
      map((value: any) => {
        return value.doc.docs[0];
      }),
      catchError((error) => {
        return error;
      })
    );
  }


  getTestById(shopName:any,id: any): Observable<any> {
    return this.restClient.get(`${this.testUrl}/${shopName}/${id}`).pipe(
      map((value: any) => {
        return value.response.docs[0];
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  getServiceById(shopName:any,id: any): Observable<any> {
    return this.restClient.get(`${this.serviceUrl}/${shopName}/${id}`).pipe(
      map((value: any) => {
        return value.response.docs[0];
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  getServiceByCode(shopName:any,id: any): Observable<any> {
    return this.restClient.get(`${this.serviceCodeUrl}/${shopName}/${id}`).pipe(
      map((value: any) => {
        return value.response.docs[0];
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  
  filterCategoryService(shopName: string,item: string): Observable<any> {
    return this.restClient
    .get(`${this.serviceCatUrl}/${shopName}/${item}`)
      .pipe(
        map((value: any) => {
          if (value) {
            return value;
          }
        }),
        catchError((error) => {
          if (error) {
            console.log(error);
          }
          return of(false);
        })
      );
  }

  
  filterCategoryDocuments(shopName: string,item: string): Observable<any> {
    return this.restClient
    .get(`${this.docCatUrl}/${shopName}/${item}`)
      .pipe(
        map((value: any) => {
          if (value) {
            return value;
          }
        }),
        catchError((error) => {
          if (error) {
            console.log(error);
          }
          return of(false);
        })
      );
  }

  getAllGallery(
    limit: string,
    startkey?: string,
    endkey?: string
  ): Observable<any> {
    return this.paginationService
      .paginate(`${this.galleryUrl}`, limit, startkey, endkey)
      .pipe(
        map((value: any) => {
          if (value) {
            return value.response;
          }
        }),
        catchError((error) => {
          return error;
        })
      );
  }

  getCompanyInfo(shopName: any): Observable<any> {
    return this.restClient
      .get(`${this.companyProfileUrl}?shopname=${shopName}`)
      .pipe(
        map(
          (response) => {
            return response;
          },
          (error: any) => {
            console.log(
              "Error in getting company list: " + JSON.stringify(error)
            );
            return error;
          }
        )
      );
  }

  getItemsByShop(
    shopName: string,
    item: string,
    limit: string,
    startkey?: string,
    endkey?: string
  ): Observable<any> {
    // return new Observable((observer: any) => {
    return this.paginationService
      .paginate(`${this.itemUrl}/${item}/${shopName}`, limit, startkey, endkey)
      .pipe(
        map((value: any) => {
          if (value) {
            return value.response;
          }
        }),
        catchError((error: any) => {
          console.log(error);
          if (error) {
            this.router.navigate(["/home"], {
              queryParams: { shop: shopName },
            });
          }

          return of(false);
        })
      );
  }

  //Products from shop
  getCategories(shopName: string): Observable<any> {
    return this.restClient
    .get(`${this.productUrl}/category/${shopName}`)
      .pipe(
        map((value: any) => {
          if (value) {
            return value;
          }
        }),
        catchError((error) => {
          if (error) {
            console.log(error);
          }
          return of(false);
        })
      );
  }

  getCategory(shopName: string): Observable<any> {
    return this.restClient
    .get(`${this.categoryUrl}/${shopName}/${this.id}`)
      .pipe(
        map((value: any) => {
          if (value) {
            return value;
          }
        }),
        catchError((error) => {
          if (error) {
            console.log(error);
          }
          return of(false);
        })
      );
  }

  filterCategory(shopName: string,item: string): Observable<any> {
    return this.restClient
    .get(`${this.serviceUrl}/${shopName}/${item}`)
      .pipe(
        map((value: any) => {
          if (value) {
            return value;
          }
        }),
        catchError((error) => {
          if (error) {
            console.log(error);
          }
          return of(false);
        })
      );
  }

  getAll(shopName: string): Observable<any> {
    return this.restClient
    .get(`${this.productUrl}/${shopName}`)
      .pipe(
        map((value: any) => {
          if (value) {
            return value.response;
          }
        }),
        catchError((error) => {
          return error;
        })
      );
  }

  getBanner(
    shopName: string,
    item: string,
    limit: string,
    startkey?: string,
    endkey?: string
  ): Observable<any> {
    return this.paginationService
      .paginate(`${this.itemUrl}/${item}/${shopName}`, limit, startkey, endkey)
      .pipe(
        map((value: any) => {
          if (value) {
            return value.response;
          }
        }),
        catchError(error => {
          console.log(error)
          return error;
        })
      );
  }
  

  getUrlMapper(url:any): Observable<any> {
    return this.paginationService
      .paginate(`${this.urlMapperURL}/${url}`)
      .pipe(
        map((value: any) => {
          if (value) {
            return value;
          }
        }),
        catchError((error) => {
          return error;
        })
      );
  }

  getBlog(
    shopName: string,
    item: string,
    limit: string,
    startkey?: string,
    endkey?: string
  ): Observable<any> {
    return this.paginationService
      .paginate(`${this.itemUrl}/${item}/${shopName}`, limit, startkey, endkey)
      .pipe(
        map((value: any) => {
          if (value) {
            return value.response;
          }
        }),
        catchError(error => {
          console.log(error)
          return error;
        })
      );
  }


  getAllFAQ(limit: string,shopName:any): Observable<any> {
    return this.paginationService
      .paginate(`${this.faqURL}/${shopName}?limit=${limit}`)
      .pipe(
        map((value: any) => {
          if (value) {
            return value.response;
          }
        }),
        catchError((error) => {
          return error;
        })
      );
  }
}
