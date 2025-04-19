"use client";

import React, { useState } from "react";
import { FileEdit } from "lucide-react";
import { Button } from "../../components/ui/button-wrapper";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AddFabricPurchaseOrderModal from "../modals/AddFabricPurchaseOrderModal";

interface AddFabricPurchaseOrderButtonProps {
  fabricId: number;
}

const AddFabricPurchaseOrderButton = ({
  fabricId,
}: AddFabricPurchaseOrderButtonProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  console.log(fabricId);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="primary"
              icon={<FileEdit size={16} />}
              onClick={showModal}
            >
              Fabric Purchase Order
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add New Fabric Purchase Order</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AddFabricPurchaseOrderModal
        isOpen={isModalVisible}
        onCancel={handleCancel}
        fabricId={fabricId}
      />
    </>
  );
};

export default AddFabricPurchaseOrderButton;
