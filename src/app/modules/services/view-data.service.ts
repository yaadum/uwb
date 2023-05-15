import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ViewDataService {
  private viewSource = new BehaviorSubject<any>({});
  currentViewSource = this.viewSource.asObservable();

  constructor() {}

  changeView(view: any) {
    this.viewSource.next(view);
  }
}
