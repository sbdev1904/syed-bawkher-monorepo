'use client'

import React, { useRef } from "react";
import SupplierListTable, { SupplierListTableRef } from "@/components/tables/SupplierListTable";
import AddSupplierButton from "@/components/buttons/AddSupplierButton";
import DashboardLayout from "@/components/layout/DashboardLayout";

const SupplierDetails = () => {
  const tableRef = useRef<SupplierListTableRef>(null);

  const handleSupplierAdded = () => {
    tableRef.current?.refreshData();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-2">
        <div className="flex flex-row justify-between mb-5">
          <div className="text-3xl font-bold">Supplier Details</div>
          <AddSupplierButton onSuccess={handleSupplierAdded} />
        </div>
        <div>
          <SupplierListTable ref={tableRef} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupplierDetails;