"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MergeUserModal from "../modals/MergeUserModal";

const MergeCustomerButton = ({ customer_id = null }: { customer_id: string | null }) => {
  const [isMergeModalVisible, setIsMergeModalVisible] = useState(false);

  const handleMergeModal = () => {
    setIsMergeModalVisible(true);
  };

  const handleCancel = () => {
    setIsMergeModalVisible(false);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              onClick={() => {
                console.log(`Merge customers ${customer_id}`);
                handleMergeModal();
              }}
            >
              Merge Customers
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Merge Customers</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <MergeUserModal
        isOpen={isMergeModalVisible}
        onCancel={handleCancel}
        customer_id={customer_id}
      />
    </>
  );
};

export default MergeCustomerButton;
