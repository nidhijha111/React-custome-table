import styled from "styled-components";
import { TableTheme } from "../../interface/table";

const defaultTheme: TableTheme = {
  textColor: "#333",
  buttonBg: "#2563eb",
  borderColor: "#ccc",
  headerBg: "#f3f4f6",
  rowHoverColor: "#f9f9f9",
};

export const TableWrapper = styled.div<{ themeStyle?: TableTheme }>`
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: ${({ themeStyle }) => themeStyle?.textColor || defaultTheme.textColor};
  width: 100%;
`;

export const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const Input = styled.input`
  padding: 0.4rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const Select = styled.select`
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const Button = styled.button<{ themeStyle?: TableTheme }>`
  background-color: ${({ themeStyle }) => themeStyle?.buttonBg || defaultTheme.buttonBg};
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const DropdownButton = styled.button`
  padding: 0.4rem 0.8rem;
  background-color: #f3f4f6;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  z-index: 10;
  margin-top: 0.5rem;
  width: 220px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 240px;
  overflow-y: auto;
  padding: 0.5rem;
`;

export const DropdownItem = styled.label`
  display: flex;
  align-items: center;
  padding: 0.3rem 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #f1f1f1;
  }

  input {
    margin-right: 0.5rem;
  }
`;

export const StyledTable = styled.table<{ themeStyle?: TableTheme }>`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
  border: 1px solid ${({ themeStyle }) => themeStyle?.borderColor || defaultTheme.borderColor};

  th, td {
    padding: 0.75rem;
    border: 1px solid ${({ themeStyle }) => themeStyle?.borderColor || defaultTheme.borderColor};
    text-align: left;
  }

  th {
    background-color: ${({ themeStyle }) => themeStyle?.headerBg || defaultTheme.headerBg};
    cursor: pointer;
    user-select: none;
  }

  tr:hover {
    background-color: ${({ themeStyle }) => themeStyle?.rowHoverColor || defaultTheme.rowHoverColor};
  }
`;

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.875rem;
`;

export const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;