"use client";
import React from "react";
import { Input, Form } from "antd";
import TextArea from "antd/es/input/TextArea";

const PantForm = ({ requiredFieldRule = null }) => {
  return (
    <>
      <div className="grid grid-flow-row-dense md:grid-cols-3 justify-items-end">
        <Form.Item
          name={["pant", "length"]}
          label="Pant Length"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item name={["pant", "inseem"]} label="Pant Inseem">
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["pant", "waist"]}
          label="Waist"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["pant", "hips"]}
          label="Hips"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["pant", "bottom"]}
          label="Bottom"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["pant", "knee"]}
          label="Knee"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
      </div>
      <Form.Item
        name={["pant", "other_notes"]}
        label="Pant Notes"
        rules={requiredFieldRule}
      >
        <TextArea rows={2} />
      </Form.Item>
    </>
  );
};

export default PantForm;
