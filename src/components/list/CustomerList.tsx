"use client";

import React from "react";
import CustomerCard from "../cards/CustomerCard";

const CustomerList = ({ customers }: {
  customers: {
    customer_id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    office_phone: string;
    residential_phone: string;
    mobile: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    created_at: string;
    updated_at: string;
  }[]
}) => {
  return (
    <div className="flex flex-wrap space-y-1 p-1 pt-2">
      {customers.map((customer) => (
        <CustomerCard
          key={customer.customer_id}
          fName={customer.first_name}
          mName={customer.middle_name}
          lName={customer.last_name}
          email={customer.email}
          phOff={customer.office_phone}
          phRes={customer.residential_phone}
          mobile={customer.mobile}
          customer_id={customer.customer_id}
        />
      ))}
    </div>
  );
};

export default CustomerList;
