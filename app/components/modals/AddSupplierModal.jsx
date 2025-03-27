"use client";
import React from "react";
import { Modal } from "antd";
import AddSupplierForm from "../forms/AddSupplierForm";

const AddSupplierModal = ({ isOpen, onCancel }) => {
  return (
    <Modal
      title="Add New Supplier"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
    >
      <AddSupplierForm onSuccess={onCancel} />
    </Modal>
  );
};

export default AddSupplierModal;
