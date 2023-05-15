/*
 * Copyright (c) 2020 Vyasaka Technologies. All Rights Reserved.
 */

import { Injectable } from "@angular/core";

import { BsModalService } from "ngx-bootstrap/modal";
import { ConfirmationModalComponent } from "./confirmation-modal.component";
import { ProcedureModalComponent } from "./procedure-modal.component";
@Injectable({
  providedIn: "root",
})
export class ConfirmationModalService {
  constructor(private modalService: BsModalService) {}
  createConfirmationModal() {
    const bsModalRef = this.modalService.show(ConfirmationModalComponent, {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false,
    });
    return bsModalRef;
  }

  createProcedureModal() {
    const bsModalRef = this.modalService.show(ProcedureModalComponent, {
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: false,
    });
    return bsModalRef;
  }
}
