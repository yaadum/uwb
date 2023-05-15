/*
 * Copyright (c) 2020 Vyasaka Technologies. All Rights Reserved.
 */
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DbService } from "./db.service";
@Injectable()
export class DataService {
  constructor(private dbService: DbService) {}
  getAll(docType: string): Observable<any> {
    return new Observable((observer) => {
      this.dbService.getAll("docType", docType).subscribe(
        (result: any) => {
          observer.next(result);
        },
        (error: any) => {
          console.error("Error in getting all sync-update:", error);
          observer.next(error);
        }
      );
    });
  }
}
