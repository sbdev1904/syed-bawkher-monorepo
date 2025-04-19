"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileEdit } from "lucide-react";
import CreateOrderModal from "../modals/CreateOrderModal";

const CreateOrderButton = () => {
  const [isCreateOrderModalVisible, setIsCreateOrderModalVisible] = useState(false);

  const handleCreateOrder = () => {
    setIsCreateOrderModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateOrderModalVisible(false);
  };

  return (
    <>
      <Button
        variant="outline"
        className="ml-2"
        onClick={handleCreateOrder}
      >
        <FileEdit className="h-4 w-4 mr-2" />
        Create Order
      </Button>
      {isCreateOrderModalVisible && (
        <CreateOrderModal
          isOpen={isCreateOrderModalVisible}
          isCancel={handleCancel}
        />
      )}
    </>
  );
};

export default CreateOrderButton;
