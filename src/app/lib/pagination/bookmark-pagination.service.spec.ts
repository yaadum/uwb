import { TestBed } from "@angular/core/testing";

import { BookmarkPaginationService } from "./bookmark-pagination.service";

describe("BookmarkPaginationService", () => {
  let service: BookmarkPaginationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookmarkPaginationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
