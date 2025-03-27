import React from "react";
import { Input, Form } from "antd";

const CreateCustomerForm = ({ form }) => {
  return (
    <Form form={form}>
      <div className="space-y-2 flex flex-col py-2">
        <h1 className="text-gray-600 text-lg">Name</h1>
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: "Please Enter First Name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Middle Name" name="middle_name">
          <Input />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: "Please Enter Last Name" }]}
        >
          <Input />
        </Form.Item>
      </div>

      <div className="space-y-2 flex flex-col py-2">
        <h1 className="text-gray-600 text-lg">Contact</h1>
        <Form.Item
          label="Mobile Phone"
          name="mobile"
          rules={[{ required: true, message: "Please Enter Mobile Number" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Office Phone" name="office_phone">
          <Input />
        </Form.Item>
        <Form.Item label="Residential Phone" name="residential_phone">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
      </div>

      <div className="space-y-2 flex flex-col py-2">
        <h1 className="text-gray-600 text-lg">Address</h1>
        <Form.Item label="Line 1" name="add1">
          <Input />
        </Form.Item>
        <Form.Item label="Line 2" name="add2">
          <Input />
        </Form.Item>
        <Form.Item label="Line 3" name="add3">
          <Input />
        </Form.Item>
        <Form.Item label="Line 4" name="add4">
          <Input />
        </Form.Item>
      </div>
    </Form>
  );
};

export default CreateCustomerForm;
