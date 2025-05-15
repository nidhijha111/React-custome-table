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
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const Select = styled.select`
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const Button = styled.button<{ themeStyle?: TableTheme }>`
  background-color: ${({ themeStyle }) =>
    themeStyle?.buttonBg || defaultTheme.buttonBg};
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

export const DivTable = styled.div<{ themeStyle?: TableTheme }>`
  width: 100%;
  border-radius: 10px;
  overflow-x: auto; 
  overflow-y: auto; 
  max-height: 500px; 
  border: 1px solid ${({ themeStyle }) => themeStyle?.borderColor || '#ddd'};
`;

export const DivRow = styled.div<{ isHeader?: boolean; themeStyle?: TableTheme; columnCount: number }>`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: ${({ isHeader, themeStyle }) =>
    isHeader ? themeStyle?.headerBg || '#f5f5f5' : 'transparent'};
  /* border-bottom: 1px solid ${({ themeStyle }) => themeStyle?.borderColor || '#ddd'}; */

  &:hover {
    background-color: ${({ isHeader, themeStyle }) =>
      isHeader ? undefined : themeStyle?.rowHoverColor || '#f9f9f9'};
  }
`;

export const DivCell = styled.div<{
  width?: number | string;
  themeStyle?: TableTheme;
  columnCount: number;
}>`
  padding: 0.75rem;
  text-align: left;
  border: 1px solid ${({ themeStyle }) => themeStyle?.borderColor || '#ddd'};
  flex: 1;
  width: ${({ width }) => (typeof width === 'number' ? `${width}px` : width || 'auto')};
  white-space: nowrap;
  flex-basis: ${({ columnCount }) => (100 / columnCount)}%;

  @media (max-width: 768px) {
    width: 100%; 
    display: block; 
    margin-bottom: 0.5rem; 
    white-space: normal;

    &::before {
      content: attr(data-label);
      font-weight: 600;
      color: #666;
      margin-right: 0.5rem;
    }
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

export const FilterContentWrapper = styled.div`
  position: absolute;
  top: 1.5rem;
  right: 0px;
  background: #fff;
  border: 1px solid #ccc;
  padding: 1rem 0.5rem 0.5rem 0.5rem;
  z-index: 99999;
  max-height: 200px;
  overflow-y: auto;
  width: auto;
  scrollbar-width: thin;
`;

export const CancelButton = styled.button`
  border: 1px solid #f44336;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  color: #f44336;
  cursor: pointer;
  background-color: none;
`;

export const FilterButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 0.25rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
`;

export const FilterCloseButton = styled.button<{ themeStyle?: TableTheme }>`
  position: absolute;
  top: 5px;
  right: 5px;
  background: transparent;
  border: none;
  color: ${({ themeStyle }) => themeStyle?.textColor || defaultTheme.textColor};
  font-size: 20px;
  cursor: pointer;
`;

export const Label = styled.label`
  font-weight: lighter;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 12px;
  width: auto;
`;

export const InputCheckbox = styled.input``;

export const SearchColumnInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 100%;
`;

export const ColumnFunctionIcon = styled.div`
  display: flex;
  gap: 0.25rem;
  position: relative;
  justify-content: flex-end;
  align-items: center;
`;
