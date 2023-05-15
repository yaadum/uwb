import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { VyaRestClientService } from 'vya-restclient';
import { MyPaginationService } from 'src/app/lib/pagination/pagination.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productUrl = `/api/e-commerce`;
  productByIdUrl = `/api/e-commerce/product`;
  categoryUrl = "/api/e-commerce/category";
  webUrl =`/api/public-site/web`;

  constructor(
    private restClient: VyaRestClientService,
    private paginationService: MyPaginationService,
    private router: Router
  ) {}

  getProductById(id: any, cName: any): Observable<any | boolean> {
    return this.restClient.get(`${this.productByIdUrl}/${cName}/${id}`).pipe(
      map((value: any) => {
        return value.docs.docs[0];
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  getMenu(shopName:any,cid:any): Observable<any> {
    return this.restClient.get(`${this.webUrl}/${shopName}/${cid}`).pipe(
      map((value: any) => {
        return value.response;
      }),
      catchError((error: any) => {
        return error;
      })
    );
  }

  getProducts(
    limit: string,
    startkey?: string,
    endkey?: string
  ): Observable<any> {
    // return new Observable((observer: any) => {
    return this.paginationService
      .paginate(`${this.productUrl}`, limit, startkey, endkey)
      .pipe(
        map((value: any) => {
          if (value) {
            return value;
          }
        }),
        catchError((error) => {
          if (error) {
            console.log("error", error);
          }
          return of(false);
        })
      );
  }

  getCategories(shopName: string): Observable<any> {
    return this.restClient
    .get(`${this.productUrl}/category/${shopName}`)
      .pipe(
        map((value: any) => {
          if (value) {
            console.log("value1323", value);
            return value;
          }
        }),
        catchError((error) => {
          if (error) {
            console.log("error1323", error);
          }
          return of(false);
        })
      );
  }

  getAllProducts(): Observable<any | boolean> {
    return this.restClient.get(`${this.productUrl}`).pipe(
      map((values: any) => {
        if (values) {
          return values.response.rows;
        }
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  getAll(limit: string, startkey?: string, endkey?: string): Observable<any> {
    // return new Observable((observer: any) => {
    return this.paginationService
      .paginate(`${this.productUrl}`, limit, startkey, endkey)
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

  getProductsByShop(
    shopName: string,
    limit: string,
    startkey?: string,
    endkey?: string
  ): Observable<any> {
    // return new Observable((observer: any) => {
    return this.paginationService
      .paginate(`${this.productUrl}/${shopName}`, limit, startkey, endkey)
      .pipe(
        map((value: any) => {
          if (value) {
            return value;
          }
        }),
        catchError((error) => {
          console.log('error', error);
          if (error) {
            this.router.navigate(['/home'], {
              queryParams: { shop: shopName },
            });
          }
          return of(false);
        })
      );
  }

  // class END
}
