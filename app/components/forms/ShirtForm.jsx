import React from "react";
import { Input, Form } from "antd";
import TextArea from "antd/es/input/TextArea";

const ShirtForm = ({ requiredFieldRule = null }) => {
  return (
    <>
      <div className="grid grid-flow-row-dense md:grid-cols-3 justify-items-end">
        <Form.Item
          name={["shirt", "length"]}
          label="Shirt Length"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["shirt", "half_shoulder"]}
          label="Half Shoulder"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["shirt", "to_sleeve"]}
          label="To Sleeve"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["shirt", "chest"]}
          label="Chest"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["shirt", "waist"]}
          label="Waist"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["shirt", "collar"]}
          label="Collar"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
      </div>
      <Form.Item
        name={["shirt", "other_notes"]}
        label="Shirt Notes"
        rules={requiredFieldRule}
      >
        <TextArea rows={2} />
      </Form.Item>
    </>
  );
};

export default ShirtForm;
