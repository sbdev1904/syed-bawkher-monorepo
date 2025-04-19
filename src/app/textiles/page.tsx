"use client";
import React from "react";
import TextileTable from "@/components/tables/TextileTable";
import AddTextileButton from "@/components/buttons/AddTextileButton";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";

const TextileDetails = () => {
  const router = useRouter();

  const handleManageSuppliersClick = () => {
    router.push("/suppliers");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-row justify-between mb-5">
        <div className="text-3xl font-bold">Textile Details</div>
        <div className="flex flex-row space-x-2">
          <AddTextileButton />
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleManageSuppliersClick}
          >
            <Truck className="h-4 w-4" />
            Manage Suppliers
          </Button>
        </div>
      </div>

      <TextileTable />
    </DashboardLayout>
  );
};

export default TextileDetails;
