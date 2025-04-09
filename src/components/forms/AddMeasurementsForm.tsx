"use client";
import React from "react";
import { Form } from "@/components/ui/form";
import JacketForm from "./JacketForm";
import ShirtForm from "./ShirtForm";
import PantForm from "./PantForm";

interface VisibilityState {
  displayJacketForm: boolean;
  displayShirtForm: boolean;
  displayPantForm: boolean;
}

interface AddMeasurementsFormProps {
  form: any; // Replace with the appropriate form type when available
  visibility: VisibilityState;
  setFormData: (data: any) => void;
  formData: any;
}

const AddMeasurementsForm = ({
  form,
  visibility,
  setFormData,
  formData,
}: AddMeasurementsFormProps) => {
  // Define the required field rule to pass to child components
  const requiredFieldRule = { required: true, message: "This field is required" };

  return (
    <div className="space-y-6">
      <form
        onChange={(e) => {
          const formElement = e.currentTarget;
          const formData = new FormData(formElement);
          const formValues = Object.fromEntries(formData.entries());
          setFormData(formValues);
        }}
        className="space-y-6"
      >
        {visibility.displayJacketForm && (
          <JacketForm form={form} requiredFieldRule={requiredFieldRule} />
        )}
        {visibility.displayShirtForm && (
          <ShirtForm form={form} requiredFieldRule={requiredFieldRule} />
        )}
        {visibility.displayPantForm && (
          <PantForm form={form} requiredFieldRule={requiredFieldRule} />
        )}
      </form>
    </div>
  );
};

export default AddMeasurementsForm;
