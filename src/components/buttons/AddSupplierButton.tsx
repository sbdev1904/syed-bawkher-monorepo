"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AddSupplierModal from "../modals/AddSupplierModal";

interface AddSupplierButtonProps {
  onSuccess?: () => void;
}

const AddSupplierButton = ({ onSuccess }: AddSupplierButtonProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="flex items-center gap-2"
              onClick={showModal}
            >
              <PlusCircle className="h-4 w-4" />
              Add New Supplier
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add New Supplier</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AddSupplierModal isOpen={isModalVisible} onCancel={handleCancel} />
    </>
  );
};

export default AddSupplierButton;
