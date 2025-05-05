export type TableProps = {
    columns: string[];
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
