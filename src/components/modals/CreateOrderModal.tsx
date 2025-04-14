"use client";
import React, { useState } from "react";
import orderService from "../../services/orderService";
import itemsService from "../../services/itemsService";
import jacketService from "../../services/jacketService";
import shirtService from "../../services/shirtService";
import pantService from "../../services/pantService";
import moment from "moment";
import OrderDetailsForm, { OrderDetailsFormData } from "../forms/OrderDetailsForm";
import AddMeasurementsForm from "../forms/AddMeasurementsForm";
import AddItemsForm from "../forms/AddItemsForm";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import SelectCustomerForm from "../forms/SelectCustomerForm";

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

// interface FormValues {
//   orderNo: string;
//   date?: Date;
//   note?: string;
//   items: Item[];
//   jacket?: {
//     jacket_length: string;
//     natural_length: string;
//     back_length: string;
//     x_back: string;
//     half_shoulder: string;
//     to_sleeve: string;
//     chest: string;
//     waist: string;
//     collar: string;
//     waist_coat_length: string;
//     sherwani_length: string;
//     other_notes: string;
//   };
//   shirt?: {
//     length: string;
//     half_shoulder: string;
//     to_sleeve: string;
//     chest: string;
//     waist: string;
//     collar: string;
//     other_notes: string;
//   };
//   pant?: {
//     length: string;
//     inseem: string;
//     waist: string;
//     hips: string;
//     bottom: string;
//     knee: string;
//     other_notes: string;
//   };
//   customerId?: string;
//   [key: string]: unknown;
// }

interface CreateOrderModalProps {
  isOpen: boolean;
  isCancel: () => void;
  customerid?: string;
}

const steps = [
  { id: 0, title: "Order Details" },
  { id: 1, title: "Add Items" },
  { id: 2, title: "Add Measurements" },
  { id: 3, title: "Select Customer" },
] as const;

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, isCancel, customerid }) => {
  const form = useForm<FormValues>({
    defaultValues: {
      orderNo: "",
      items: [],
      customerId: customerid,
      jacket: {
        jacket_length: "",
        natural_length: "",
        back_length: "",
        x_back: "",
        half_shoulder: "",
        to_sleeve: "",
        chest: "",
        waist: "",
        collar: "",
        waist_coat_length: "",
        sherwani_length: "",
        other_notes: ""
      },
      shirt: {
        length: "",
        half_shoulder: "",
        to_sleeve: "",
        chest: "",
        waist: "",
        collar: "",
        other_notes: ""
      },
      pant: {
        length: "",
        inseem: "",
        waist: "",
        hips: "",
        bottom: "",
        knee: "",
        other_notes: ""
      }
    }
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormValues>({
    orderNo: "",
    items: [],
    customerId: customerid,
    jacket: {
      jacket_length: "",
      natural_length: "",
      back_length: "",
      x_back: "",
      half_shoulder: "",
      to_sleeve: "",
      chest: "",
      waist: "",
      collar: "",
      waist_coat_length: "",
      sherwani_length: "",
      other_notes: ""
    },
    shirt: {
      length: "",
      half_shoulder: "",
      to_sleeve: "",
      chest: "",
      waist: "",
      collar: "",
      other_notes: ""
    },
    pant: {
      length: "",
      inseem: "",
      waist: "",
      hips: "",
      bottom: "",
      knee: "",
      other_notes: ""
    }
  });
  const [visibility, setVisibility] = useState({
    displayJacketForm: false,
    displayShirtForm: false,
    displayPantForm: false,
  });

  const { toast } = useToast();

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      // On last step, submit the form
      const formValues = form.getValues();
      if (!formValues.customerId) {
        toast({
          variant: "destructive",
          title: "Customer Required",
          description: "Please select a customer before creating the order.",
        });
        return;
      }
      await handleSubmit(formValues);
    } else {
      const isValid = await form.trigger();
      if (!isValid) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill all required fields correctly before proceeding.",
        });
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (data: FormValues) => {
    try {
      const { orderNo, date, note, items, customerId } = data;

      if (!customerId) {
        toast({
          variant: "destructive",
          title: "Customer Required",
          description: "Please select a customer before creating the order.",
        });
        return;
      }

      const formattedDate = date
        ? moment(date).format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");

      const orderResponse = await orderService.createOrder(customerId, {
        orderNo,
        date: formattedDate,
        note,
      });

      if (!orderResponse.orderNo) {
        throw new Error("Order number was not returned.");
      }

      const measurementPromises = items?.map((item: Item) => {
        const measurementData = form.getValues(item.item_type);
        console.log(
          "Measurement data for item:",
          item.item_type,
          measurementData
        );

        if (!customerId) {
          throw new Error("Customer ID is required");
        }

        switch (item.item_type) {
          case "jacket":
            return jacketService.createJacketMeasurement(
              customerId,
              orderResponse.orderNo,
              measurementData
            );
          case "shirt":
            return shirtService.createShirtMeasurement(
              customerId,
              orderResponse.orderNo,
              measurementData
            );
          case "pant":
            return pantService.createPantMeasurement(
              customerId,
              orderResponse.orderNo,
              measurementData
            );
          default:
            throw new Error("Unsupported item type");
        }
      });

      if (!measurementPromises) {
        throw new Error("No items to process");
      }

      const measurementResults = await Promise.allSettled(measurementPromises);
      console.log("Measurement results:", measurementResults);

      const itemsWithMeasurements = items
        ?.map((item: Item, index: number) => {
          const result = measurementResults[index];
          if (
            result.status === "fulfilled" &&
            result.value &&
            result.value.measurement_id
          ) {
            return {
              ...item,
              measurement_id: result.value.measurement_id,
              orderNo: orderResponse.orderNo,
            };
          }
          return null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      if (!itemsWithMeasurements || itemsWithMeasurements.length !== items?.length) {
        console.log("Mismatch in item measurements", itemsWithMeasurements);
        throw new Error(
          "Some items failed to have measurements created properly."
        );
      }

      await itemsService.createMultipleItems(
        orderResponse.orderNo,
        //@ts-expect-error items is correct
        itemsWithMeasurements
      );

      toast({
        title: "Success",
        description: "Order, measurements, and items created successfully!",
      });
      form.reset();
      setFormData({
        orderNo: "",
        items: [],
        customerId: customerid,
        jacket: {
          jacket_length: "",
          natural_length: "",
          back_length: "",
          x_back: "",
          half_shoulder: "",
          to_sleeve: "",
          chest: "",
          waist: "",
          collar: "",
          waist_coat_length: "",
          sherwani_length: "",
          other_notes: ""
        },
        shirt: {
          length: "",
          half_shoulder: "",
          to_sleeve: "",
          chest: "",
          waist: "",
          collar: "",
          other_notes: ""
        },
        pant: {
          length: "",
          inseem: "",
          waist: "",
          hips: "",
          bottom: "",
          knee: "",
          other_notes: ""
        }
      });
      isCancel();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      console.error("Error in creating order:", error);
      return;
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <OrderDetailsForm
            form={form}
            formData={{
              orderNo: formData.orderNo || '',
              date: formData.date,
              note: formData.note
            }}
            setFormData={(data: OrderDetailsFormData) => {
              setFormData({
                ...formData,
                ...data
              });
            }}
          />
        );
      case 1:
        return (
          <AddItemsForm
            form={form}
            formData={{
              items: formData.items || []
            }}
            setFormData={(data: { items: Item[] }) => {
              setFormData({
                ...formData,
                items: data.items
              });
            }}
            setVisibility={setVisibility}
          />
        );
      case 2:
        //@ts-expect-error Form is correct
        return <AddMeasurementsForm form={form} visibility={visibility} />;
      case 3:
        return (
          <SelectCustomerForm
            onSelect={(customerId) => {
              form.setValue('customerId', customerId);
              setFormData({
                ...formData,
                customerId
              });
            }}
            selectedCustomerId={form.getValues('customerId')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      setFormData({
        orderNo: "",
        items: [],
        customerId: customerid,
        jacket: {
          jacket_length: "",
          natural_length: "",
          back_length: "",
          x_back: "",
          half_shoulder: "",
          to_sleeve: "",
          chest: "",
          waist: "",
          collar: "",
          waist_coat_length: "",
          sherwani_length: "",
          other_notes: ""
        },
        shirt: {
          length: "",
          half_shoulder: "",
          to_sleeve: "",
          chest: "",
          waist: "",
          collar: "",
          other_notes: ""
        },
        pant: {
          length: "",
          inseem: "",
          waist: "",
          hips: "",
          bottom: "",
          knee: "",
          other_notes: ""
        }
      });
      isCancel();
    }}>
      <DialogContent className="min-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>

        <div className="relative mt-4">
          {/* Steps indicator */}
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
              {steps.map((step, stepIdx) => (
                <li key={step.title} className={cn("relative", {
                  "flex-1": stepIdx !== steps.length - 1,
                })}>
                  {currentStep > stepIdx ? (
                    <div className="group">
                      <span className="flex items-center">
                        <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                          <svg
                            className="h-5 w-5 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        {stepIdx !== steps.length - 1 && (
                          <div className="absolute right-4 left-0 -top-px mt-4 h-0.5 bg-primary" />
                        )}
                      </span>
                    </div>
                  ) : currentStep === stepIdx ? (
                    <div className="group">
                      <span className="flex items-center">
                        <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white">
                          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        </span>
                        {stepIdx !== steps.length - 1 && (
                          <div className="absolute right-4 left-0 -top-px mt-4 h-0.5 bg-gray-300" />
                        )}
                      </span>
                    </div>
                  ) : (
                    <div className="group">
                      <span className="flex items-center">
                        <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                          <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                        </span>
                        {stepIdx !== steps.length - 1 && (
                          <div className="absolute right-4 left-0 -top-px mt-4 h-0.5 bg-gray-300" />
                        )}
                      </span>
                    </div>
                  )}
                  <div className="mt-4 text-sm font-medium">
                    {step.title}
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-8">
            {renderStepContent()}
          </div>

          <div className="mt-8 flex justify-between">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrev}
              >
                Previous
              </Button>
            )}
            <div className="flex justify-end flex-1">
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button onClick={form.handleSubmit(handleSubmit)}>
                  Done
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderModal;
