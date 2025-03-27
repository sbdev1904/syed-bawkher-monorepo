"use client";
import React, { useState } from "react";
import { Input, message, Spin } from "antd";
import customerService from "../../services/customerService";
import CustomerList from "../list/CustomerList";

const FindCustomer = () => {
  const { Search } = Input;
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  const handleSearch = async (value) => {
    if (!value.trim()) return;
    setLoading(true);
    try {
      const results = await customerService.searchCustomers(value);
      console.log("Search results:", results);
      setCustomers(results); // Set search results to state
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      message.error("Failed to search for customers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Spin spinning={loading}>
          <Search
            placeholder="Search by Name or Phone Number"
            allowClear
            enterButton="Search"
            onSearch={handleSearch}
          />
          <CustomerList customers={customers} />
        </Spin>
      </div>
    </>
  );
};

export default FindCustomer;
