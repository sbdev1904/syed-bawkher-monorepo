"use client";
import { Modal } from "antd";
import React from "react";
import MergeUserForm from "../forms/MergeUserForm";

const MergeUserModal = ({ isOpen, onCancel, customer_id = null }) => {
  return (
    <Modal
      title={`Merge into user: ${customer_id}`}
      open={isOpen}
      onCancel={onCancel}
      footer={null}
    >
      <MergeUserForm targetCustomerID={customer_id} />
    </Modal>
  );
};

export default MergeUserModal;
