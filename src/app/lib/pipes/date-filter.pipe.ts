/**
 * Copyright 2020 Vyasaka Technologies. All Rights Reserved.
 */

import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "datefilterPipe",
})
export class DateFilterPipe implements PipeTransform {
  transform(items: any, filter?: any[], searchKey?: any): any {
    return filter
      ? items.filter(
          (show: any) =>
            new Date(show[searchKey]) > filter[0] &&
            new Date(show[searchKey]) < filter[1]
        )
      : items;
  }
}
