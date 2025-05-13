import { ReactNode } from "react";

export type TableProps = {
  columns: Column[];
  data: Record<string, any>[];
  theme?: TableTheme;
  pagination?:boolean;
  exportCsv?:boolean;
  tableSearch?:boolean;
  tableTitle?:string;
  tableSubTitle?:string;
  columnViewOtion?:boolean;
  columnMove?:boolean;
};

export type TableTheme = {
  primaryColor?: string;
  headerBg?: string;
  rowHoverColor?: string;
  borderColor?: string;
  buttonBg?: string;
  textColor?: string;
};

export interface Column {
  title: string; 
  dataIndex: string; 
  sorter?: boolean; 
  showSearch?: boolean; 
  customRenderer?: (value: any, row: any) => ReactNode;
  onCell?: (record: any) => { rowSpan?: number; colSpan?: number }; 
  showFilter?:boolean;
  width?:number;
  hideColumn?:boolean;
}
