import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  faSortUp,
  faSortDown,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { Column, TableProps } from "../interface/table";
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

const Table: React.FC<TableProps> = ({
  columns,
  data,
  sortable = false,
  theme = {},
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns);
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return visibleColumns.every((col) => {
        const filterValue = filters[col] ? filters[col].toLowerCase() : "";
        const rowValue = String(row[col] || "").toLowerCase();
        return rowValue.includes(filterValue);
      });
    });
  }, [data, filters, visibleColumns]);

  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig) return filteredData;

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

  const handleSort = (column: string) => {
    if (!sortable) return;
    setSortConfig((prev) =>
      prev?.key === column
        ? { key: column, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key: column, direction: "asc" }
    );
  };

  const exportToCSV = () => {
    const headers = visibleColumns.join(",");
    const rows = data.map((row) =>
      visibleColumns.map((col) => "${row[col] ?? ""}").join(",")
    );
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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (col: string) => {
    setVisibleColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
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
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />

          <Button themeStyle={theme} onClick={exportToCSV}>
            Export CSV
          </Button>
        </div>

        <DropdownWrapper ref={dropdownRef}>
          <DropdownButton onClick={() => setIsOpen(!isOpen)}>
            Select Columns
          </DropdownButton>
          {isOpen && (
            <DropdownMenu>
              {columns.map((col) => (
                <DropdownItem key={col.key}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col.key)}
                    onChange={() => toggleColumn(col)}
                  />
                  {col}
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
              {columns.map((col:Column) => (
                <th key={col}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: col.sortable ? "pointer" : "default",
                      }}
                      onClick={() => handleSort(col)}
                    >
                      {col}
                      {col.sortable && (
                        <FontAwesomeIcon
                          icon={
                            sortConfig?.key === col
                              ? sortConfig.direction === "asc"
                                ? faSortUp
                                : faSortDown
                              : faSort
                          }
                          style={{ marginLeft: "0.5rem", color: "#555" }}
                        />
                      )}
                    </div>

                    {col.filter && (
                      <Input
                        type="text"
                        placeholder={Search ${col}}
                        value={filters[col] || ""}
                        onChange={(e) => {
                          setFilters((prev) => ({
                            ...prev,
                            [col]: e.target.value,
                          }));
                        }}
                        style={{ marginTop: "0.25rem", width: "100%" }}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col}>{row[col]}</td>
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
            <option key={num} value={num}>
              {num === data.length ? "All" : num}
            </option>
          ))}
        </Select>
        <span>
          Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(currentPage * rowsPerPage, sortedData.length)} of{" "}
          {sortedData.length} entries
        </span>
        <PaginationControls>
          <Button
            themeStyle={theme}
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            <FiChevronLeft size={20} />
          </Button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <Button
            themeStyle={theme}
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            <FiChevronRight size={20} />
          </Button>
        </PaginationControls>
      </PaginationWrapper>
    </TableWrapper>
  );
};

export default Table; 