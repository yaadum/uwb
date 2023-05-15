/**
 * Copyright 2020 Vyasaka Technologies. All Rights Reserved.
 */

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterPipe",
})
export class FilterPipe implements PipeTransform {
  transform(items: any, filter?: any, searchKey?: any): any {
    return filter
      ? items.filter((show: any) => show[searchKey] === filter)
      : items;
  }
}
