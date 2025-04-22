import { CustomerFormValues } from "@/components/modals/CreateCustomerModal";
import axios from "axios";

const customerService = {
  searchCustomers: async (search: string) => {
    const url = `/api/customers/search?query=${encodeURIComponent(search)}`; // Correct variable name used
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error searching for customers:", error);
      throw error; // Throws error to be caught where the function is called
    }
  },

  findById: async (customer_id: string) => {
    const url = `/api/customers/${customer_id}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error finding customer:", error);
      throw error;
    }
  },

  findByOrderNo: async (orderNo: string) => {
    const url = `/api/customers/order/${encodeURIComponent(orderNo)}`;
    try {
      const response = await axios.get(url);
      console.log("Customer by order number:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error finding customer by order number:", error);
      throw error;
    }
  },

  createCustomer: async (customer: CustomerFormValues) => {
    const url = `/api/customers`;
    try {
      const response = await axios.post(url, customer);
      return response.data;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  },

  updateCustomer: async (
    customer_id: string,
    customerData: CustomerFormValues
  ) => {
    const url = `/api/customers/${customer_id}`;
    try {
      const response = await axios.put(url, customerData);
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error; // Throws error to be caught where the function is called
    }
  },

  mergeCustomers: async (customerIds: string[]) => {
    const url = `/api/customers/merge`;
    const data = { customerIds };
    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
        maxBodyLength: Infinity,
      });
      return response.data;
    } catch (error) {
      console.error("Error merging customers:", error);
      throw error;
    }
  },
};

export default customerService;
