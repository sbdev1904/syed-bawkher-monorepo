"use client";
import React from "react";
import { Form, Input, Button, message } from "antd";
import supplierService from "../../services/supplierService";

const AddSupplierForm = ({ onSuccess }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      await supplierService.createSupplier(values);
      message.success("Supplier created successfully");
      form.resetFields();
      if (onSuccess) {
        onSuccess(); // Close the modal or perform other success actions
      }
    } catch (error) {
      message.error("Failed to create supplier: " + error.message);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Supplier Name"
        name="supplier_name"
        rules={[{ required: true, message: "Please input the supplier name!" }]}
      >
        <Input placeholder="Enter supplier name" />
      </Form.Item>

      <Form.Item
        label="Address 1"
        name="add1"
        rules={[
          { required: true, message: "Please input the primary address!" },
        ]}
      >
        <Input placeholder="Enter primary address" />
      </Form.Item>

      <Form.Item label="Address 2" name="add2">
        <Input placeholder="Enter secondary address" />
      </Form.Item>

      <Form.Item label="Address 3" name="add3">
        <Input placeholder="Enter additional address" />
      </Form.Item>

      <Form.Item
        label="Phone Number 1"
        name="phone_number1"
        rules={[
          { required: true, message: "Please input the primary phone number!" },
        ]}
      >
        <Input placeholder="Enter primary phone number" />
      </Form.Item>

      <Form.Item label="Phone Number 2" name="phone_number2">
        <Input placeholder="Enter secondary phone number" />
      </Form.Item>

      <Form.Item label="Phone Number 3" name="phone_number3">
        <Input placeholder="Enter additional phone number" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "Please input a valid email!",
          },
        ]}
      >
        <Input placeholder="Enter email address" />
      </Form.Item>

      <Form.Item
        label="Primary Contact Name 1"
        name="primary_contact_name1"
        rules={[
          { required: true, message: "Please input the primary contact name!" },
        ]}
      >
        <Input placeholder="Enter primary contact name" />
      </Form.Item>

      <Form.Item label="Primary Contact Name 2" name="primary_contact_name2">
        <Input placeholder="Enter secondary contact name" />
      </Form.Item>

      <Form.Item label="Primary Contact Name 3" name="primary_contact_name3">
        <Input placeholder="Enter additional contact name" />
      </Form.Item>

      <Form.Item label="Notes" name="notes">
        <Input.TextArea placeholder="Enter any notes about the supplier" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddSupplierForm;
