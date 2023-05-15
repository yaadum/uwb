/**
 * Copyright 2020 Vyasaka Technologies
 */

import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { VyaPouchDb } from "vya-pouchdb";
import { VyaPouchDbService } from "vya-pouchdb";

import { BlogConstant } from "../modules/blog/blog-constant";
import { CircularConstant } from "../modules/circular/circular-constant";
import { DocumentConstant } from "../modules/document/document-constant";
import { DocumentMasterConstant } from "../modules/document/document-master/document-master-constant";
import { EventConstant } from "../modules/event/event-constant";
import { GalleryConstant } from "../modules/gallery/gallery-constant";
import { MasterConstant } from "../modules/master/master.constant";
import { ServicesConstant } from "../modules/services/services-constant";

import { SessionStore } from "./session.store";

@Injectable()
export class DbService {
  protected db: VyaPouchDb;

  constructor() {
    const cid = SessionStore.getSubscriptionCid();
    this.db = VyaPouchDbService.getDb(cid);

    this.db.syncToLocal("event", { docType: EventConstant.DOC_TYPE });
    this.db.syncToLocal("gallery", { docType: GalleryConstant.DOC_TYPE });
    this.db.syncToLocal("services", { docType: ServicesConstant.DOC_TYPE });
    this.db.syncToLocal("blog", { docType: BlogConstant.DOC_TYPE });
    this.db.syncToLocal("document", { docType: DocumentConstant.DOC_TYPE });
    this.db.syncToLocal("document-master", {
      docType: DocumentMasterConstant.DOC_TYPE,
    });
    this.db.syncToLocal("circular", { docType: CircularConstant.DOC_TYPE });
    this.db.syncToLocal("website-master", { docType: MasterConstant.DOC_TYPE });
  }

  getChangeListener(): EventEmitter<any> {
    return this.db.getChangeListener();
  }

  syncFrom(data: string) {
    console.log("Fetching data ...", data);
    /*
    switch (data) {
      case "near-miss":
        this.db.syncToLocal(data, { docType: NearMissConstant.DOC_TYPE });
        break;
      case "all-master":
        this.db.syncToLocal("all-master", {
          docType: NearMissMasterConstant.DOC_TYPE
        });
        break;
        console.log("Fetching done ...", data);
    }
    */
  }

  syncTo(docty: any) {
    this.db.syncToRemote({ docType: docty });
  }

  sync() {
    this.db.syncToRemote({ docType: EventConstant.DOC_TYPE });
    this.db.syncToRemote({ docType: BlogConstant.DOC_TYPE });
    this.db.syncToRemote({ docType: CircularConstant.DOC_TYPE });
    this.db.syncToRemote({ docType: ServicesConstant.DOC_TYPE });
    this.db.syncToRemote({ docType: DocumentConstant.DOC_TYPE });
    this.db.syncToRemote({ docType: GalleryConstant.DOC_TYPE });
    this.db.syncToRemote({ docType: DocumentMasterConstant.DOC_TYPE });
    this.db.syncToRemote({ docType: MasterConstant.DOC_TYPE });
    return true;
  }

  getAll(docType: string, docTypeValue: string): Observable<any> {
    return new Observable((observer) => {
      this.db.queryEq(docType, docTypeValue).subscribe(
        (result) => {
          observer.next(result["docs"]);
        },
        (error) => {
          console.error("Error in getting all documents:", error);
          observer.next(error);
        }
      );
    });
  }

  get(_id: string) {
    return new Observable((observer) => {
      this.db.get(_id).subscribe(
        (result: any) => {
          observer.next(result);
        },
        (error: any) => {
          console.error("Error in getting document:", error);
          observer.next(error);
        }
      );
    });
  }

  create(data: { [key: string]: any }) {
    return new Observable((observer) => {
      this.db.create(data).subscribe(result => {
          observer.next(result);
        },
        (error) => {
          console.error("Error in creating document:", error);
          observer.next(error);
        }
      );
    });
  }

  appendField(docTypeValue: string, key: string, value: any) {
    return new Observable((observer) => {
      this.db.appendField(docTypeValue, key, value).subscribe(
        (result) => {
          observer.next(result);
        },
        (error) => {
          console.error("Error in appending document:", error);
          observer.next(error);
        }
      );
    });
  }

  update(data: { [key: string]: any }) {
    return new Observable((observer) => {
      this.db.update(data).subscribe(
        (result: any) => {
          observer.next(result);
        },
        (error: any) => {
          console.error("Error in creating document:", error);
          observer.next(error);
        }
      );
    });
  }

  remove(_id: string) {
    return new Observable((observer) => {
      this.db.remove(_id).subscribe(
        (result: any) => {
          observer.next(result);
        },
        (error: any) => {
          console.error("Error in deleting document:", error);
          observer.next(error);
        }
      );
    });
  }

  // @ts-ignore TS6133
  isDocExist(_id: string) {
    return new Observable((observer) => {
      this.db.get(_id).subscribe(
        () => {
          observer.next(true);
        },
        () => {
          observer.next(false);
        }
      );
    });
  }
}
