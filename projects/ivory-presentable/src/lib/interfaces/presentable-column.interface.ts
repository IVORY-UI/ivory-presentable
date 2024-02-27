export interface PresentableColumn {
  header?: string;
  field?: string;
  sortable?: boolean;
  resizable?: boolean;
  hasFilter?: boolean;
  filterOptions?: any[];
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  isCheckbox?: boolean;
  widthGrow?: number;
  forcedWidth?: boolean;
  initialWidth?: number | string;
  [x: string | number | symbol ]: unknown;
}
