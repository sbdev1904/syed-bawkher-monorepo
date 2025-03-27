"use client";

import React from "react";
import { Input, Form, DatePicker } from "antd";

const OrderDetailsForm = ({ form, formData, setFormData }) => {
  const handleValueChange = (changedValues) => {
    // Update the centralized formData state
    setFormData((prev) => ({ ...prev, ...changedValues }));
  };

  return (
    <>
      <Form
        form={form}
        initialValues={formData}
        onValuesChange={(changedValues, allValues) => setFormData(allValues)}
      >
        <Form.Item
          name="orderNo"
          label="Order Number"
          className="mt-10"
          rules={[{ required: true, message: "Please enter an order number" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="date"
          label="Date (optional)"
          tooltip="If no date is provided, today's date will be used."
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="note"
          label="Note"
          tooltip="Any special notes for the order"
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </>
  );
};

export default OrderDetailsForm;
