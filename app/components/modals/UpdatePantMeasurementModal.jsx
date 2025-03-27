import React, { useEffect } from "react";
import { Modal, Form, message } from "antd";
import PantForm from "../forms/PantForm";
import pantService from "../../services/pantService";

const UpdatePantMeasurementModal = ({ isOpen, onCancel, measurement }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ pant: measurement });
    }
  });

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { pant } = values;
      await pantService.updatePantMeasurement(measurement.measurement_id, pant);
      message.success("Pant measurement updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating pant measurement:", error);
      message.error("Failed to update pant measurement");
    }
  };

  return (
    <Modal
      title={`Update Pant Measurement`}
      open={isOpen}
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form form={form}>
        <PantForm />
      </Form>
    </Modal>
  );
};

export default UpdatePantMeasurementModal;
