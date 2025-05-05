import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortUp, faSortDown, faSort, } from "@fortawesome/free-solid-svg-icons";
import { Button, DropdownButton, DropdownItem, DropdownMenu, DropdownWrapper, Input, PaginationControls, PaginationWrapper, Select, StyledTable, TableWrapper, Toolbar, } from "./styledcomponets/style";
const Table = ({ columns, data, sortable = false, theme = {} }) => {
    const [sortConfig, setSortConfig] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleColumns, setVisibleColumns] = useState(columns.map((c) => c.dataIndex));
    const [filters, setFilters] = useState({});
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    // Combined filtering: global search + column filters
    const filteredData = useMemo(() => {
        return data.filter((row) => {
            // global search
            const matchesGlobal = !searchText ||
                Object.values(row).some((val) => String(val).toLowerCase().includes(searchText.toLowerCase()));
            if (!matchesGlobal)
                return false;
            // column filters
            return visibleColumns.every((colKey) => {
                var _a, _b;
                const filterValue = ((_a = filters[colKey]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "";
                const rowValue = String((_b = row[colKey]) !== null && _b !== void 0 ? _b : "").toLowerCase();
                return rowValue.includes(filterValue);
            });
        });
    }, [data, searchText, filters, visibleColumns]);
    // Sorting
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
    // Pagination slice
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(start, start + rowsPerPage);
    }, [sortedData, currentPage, rowsPerPage]);
    const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));
    // Handlers
    const handleSort = (columnKey) => {
        if (!sortable)
            return;
        setSortConfig((prev) => (prev === null || prev === void 0 ? void 0 : prev.key) === columnKey
            ? { key: columnKey, direction: prev.direction === "asc" ? "desc" : "asc" }
            : { key: columnKey, direction: "asc" });
    };
    const handleExport = () => {
        const headers = visibleColumns.join(",");
        const rowsCsv = sortedData.map((row) => visibleColumns.map((col) => { var _a; return (_a = row[col]) !== null && _a !== void 0 ? _a : ""; }).join(","));
        const csvContent = [headers, ...rowsCsv].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "table_data.csv";
        link.click();
        URL.revokeObjectURL(url);
    };
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                // close
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const toggleColumn = (key) => {
        setVisibleColumns((prev) => prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]);
    };
    return (React.createElement(TableWrapper, { themeStyle: theme },
        React.createElement(Toolbar, null,
            React.createElement("div", { style: { display: "flex", gap: "0.75rem", flexWrap: "wrap" } },
                React.createElement(Input, { type: "text", placeholder: "Search...", value: searchText, onChange: (e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                    } }),
                React.createElement(Button, { themeStyle: theme, onClick: handleExport }, "Export CSV")),
            React.createElement(DropdownWrapper, { ref: dropdownRef },
                React.createElement(DropdownButton, { onClick: () => setIsOpen((o) => !o) }, "Select Columns"),
                isOpen && (React.createElement(DropdownMenu, null, columns.map((col) => (React.createElement(DropdownItem, { key: col.dataIndex },
                    React.createElement("input", { type: "checkbox", checked: visibleColumns.includes(col.dataIndex), onChange: () => toggleColumn(col.dataIndex) }),
                    col.title))))))),
        React.createElement("div", { style: { overflowX: "auto" } },
            React.createElement(StyledTable, { themeStyle: theme },
                React.createElement("thead", null,
                    React.createElement("tr", null, columns
                        .filter((col) => visibleColumns.includes(col.dataIndex))
                        .map((col) => (React.createElement("th", { key: col.dataIndex },
                        React.createElement("div", { style: { display: "flex", flexDirection: "column" } },
                            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.5rem", cursor: col.sorter ? "pointer" : "default" }, onClick: () => col.sorter && handleSort(col.dataIndex) },
                                col.title,
                                col.sorter && (React.createElement(FontAwesomeIcon, { icon: (sortConfig === null || sortConfig === void 0 ? void 0 : sortConfig.key) === col.dataIndex
                                        ? sortConfig.direction === "asc"
                                            ? faSortUp
                                            : faSortDown
                                        : faSort }))),
                            col.showSearch && (React.createElement(Input, { type: "text", placeholder: `Filter ${col.title}`, value: filters[col.dataIndex] || "", onChange: (e) => {
                                    setFilters((f) => (Object.assign(Object.assign({}, f), { [col.dataIndex]: e.target.value })));
                                    setCurrentPage(1);
                                } })))))))),
                React.createElement("tbody", null, paginatedData.map((row, ri) => (React.createElement("tr", { key: ri }, columns
                    .filter((col) => visibleColumns.includes(col.dataIndex))
                    .map((col) => {
                    var _a;
                    return (React.createElement("td", { key: col.dataIndex }, col.customRenderer
                        ? col.customRenderer(row[col.dataIndex], row)
                        : String((_a = row[col.dataIndex]) !== null && _a !== void 0 ? _a : "-")));
                }))))))),
        React.createElement(PaginationWrapper, null,
            React.createElement(PaginationControls, null,
                React.createElement(Button, { themeStyle: theme, onClick: () => setCurrentPage(1), disabled: currentPage === 1 }, "First"),
                React.createElement(Button, { themeStyle: theme, onClick: () => setCurrentPage((p) => Math.max(p - 1, 1)), disabled: currentPage === 1 }, "Prev"),
                React.createElement("span", null,
                    "Page ",
                    currentPage,
                    " of ",
                    totalPages),
                React.createElement(Button, { themeStyle: theme, onClick: () => setCurrentPage((p) => Math.min(p + 1, totalPages)), disabled: currentPage === totalPages }, "Next"),
                React.createElement(Button, { themeStyle: theme, onClick: () => setCurrentPage(totalPages), disabled: currentPage === totalPages }, "Last")),
            React.createElement(Select, { value: rowsPerPage, onChange: (e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); } }, [5, 10, 25, 50].map(s => React.createElement("option", { key: s, value: s }, s === data.length ? 'All' : `Show ${s}`))))));
};
export default Table;
