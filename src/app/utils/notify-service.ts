import { Subject } from "rxjs";

export class NotifyService {
  static unseenCount = new Subject<number>();

  static setUnSyncCount(count: number) {
    this.unseenCount.next(count); // this will make sure to tell every subscriber about the change.
    localStorage.setItem("localDbUnSyncCount", count.toString());
  }

  static getUnSyncCount() {
    const pouchDbUnSyncCount = localStorage.getItem("localDbUnSyncCount");
    if (pouchDbUnSyncCount === null) {
      return 0;
    } else {
      return parseInt(pouchDbUnSyncCount, 10);
    }
  }
}
