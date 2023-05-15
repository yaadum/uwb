/**
 * Copyright 2020 Vyasaka Technologies. All Rights Reserved.
 */

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "multiplefilterPipe",
})
export class MultipleFilterPipe implements PipeTransform {
  transform(items: any, filter?: any, searchKey?: any, searchKey1?: any): any {
    return filter
      ? items.filter((show: any) => show[searchKey][searchKey1] === filter)
      : items;
  }
}
