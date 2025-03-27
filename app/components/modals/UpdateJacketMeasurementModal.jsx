"use client";
import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import JacketForm from "../forms/JacketForm";
import jacketService from "../../services/jacketService";

const UpdateJacketMeasurementModal = ({ isOpen, onCancel, measurement }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ jacket: measurement });
    }
  });

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { jacket } = values;
      await jacketService.updateJacketMeasurement(
        measurement.measurement_id,
        jacket
      );
      message.success("Jacket measurement updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating jacket measurement:", error);
      message.error("Failed to update jacket measurement");
    }
  };

  return (
    <Modal
      title={`Update Jacket Measurement`}
      open={isOpen}
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form form={form}>
        <JacketForm />
      </Form>
    </Modal>
  );
};

export default UpdateJacketMeasurementModal;
