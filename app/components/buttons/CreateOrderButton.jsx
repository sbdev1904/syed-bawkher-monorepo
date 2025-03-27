"use client";
import React, { useState } from "react";
import { Tooltip, Button } from "antd";
import { IoMdCreate } from "react-icons/io";
import { useRouter } from "next/navigation";
import CreateOrderModal from "../modals/CreateOrderModal";

const CreateOrderButton = ({ customerId = null }) => {
  const [isCreateOrderModalVisible, setIsCreateOrderModalVisible] =
    useState(false);
  const router = useRouter();

  const handleCreateOrder = () => {
    setIsCreateOrderModalVisible(true);
  };

  const handleCancel = () => {
    setIsCreateOrderModalVisible(false);
  };

  const handleSuccess = (orderNo) => {
    setIsCreateOrderModalVisible(false);
    router.push(`/order/${orderNo}`);
  };

  return (
    <>
      <Tooltip title="Create Order">
        <Button
          type="dashed"
          shape="circle"
          icon={<IoMdCreate />}
          className="ml-2"
          onClick={handleCreateOrder}
        />
      </Tooltip>
      {isCreateOrderModalVisible && (
        <CreateOrderModal
          isOpen={isCreateOrderModalVisible}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
          customerid={customerId}
        />
      )}
    </>
  );
};

export default CreateOrderButton;
