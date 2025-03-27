"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  message,
  Select,
} from "antd";
import fabricOrderService from "../../services/fabricOrderListService";
import supplierService from "../../services/supplierService";
import dayjs from "dayjs";

const { Option } = Select;

const AddFabricPurchaseOrderForm = ({ onSuccess, fabricId }) => {
  const [form] = Form.useForm();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const supplierList = await supplierService.getAllSuppliers();
        setSuppliers(supplierList);
      } catch (error) {
        message.error("Failed to load suppliers: " + error.message);
      }
    };

    fetchSuppliers();
  }, []);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const {
        fabric_id,
        description,
        supplier_name,
        meters,
        ordered_date,
        ordered_for,
      } = form.getFieldsValue(true);

      const formattedOrderedDate = ordered_date
        ? ordered_date.format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD");

      const formattedValues = {
        fabric_id,
        description,
        supplier_name,
        meters,
        ordered_date: formattedOrderedDate,
        ordered_for,
        supplier_id: selectedSupplierId,
      };

      await fabricOrderService.createFabricOrder(formattedValues);
      message.success("Fabric Purchase Order created successfully");
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error("Failed to create fabric order: " + error.message);
    }
  };

  const handleSupplierChange = (value, option) => {
    setSelectedSupplierId(option.key);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        fabric_id: fabricId || "",
        ordered_date: dayjs(),
      }}
    >
      <Form.Item
        label="Fabric ID"
        name="fabric_id"
        rules={[{ required: true, message: "Please input the fabric Id!" }]}
      >
        <Input
          placeholder="Enter fabric ID"
          disabled={!!fabricId}
          value={fabricId || undefined}
        />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please input the description!" }]}
      >
        <Input placeholder="Enter purchase order description" />
      </Form.Item>

      <Form.Item
        label="Supplier Name"
        name="supplier_name"
        rules={[{ required: true, message: "Please select a supplier!" }]}
      >
        <Select placeholder="Select a supplier" onChange={handleSupplierChange}>
          {suppliers.map((supplier) => (
            <Option key={supplier.supplier_id} value={supplier.supplier_name}>
              {supplier.supplier_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Meters"
        name="meters"
        rules={[
          { required: true, message: "Please input the number of meters!" },
        ]}
      >
        <InputNumber
          min={0}
          placeholder="Enter meters"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        label="Ordered Date"
        name="ordered_date"
        rules={[{ required: true, message: "Please select the ordered date!" }]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        label="Ordered For"
        name="ordered_for"
        rules={[
          { required: true, message: "Please input who the order is for!" },
        ]}
      >
        <Input placeholder="Enter client name or purpose" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddFabricPurchaseOrderForm;
