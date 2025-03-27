"use client";
import React from "react";
import { Modal } from "antd";
import AddFabricPurchaseOrderForm from "../forms/AddFabricPurchaseOrderForm";

const AddFabricPurchaseOrderModal = ({ isOpen, onCancel, fabricId }) => {
  return (
    <Modal
      title="Add New Fabric Purchase Order"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
    >
      <AddFabricPurchaseOrderForm onSuccess={onCancel} fabricId={fabricId} />
    </Modal>
  );
};

export default AddFabricPurchaseOrderModal;
