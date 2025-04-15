"use client";
import React, { useState, useEffect } from "react";
import itemsService from "../../services/itemsService";
import orderService from "../../services/orderService";
import jacketService from "../../services/jacketService";
import shirtService from "../../services/shirtService";
import pantService from "../../services/pantService";
import AddItemsForm from "../forms/AddItemsForm";
import AddMeasurementsForm from "../forms/AddMeasurementsForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";

// Custom Stepper component
const CustomStepper = ({
  steps,
  currentStep,
}: {
  steps: { title: string }[];
  currentStep: number;
}) => {
  return (
    <div className="flex justify-between mb-8 relative">
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full grid place-content-center text-sm font-medium ${
              index <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {index + 1}
          </div>
          <div className="mt-2 text-sm font-medium">{step.title}</div>
          {index < steps.length - 1 && (
            <div
              className={`absolute top-4 left-0 right-0 h-[2px] ${
                index < currentStep ? "bg-primary" : "bg-muted"
              }`}
              style={{
                left: `calc(${(index * 100) / (steps.length - 1)}% + ${16}px)`,
                right: `calc(${
                  100 - ((index + 1) * 100) / (steps.length - 1)
                }% + ${16}px)`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Import the correct types from the AddItemsForm component
interface Item {
  item_name: string;
  item_type: "jacket" | "shirt" | "pant";
  fabric_id?: string;
  lining_fabric_id?: string;
  key: string;
}

interface FormValues {
  orderNo: string;
  date?: Date;
  note?: string;
  items: Item[];
  jacket?: Record<string, string | number>;
  shirt?: Record<string, string | number>;
  pant?: Record<string, string | number>;
  customerId?: string;
  [key: string]: unknown;
}

interface VisibilityState {
  displayJacketForm: boolean;
  displayShirtForm: boolean;
  displayPantForm: boolean;
}

const AddItemsModal = ({
  isOpen,
  isCancel,
  orderNo,
}: {
  isOpen: boolean;
  isCancel: () => void;
  orderNo: string;
}) => {
  const form = useForm<FormValues>({
    defaultValues: {
      orderNo,
      items: [],
      jacket: {},
      shirt: {},
      pant: {},
    },
  });
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormValues>({
    orderNo,
    items: [],
    jacket: {},
    shirt: {},
    pant: {},
  });
  const [visibility, setVisibility] = useState<VisibilityState>({
    displayJacketForm: false,
    displayShirtForm: false,
    displayPantForm: false,
  });
  const [customerId, setCustomerId] = useState<string | null>(null);

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
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch order details",
          });
          console.error("Error fetching order details:", error);
        }
      };

      fetchOrderDetails();
    } else {
      console.error("OrderNo is missing");
    }
  }, [orderNo, toast]);

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
          setFormData={(data: FormValues) => setFormData(data)}
          setVisibility={setVisibility}
        />
      ),
    },
    {
      title: "Add Measurements",
      content: (
        <AddMeasurementsForm
          //@ts-expect-error interface mismatch not a problem
          form={form}
          visibility={visibility}
          formData={formData}
          setFormData={(data: FormValues) => setFormData(data)}
        />
      ),
    },
  ];

  const handleNext = async () => {
    try {
      await form.trigger();
      setCurrentStep(currentStep + 1);
    } catch (errorInfo) {
      console.error("Validation Failed:", errorInfo);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description:
          "Please fill all required fields correctly before proceeding.",
      });
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = async () => {
    try {
      const isValid = await form.trigger();
      if (!isValid) return;

      const values = form.getValues();
      const { items } = values;

      if (!customerId) {
        throw new Error("Customer ID is missing");
      }

      const measurementPromises = items.map((item: Item) => {
        const measurementData = form.getValues(item.item_type);
        console.log(
          `Creating ${item.item_type} measurement for customer ID ${customerId} with data:`,
          measurementData
        ); // Add this line to log the measurement data

        switch (item.item_type) {
          case "jacket":
            return jacketService.createJacketMeasurement(
              customerId,
              orderNo,
              //@ts-expect-error interface mismatch not a problem
              measurementData
            );
          case "shirt":
            return shirtService.createShirtMeasurement(
              customerId,
              orderNo,
              //@ts-expect-error interface mismatch not a problem
              measurementData
            );
          case "pant":
            return pantService.createPantMeasurement(
              customerId,
              orderNo,
              //@ts-expect-error interface mismatch not a problem
              measurementData
            );
          default:
            throw new Error("Unsupported item type");
        }
      });

      const measurementResults = await Promise.allSettled(measurementPromises);

      const itemsWithMeasurements = items
        .map((item: Item, index: number) => {
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
        .filter((item: Item | null) => item !== null);

      if (itemsWithMeasurements.length !== items.length) {
        throw new Error(
          "Some items failed to have measurements created properly."
        );
      }

      //@ts-expect-error interface mismatch not a problem
      await itemsService.createMultipleItems(orderNo, itemsWithMeasurements);

      toast({
        title: "Success",
        description: "Items and measurements created successfully!",
      });
      form.reset();
      setFormData({ orderNo, items: [], jacket: {}, shirt: {}, pant: {} });
      setVisibility({
        displayJacketForm: false,
        displayShirtForm: false,
        displayPantForm: false,
      });
      isCancel();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create items: ${errorMessage}`,
      });
      console.error("Error in creating items or measurements:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && isCancel()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add Items</DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          <CustomStepper steps={steps} currentStep={currentStep} />
          <div className="py-4">{steps[currentStep].content}</div>
        </div>
        <DialogFooter className="flex space-x-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrev}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button onClick={handleNext}>Next</Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button onClick={handleFinish}>Done</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemsModal;
