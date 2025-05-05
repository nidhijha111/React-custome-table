import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { faSortUp, faSortDown, faSort, } from "@fortawesome/free-solid-svg-icons";
import { Button, DropdownButton, DropdownItem, DropdownMenu, DropdownWrapper, Input, PaginationControls, PaginationWrapper, Select, StyledTable, TableWrapper, Toolbar, } from "./styledcomponets/style";
const Table = ({ columns, data, sortable = false, theme = {} }) => {
    const [sortConfig, setSortConfig] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleColumns, setVisibleColumns] = useState(columns.map(c => c.dataIndex));
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({});
    const dropdownRef = useRef(null);
    const filteredData = useMemo(() => {
        return data.filter((row) => {
            return visibleColumns.every((colKey) => {
                var _a;
                const filterValue = ((_a = filters[colKey]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "";
                const rowValue = String(row[colKey] || "").toLowerCase();
                return rowValue.includes(filterValue);
            });
        });
    }, [data, filters, visibleColumns]);
    const sortedData = useMemo(() => {
        if (!sortable || !sortConfig)
            return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
            }
            return sortConfig.direction === "asc"
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
    }, [filteredData, sortConfig, sortable]);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(start, start + rowsPerPage);
    }, [sortedData, currentPage, rowsPerPage]);
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const handleSort = (columnKey) => {
        if (!sortable)
            return;
        setSortConfig((prev) => (prev === null || prev === void 0 ? void 0 : prev.key) === columnKey
            ? { key: columnKey, direction: prev.direction === "asc" ? "desc" : "asc" }
            : { key: columnKey, direction: "asc" });
    };
    const exportToCSV = () => {
        const headers = visibleColumns.join(",");
        const rows = data.map((row) => visibleColumns.map((col) => { var _a; return (_a = row[col]) !== null && _a !== void 0 ? _a : ""; }).join(","));
        const csvContent = [headers, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "table_data.csv";
        link.click();
        URL.revokeObjectURL(url);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const toggleColumn = (colKey) => {
        setVisibleColumns((prev) => prev.includes(colKey) ? prev.filter((c) => c !== colKey) : [...prev, colKey]);
    };
    return (React.createElement(TableWrapper, { themeStyle: theme },
        React.createElement(Toolbar, null,
            React.createElement("div", { style: { display: "flex", gap: "0.75rem", flexWrap: "wrap" } },
                React.createElement(Input, { type: "text", placeholder: "Search...", value: searchText, onChange: (e) => setSearchText(e.target.value) }),
                React.createElement(Button, { themeStyle: theme, onClick: exportToCSV }, "Export CSV")),
            React.createElement(DropdownWrapper, { ref: dropdownRef },
                React.createElement(DropdownButton, { onClick: () => setIsOpen(!isOpen) }, "Select Columns"),
                isOpen && (React.createElement(DropdownMenu, null, columns.map((col) => (React.createElement(DropdownItem, { key: col.dataIndex },
                    React.createElement("input", { type: "checkbox", checked: visibleColumns.includes(col.dataIndex), onChange: () => toggleColumn(col.dataIndex) }),
                    col.title))))))),
        React.createElement("div", { style: { overflowX: "auto" } },
            React.createElement(StyledTable, { themeStyle: theme },
                React.createElement("thead", null,
                    React.createElement("tr", null, columns.filter(col => visibleColumns.includes(col.dataIndex)).map((col) => (React.createElement("th", { key: col.dataIndex },
                        React.createElement("div", { style: { display: "flex", flexDirection: "column" } },
                            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem", cursor: col.sorter ? "pointer" : "default" }, onClick: () => col.sorter && handleSort(col.dataIndex) },
                                col.title,
                                col.sorter && (React.createElement(FontAwesomeIcon, { icon: (sortConfig === null || sortConfig === void 0 ? void 0 : sortConfig.key) === col.dataIndex
                                        ? sortConfig.direction === "asc"
                                            ? faSortUp
                                            : faSortDown
                                        : faSort, style: { marginLeft: "0.5rem", color: "#555" } }))),
                            col.showSearch && (React.createElement(Input, { type: "text", placeholder: `Search ${col.title}`, value: filters[col.dataIndex] || "", onChange: (e) => setFilters((prev) => (Object.assign(Object.assign({}, prev), { [col.dataIndex]: e.target.value }))), style: { marginTop: "0.25rem", width: "100%" } })))))))),
                React.createElement("tbody", null, paginatedData.map((row, rowIndex) => (React.createElement("tr", { key: rowIndex }, columns.filter(col => visibleColumns.includes(col.dataIndex)).map((col) => {
                    var _a, _b, _c;
                    return (React.createElement("td", { key: col.dataIndex, rowSpan: ((_b = (_a = col.onCell) === null || _a === void 0 ? void 0 : _a.call(col, row)) === null || _b === void 0 ? void 0 : _b.rowSpan) || 1 }, col.customRenderer ? col.customRenderer(row[col.dataIndex], row) : (_c = row[col.dataIndex]) !== null && _c !== void 0 ? _c : "-"));
                }))))))),
        React.createElement(PaginationWrapper, null,
            React.createElement(Select, { value: rowsPerPage, onChange: (e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                } }, [10, 25, 50, data.length].map((num) => (React.createElement("option", { key: num, value: num }, num === data.length ? "All" : num)))),
            React.createElement("span", null,
                "Showing ",
                (currentPage - 1) * rowsPerPage + 1,
                " to ",
                Math.min(currentPage * rowsPerPage, sortedData.length),
                " of ",
                sortedData.length,
                " entries"),
            React.createElement(PaginationControls, null,
                React.createElement(Button, { themeStyle: theme, onClick: () => setCurrentPage((p) => p - 1), disabled: currentPage === 1 },
                    React.createElement(FiChevronLeft, { size: 20 })),
                React.createElement("span", null,
                    "Page ",
                    currentPage,
                    " of ",
                    totalPages),
                React.createElement(Button, { themeStyle: theme, onClick: () => setCurrentPage((p) => p + 1), disabled: currentPage === totalPages },
                    React.createElement(FiChevronRight, { size: 20 }))))));
};
export default Table;
