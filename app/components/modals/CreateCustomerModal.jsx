import React , {useEffect} from "react";
import { Modal, Input, Form, Button, message } from "antd";
import customerService from "../../services/customerService";
import CreateCustomerForm from "../forms/CreateCustomerForm";

/*
TODO: 
 Currently shows this warning : 
  Warning: Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?
 */

const CreateCustomerModal = ({ isOpen, isCancel, customerid = null }) => {
  const [form] = Form.useForm();


  useEffect(() => {
    if (customerid) {
      customerService.findById(customerid)
        .then(data => {
          // Assuming `data` is the customer object returned from the backend
          form.setFieldsValue({
            first_name: data.first_name,
            middle_name: data.middle_name,
            last_name: data.last_name,
            mobile: data.mobile,
            add1: data.add1,
            add2: data.add2,
            add3: data.add3,
            add4: data.add4,
            email: data.email,
            office_phone: data.office_phone,
            residential_phone: data.residential_phone
          });
        })
        .catch(error => {
          console.error('Failed to fetch customer:', error);
          message.error('Failed to load customer data.');
        });
    }
  }, [customerid, isOpen, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (customerid) {
        await customerService.updateCustomer(customerid, values);
        message.success('Customer updated successfully!');
      } else {
        await customerService.createCustomer(values);
        message.success('Customer created successfully!');
      }
      form.resetFields();
      isCancel(); // Close modal after successful submission
    } catch (error) {
      console.error('Failed to process customer:', error);
      message.error('Failed to process customer. Please check your input and try again.');
    }
  };

  return (
    <Modal
      title="Create Customer"
      open={isOpen}
      onCancel={isCancel}
      footer={[
        <Button key="back" onClick={isCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} >
        <CreateCustomerForm form={form} />
      </Form>
    </Modal>
  );
};

export default CreateCustomerModal;
