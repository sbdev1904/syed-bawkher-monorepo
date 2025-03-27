"use client";

import React, { useState } from "react";
import { Input, message, Spin } from "antd";
import customerService from "../../services/customerService";
import CustomerList from "../list/CustomerList";

const FindCustomerByOrderNo = () => {
  const { Search } = Input;
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  const handleSearch = async (value) => {
    if (!value.trim()) return;
    setLoading(true);
    try {
      const result = await customerService.findByOrderNo(value);
      console.log("Search results:", result);
      if (result) {
        setCustomers([result]); // Wrap the result in an array
      } else {
        setCustomers([]); // Set to empty array if no result
      }
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
      message.error(
        "Failed to search for customers, try using their phone No or Name"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Spin spinning={loading}>
          <Search
            placeholder="Search by Order Number"
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

export default FindCustomerByOrderNo;
