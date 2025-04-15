"use client";

import React from "react";
import CustomerCard from "../cards/CustomerCard";
import { Customer } from "@prisma/client";

const CustomerList = ({ customers }: { customers: Customer[] }) => {
  return (
    <div className="flex flex-wrap space-y-1 p-1 pt-2">
      {customers.map((customer) => (
        <CustomerCard
          key={customer.customer_id}
          fName={customer.first_name!}
          mName={customer.middle_name!}
          lName={customer.last_name!}
          email={customer.email!}
          phOff={customer.office_phone!}
          phRes={customer.residential_phone!}
          mobile={customer.mobile!}
          customer_id={customer.customer_id}
        />
      ))}
    </div>
  );
};

export default CustomerList;
