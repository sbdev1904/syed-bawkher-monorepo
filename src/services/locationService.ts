import axios from "axios";
import { InventoryItem } from "@prisma/client";

export interface Location {
  id: number;
  name: string;
  description?: string;
  racks: Rack[];
  created_at: Date;
  updated_at: Date;
}

export interface Rack {
  id: number;
  name: string;
  description?: string;
  location_id: number;
  capacity: number;
  current_utilization: number;
  bunches: Bunch[];
  created_at: Date;
  updated_at: Date;
}

export interface Bunch {
  id: number;
  name: string;
  rack_id: number;
  items: InventoryItem[];
  created_at: Date;
  updated_at: Date;
}

const locationService = {
  // Get all locations with their racks and bunches
  getAllLocations: async () => {
    try {
      const response = await axios.get("/api/locations");
      return response.data;
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  },

  // Create a new location
  createLocation: async (data: { name: string; description?: string }) => {
    try {
      const response = await axios.post("/api/locations", data);
      return response.data;
    } catch (error) {
      console.error("Error creating location:", error);
      throw error;
    }
  },

  // Get all racks for a location
  getRacksByLocation: async (location_id: number) => {
    try {
      const response = await axios.get(`/api/racks?location_id=${location_id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching racks:", error);
      throw error;
    }
  },

  // Create a new rack
  createRack: async (data: {
    name: string;
    description?: string;
    location_id: number;
    capacity?: number;
  }) => {
    try {
      const response = await axios.post("/api/racks", data);
      return response.data;
    } catch (error) {
      console.error("Error creating rack:", error);
      throw error;
    }
  },
};

export default locationService;
