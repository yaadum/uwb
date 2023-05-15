import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map, mapTo } from "rxjs/operators";
import { VyaRestClientService } from "vya-restclient";
import { MyPaginationService } from "./pagination.service";


@Injectable({
  providedIn: "root"
})
export class BlogService {
  constructor(
    private restClient: VyaRestClientService,
    private paginationService: MyPaginationService
  ) {}

  blogUrl: string = `/api/site/blog`;

  getBlogById(id: any): Observable<any> {
    return this.restClient.get(`${this.blogUrl}/${id}`).pipe(
      map((value: any) => {
        return value.doc.docs[0];
      }),
      catchError(error => {
        return error;
      })
    );
  }

  getAll(limit: string, startkey?: string, endkey?: string): Observable<any> {
    return this.restClient
      .get(`${this.blogUrl}`)
      .pipe(
        map((value: any) => {
          if (value) {
            return value.response;
          }
        }),
        catchError(error => {
          return error;
        })
      );
  }

  deleteBlogById(id: any): Observable<any | boolean> {
    return this.restClient.delete(`${this.blogUrl}/${id}`).pipe(
      mapTo(true),
      catchError(error => {
        return error;
      })
    );
  }

  editBlogById(data: any, id: any): Observable<any | boolean> {
    return this.restClient.put(`${this.blogUrl}/${id}`, data).pipe(
      mapTo(true),
      catchError(error => {
        return error;
      })
    );
  }

  addBlog(data: any): Observable<any | boolean> {
    return this.restClient.post(`${this.blogUrl}`, data).pipe(
      mapTo(true),
      catchError(error => {
        return error;
      })
    );
  }

  // class END
}
