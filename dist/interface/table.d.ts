export type TableProps = {
    columns: Column[];
    data: Record<string, any>[];
    sortable?: boolean;
    theme?: TableTheme;
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
    key?: string;
    label?: string;
    filter?: boolean;
    sortable?: boolean;
}
