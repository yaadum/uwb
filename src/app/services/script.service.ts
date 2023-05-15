import { Injectable } from '@angular/core';

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  {
    name: 'jquery',
    src: '../../assets/js/jquery/js/jquery.min.js',
  },
  {
    name: 'jquery-ui',
    src: '../../assets/js/jquery-ui/js/jquery-ui.min.js',
  },
  {
    name: 'popper',
    src: '../../assets/js/popper.js/js/popper.min.js',
  },
  {
    name: 'bootstrap',
    src: '../../assets/js/bootstrap/js/bootstrap.min.js',
  },
  {
    name: 'waves',
    src: '../../assets/pages/waves/js/waves.min.js',
  },
  {
    name: 'slimscroll',
    src: '../../assets/js/jquery-slimscroll/js/jquery.slimscroll.js',
  },
  {
    name: 'modernizr',
    src: '../../assets/js/modernizr/js/modernizr.js',
  },
  {
    name: 'mCustomScrollbar',
    src: '../../assets/js/jquery.mCustomScrollbar.concat.min.js',
  },
  {
    name: 'pcoded',
    src: '../../assets/js/pcoded.min.js',
  },
  {
    name: 'mainScript',
    src: '../../assets/js/script.js',
  },
  {
    name: 'verticalLayout',
    src: '../../assets/js/vertical/vertical-layout.min.js',
  },
  {
    name: 'razorPay',
    src: 'https://checkout.razorpay.com/v1/checkout.js',
  },
  {
    name: 'pusher',
    src: 'https://js.pusher.com/7.0/pusher.min.js',
  },
];

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  private scripts: any = {};

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src,
      };
    });
  }

  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    // @ts-ignore
    return new Promise((resolve, reject) => {
      // resolve if already loaded
      if (this.scripts[name].loaded) {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      } else {
        // load script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        script.onload = () => {
          this.scripts[name].loaded = true;
          console.log(`${name} Loaded.`);
          resolve({ script: name, loaded: true, status: 'Loaded' });
        };
        // @ts-ignore
        script.onerror = (error: any) =>
          resolve({ script: name, loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }
}
