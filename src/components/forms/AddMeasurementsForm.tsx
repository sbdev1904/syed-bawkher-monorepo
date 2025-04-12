"use client";
import React from "react";
import { Form } from "@/components/ui/form";
import JacketForm from "./JacketForm";
import ShirtForm from "./ShirtForm";
import PantForm from "./PantForm";
import { UseFormReturn } from "react-hook-form";

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
  jacket: {
    jacket_length: string;
    natural_length: string;
    back_length: string;
    x_back: string;
    half_shoulder: string;
    to_sleeve: string;
    chest: string;
    waist: string;
    collar: string;
    waist_coat_length: string;
    sherwani_length: string;
    other_notes: string;
  };
  shirt: {
    length: string;
    half_shoulder: string;
    to_sleeve: string;
    chest: string;
    waist: string;
    collar: string;
    other_notes: string;
  };
  pant: {
    length: string;
    inseem: string;
    waist: string;
    hips: string;
    bottom: string;
    knee: string;
    other_notes: string;
  };
  customerId?: string;
  [key: string]: unknown;
}

interface AddMeasurementsFormProps {
  form: UseFormReturn<FormValues>;
  visibility: {
    displayJacketForm: boolean;
    displayShirtForm: boolean;
    displayPantForm: boolean;
  };
}

const AddMeasurementsForm = ({
  form,
  visibility,
}: AddMeasurementsFormProps) => {
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-6">
          {visibility.displayJacketForm && (
            <JacketForm form={form} />
          )}
          {visibility.displayShirtForm && (
            <ShirtForm form={form} />
          )}
          {visibility.displayPantForm && (
            <PantForm form={form} />
          )}
        </form>
      </Form>
    </div>
  );
};

export default AddMeasurementsForm;
