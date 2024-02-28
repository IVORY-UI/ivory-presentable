import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterManagerService {

  constructor() { }

  processFilterOptions(arr: any) {
    let temp = [];
    for (const i of arr) {
      temp.push({ option: i, isSelected: false });
    }
    return temp;
  }

}
