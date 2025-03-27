import React from "react";
import { Input, Form } from "antd";
import TextArea from "antd/es/input/TextArea";

const JacketForm = ({ requiredFieldRule = null }) => {
  return (
    <>
      <div className="grid grid-flow-row-dense md:grid-cols-3 justify-items-end">
        <Form.Item
          name={["jacket", "jacket_length"]}
          label="Jacket Length"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["jacket", "natural_length"]}
          label="Natural Length"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["jacket", "back_length"]}
          label="Back Length"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["jacket", "x_back"]}
          label="Cross Back"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["jacket", "half_shoulder"]}
          label="Half Shoulder"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["jacket", "to_sleeve"]}
          label="To Sleeve"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["jacket", "chest"]}
          label="Chest"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["jacket", "waist"]}
          label="Waist"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["jacket", "collar"]}
          label="Collar"
          rules={requiredFieldRule}
        >
          <Input className="w-10" />
        </Form.Item>
      </div>
      <div className="grid grid-flow-row-dense md:grid-cols-2 justify-items-end">
        <Form.Item
          name={["jacket", "waist_coat_length"]}
          label="Vest Coat Length"
        >
          <Input className="w-10" />
        </Form.Item>
        <Form.Item
          name={["jacket", "sherwani_length"]}
          label="Sherwani Length"
        >
          <Input className="w-10" />
        </Form.Item>
      </div>
      <Form.Item
        name={["jacket", "other_notes"]}
        label="Jacket Notes"
        rules={requiredFieldRule}
      >
        <TextArea rows={2} />
      </Form.Item>
    </>
  );
};

export default JacketForm;
