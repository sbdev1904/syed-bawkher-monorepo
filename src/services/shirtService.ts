import axios from "axios";
import { ShirtMeasurement } from "@/components/modals/UpdateShirtMeasurementModal";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";

const shirtService = {
  getShirtByOrderNo: async (orderNo: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/shirt-measurement/order/${encodeURIComponent(orderNo)}`
      );
      return response.data[0];
    } catch (error) {
      console.error("Error finding shirt measurements:", error);
      throw error;
    }
  },
  getShirtByCustomerId: async (customerId: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/shirt-measurement/customer/${encodeURIComponent(
          customerId
        )}`
      );
      console.log("Shirt1:" + customerId, response.data);
      return response.data;
    } catch (error) {
      console.error("Error finding shirt measurements:", error);
      throw error;
    }
  },
  createShirtMeasurement: async (
    customerId: string,
    orderNo: string,
    measurementData: ShirtMeasurement
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/shirt-measurement`,
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
      console.log("Shirt:", measurementData);
      return response.data;
    } catch (error) {
      console.error("Error creating shirt measurement:", error);
      throw error;
    }
  },
  updateShirtMeasurement: async (
    measurementId: string,
    measurementData: ShirtMeasurement
  ) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/shirt-measurement/${encodeURIComponent(
          measurementId
        )}`,
        measurementData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating shirt measurement:", error);
      throw error;
    }
  },
};

export default shirtService;
