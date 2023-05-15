import { Injectable } from "@angular/core";
import { NotificationsService } from "angular2-notifications";
/*import { NotificationsService, NotificationType } from "angular2-notifications";*/

@Injectable()
export class AlertService {
  private options = {
    timeOut: 5000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    animate: "fromRight",
  };

  constructor(private _notifications: NotificationsService) {}

  error(title: string, message: string) {
    this._notifications.error(title, message, this.options);
  }
}
