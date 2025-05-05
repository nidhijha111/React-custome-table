import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  faSortUp,
  faSortDown,
  faSort,
  faDownload,
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
import type { TableProps } from "../interface/table";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

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
  const [searchText, setSearchText] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((c) => c.dataIndex)
  );
  const [filters, setFilters] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filterOpenCol, setFilterOpenCol] = useState<string | null>(null);

  // Combined filtering: global search + column filters
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // global search
      const matchesGlobal =
        !searchText ||
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchText.toLowerCase())
        );
      if (!matchesGlobal) return false;
      // column filters
      return visibleColumns.every((colKey) => {
        const filterValue = filters[colKey]?.toLowerCase() || "";
        const rowValue = String(row[colKey] ?? "").toLowerCase();
        return rowValue.includes(filterValue);
      });
    });
  }, [data, searchText, filters, visibleColumns]);

  // Sorting
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

  // Pagination slice
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));

  // Handlers
  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    setSortConfig((prev) =>
      prev?.key === columnKey
        ? {
            key: columnKey,
            direction: prev.direction === "asc" ? "desc" : "asc",
          }
        : { key: columnKey, direction: "asc" }
    );
  };

  const handleExport = () => {
    const headers = visibleColumns.join(",");
    const rowsCsv = sortedData.map((row) =>
      visibleColumns.map((col) => row[col] ?? "").join(",")
    );
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
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        // close
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
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
          <Button themeStyle={theme} onClick={handleExport}>
            <FontAwesomeIcon icon={faDownload} /> Export CSV
          </Button>
        </div>
        <DropdownWrapper ref={dropdownRef}>
          <DropdownButton onClick={() => setIsOpen((o) => !o)}>
            Select Columns
          </DropdownButton>
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
              {columns
                .filter((col) => visibleColumns.includes(col.dataIndex))
                .map((col) => (
                  <th key={col.dataIndex}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          cursor: col.sorter ? "pointer" : "default",
                        }}
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
                          />
                        )}
                      </div>
                      {col.showSearch && (
                        <Input
                          type="text"
                          placeholder={`Filter ${col.title}`}
                          value={filters[col.dataIndex] || ""}
                          onChange={(e) => {
                            setFilters((f) => ({
                              ...f,
                              [col.dataIndex]: e.target.value,
                            }));
                            setCurrentPage(1);
                          }}
                        />
                      )}
                      {col.showFilter && (
                        <FontAwesomeIcon
                          icon={faFilter}
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setFilterOpenCol(
                              filterOpenCol === col.dataIndex
                                ? null
                                : col.dataIndex
                            )
                          }
                        />
                      )}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, ri) => (
              <tr key={ri}>
                {columns
                  .filter((col) => visibleColumns.includes(col.dataIndex))
                  .map((col) => (
                    <td key={col.dataIndex}>
                      {col.customRenderer
                        ? col.customRenderer(row[col.dataIndex], row)
                        : String(row[col.dataIndex] ?? "-")}
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
          {[5, 10, 25, 50].map((s) => (
            <option key={s} value={s}>
              {s === data.length ? "All" : `Show ${s}`}
            </option>
          ))}
        </Select>
        <PaginationControls>
          <Button
            themeStyle={theme}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </Button>
          <Button
            themeStyle={theme}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            themeStyle={theme}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
          <Button
            themeStyle={theme}
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </Button>
        </PaginationControls>
      </PaginationWrapper>
    </TableWrapper>
  );
};

export default Table;
