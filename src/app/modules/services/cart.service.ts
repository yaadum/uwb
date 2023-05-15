import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { VyaRestClientService } from 'vya-restclient';

@Injectable({
  providedIn: 'root'
})

export class CartService {
  paymentUrl = '/api/e-payment/order';
  cartUrl = '/api/cart/';
  cartUrl2 = '/api/cart/get/cart';
  paymentGateway = `/api/gateway/cName`;
  adminPayment = `/api/e-commerce/company/profile`;
  couponUrlBycode=`/api/coupon/couponId`;

  constructor(private restClient: VyaRestClientService) {}

  addToCart(data: any): Observable<any | boolean> {
    return this.restClient.post(`${this.cartUrl}`, data).pipe(
      map((value: any) => {
        return value;
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  getCouponBycode(couponCode: any): Observable<any | boolean>{
    return this.restClient.get(`${this.couponUrlBycode}/${couponCode}`).pipe(
      map((value: any) => {
        return value;
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  // getAllCartItems(limit: string): Observable<any | boolean> {
  //   return this.restClient.get(`${this.cartUrl}?limit=${limit}`).pipe(
  //     map((value: any) => {
  //       return value.response.docs[0];
  //     }),
  //     catchError((error) => {
  //       return error;
  //     })
  //   );
  // }

  getAllCartItems(limit: string,shopName:any): Observable<any | boolean> {
    return this.restClient.get(`${this.cartUrl2}/${shopName}?limit=${limit}`).pipe(
      map((value: any) => {
        return value.response.docs[0];     
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  updateCartItems(data: any): Observable<any | boolean> {
    return this.restClient.post(`${this.cartUrl}/update`, data).pipe(
      map((value: any) => {
        return value;
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  deleteCartItems(data: any): Observable<any | boolean> {
    return this.restClient.post(`${this.cartUrl}/delete`, data).pipe(
      map((value: any) => {
        return value;
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  removeCartItems(data: any): Observable<any | boolean> {
    return this.restClient.post(`${this.cartUrl}/remove`, data).pipe(
      map((value: any) => {
        return value;
      }),
      catchError((error) => {
        return error;
      })
    );
  }
  getCartLenght(): Observable<any | boolean> {
    return this.restClient.get(`${this.cartUrl}/size`).pipe(
      map((value: any) => {
        return value;
      }),
      catchError((error) => {
        return error;
      })
    );
  }

  // To make an Order
  makeOrder(shopName: string, data: any): Observable<any | boolean> {
    return this.restClient
      .post(`${this.paymentUrl}?name=${shopName}`, data)
      .pipe(
        map((value: any) => {
          return value;
        }),
        catchError((error) => {
          return error;
        })
      );
  }

  // Save payment on Authorized checkout
  savePayment(shopName: string, data: any): Observable<any | boolean> {
    return this.restClient
      .post(`${this.paymentUrl}/success?name=${shopName}`, data)
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

  // Save payment on Authorized checkout Paypal
  savePayment1(shopName: string, data: any): Observable<any | boolean> {
    return this.restClient
      .post(`${this.paymentUrl}/success/paypal?name=${shopName}`, data)
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

  // To get payment gateway by cName
  getPaymentGateway(shopName: string): Observable<any | boolean> {
    return this.restClient
      .get(`${this.paymentGateway}/${shopName}`)
      .pipe(
        map((value: any) => {
          return value.paymentGateway[0];
        }),
        catchError((error) => {
          return error;
        })
      );
  }

  // To get payment from admin by cName
  getAdminPayment(shopName: string): Observable<any | boolean> {
    return this.restClient
      .get(`${this.adminPayment}/${shopName}`)
      .pipe(
        map((value: any) => {
          return value.profile.rows[0];
        }),
        catchError((error) => {
          return error;
        })
      );
  }
}
