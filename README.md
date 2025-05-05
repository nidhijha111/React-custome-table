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
    {
      id: "pay_001",
      amount: 120.5,
      status: "pending",
      email: "alice@example.com",
    },
    {
      id: "pay_002",
      amount: 75.0,
      status: "processing",
      email: "bob@example.com",
    },
    {
      id: "pay_003",
      amount: 250.0,
      status: "success",
      email: "carol@example.com",
    },
    {
      id: "pay_004",
      amount: 40.99,
      status: "failed",
      email: "dave@example.com",
    },
    {
      id: "pay_005",
      amount: 99.95,
      status: "success",
      email: "eve@example.com",
    }
  ]


 const columns = [
    { title: "ID", dataIndex: "id", sorter: true, showSearch: true },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: true,
      showSearch: true,
      customRenderer: (value) => `$${value.toFixed(2)}`,
    },
    { title: "Status", dataIndex: "status", sorter: true, showSearch: true },
    { title: "Email", dataIndex: "email", sorter: false, showSearch: true },
  ];

const App = () => (
  <div>
    <h1>User Table</h1>
    <CustomTable data={data} columns={columns} />
  </div>
);

export default App;
```

