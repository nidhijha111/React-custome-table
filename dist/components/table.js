import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { Button, DropdownButton, DropdownItem, DropdownMenu, DropdownWrapper, Input, StyledTable, TableWrapper, Toolbar, } from "./styledcomponets/style";
import Pagination from "./pagination";
import TheadData from "./theadData";
const Table = ({ columns, data, theme = {}, pagination, tableTitle }) => {
    const [sortConfig, setSortConfig] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleColumns, setVisibleColumns] = useState(columns.map((c) => c.dataIndex));
    const [filters, setFilters] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [activeFilterColumn, setActiveFilterColumn] = useState(null);
    const [checkedFilterOptions, setCheckedFilterOptions] = useState({});
    const dropdownRef = useRef(null);
    const filterDropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            const target = e.target;
            if (dropdownRef.current &&
                !dropdownRef.current.contains(target) &&
                filterDropdownRef.current &&
                !filterDropdownRef.current.contains(target)) {
                setIsOpen(false);
                setActiveFilterColumn(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const toggleColumn = (key) => {
        setVisibleColumns((prev) => prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]);
    };
    const getUniqueColumnValues = (data, key) => {
        return [...new Set(data.map((row) => row[key]))];
    };
    const searchData = useMemo(() => {
        return data.filter((row) => {
            const matchesGlobal = !searchText ||
                Object.values(row).some((val) => String(val).toLowerCase().includes(searchText.toLowerCase()));
            if (!matchesGlobal)
                return false;
            return visibleColumns.every((colKey) => {
                var _a, _b;
                const filterValue = ((_a = filters[colKey]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "";
                const rowValue = String((_b = row[colKey]) !== null && _b !== void 0 ? _b : "").toLowerCase();
                return rowValue.includes(filterValue);
            });
        });
    }, [data, searchText, filters, visibleColumns]);
    const sortedData = useMemo(() => {
        if (!sortConfig)
            return searchData;
        return [...searchData].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
            }
            return sortConfig.direction === "asc"
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
    }, [searchData, sortConfig]);
    const finalFilteredData = useMemo(() => {
        return sortedData.filter((row) => Object.entries(checkedFilterOptions).every(([key, selectedVals]) => {
            if (!selectedVals || selectedVals.length === 0)
                return true;
            return selectedVals.includes(row[key]);
        }));
    }, [sortedData, checkedFilterOptions]);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return finalFilteredData.slice(start, start + rowsPerPage);
    }, [finalFilteredData, currentPage, rowsPerPage]);
    const totalPages = Math.max(1, Math.ceil(finalFilteredData.length / rowsPerPage));
    const handleSort = (columnKey) => {
        setSortConfig((prev) => (prev === null || prev === void 0 ? void 0 : prev.key) === columnKey
            ? {
                key: columnKey,
                direction: prev.direction === "asc" ? "desc" : "asc",
            }
            : { key: columnKey, direction: "asc" });
    };
    const handleExport = () => {
        const headers = visibleColumns.join(",");
        const rowsCsv = finalFilteredData.map((row) => visibleColumns.map((col) => { var _a; return (_a = row[col]) !== null && _a !== void 0 ? _a : ""; }).join(","));
        const csvContent = [headers, ...rowsCsv].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "table_data.csv";
        link.click();
        URL.revokeObjectURL(url);
    };
    return (React.createElement(TableWrapper, { themeStyle: theme },
        tableTitle && React.createElement("div", null, tableTitle),
        React.createElement(Toolbar, null,
            React.createElement("div", { style: { display: "flex", gap: "0.75rem", flexWrap: "wrap" } },
                React.createElement(Input, { type: "search", placeholder: "Search...", value: searchText, onChange: (e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                    } })),
            React.createElement("div", { style: { display: "flex", gap: "0.75rem", flexWrap: "wrap" } },
                React.createElement(Button, { themeStyle: theme, onClick: handleExport },
                    React.createElement(FontAwesomeIcon, { icon: faDownload }),
                    " Export CSV"),
                React.createElement(DropdownWrapper, { ref: dropdownRef },
                    React.createElement(DropdownButton, { onClick: () => setIsOpen((o) => !o) }, "Select Columns"),
                    isOpen && (React.createElement(DropdownMenu, null, columns.map((col) => (React.createElement(DropdownItem, { key: col.dataIndex },
                        React.createElement("input", { type: "checkbox", checked: visibleColumns.includes(col.dataIndex), onChange: () => toggleColumn(col.dataIndex) }),
                        col.title)))))))),
        React.createElement("div", { style: { overflowX: "auto" } },
            React.createElement(StyledTable, { themeStyle: theme },
                React.createElement("thead", null,
                    React.createElement("tr", null, columns
                        .filter((col) => visibleColumns.includes(col.dataIndex))
                        .map((col) => (React.createElement(TheadData, { key: col.dataIndex, col: col, handleSort: handleSort, filters: filters, setFilters: setFilters, setCurrentPage: setCurrentPage, activeFilterColumn: activeFilterColumn, setActiveFilterColumn: setActiveFilterColumn, sortConfig: sortConfig, filterDropdownRef: filterDropdownRef, getUniqueColumnValues: getUniqueColumnValues, checkedFilterOptions: checkedFilterOptions, setCheckedFilterOptions: setCheckedFilterOptions, theme: theme, data: data }))))),
                React.createElement("tbody", null, paginatedData.map((row, rowIndex) => (React.createElement("tr", { key: rowIndex }, columns
                    .filter((col) => visibleColumns.includes(col.dataIndex))
                    .map((col) => (React.createElement("td", { key: col.dataIndex }, row[col.dataIndex]))))))))),
        pagination && React.createElement(Pagination, { currentPage: currentPage, totalPages: totalPages, setCurrentPage: setCurrentPage, setRowsPerPage: setRowsPerPage, rowsPerPage: rowsPerPage, data: data, theme: theme })));
};
export default Table;
