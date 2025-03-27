import React from "react";
import { Form, Input, InputNumber, Button, message } from "antd";
import fabricService from "../../services/fabricService";

const AddTextileForm = ({ onSuccess }) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const response = await fabricService.createFabric(values);
      message.success("Fabric created successfully");
      form.resetFields();
      if (onSuccess) {
        onSuccess(); // Call the onSuccess callback to close the modal
      }
    } catch (error) {
      message.error("Failed to create fabric: " + error.message);
    }
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Fabric Code"
          name="fabric_code"
          rules={[{ required: true, message: "Please input the fabric Code!" }]}
        >
          <Input placeholder="Enter fabric Code" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input placeholder="Enter fabric description" />
        </Form.Item>

        <Form.Item
          label="Available Length"
          name="available_length"
          rules={[
            { required: true, message: "Please input the available length!" },
          ]}
        >
          <InputNumber
            min={0}
            placeholder="Enter available length in meters"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Fabric Brand"
          name="fabric_brand"
          rules={[
            { required: true, message: "Please input the fabric brand!" },
          ]}
        >
          <Input placeholder="Enter fabric brand" />
        </Form.Item>

        <Form.Item
          label="Stock Location"
          name="stock_location"
        >
          <Input placeholder="Enter stock location" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTextileForm;
