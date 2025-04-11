'use client'

import React from "react";
import SupplierListTable from "@/components/tables/SupplierListTable";
import AddSupplierButton from "@/components/buttons/AddSupplierButton";
import DashboardLayout from "@/components/layout/DashboardLayout";

const SupplierDetails = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-2">
        <div className="">
          <div className="text-3xl font-bold">Supplier Details</div>
        </div>
        <div className="flex flex-row space-x-2">
          {/* Button for adding a new supplier modal and form goes here */}
          <AddSupplierButton />
        </div>
        <div>
          <SupplierListTable />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupplierDetails;