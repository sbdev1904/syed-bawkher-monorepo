import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";

const pantService = {
  getPantByOrderNo: async (orderNo) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/pantMeasurement/order/${encodeURIComponent(orderNo)}`
      );
      return response.data[0];
    } catch (error) {
      console.error("Error finding pant measurements:", error);
      throw error;
    }
  },
  getPantByCustomerId: async (customerId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/pantMeasurement/customer/${encodeURIComponent(
          customerId
        )}`
      );
      console.log("Pant1:" + customerId, response.data);
      return response.data;
    } catch (error) {
      console.error("Error finding pant measurements:", error);
      throw error;
    }
  },
  createPantMeasurement: async (customerId, orderNo, measurementData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/pantMeasurement/${encodeURIComponent(
          customerId
        )}/${encodeURIComponent(orderNo)}`,
        measurementData,
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
  updatePantMeasurement: async (measurementId, measurementData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/pantMeasurement/${encodeURIComponent(measurementId)}`,
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
