"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, message, Steps, Form } from "antd";
import itemsService from "../../services/itemsService";
import orderService from "../../services/orderService";
import jacketService from "../../services/jacketService";
import shirtService from "../../services/shirtService";
import pantService from "../../services/pantService";
import AddItemsForm from "../forms/AddItemsForm";
import AddMeasurementsForm from "../forms/AddMeasurementsForm";

const { Step } = Steps;

const AddItemsModal = ({ isOpen, isCancel, orderNo }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [visibility, setVisibility] = useState({
    displayJacketForm: false,
    displayShirtForm: false,
    displayPantForm: false,
  });
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    if (orderNo) {
      const fetchOrderDetails = async () => {
        try {
          //console.log("Fetching order details for orderNo:", orderNo);
          const orderDetails = await orderService.getOrder(orderNo);
          if (orderDetails.orderNo == orderNo) {
            setCustomerId(orderDetails.customer_id);
            //console.log("Customer ID set to:", orderDetails.customer_id);
          } else {
            console.error("No order details found for orderNo:", orderNo);
          }
        } catch (error) {
          message.error("Failed to fetch order details");
          console.error("Error fetching order details:", error);
        }
      };

      fetchOrderDetails();
    } else {
      console.error("OrderNo is missing");
    }
  }, [orderNo]);

  useEffect(() => {
    //console.log("Customer ID after fetching:", customerId); // Add this line to log the customerId
  }, [customerId]);

  const steps = [
    {
      title: "Add Items",
      content: (
        <AddItemsForm
          form={form}
          formData={formData}
          setFormData={setFormData}
          setVisibility={setVisibility}
        />
      ),
    },
    {
      title: "Add Measurements",
      content: (
        <AddMeasurementsForm
          form={form}
          visibility={visibility}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
  ];

  const handleNext = () => {
    form
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
        message.error(
          "Please fill all required fields correctly before proceeding."
        );
      });
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = async () => {
    try {
      await form.validateFields();
      const { items } = form.getFieldsValue(true);

      if (!customerId) {
        throw new Error("Customer ID is missing");
      }

      const measurementPromises = items.map((item) => {
        const measurementData = form.getFieldValue([item.item_type]);
        console.log(
          `Creating ${item.item_type} measurement for customer ID ${customerId} with data:`,
          measurementData
        ); // Add this line to log the measurement data

        switch (item.item_type) {
          case "jacket":
            return jacketService.createJacketMeasurement(
              customerId,
              orderNo,
              measurementData
            );
          case "shirt":
            return shirtService.createShirtMeasurement(
              customerId,
              orderNo,
              measurementData
            );
          case "pant":
            return pantService.createPantMeasurement(
              customerId,
              orderNo,
              measurementData
            );
          default:
            throw new Error("Unsupported item type");
        }
      });

      const measurementResults = await Promise.allSettled(measurementPromises);

      const itemsWithMeasurements = items
        .map((item, index) => {
          const result = measurementResults[index];
          if (
            result.status === "fulfilled" &&
            result.value &&
            result.value.measurement_id
          ) {
            return {
              ...item,
              measurement_id: result.value.measurement_id,
            };
          }
          return null;
        })
        .filter((item) => item !== null);

      if (itemsWithMeasurements.length !== items.length) {
        throw new Error(
          "Some items failed to have measurements created properly."
        );
      }

      await itemsService.createMultipleItems(orderNo, itemsWithMeasurements);

      message.success("Items and measurements created successfully!");
      form.resetFields();
      setFormData({});
      setVisibility({
        displayJacketForm: false,
        displayShirtForm: false,
        displayPantForm: false,
      });
      isCancel();
    } catch (error) {
      message.error(`Failed to create items: ${error.message}`);
      console.error("Error in creating items or measurements:", error);
    }
  };

  return (
    <Modal
      title="Add Items"
      open={isOpen}
      onCancel={() => {
        setFormData({});
        isCancel();
      }}
      footer={null}
      width="auto"
    >
      <Steps current={currentStep} className="mt-10 px-5">
        {steps.map((item, index) => (
          <Step key={index} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[currentStep].content}</div>
      <div className="steps-action">
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={handleNext}>
            Next
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button type="primary" onClick={handleFinish}>
            Done
          </Button>
        )}
        {currentStep > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={handlePrev}>
            Previous
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default AddItemsModal;
