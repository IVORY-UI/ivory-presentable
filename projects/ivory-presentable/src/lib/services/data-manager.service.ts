import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService {

  canSelectAll(dataSet: any) {
    for (let i=0; i<dataSet.length; i++) {
      if (!dataSet[i].isSelected) {
        return false;
      }
    }
  }

}
