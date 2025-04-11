"use client";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FileEdit } from "lucide-react";
import { useRouter } from "next/navigation";
import CreateOrderModal from "../modals/CreateOrderModal";

interface CreateOrderButtonProps {
  customerId?: string | null;
}

const CreateOrderButton = ({ customerId = null }: CreateOrderButtonProps) => {
  const [isCreateOrderModalVisible, setIsCreateOrderModalVisible] =
    useState(false);
  const router = useRouter();

  const handleCreateOrder = () => {
    setIsCreateOrderModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateOrderModalVisible(false);
  };

  const handleSuccess = (orderNo: string) => {
    setIsCreateOrderModalVisible(false);
    router.push(`/order/${orderNo}`);
  };

  return (
    <>
      <Button
        variant="outline"
        className="ml-2"
        onClick={handleCreateOrder}
      >
        <FileEdit className="h-4 w-4" />
        Create Order
      </Button>
      {isCreateOrderModalVisible && (
        <CreateOrderModal
          isOpen={isCreateOrderModalVisible}
          isCancel={handleCancel}
          customerid={customerId}
        />
      )}
    </>
  );
};

export default CreateOrderButton;
