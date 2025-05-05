import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown, faSort, } from "@fortawesome/free-solid-svg-icons";
import { Button, DropdownButton, DropdownItem, DropdownMenu, DropdownWrapper, Input, PaginationControls, PaginationWrapper, Select, StyledTable, TableWrapper, Toolbar } from "./styledcomponets/style";
const Table = ({ columns, data, sortable = false, theme = {} }) => {
    const [sortConfig, setSortConfig] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleColumns, setVisibleColumns] = useState(columns);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const filteredData = useMemo(() => {
        return data.filter((row) => visibleColumns.some((col) => String(row[col] || "").toLowerCase().includes(searchText.toLowerCase())));
    }, [data, searchText, visibleColumns]);
    const sortedData = useMemo(() => {
        if (!sortable || !sortConfig)
            return filteredData;
        const sorted = [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
            }
            return sortConfig.direction === "asc"
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
        return sorted;
    }, [filteredData, sortConfig, sortable]);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(start, start + rowsPerPage);
    }, [sortedData, currentPage, rowsPerPage]);
    const totalPages = Math.ceil(sortedData.length / rowsPerPage);
    const handleSort = (column) => {
        if (!sortable)
            return;
        setSortConfig((prev) => (prev === null || prev === void 0 ? void 0 : prev.key) === column
            ? { key: column, direction: prev.direction === "asc" ? "desc" : "asc" }
            : { key: column, direction: "asc" });
    };
    const exportToCSV = () => {
        const headers = visibleColumns.join(",");
        const rows = data.map((row) => visibleColumns.map((col) => { var _a; return `"${(_a = row[col]) !== null && _a !== void 0 ? _a : ""}"`; }).join(","));
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
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const toggleColumn = (col) => {
        setVisibleColumns((prev) => prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]);
    };
    return (React.createElement(TableWrapper, { themeStyle: theme },
        React.createElement(Toolbar, null,
            React.createElement("div", { style: { display: "flex", gap: "0.75rem", flexWrap: "wrap" } },
                React.createElement(Input, { type: "text", placeholder: "Search...", value: searchText, onChange: (e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                    } }),
                React.createElement(Button, { themeStyle: theme, onClick: exportToCSV }, "Export CSV")),
            React.createElement(DropdownWrapper, { ref: dropdownRef },
                React.createElement(DropdownButton, { onClick: () => setIsOpen(!isOpen) }, "Select Columns"),
                isOpen && (React.createElement(DropdownMenu, null, columns.map((col) => (React.createElement(DropdownItem, { key: col },
                    React.createElement("input", { type: "checkbox", checked: visibleColumns.includes(col), onChange: () => toggleColumn(col) }),
                    col))))))),
        React.createElement("div", { style: { overflowX: "auto" } },
            React.createElement(StyledTable, { themeStyle: theme },
                React.createElement("thead", null,
                    React.createElement("tr", null, visibleColumns.map((col) => (React.createElement("th", { key: col, onClick: () => handleSort(col) },
                        col,
                        sortable && (React.createElement(FontAwesomeIcon, { icon: (sortConfig === null || sortConfig === void 0 ? void 0 : sortConfig.key) === col
                                ? sortConfig.direction === "asc"
                                    ? faSortUp
                                    : faSortDown
                                : faSort, style: { marginLeft: "0.5rem", color: "#555" } }))))))),
                React.createElement("tbody", null, paginatedData.map((row, idx) => (React.createElement("tr", { key: idx }, visibleColumns.map((col) => (React.createElement("td", { key: col }, row[col]))))))))),
        React.createElement(PaginationWrapper, null,
            React.createElement(Select, { value: rowsPerPage, onChange: (e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                } }, [10, 25, 50, data.length].map((num) => (React.createElement("option", { key: num, value: num }, num === data.length ? "All" : num)))),
            React.createElement("span", null,
                "Showing ",
                (currentPage - 1) * rowsPerPage + 1,
                " to",
                " ",
                Math.min(currentPage * rowsPerPage, sortedData.length),
                " of",
                " ",
                sortedData.length,
                " entries"),
            React.createElement(PaginationControls, null,
                React.createElement(Button, { themeStyle: theme, onClick: () => setCurrentPage((p) => p - 1), disabled: currentPage === 1 }, "Prev"),
                React.createElement("span", null,
                    "Page ",
                    currentPage,
                    " of ",
                    totalPages),
                React.createElement(Button, { themeStyle: theme, onClick: () => setCurrentPage((p) => p + 1), disabled: currentPage === totalPages }, "Next")))));
};
export default Table;
