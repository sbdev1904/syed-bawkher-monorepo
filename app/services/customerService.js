import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";

const customerService = {
  searchCustomers: async (search) => {
    const url = `${BASE_URL}/api/customers/search?query=${encodeURIComponent(
      search
    )}`; // Correct variable name used
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error searching for customers:", error);
      throw error; // Throws error to be caught where the function is called
    }
  },

  findById: async (customer_id) => {
    const url = `${BASE_URL}/api/customers/${customer_id}`;
    try {
      const response = await axios.get(url);
      return response.data[0];
    } catch (error) {
      console.error("Error finding customer:", error);
      throw error;
    }
  },

  findByOrderNo: async (orderNo) => {
    const url = `${BASE_URL}/api/customers/order/${encodeURIComponent(orderNo)}`;
    try {
      const response = await axios.get(url);
      console.log("Customer by order number:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error finding customer by order number:", error);
      throw error;
    }
  },

  createCustomer: async (customer) => {
    const url = `${BASE_URL}/api/customers`;
    try {
      const response = await axios.post(url, customer);
      return response.data;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  },

  updateCustomer: async (customer_id, customerData) => {
    const url = `${BASE_URL}/api/customers/${customer_id}`;
    try {
      const response = await axios.put(url, customerData);
      return response.data;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error; // Throws error to be caught where the function is called
    }
  },

  mergeCustomers: async (customerIds) => {
    const url = `${BASE_URL}/api/customers/merge`;
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
