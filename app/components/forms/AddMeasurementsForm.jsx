import React from "react";
import { Form } from "antd";
import JacketForm from "./JacketForm";
import ShirtForm from "./ShirtForm";
import PantForm from "./PantForm";

const AddMeasurementsForm = ({ form, visibility, setFormData, formData }) => {
  const requiredFieldRule = [{ required: true, message: "This field is required." }];

  return (
    <Form form={form} initialValues={formData} onValuesChange={(changedValues, allValues) => setFormData(allValues)}>
      {visibility.displayJacketForm && (
        <JacketForm requiredFieldRule={requiredFieldRule} />
      )}
      {visibility.displayShirtForm && (
        <ShirtForm requiredFieldRule={requiredFieldRule} />
      )}
      {visibility.displayPantForm && (
        <PantForm requiredFieldRule={requiredFieldRule} />
      )}
    </Form>
  );
};

export default AddMeasurementsForm;
