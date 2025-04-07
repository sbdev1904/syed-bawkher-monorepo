"use client";
import React, { useState } from "react";
import { PenLine } from "lucide-react";
import { Button } from "@/app/components/ui/button-wrapper";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type={customerId ? "link" : "primary"}
              shape="circle"
              icon={<PenLine className="h-4 w-4" />}
              className={customerId ? "text-lg text-white" : "ml-2"}
              onClick={handleCreateCustomer}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>{customerId ? "Edit Customer" : "Create Customer"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CreateCustomerModal
        isOpen={isCreateCustomerModalVisible}
        isCancel={() => setIsCreateCustomerModalVisible(false)}
        customerid={customerId}
      />
    </>
  );
};

export default CreateCustomerButton;
