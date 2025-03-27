import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import ShirtForm from "../forms/ShirtForm";
import shirtService from "../../services/shirtService";

const UpdateShirtMeasurementModal = ({ isOpen, onCancel, measurement }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ shirt: measurement });
    }
  });

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { shirt } = values;
      await shirtService.updateShirtMeasurement(measurement.measurement_id, shirt);
      message.success("Shirt measurement updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating shirt measurement:", error);
      message.error("Failed to update shirt measurement");
    }
  };

  return (
    <Modal
      title={`Update Shirt Measurement`}
      open={isOpen}
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form form={form}>
        <ShirtForm />
      </Form>
    </Modal>
  );
};

export default UpdateShirtMeasurementModal;
