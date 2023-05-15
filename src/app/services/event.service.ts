import { EventEmitter, Injectable } from "@angular/core";

@Injectable()
export class EventService {
  sidebarEvent: EventEmitter<boolean> = new EventEmitter();
  vesselChangeEvent: EventEmitter<any> = new EventEmitter();

  constructor() {}

  emitSidebarChangeEvent(sidebarMinimized: boolean) {
    this.sidebarEvent.emit(sidebarMinimized);
  }

  getSidebarChangeEmitter() {
    return this.sidebarEvent;
  }

  emitVesselChangeEvent(vesselData: any) {
    this.vesselChangeEvent.emit(vesselData);
  }
  getVesselChangeEvent() {
    return this.vesselChangeEvent;
  }
}
