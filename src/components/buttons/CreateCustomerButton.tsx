"use client";
import React, { useState } from "react";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button-wrapper";
import CreateCustomerModal from "../modals/CreateCustomerModal";

interface CreateCustomerButtonProps {
  customerId?: number | null;
}

const CreateCustomerButton = ({ customerId = null }: CreateCustomerButtonProps) => {
  const [isCreateCustomerModalVisible, setIsCreateCustomerModalVisible] =
    useState(false);

  const handleCreateCustomer = () => {
    setIsCreateCustomerModalVisible(true);
  };

  return (
    <>
      <Button
        type={customerId ? "link" : "primary"}
        icon={<PenLine className="h-4 w-4" />}
        className={customerId ? "text-lg text-white" : "ml-2"}
        onClick={handleCreateCustomer}
      >
        Create Customer
      </Button>
      <CreateCustomerModal
        isOpen={isCreateCustomerModalVisible}
        isCancel={() => setIsCreateCustomerModalVisible(false)}
        customerid={customerId}
      />
    </>
  );
};

export default CreateCustomerButton;
