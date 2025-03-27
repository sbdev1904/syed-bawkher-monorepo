"use client";

import React, { useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { Button, Tooltip } from "antd";
import AddFabricPurchaseOrderModal from "../modals/AddFabricPurchaseOrderModal";

const AddFabricPurchaseOrderButton = ({ fabricId }) => {
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
      <Tooltip title="Add New Fabric Purchase Order">
        <Button type="primary" icon={<IoMdCreate />} onClick={showModal}>
          Fabric Purchase Order
        </Button>
      </Tooltip>
      <AddFabricPurchaseOrderModal
        isOpen={isModalVisible}
        onCancel={handleCancel}
        fabricId={fabricId}
      />
    </>
  );
};

export default AddFabricPurchaseOrderButton;
