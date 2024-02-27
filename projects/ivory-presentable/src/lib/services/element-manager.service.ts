import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElementManagerService {
  datagrid: HTMLElement | undefined;
  datagridHeader: HTMLElement | undefined;
  datagridBody: HTMLElement | undefined;

  constructor() { }

  registerDatagridEl(datagrid: HTMLElement) {
    this.datagrid = datagrid;
  }

  getDatagridEl(): HTMLElement | undefined {
    return this.datagrid;
  }

  getDatagridElDimenstions(): any | undefined {
    return this.datagrid?.getBoundingClientRect() || {};
  }

  registerDatagridHeaderEl(datagridHeader: HTMLElement) {
    this.datagridHeader = datagridHeader;
  }

  getDatagridHeaderEl(): HTMLElement | undefined {
    return this.datagridHeader;
  }

  getDatagridHeaderElDimenstions(): any | undefined {
    return this.datagridHeader?.getBoundingClientRect() || {};
  }

  registerDatagridBodyEl(datagridBody: HTMLElement) {
    this.datagridBody = datagridBody;
  }

  getDatagridBodyEl(): HTMLElement | undefined {
    return this.datagridBody;
  }
}
