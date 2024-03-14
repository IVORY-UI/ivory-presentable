import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterManagerService {

  public queryModel: any = {};

  constructor() { }

  processFilterOptions(arr: any) {
    let temp = [];
    for (const i of arr) {
      temp.push({ option: i, isSelected: false });
    }
    return temp;
  }

  buildQueryModel(data: any) {
    if (this.queryModel[data.column]===undefined || this.queryModel[data.column]===null) {
      this.queryModel[data.column] = {};
    }
    
    if (data.type==='options') {
      if (data.values.length > 0) {
        this.queryModel[data.column]['type'] = data['type'];
        this.queryModel[data.column]['values'] = data['values'];
      } else {
        delete this.queryModel[data.column];
      }
    } else if (data.type==='text') {
      if (data.keyword!=='') {
        this.queryModel[data.column]['type'] = data['type'];
        this.queryModel[data.column]['keyword'] = data['keyword'];
      } else {
        delete this.queryModel[data.column];
      }
    }
  }

  getQueryModel() {
    return this.queryModel;
  }

  resetQueryModel() {
    this.queryModel = {};
  }

  filterData(data: any, query: any) {
    console.log('Filter query -> ', query);
    const filtered = data.filter((item: any) => {
      for (let key in query) {
        if (query[key]['type']==='text') {
          const regexp = new RegExp(query[key]['keyword'], 'i');
          if (regexp.test(item[key])) {
            return true;
          }
        } else if (query[key]['type']==='options' && query[key]['values'].includes(item[key])) {
          return true;
        }
        return false;
      }
    });
    return filtered;
  }

}
