"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import customerService from "@/services/customerService";
import OrderTable from "@/components/tables/OrderTable";
import PastMeasurements from "@/components/tables/PastMeasurements";
import CreateCustomerButton from "@/components/buttons/CreateCustomerButton";
import CustomerDetailsCard from "@/components/cards/CustomerDetailsCard";
import { Customer } from "@prisma/client";
import DashboardLayout from "@/components/layout/DashboardLayout";


const CustomerDetails = () => {
  const pathname = usePathname();
  const customerId = pathname.split("/")[2];

  console.log(customerId);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setError("Customer ID is missing.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const fetchedCustomer = await customerService.findById(customerId);

        setCustomer(fetchedCustomer);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch customer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse">Loading customer details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div>No customer found.</div>
        </div>
      </DashboardLayout>
    );
  }

  const fullName = [
    customer.first_name,
    customer.middle_name,
    customer.last_name,
  ]
    .filter((name) => name && name !== "NULL") // Check for non-null and not "NULL"
    .map(
      (name) =>
        (name || "").charAt(0).toUpperCase() +
        (name || "").slice(1).toLowerCase()
    ) // Capitalize names
    .join(" ");

  return (
    <DashboardLayout>
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-3xl font-semibold ">{`#${customer.customer_id} ${fullName}`}</h1>
        <CreateCustomerButton customerId={parseInt(customerId!)} />
      </div>
      <CustomerDetailsCard customer={customer} />
      <OrderTable customerId={customerId} />
      <PastMeasurements customerId={customerId} />
    </DashboardLayout>
  );
};

export default CustomerDetails;
