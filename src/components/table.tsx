import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen, faChevronDown, faDownload } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownWrapper,
  Input,
  TableWrapper,
  Toolbar,
  DivTable,
  DivRow,
  DivCell,
  DataNotFoundSection,
} from "./styledcomponets/style";
import type { TableProps } from "../interface/table";
import Pagination from "./pagination";
import TheadData from "./theadData";

const Table: React.FC<TableProps> = ({
  columns,
  data,
  theme = {},
  pagination,
  tableTitle,
  customPaginationHandler,
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
    if (!sortConfig) return searchData;
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
    return sortedData.filter((row) =>
      Object.entries(checkedFilterOptions).every(([key, selectedVals]) => {
        if (!selectedVals || selectedVals.length === 0) return true;
        return selectedVals.includes(row[key]);
      })
    );
  }, [sortedData, checkedFilterOptions]);

  const paginatedData = useMemo(() => {
    if (customPaginationHandler) {
      return data;
    }
    const start = (currentPage - 1) * rowsPerPage;
    return finalFilteredData.slice(start, start + rowsPerPage);
  }, [
    data,
    finalFilteredData,
    currentPage,
    rowsPerPage,
    customPaginationHandler,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(finalFilteredData.length / rowsPerPage)
  );

  const handleSort = (columnKey: string) => {
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

  const toggleAllColumns = () => {
    if (visibleColumns.length === columns.length) {
      setVisibleColumns([]);
    } else {
      setVisibleColumns(columns.map((col) => col.dataIndex)); 
    }
  };

  return (
    <TableWrapper themeStyle={theme}>
      {tableTitle && <div>{tableTitle}</div>}
      <Toolbar>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Input
            type="search"
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
            <DropdownButton onClick={() => setIsOpen((o) => !o)} themeStyle={theme}>
              <span>Columns</span> <span><FontAwesomeIcon icon={faChevronDown} /></span>
            </DropdownButton>
            {isOpen && (
              <DropdownMenu>
                <DropdownItem key="all">
                  <input
                    type="checkbox"
                    checked={visibleColumns.length === columns.length}
                    onChange={() => toggleAllColumns()}
                  />
                  All
                </DropdownItem>
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
        <DivTable themeStyle={theme}>
          <DivRow isHeader themeStyle={theme}>
            {columns
              .filter((col) => visibleColumns.includes(col.dataIndex))
              .map((col) => (
                <TheadData
                  key={col.dataIndex}
                  col={col}
                  handleSort={handleSort}
                  filters={filters}
                  setFilters={setFilters}
                  setCurrentPage={setCurrentPage}
                  activeFilterColumn={activeFilterColumn}
                  setActiveFilterColumn={setActiveFilterColumn}
                  sortConfig={sortConfig}
                  filterDropdownRef={filterDropdownRef}
                  getUniqueColumnValues={getUniqueColumnValues}
                  checkedFilterOptions={checkedFilterOptions}
                  setCheckedFilterOptions={setCheckedFilterOptions}
                  theme={theme}
                  data={data}
                />
              ))}
          </DivRow>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <DivRow key={rowIndex} themeStyle={theme}>
                {columns
                  .filter((col) => visibleColumns.includes(col.dataIndex))
                  .map((col) => {
                    const value = row[col.dataIndex];
                    const content = col.customRenderer
                      ? col.customRenderer(row, value)
                      : value;

                    return (
                      <DivCell
                        width={col?.width}
                        themeStyle={theme}
                        key={col.dataIndex}
                      >
                        {content}
                      </DivCell>
                    );
                  })}
              </DivRow>
            ))
          ) : (
            <DivRow themeStyle={theme}>
              <DataNotFoundSection themeStyle={theme}>
                <FontAwesomeIcon
                  icon={faBoxOpen}
                  style={{ fontSize: "3rem" }}
                />

                <span style={{ marginTop: "0.5rem" }}>No data available</span>
              </DataNotFoundSection>
            </DivRow>
          )}
        </DivTable>
      </div>

      {pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={(page) => {
            setCurrentPage(page);
            if (customPaginationHandler) {
              customPaginationHandler(page, rowsPerPage);
            }
          }}
          setRowsPerPage={(limit) => {
            setRowsPerPage(limit);
            setCurrentPage(1);
            if (customPaginationHandler) {
              customPaginationHandler(1, limit);
            }
          }}
          rowsPerPage={rowsPerPage}
          data={customPaginationHandler ? [] : finalFilteredData}
          theme={theme}
        />
      )}
    </TableWrapper>
  );
};

export default Table;
