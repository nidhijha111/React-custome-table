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
      id: "pay_025",
      amount: 181.66,
      status: "success",
      email: "eve@example.com",
      date: "2024-06-28",
      method: "Credit Card",
      customer: "Eve Black",
      country: "India",
      currency: "inr",
    },
    {
      id: "pay_026",
      amount: 354.04,
      status: "failed",
      email: "grace@example.com",
      date: "2024-05-20",
      method: "UPI",
      customer: "Grace Lee",
      country: "Singapore",
      currency: "sgd",
    },
    {
      id: "pay_027",
      amount: 369.03,
      status: "processing",
      email: "frank@example.com",
      date: "2024-06-08",
      method: "UPI",
      customer: "Frank Green",
      country: "Australia",
      currency: "aud",
    },
    {
      id: "pay_028",
      amount: 317.29,
      status: "pending",
      email: "grace@example.com",
      date: "2024-06-24",
      method: "UPI",
      customer: "Grace Lee",
      country: "Singapore",
      currency: "sgd",
    },
    {
      id: "pay_029",
      amount: 110.41,
      status: "success",
      email: "grace@example.com",
      date: "2024-06-26",
      method: "Credit Card",
      customer: "Grace Lee",
      country: "Singapore",
      currency: "sgd",
    },
    {
      id: "pay_030",
      amount: 453.3,
      status: "success",
      email: "henry@example.com",
      date: "2024-06-16",
      method: "Bank Transfer",
      customer: "Henry Ford",
      country: "USA",
      currency: "usd",
    },
  ]


 const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: true,
      showSearch: true,
      width: 180,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      sorter: true,
      showSearch: true,
      customRenderer: (row, value) => {
        const click = () => {
       
        };
        return (
          <button onClick={click} style={{ color: "green" }}>
            ${value.toFixed(2)}
          </button>
        );
      },
      showFilter: true,
      width: 180,
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: true,
      showSearch: false,
      showFilter: true,
      width: 180,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: false,
      showSearch: true,
      width: 300,
      showFilter:true,
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: true,
      showSearch: false,
      width: 200,
    },
    {
      title: "Method",
      dataIndex: "method",
      sorter: true,
      showFilter: true,
      width: 200,
    },
    {
      title: "Customer Name",
      dataIndex: "customer",
      sorter: true,
      showSearch: true,
      width: 300,
    },
    {
      title: "Country",
      dataIndex: "country",
      sorter: false,
      showFilter: true,
      width: 200,
    },
    {
      title: "Currency",
      dataIndex: "currency",
      sorter: false,
      showFilter: true,
      width: 200,
    },
  ];

const App = () => (
  <div>
    <h1>Table</h1>
    <CustomTable data={data} columns={columns} />
  </div>
);

export default App;
```

