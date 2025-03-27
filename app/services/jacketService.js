import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";

const jacketService = {
  getJacketByOrderNo: async (orderNo) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/jacketMeasurement/order/${encodeURIComponent(orderNo)}`
      );
      return response.data[0];
    } catch (error) {
      console.error("Error finding jacket measurements:", error);
      throw error;
    }
  },
  getJacketByCustomerId: async (customerId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/jacketMeasurement/customer/${encodeURIComponent(
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
  createJacketMeasurement: async (customerId, orderNo, measurementData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/jacketMeasurement/${encodeURIComponent(
          customerId
        )}/${encodeURIComponent(orderNo)}`,
        measurementData,
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
  updateJacketMeasurement: async (measurementId, measurementData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/jacketMeasurement/${encodeURIComponent(
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
