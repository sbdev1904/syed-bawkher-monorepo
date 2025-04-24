import { ProductionStatus } from "@prisma/client";
import axios from "axios";

export interface UpdateProductionStatusInput {
  orderNo: string;
  status: ProductionStatus;
  notes?: string;
}

const productionService = {
  // Initialize production tracking for an order
  async initializeProduction(orderNo: string) {
    const response = await axios.post(`/api/production?orderNo=${orderNo}`);
    return response.data;
  },

  // Get production status for an order
  async getProductionStatus(orderNo: string) {
    try {
      const response = await axios.get(`/api/production?orderNo=${orderNo}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch production status:", error);
      throw error;
    }
  },

  // Update production status
  async updateProductionStatus({
    orderNo,
    status,
    notes,
  }: UpdateProductionStatusInput) {
    const response = await axios.put(`/api/production`, {
      orderNo,
      status,
      notes,
    });
    return response.data;
  },

  // Get all orders with their production status
  async getAllProductionStatus() {
    const response = await axios.get(`/api/production/all`);
    return response.data;
  },
};

export default productionService;
