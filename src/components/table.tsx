import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSortUp,
  faSortDown,
  faSort,
  faDownload,
  faFilter,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownWrapper,
  Input,
  StyledTable,
  TableWrapper,
  Toolbar,
} from "./styledcomponets/style";
import type { TableProps } from "../interface/table";
import Pagination from "./pagination";

const Table: React.FC<TableProps> = ({
  columns,
  data,
  sortable = false,
  theme = {},
}) => {
  const [sortConfig, setSortConfig] = useState<null | {
    key: string;
    direction: "asc" | "desc";
  }>(null);
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.map((c) => c.dataIndex)
  );
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(
    null
  );
  const [checkedFilterOptions, setCheckedFilterOptions] = useState<
    Record<string, string[]>
  >({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        setActiveFilterColumn(null);
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

  const getUniqueColumnValues = (data: any[], key: string) => {
    return [...new Set(data.map((row) => row[key]))];
  };

  const searchData = useMemo(() => {
    return data.filter((row) => {
      const matchesGlobal =
        !searchText ||
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchText.toLowerCase())
        );
      if (!matchesGlobal) return false;
      return visibleColumns.every((colKey) => {
        const filterValue = filters[colKey]?.toLowerCase() || "";
        const rowValue = String(row[colKey] ?? "").toLowerCase();
        return rowValue.includes(filterValue);
      });
    });
  }, [data, searchText, filters, visibleColumns]);

  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig) return searchData;
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
  }, [searchData, sortConfig, sortable]);

  const finalFilteredData = useMemo(() => {
    return sortedData.filter((row) =>
      Object.entries(checkedFilterOptions).every(([key, selectedVals]) => {
        if (!selectedVals || selectedVals.length === 0) return true;
        return selectedVals.includes(row[key]);
      })
    );
  }, [sortedData, checkedFilterOptions]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return finalFilteredData.slice(start, start + rowsPerPage);
  }, [finalFilteredData, currentPage, rowsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(finalFilteredData.length / rowsPerPage)
  );

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
    const rowsCsv = finalFilteredData.map((row) =>
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
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Button themeStyle={theme} onClick={handleExport}>
            <FontAwesomeIcon icon={faDownload} /> Export CSV
          </Button>
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
        </div>
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
                            icon={faSort}
                            style={{
                              fontSize: "0.75rem",
                              cursor: "pointer",
                              transform:
                                sortConfig?.key === col.dataIndex &&
                                sortConfig.direction === "desc"
                                  ? "rotate(180deg)"
                                  : "none",
                              color:
                                sortConfig?.key === col.dataIndex
                                  ? "#000"
                                  : "#ccc",
                              transition: "transform 0.2s ease",
                            }}
                          />
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          flexWrap: "wrap",
                          width: "100%",
                        }}
                      >
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
                          <div style={{ position: "relative" }}>
                            <FontAwesomeIcon
                              icon={faFilter}
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setActiveFilterColumn(
                                  activeFilterColumn === col.dataIndex
                                    ? null
                                    : col.dataIndex
                                )
                              }
                            />
                            {activeFilterColumn === col.dataIndex && (
                              <div
                                ref={filterDropdownRef}
                                style={{
                                  position: "absolute",
                                  top: "1.5rem",
                                  left: 0,
                                  background: "#fff",
                                  border: "1px solid #ccc",
                                  padding: "0.5rem",
                                  zIndex: 10,
                                  maxHeight: "200px",
                                  overflowY: "auto",
                                }}
                              >
                                <button
                                  style={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                    background: "transparent",
                                    border: "none",
                                    color: "#000",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => setActiveFilterColumn(null)}
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </button>

                                {getUniqueColumnValues(data, col.dataIndex).map(
                                  (val) => (
                                    <label
                                      key={val}
                                      style={{ display: "block" }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={
                                          checkedFilterOptions[
                                            col.dataIndex
                                          ]?.includes(val) ?? false
                                        }
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          setCheckedFilterOptions((prev) => {
                                            const existing =
                                              prev[col.dataIndex] || [];
                                            const updated = checked
                                              ? [...existing, val]
                                              : existing.filter(
                                                  (v) => v !== val
                                                );
                                            return {
                                              ...prev,
                                              [col.dataIndex]: updated,
                                            };
                                          });
                                          setCurrentPage(1);
                                        }}
                                      />
                                      {val}
                                    </label>
                                  )
                                )}
                                <div>
                                  <button
                                    style={{
                                      width: "100%",
                                      marginBottom: "10px",
                                      background: "#f44336",
                                      color: "#fff",
                                      padding: "8px",
                                      border: "none",
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setCheckedFilterOptions((prev) => ({
                                        ...prev,
                                        [col.dataIndex]: [],
                                      }));
                                      setCurrentPage(1);
                                    }}
                                  >
                                    Clear Filter
                                  </button>
                                  <button
                                    style={{
                                      width: "100%",
                                      marginTop: "10px",
                                      background: "#4CAF50",
                                      color: "#fff",
                                      padding: "8px",
                                      border: "none",
                                      borderRadius: "4px",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      setActiveFilterColumn(null);
                                      setCurrentPage(1);
                                    }}
                                  >
                                    Apply Filter
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns
                  .filter((col) => visibleColumns.includes(col.dataIndex))
                  .map((col) => (
                    <td key={col.dataIndex}>{row[col.dataIndex]}</td>
                  ))}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        setRowsPerPage={setRowsPerPage}
        rowsPerPage={rowsPerPage}
        data={data}
        theme={theme}
      />
    </TableWrapper>
  );
};

export default Table;
