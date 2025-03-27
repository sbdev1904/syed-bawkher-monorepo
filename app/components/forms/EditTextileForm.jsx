"use client";
import React from "react";
import { Form, Input, InputNumber, Button } from "antd";

const EditTextileForm = ({ fabric, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      initialValues={{
        description: fabric.description,
        available_length: fabric.available_length,
        fabric_code: fabric.fabric_code,
        stock_location: fabric.stock_location,
      }}
      onFinish={handleFinish}
      layout="vertical"
    >
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: "Please enter the description" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="available_length"
        label="Available Length"
        rules={[
          { required: true, message: "Please enter the available length" },
        ]}
      >
        <InputNumber min={0} step={0.01} />
      </Form.Item>
      <Form.Item
        name="fabric_code"
        label="Fabric Code"
        rules={[{ required: true, message: "Please enter the fabric code" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="stock_location"
        label="Stock Location"
        rules={[{ required: true, message: "Please enter the stock location" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update Fabric
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditTextileForm;
