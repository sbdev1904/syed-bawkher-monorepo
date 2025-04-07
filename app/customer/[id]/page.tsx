"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import customerService from "@/app/services/customerService";
import OrderTable from "@/app/components/tables/OrderTable";
import PastMeasurements from "@/app/components/tables/PastMeasurements";
import CreateCustomerButton from "@/app/components/buttons/CreateCustomerButton";
import CustomerDetailsCard from "@/app/components/cards/CustomerDetailsCard";
import { Customer } from "@prisma/client";

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
        setError("Failed to fetch customer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  if (loading) {
    return <div>Loading customer details...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!customer) {
    return <div>No customer found.</div>;
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
    <>
      <div className="flex flex-row items-center">
        <h1 className="text-3xl font-semibold ">{`${customer.customer_id + ": " + fullName
          }`}</h1>
        <CreateCustomerButton customerId={parseInt(customerId!)} />
      </div>
      <CustomerDetailsCard customer={customer} />
      <OrderTable customerId={customerId} />
      <PastMeasurements customerId={customerId} />
    </>
  );
};

export default CustomerDetails;
