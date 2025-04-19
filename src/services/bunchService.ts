import axios from "axios";
import { InventoryItem } from "./locationService";

const bunchService = {
  // Get all bunches in a rack
  getBunchesByRack: async (rack_id: number) => {
    try {
      const response = await axios.get(`/api/bunches?rack_id=${rack_id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching bunches:", error);
      throw error;
    }
  },

  // Create a new bunch
  createBunch: async (data: {
    name: string;
    description?: string;
    rack_id: number;
  }) => {
    try {
      const response = await axios.post("/api/bunches", data);
      return response.data;
    } catch (error) {
      console.error("Error creating bunch:", error);
      throw error;
    }
  },

  // Add items to a bunch
  addItemsToBunch: async (
    bunch_id: number,
    items: Partial<InventoryItem>[]
  ) => {
    try {
      const response = await axios.post(`/api/bunches/${bunch_id}/items`, {
        items,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding items to bunch:", error);
      throw error;
    }
  },

  // Move a bunch to a different rack
  moveBunch: async (bunch_id: number, newrack_id: number) => {
    try {
      const response = await axios.patch(`/api/bunches/${bunch_id}/move`, {
        newrack_id,
      });
      return response.data;
    } catch (error) {
      console.error("Error moving bunch:", error);
      throw error;
    }
  },

  // Delete a bunch and all its items
  deleteBunch: async (bunch_id: number) => {
    try {
      const response = await axios.delete(`/api/bunches/${bunch_id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting bunch:", error);
      throw error;
    }
  },
};

export default bunchService;
