import axios from "axios";
import { JacketMeasurement } from "@/components/modals/UpdateJacketMeasurementModal";

const jacketService = {
  getJacketByOrderNo: async (orderNo: string) => {
    try {
      const response = await axios.get(
        `/api/jacket-measurement/order/${encodeURIComponent(orderNo)}`
      );
      return response.data[0];
    } catch (error) {
      console.error("Error finding jacket measurements:", error);
      throw error;
    }
  },
  getJacketByCustomerId: async (customerId: string) => {
    try {
      const response = await axios.get(
        `/api/jacket-measurement/customer/${encodeURIComponent(customerId)}`
      );
      console.log("Jacket1:" + customerId, response.data);
      return response.data;
    } catch (error) {
      console.error("Error finding jacket measurements:", error);
      throw error;
    }
  },
  createJacketMeasurement: async (
    customerId: string,
    orderNo: string,
    measurementData: JacketMeasurement
  ) => {
    try {
      const response = await axios.post(
        `/api/jacket-measurement`,
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
      console.log("Jacket:", measurementData);
      return response.data;
    } catch (error) {
      console.error("Error creating jacket measurement:", error);
      throw error;
    }
  },
  updateJacketMeasurement: async (
    measurementId: string,
    measurementData: JacketMeasurement
  ) => {
    try {
      const response = await axios.put(
        `/api/jacket-measurement`,
        { measurementData, measurementId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating jacket measurement:", error);
      throw error;
    }
  },
};

export default jacketService;
