"use client";

import axios from "axios";

const loggingService = {
  // Log any user action
  logAction: async (actionData: string) => {
    try {
      const response = await axios.post(`/api/log-entry`, actionData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error logging action:", error);
      throw error;
    }
  },

  // Get all logs
  getLogs: async (filters = {}) => {
    try {
      const response = await axios.get(`/api/log-entry`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching logs:", error);
      throw error;
    }
  },

  // Get logs by type
  getLogsByType: async (type: string) => {
    try {
      const response = await axios.get(`/api/log-entry/type/${type}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching logs by type:", error);
      throw error;
    }
  },

  // Get logs by date range
  getLogsByDateRange: async (startDate: string, endDate: string) => {
    try {
      const response = await axios.get(`/api/log-entry/date-range`, {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching logs by date range:", error);
      throw error;
    }
  },
};

export default loggingService;
