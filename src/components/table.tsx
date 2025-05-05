import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  faSortUp,
  faSortDown,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownWrapper,
  Input,
  PaginationControls,
  PaginationWrapper,
  Select,
  StyledTable,
  TableWrapper,
  Toolbar,
} from "./styledcomponets/style";

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
        const filterValue = filters[colKey]?.toLowerCase() || "";
        const rowValue = String(row[colKey] || "").toLowerCase();
        return rowValue.includes(filterValue);
      });
    });
  }, [data, filters, visibleColumns]);

  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig) return filteredData;
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
    if (!sortable) return;
    setSortConfig((prev) =>
      prev?.key === columnKey
        ? { key: columnKey, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key: columnKey, direction: "asc" }
    );
  };

  const exportToCSV = () => {
    const headers = visibleColumns.join(",");
    const rows = data.map((row) => visibleColumns.map((col) => row[col] ?? "").join(","));
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
    setVisibleColumns((prev) =>
      prev.includes(colKey) ? prev.filter((c) => c !== colKey) : [...prev, colKey]
    );
  };

  return (
    <TableWrapper themeStyle={theme}>
      <Toolbar>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button themeStyle={theme} onClick={exportToCSV}>Export CSV</Button>
        </div>

        <DropdownWrapper ref={dropdownRef}>
          <DropdownButton onClick={() => setIsOpen(!isOpen)}>Select Columns</DropdownButton>
          {isOpen && (
            <DropdownMenu>
              {columns.map((col) => (
                <DropdownItem key={col.dataIndex}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col.dataIndex)}
                    onChange={() => toggleColumn(col.dataIndex)}
                  />
                  {col.title}
                </DropdownItem>
              ))}
            </DropdownMenu>
          )}
        </DropdownWrapper>
      </Toolbar>

      <div style={{ overflowX: "auto" }}>
        <StyledTable themeStyle={theme}>
          <thead>
            <tr>
              {columns.filter(col => visibleColumns.includes(col.dataIndex)).map((col) => (
                <th key={col.dataIndex}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: col.sorter ? "pointer" : "default" }}
                      onClick={() => col.sorter && handleSort(col.dataIndex)}
                    >
                      {col.title}
                      {col.sorter && (
                        <FontAwesomeIcon
                          icon={
                            sortConfig?.key === col.dataIndex
                              ? sortConfig.direction === "asc"
                                ? faSortUp
                                : faSortDown
                              : faSort
                          }
                          style={{ marginLeft: "0.5rem", color: "#555" }}
                        />
                      )}
                    </div>

                    {col.showSearch && (
                      <Input
                        type="text"
                        placeholder={`Search ${col.title}`}
                        value={filters[col.dataIndex] || ""}
                        onChange={(e) => setFilters((prev) => ({ ...prev, [col.dataIndex]: e.target.value }))}
                        style={{ marginTop: "0.25rem", width: "100%" }}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.filter(col => visibleColumns.includes(col.dataIndex)).map((col) => (
                  <td key={col.dataIndex} rowSpan={col.onCell?.(row)?.rowSpan || 1}>
                    {col.customRenderer ? col.customRenderer(row[col.dataIndex], row) : row[col.dataIndex] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </div>

      <PaginationWrapper>
        <Select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          {[10, 25, 50, data.length].map((num) => (
            <option key={num} value={num}>{num === data.length ? "All" : num}</option>
          ))}
        </Select>
        <span>
          Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} entries
        </span>
        <PaginationControls>
          <Button themeStyle={theme} onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}><FiChevronLeft size={20} /></Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button themeStyle={theme} onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}><FiChevronRight size={20} /></Button>
        </PaginationControls>
      </PaginationWrapper>
    </TableWrapper>
  );
};

export default Table;
