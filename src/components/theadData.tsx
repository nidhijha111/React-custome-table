import React, { useState } from "react";
import {
  Button,
  CancelButton,
  FilterButtonWrapper,
  FilterCloseButton,
  FilterContentWrapper,
  Input,
  InputCheckbox,
  Label,
} from "./styledcomponets/style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faFilter, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function TheadData({
  col,
  handleSort,
  filters,
  setFilters,
  setCurrentPage,
  activeFilterColumn,
  setActiveFilterColumn,
  sortConfig,
  filterDropdownRef,
  getUniqueColumnValues,
  checkedFilterOptions,
  setCheckedFilterOptions,
  theme,
  data,
}) {
  const [showFilterInput, setShowFilterInput] = useState(false);
  console.log(col,"jnjnjinkink")
  return (
    <th key={col.dataIndex}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          minWidth: `${col?.width}px !important`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: col.sorter ? "pointer" : "default",
          }}
          onClick={() => col.sorter && handleSort(col.dataIndex)}
        >
          {!showFilterInput ? col.title : ""}
          {col.showSearch && showFilterInput && (
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
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            position: "relative",
          }}
        >
          {showFilterInput ? (
            <span
              onClick={() => {
                setShowFilterInput(false);
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </span>
          ) : (
            <span
              onClick={() => {
                setShowFilterInput(true);
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
            </span>
          )}
          {col.sorter && (
            <FontAwesomeIcon
              icon={faArrowUp}
              style={{
                fontSize: "0.75rem",
                cursor: "pointer",
                transform:
                  sortConfig?.key === col.dataIndex &&
                  sortConfig.direction === "desc"
                    ? "rotate(180deg)"
                    : "none",
                color: sortConfig?.key === col.dataIndex ? "#000" : "#ccc",
                transition: "transform 0.2s ease",
              }}
            />
          )}

          {col.showFilter && (
            <div>
              <FontAwesomeIcon
                icon={faFilter}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setActiveFilterColumn(
                    activeFilterColumn === col.dataIndex ? null : col.dataIndex
                  )
                }
              />
              {activeFilterColumn === col.dataIndex && (
                <FilterContentWrapper ref={filterDropdownRef}>
                  <FilterCloseButton
                    onClick={() => setActiveFilterColumn(null)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </FilterCloseButton>

                  {getUniqueColumnValues(data, col.dataIndex).map((val) => (
                    <Label key={val}>
                      <InputCheckbox
                        type="checkbox"
                        checked={
                          checkedFilterOptions[col.dataIndex]?.includes(val) ??
                          false
                        }
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setCheckedFilterOptions((prev) => {
                            const existing = prev[col.dataIndex] || [];
                            const updated = checked
                              ? [...existing, val]
                              : existing.filter((v) => v !== val);
                            return {
                              ...prev,
                              [col.dataIndex]: updated,
                            };
                          });
                          setCurrentPage(1);
                        }}
                      />
                      {val}
                    </Label>
                  ))}
                  <FilterButtonWrapper>
                    <CancelButton
                      onClick={() => {
                        setCheckedFilterOptions((prev) => ({
                          ...prev,
                          [col.dataIndex]: [],
                        }));
                        setCurrentPage(1);
                      }}
                    >
                      Clear
                    </CancelButton>
                    <Button
                      themeStyle={theme}
                      onClick={() => {
                        setActiveFilterColumn(null);
                        setCurrentPage(1);
                      }}
                    >
                      Ok
                    </Button>
                  </FilterButtonWrapper>
                </FilterContentWrapper>
              )}
            </div>
          )}
        </div>
      </div>
    </th>
  );
}
