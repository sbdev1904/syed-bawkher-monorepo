"use client";
import React from "react";
import { Modal, message } from "antd";
import EditTextileForm from "../forms/EditTextileForm";
import fabricService from "../../services/fabricService";

const EditTextileModal = ({ visible, onClose, fabric, onUpdate }) => {
  const handleFormSubmit = async (updatedFields) => {
    try {
      await fabricService.updateFabric(fabric.fabric_id, updatedFields);
      const updatedFabric = await fabricService.getFabricById(fabric.fabric_id);
      onUpdate(updatedFabric);
      onClose();
      message.success("Fabric updated successfully.");
    } catch (error) {
      console.error("Error updating fabric:", error);
      message.error("Failed to update fabric.");
    }
  };

  return (
    <Modal
      visible={visible}
      title="Edit Fabric"
      onCancel={onClose}
      footer={null}
    >
      <EditTextileForm fabric={fabric} onSubmit={handleFormSubmit} />
    </Modal>
  );
};

export default EditTextileModal;
