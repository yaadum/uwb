/*
 * Copyright (c) 2020 Vyasaka Technologies. All Rights Reserved.
 */

import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { FormGroup, FormBuilder } from "@angular/forms";

@Component({
  templateUrl: "./procedure-modal.component.html",
})
export class ProcedureModalComponent implements OnInit {
  public active: boolean = false;
  public body: string | undefined = undefined;
  public title: string | undefined = undefined;
  public onClose: Subject<boolean> = new Subject<boolean>();

  public constructor(
    private _bsModalRef: BsModalRef,
    private formBuilder: FormBuilder
  ) {}

  myForm: FormGroup = new FormGroup({});

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({});
    this.onClose = new Subject();
  }

  public showConfirmationModal(title: string, body: string): void {
    this.title = title;
    this.body = body;
    this.active = true;
  }

  public onConfirm(): void {
    this.active = false;
    this.onClose.next(true);
    this._bsModalRef.hide();
  }

  public onCancel(): void {
    this.active = false;
    this.onClose.next(false);
    this._bsModalRef.hide();
  }

  public hideConfirmationModal(): void {
    this.active = false;
    this.onClose.next(undefined);
    this._bsModalRef.hide();
  }
}
