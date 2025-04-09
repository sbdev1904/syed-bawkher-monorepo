"use client";

import React, { useState } from "react";
import { Spinner } from "../ui/spinner";
import { message } from "@/lib/toast-utils";
import customerService from "../../services/customerService";
import CustomerList from "../list/CustomerList";
import { SearchInput } from "../ui/search-input";

const FindCustomerByOrderNo = () => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  const handleSearch = async (value: string) => {
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
    <div className="w-full space-y-4">
      <SearchInput
        placeholder="Search by Order Number"
        allowClear
        onSearch={handleSearch}
      />
      {loading ? (
        <div className="w-full flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <CustomerList customers={customers} />
      )}
    </div>
  );
};

export default FindCustomerByOrderNo;
