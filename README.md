# React Custom Table

A customizable and reusable table component built with React. Supports dynamic data, column configuration, sorting, pagination, and more.

## 🚀 Features

- Dynamic columns and data
- Pagination support
- Sorting capabilities
- Custom cell renderers
- Responsive design

## 📦 Installation

```bash
npm install react-custom-table
```

## Or use via Git:

git clone https://github.com/nidhijha111/React-custome-table.git

## 🧪 Usage
```bash
import React from 'react';
import CustomTable from 'react-custom-table';

const data = [
  { id: 1, name: 'John Doe', age: 28 },
  { id: 2, name: 'Jane Smith', age: 34 },
];

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
];

const App = () => (
  <div>
    <h1>User Table</h1>
    <CustomTable data={data} columns={columns} />
  </div>
);

export default App;
```

