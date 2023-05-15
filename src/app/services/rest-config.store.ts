import { HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment.prod";

import { VyaRestClientConfig } from "vya-restclient";

// import { AppConfigStore } from "./app-config.store";
import { SessionStore } from "./session.store";

export class RestConfigStore extends VyaRestClientConfig {
  constructor() {
    super();
    let config:any=[];
    config.apiUrl = environment.apiUrl;
    config.loginPortal = environment.loginPortal;
    super.setApiConfig(config);
  }

  getReqHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/json");
    headers = headers.set("Accept", "application/json");

    if (SessionStore.getAccessToken() !== null) {
      headers = headers.set(
        "Authorization",
        "Bearer " + SessionStore.getAccessToken()
      );
    }

    return headers;
  }
}
