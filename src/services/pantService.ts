import axios from "axios";

import { PantMeasurement } from "@/components/modals/UpdatePantMeasurementModal";

const pantService = {
  getPantByOrderNo: async (orderNo: string) => {
    try {
      const response = await axios.get(
        `/api/pant-measurement/order/${encodeURIComponent(orderNo)}`
      );
      return response.data[0];
    } catch (error) {
      console.error("Error finding pant measurements:", error);
      throw error;
    }
  },
  getPantByCustomerId: async (customerId: string) => {
    try {
      const response = await axios.get(
        `/api/pant-measurement/customer/${encodeURIComponent(customerId)}`
      );
      console.log("Pant1:" + customerId, response.data);
      return response.data;
    } catch (error) {
      console.error("Error finding pant measurements:", error);
      throw error;
    }
  },
  createPantMeasurement: async (
    customerId: string,
    orderNo: string,
    measurementData: PantMeasurement
  ) => {
    try {
      const response = await axios.post(
        `/api/pant-measurement`,
        {
          ...measurementData,
          customerId,
          orderNo,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Pant:", measurementData);
      return response.data;
    } catch (error) {
      console.error("Error creating pant measurement:", error);
      throw error;
    }
  },
  updatePantMeasurement: async (
    measurementId: string,
    measurementData: PantMeasurement
  ) => {
    try {
      const response = await axios.put(
        `/api/pant-measurement/${encodeURIComponent(measurementId)}`,
        measurementData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating pant measurement:", error);
      throw error;
    }
  },
};

export default pantService;
