import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// import { AppConfigStore } from 'src/app/services/app-config.store';
import { NotificationService } from 'src/app/services/notification.service';
import { ScriptService } from 'src/app/services/script.service';
import { SessionStore } from 'src/app/services/session.store';
import { CartService } from '../services/cart.service';
import { HomeService } from '../services/home.service';
import { ProductService } from '../services/product.service';
import * as moment from 'moment';

import { RestApiService } from 'src/app/services/rest-api.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

declare let Razorpay: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  @Input() productCartData: any[] = [];
  @ViewChild('paypal', { static: true })
  paypalElelment!: ElementRef;
  payPalConfig? : IPayPalConfig;

  cartForm: FormGroup = new FormGroup({});
  shopName:any = window.localStorage.getItem('shopName');

  // component
  cartData: any[] = [];
  dataArray: any[] = [];
  totalAmount = 0;
  gstAmount = 0;
  total = 0;
  showCart = false;
  limit = '20';
  currency: string = ''; 
  // currency: string = '';
  contactNo: string = "";
  loginEmail: string = "";
  fee: number = 0;

  //  count: number  = 1;
  price: number | undefined = undefined;

  // pagination
  page = 1;

  // checkbox
  isChecked = false;
  checkedIdList: any[] = [];
  id = '';
  shipping:any;
  ship:boolean=false;
  gstCalc:any;
  serviceList: any = [];
  serviceBanner: any = {
    imageLocation: "",
  };
  item = "service";
  dataset:any;
  couponpercent:any;
  couponamount:any;
  coupon:any;
  couponB:boolean=false;

  item2 = "Banner";
  bannerList: any[] = [];

  // checkout
  checkoutForm: FormGroup = new FormGroup({});
  myForm: FormGroup = new FormGroup({});
  options: any = {
    amount: `${this.totalAmount * 100}`,
    currency: 'INR',
    order_id: '',
    handler: (response: any) => {
      this.savePayment(response);
    },
    notes: {
      address: 'Razorpay Corporate Office',
    },
    theme: {
      color: '#448aff',
    },
  };

  //paypal
  showRazorPay: boolean = false;
  showPaypal: boolean = false;
  order:any;
  orderId: string = "";
  payerId: string = "";
  clientId: string = "AbwTesraGyc39PkK9WqIdHaRYgRsVSxVoADWT_Glenlm0iGO_El8KCf_0IomvP3ZNhsK_9cjYos9Z0Q8";
  todayDate=moment(new Date()).format("YYYY-MM-DD");

  constructor(
    private formBuilder: FormBuilder,
    private scriptService: ScriptService,
    private cartService: CartService,
    private productService: ProductService,
    private router: Router,
    private homeService: HomeService,
    private restService: RestApiService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute
  ) {
    console.log('Loading External Scripts');
    this.scriptService.loadScript('razorPay');
   }

  ngOnInit(): void {
    this.getAdminPayment();
    this.userInfo();

    let url = window.location.origin;
    if(SessionStore.getAccessToken() === null) {
      setTimeout(() => {
        this.getAllDetails();
       },8000);
    }
    
    if (this.activatedRoute.snapshot.paramMap.get("name")) {
      this.shopName = this.activatedRoute.snapshot.paramMap.get("name");
      this.getGalleryByShop(this.shopName,this.item2 ,this.limit);
    }
    
    this.cartForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      state: [''],
      address: [''],
      city: [''],
      mobile: [''],
      email: [''],
    });

    this.myForm = new FormGroup({
      coupon: new FormControl(""),
    });
    this.checkoutForm = this.formBuilder.group({
      checkIn: [""],
      checkOut: [""],
    });

    if(SessionStore.getAccessToken() !== null){
      this.getAllDetails();
      this.calculateTotal();
    }

    this.getServicesByShop(this.shopName, this.item, this.limit);
    this.getAllDetails();
    this.getSettings();
  }

  getAllDetails() {
    this.cartService.getAllCartItems(this.limit,this.shopName).subscribe((resp: any) => {
      console.log(resp);
      if (resp) {
        this.dataArray = resp.items;
        this.calculateTotal();
      }
    });
    // this.calculateTotal();
  }

  getGalleryByShop(shopName: string, item: string, limit: string) {
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
     
      this.bannerList = gallery;
      this.bannerList=this.bannerList.filter((item:any)=>  item.galleryGroup=== "Banner");
      console.log(this.bannerList,"banner")
      });
    }

  userInfo() {
    this.restService.getMyProfile().subscribe(
      (result: any) => {
        if (result && result.docs[0]) {
          const companyDetail = result.docs[0];
          this.contactNo = companyDetail.contact.mobile,
          this.loginEmail = companyDetail.contact.email;
        }
      },
      (error: any) => {
        console.log("Error in getting access data: " + JSON.stringify(error));
      }
    );
  }

  getSettings() {
    this.homeService.getCompanySettings(this.shopName).subscribe(
      (resp: any) => {
        this.currency = resp.rows[0].doc.currencyList
      }
    )
  }

  increment(quantity: number, id: number) {
    const count = quantity + 1;
    this.calculatePrice(count, id);
  }

  decrement(quantity: number, id: number) {
    let count = quantity;
    if (count > 1) {
      count -= 1;
    }
    this.calculatePrice(count, id);
  }

  calculatePrice(count: number, id: number) {
    console.log(this.dataArray);
    let currentItem;
    for (const data of this.dataArray) {
      if (data.itemCode === id) {
        currentItem = data;
        // @ts-ignore TS2345
        data.quantity = count;
        data.price = count * data.discount;
      }
    }
    this.calculateTotal();
    this.cartService.updateCartItems(currentItem).subscribe(console.log);
  }

  getPaymentGateway() {
    this.cartService.getPaymentGateway(this.shopName).subscribe((res)=>{
      if(res) {
        this.options.key = res.key_id;
        this.options.name = res.companyName;
        this.options.description = res.description;
        this.options.image = res.companyLogo;
      }
    }, (err)=> {
      if(err) {
        this.notificationService.showError("Payment gateway not defined", "");
      }
    });
  }

  getAdminPayment() {
    this.cartService.getAdminPayment(this.shopName).subscribe((res)=>{
      if(res) {
        if((res.doc.paymentName).split(" ")[0] === 'razorpay') {
          this.options.key = res.doc.key_id;
          this.options.name = res.doc.companyName;
          this.options.description = res.doc.description;
          this.options.image = res.doc.companyLogo;
          this.showRazorPay = true;
          this.showPaypal = false;
        } else if ((res.doc.paymentName).split(" ")[0]=== 'Paypal') {
          this.clientId = res.doc.key_id;
          this.showPaypal = true;
          this.showRazorPay = false;
          this.paypal();
        }
      }
    }, (err)=> {
      if(err) {
        this.notificationService.showError("Payment gateway not defined", "");
      }
    });
  }
  
  onFormSubmit(data: any) {
    const total = this.total;
    const postData = {
      items: this.dataArray,
      checkIn: data.checkIn,
      checkOut:data.checkOut,
      amount: total * 100,
      currency: 'INR',
      receipt: 'order_rcptid_11',
      payment_capture: '1',
      paidOn : moment().format('MMMM Do YYYY, h:mm:ss a'),
      loginEmail : this.loginEmail,
      contactNo : this.contactNo,
      gateWay : 'RazorPay',
      amtPaid : this.total + this.fee,
      orderType : window.location.origin,
      gst : this.gstAmount
    };
    this.cartService.makeOrder(this.shopName || '{}', postData).subscribe((resp: any) => {
        this.options.order_id = resp.order_id;
        const razorPay = new Razorpay(this.options);
        razorPay.open();
      }, (err)=> {
        if(err) {
          this.notificationService.showError("Error Found", "");
        }
      }
    );
  
  }
  


  calculateTotal() {
    this.showCart = true;
    for (const data of this.dataArray) {
      if (data.quantity < 0 || data.quantity === 0) {
        data.quantity = 1;
      }
      // @ts-ignore TS2345
      data.price = data.quantity * data.discount;
    }
    const result = this.dataArray.map((value: any) => {
      return value.price;
    });

  
      const gstResult = this.dataArray.map((value: any) => {
        console.log(value.gst);
        const gst =value.gst;
        if(gst !==undefined){
           this.gstCalc = (value.price *gst) / 100;
          
        }
        else{
          this.gstCalc = 0;
          
        }
        return this.gstCalc;
    });

    this.totalAmount = result.reduce((a: number, b: number) => a + b, 0);
    this.gstAmount = gstResult.reduce((a: number, b: number) => a + b, 0);
    if(this.totalAmount <899 && this.totalAmount !==0){
      this.ship =true;
      this.shipping = 49;
      this.total = this.totalAmount + this.gstAmount +this.shipping;
    }
    else{
      this.total = this.totalAmount + this.gstAmount;
    }
    
   
   
  }

  // onPlaceOrder
  toPay() {
    // NOTE: amount : 1.00 INR ruppe ==> amount : 100 paise
    const total = this.totalAmount;
    const data = {
      amount: total * 100, // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: 'order_rcptid_11',
      payment_capture: '1',
    };
    this.cartService.makeOrder(this.shopName, data).subscribe((resp: any) => {
      this.options.order_id = resp.order_id;
      const razorPay = new Razorpay(this.options);
      razorPay.open();
    });
  }

  // onCheckoutNav(event: any) {
  //   event.preventDefault();
  //   if (this.shopName) {
  //     this.router.navigateByUrl("/site/" + this.shopName + "/checkout");
  //   } else {
  //     this.router.navigateByUrl("/checkout");
  //   }
  // }

  // onFormSubmit(data: any) {
  //   console.log('cartForm', data);
  //   const total = this.total;
  //   const postData = {
  //     deliveryDetails: data,
  //     amount: total * 100,
  //     currency: 'INR',
  //     receipt: 'order_rcptid_11',
  //     payment_capture: '1',
  //   };
  //   this.cartService
  //     .makeOrder(this.shopName, postData)
  //     .subscribe((resp: any) => {
  //       this.options.order_id = resp.order_id;
  //       const razorPay = new Razorpay(this.options);
  //       razorPay.open();
  //     });
  // }

  onDelete(id: any) {
    const index = this.dataArray.findIndex((x: any) => x.itemCode === id);
    this.cartService
      .deleteCartItems(this.dataArray[index])
      .subscribe(console.log);
    this.dataArray.splice(index, 1);
    this.calculateTotal();
  }

  savePayment(data: any) {
    this.calculateTotal();
    const dbData = Object.assign({}, data, {
      products: this.dataArray,
      paidAmount: this.total,
      paidOn:new Date().toJSON()
    });
    this.cartService
      .savePayment(this.shopName || '{}', dbData)
      .subscribe((resp: any) => {
        if (resp) {
          this.cartService.removeCartItems(data).subscribe(console.log);
        }
      }, (err)=> {
        if(err) {
          this.notificationService.showError("Error Found", "");
        }
      });
  }

  getServicesByShop(shopName: string, item: string, limit: string) {
    this.homeService.getItemsByShop(shopName, item, limit).subscribe(
      (resp: any) => {
        console.log("service", resp);
        if (resp) {
          const services: any = [];
          resp.rows.forEach((value: any, i: any) => {
            services.push({
              _id: value.doc._id,
              docType: value.doc.docType,
              title: value.doc.title,
              order: value.doc.order,
              imageLocation: value.doc.imageUpload,
              shortDescription: value.doc.shortDescription,
              longDescription: value.doc.longDescription,
              category:value.doc.category,
              createdOn: value.doc.createdOn,
            });
          });
          services.sort((a: any, b: any) => Number(a.order) - Number(b.order));
          // this.serviceBanner = services.shift();
          this.serviceList = services.filter((item:any)=>item.category === 'Shipping');
          console.log(this.serviceList,"serv")
  
        }
      }
  
    );
  }

  onHomeNav(event: any) {
    event.preventDefault();
    if (this.shopName) {
      this.router.navigateByUrl("/site/" + this.shopName);
    } else {
      this.router.navigateByUrl("/");
    }
  }


  paypal(): void  {
    const postData = {
      deliveryDetails: "",
      amount:  this.total * 100,
      currency: 'USD',
      receipt: 'order_rcptid_11',
      payment_capture: '1',
      paidOn : new Date().toJSON(),
      loginEmail : this.loginEmail,
      contactNo : this.contactNo,
      gst : this.gstAmount,
      gateWay : 'Paypal',
      amtPaid : this.total + this.fee,
      orderType : 'Ecommerce'
    };

    this.payPalConfig = {
      currency: 'USD',
      clientId:  this.clientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: this.total.toString(),
            },
          }
        ]
      },
      advanced: {
        commit: 'true',
        extraQueryParams: [ { name: "disable-funding", value:"credit,card"} ]
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: async (data, actions) => {
        this.orderId = data.orderID;
        this.payerId = data.payerID;
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        const order = await actions.order.get().then((details:any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
        this.order = order;
        this.notificationService.showSuccess("Payment is successfull","")
        this.savePayment1(postData);
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.notificationService.showError("Payment Cancelled","")
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
        this.notificationService.showError("Error Found","")
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  savePayment1(data: any) {
    this.calculateTotal();
    const dbData = {
      deliveryDetails: "",
      amount: this.total * 100,
      currency: 'USD',
      receipt: 'order_rcptid_11',
      payment_capture: '1',
      paidOn : new Date().toJSON(),
      loginEmail : this.loginEmail,
      contactNo : this.contactNo,
      gst : this.gstAmount,
      gateWay : 'Paypal',
      amtPaid : this.total + this.fee,
      orderType : 'Ecommerce',
      products: this.dataArray,
      paidAmount: this.total,
      orderId: this.orderId,
      order: this.order,
      payerId: this.payerId
    };

    this.cartService
      .savePayment1(this.shopName, dbData)
      .subscribe((resp: any) => {
        if (resp) {
          this.notificationService.showSuccess("Payment saved successfully","");
          this.cartService.removeCartItems(data).subscribe(console.log);
          this.router.navigateByUrl("/site/" + this.shopName);
        }
      },(err)=> {
        if(err) {
          console.log("Payment Error", err)
          this.notificationService.showSuccess("Error Found","")
        }
      });
  }

}

