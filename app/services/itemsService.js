import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";

const itemsService = {
  createMultipleItems: async (orderNo, items) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/items`,
        { orderNo, items },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error posting items:", error);
      throw error;
    }
  },

  getOrderItems: async (orderNo) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/items/order/${encodeURIComponent(orderNo)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching order items:", error);
      throw error;
    }
  },

  // Get an item by ID
  getItemById: async (itemId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/items/${encodeURIComponent(itemId)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching item:", error);
      throw error;
    }
  },

  // Update an item
  updateItem: async (itemId, fields) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/items/${encodeURIComponent(itemId)}`,
        fields,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  },

  // Delete an item
  deleteItem: async (itemId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/items/${encodeURIComponent(itemId)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting item:", error);
      throw error;
    }
  },

  createJacket: async (
    orderNo,
    item_name,
    jacket_measurement_id,
    fabric_id,
    lining_fabric_id
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/items/jacket`,
        {
          orderNo,
          item_name,
          jacket_measurement_id,
          fabric_id,
          lining_fabric_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating jacket:", error);
      throw error;
    }
  },

  createShirt: async (
    orderNo,
    item_name,
    shirt_measurement_id,
    fabric_id,
    lining_fabric_id
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/items/shirt`,
        {
          orderNo,
          item_name,
          shirt_measurement_id,
          fabric_id,
          lining_fabric_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating shirt:", error);
      throw error;
    }
  },

  createPant: async (
    orderNo,
    item_name,
    pant_measurement_id,
    fabric_id,
    lining_fabric_id
  ) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/items/pant`,
        {
          orderNo,
          item_name,
          pant_measurement_id,
          fabric_id,
          lining_fabric_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating pant:", error);
      throw error;
    }
  },
};

export default itemsService;
