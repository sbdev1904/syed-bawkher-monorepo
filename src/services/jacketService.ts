import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";

const jacketService = {
  getJacketByOrderNo: async (orderNo: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/jacket-measurement/order/${encodeURIComponent(
          orderNo
        )}`
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
        `${BASE_URL}/api/jacket-measurement/customer/${encodeURIComponent(
          customerId
        )}`
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
    measurementData: any
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/jacket-measurement`,
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
    measurementData: any
  ) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/jacket-measurement/${encodeURIComponent(
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
      console.error("Error updating jacket measurement:", error);
      throw error;
    }
  },
};

export default jacketService;
