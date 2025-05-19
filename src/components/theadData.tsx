import React, { useState } from "react";
import {
  Button,
  CancelButton,
  ColumnFunctionIcon,
  DivCell,
  FilterButtonWrapper,
  FilterCloseButton,
  FilterContentWrapper,
  FilterOptionWrapper,
  Input,
  InputCheckbox,
  Label,
  SearchColumnInput,
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
  return (
    <DivCell key={col.dataIndex} width={col?.width} themeStyle={theme} isHeader>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap:"0.5rem",
          width:"100%"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: col.sorter ? "pointer" : "default",
          }}
        >
          {!showFilterInput ? col.title : ""}
          {col.showSearch === true && showFilterInput === true && (
            <SearchColumnInput
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
        <ColumnFunctionIcon>
          {col.showSearch === true &&
            (showFilterInput ? (
              <span
                onClick={() => {
                  setShowFilterInput(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon icon={faTimes} style={{ fontSize: "14px" }} />
              </span>
            ) : (
              <span
                onClick={() => {
                  setShowFilterInput(true);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon icon={faSearch} style={{ fontSize: "13px" }} />
              </span>
            ))}
          {col.sorter && (
            <button
              style={{
                backgroundColor: "none",
                border: "none",
                cursor: col.sorter ? "pointer" : "default",
                padding:"0px",
                margin:"0px",
              }}
              onClick={() => col.sorter && handleSort(col.dataIndex)}
            >
              <FontAwesomeIcon
                icon={faArrowUp}
                style={{
                  cursor: "pointer",
                  transform:
                    sortConfig?.key === col.dataIndex &&
                    sortConfig.direction === "desc"
                      ? "rotate(180deg)"
                      : "none",
                  color: sortConfig?.key === col.dataIndex ? "#000" : "#9f9a9a",
                  transition: "transform 0.2s ease",
                  fontSize: "12px",
                }}
              />
            </button>
          )}

          {col.showFilter && (
            <>
              <FontAwesomeIcon
                icon={faFilter}
                style={{ cursor: "pointer", fontSize: "12px" }}
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
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{
                        fontSize: "18px",
                      }}
                    />
                  </FilterCloseButton>
                  <FilterOptionWrapper width={col?.width}>
                    {getUniqueColumnValues(data, col.dataIndex).map((val) => (
                      <Label key={val} themeStyle={theme}>
                        <InputCheckbox
                          type="checkbox"
                          checked={
                            checkedFilterOptions[col.dataIndex]?.includes(
                              val
                            ) ?? false
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
                  </FilterOptionWrapper>
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
            </>
          )}
        </ColumnFunctionIcon>
      </div>
    </DivCell>
  );
}
