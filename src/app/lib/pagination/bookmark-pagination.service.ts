import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { VyaRestClientService } from "vya-restclient";

@Injectable({
  providedIn: "root",
})
export class BookmarkPaginationService {
  constructor(private restClient: VyaRestClientService) {}
  public paginate(
    url: string,
    limit?: number,
    bookmark?: string
  ): Observable<any> {
    let httpGetRequestCall: any;
    if (limit && !bookmark) {
      httpGetRequestCall = this.restClient.get(`${url}?limit=${limit}`);
    } else if (limit && bookmark) {
      httpGetRequestCall = this.restClient.get(
        `${url}?limit=${limit}&bookmark=${bookmark}`
      );
    } else {
      httpGetRequestCall = this.restClient.get(`${url}`);
    }
    return httpGetRequestCall;
  }
}
