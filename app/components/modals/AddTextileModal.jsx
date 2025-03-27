import React from "react";
import { Modal } from "antd";
import AddTextileForm from "../forms/AddTextileForm";

const AddTextileModal = ({ isOpen, onCancel }) => {
  return (
    <Modal
      title={`Add New Textile`}
      open={isOpen}
      onCancel={onCancel}
      footer={null}
    >
      <AddTextileForm onSuccess={onCancel} />
    </Modal>
  )
}

export default AddTextileModal;
