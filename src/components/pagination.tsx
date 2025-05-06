import React from "react";
import {
  Button,
  PaginationControls,
  PaginationWrapper,
  Select,
} from "./styledcomponets/style";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";

export default function Pagination({
  rowsPerPage,
  setRowsPerPage,
  setCurrentPage,
  data,
  theme,
  currentPage,
  totalPages,
}) {
  return (
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
          <FaAngleDoubleLeft />
        </Button>
        <Button
          themeStyle={theme}
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          <FaAngleLeft />
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          themeStyle={theme}
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <FaAngleRight />
        </Button>
        <Button
          themeStyle={theme}
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <FaAngleDoubleRight />
        </Button>
      </PaginationControls>
    </PaginationWrapper>
  );
}
