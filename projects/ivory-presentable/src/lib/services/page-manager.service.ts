import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageManagerService {

  private currentPageSub: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSub.asObservable();

  updateCurrentPage(value: number) {
    this.currentPageSub.next(value);
  }

  resetPagination() {
    this.updateCurrentPage(1);
  }

}
