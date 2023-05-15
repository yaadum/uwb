/**
 * Copyright 2020 Vyasaka Technologies. All Rights Reserved.
 */

import { NgModule } from "@angular/core";

import { FilterPipe } from "./filter.pipe";
import { MinuteSecondsPipe } from "./minuteseconds.pipe";
import { MultipleFilterPipe } from "./multiple-filter.pipe";
import { SearchPipe } from "./search.pipe";

@NgModule({
  imports: [],
  declarations: [FilterPipe, SearchPipe, MultipleFilterPipe, MinuteSecondsPipe],
  exports: [FilterPipe, SearchPipe, MultipleFilterPipe, MinuteSecondsPipe],
})
export class VyaPipeModule {}
