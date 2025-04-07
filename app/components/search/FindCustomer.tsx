"use client";
import React, { useState } from "react";
import { Spinner } from "../ui/spinner";
import { message } from "@/app/utils/toast-utils";
import customerService from "../../services/customerService";
import CustomerList from "../list/CustomerList";
import { SearchInput } from "../ui/search-input";

const FindCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  const handleSearch = async (value: string) => {
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
    <div className="w-full space-y-4">
      <SearchInput
        placeholder="Search by Name or Phone Number"
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

export default FindCustomer;
