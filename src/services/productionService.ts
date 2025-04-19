import { ProductionStatus } from "@prisma/client";

export interface UpdateProductionStatusInput {
  orderNo: string;
  status: ProductionStatus;
  notes?: string;
}

const productionService = {
  // Initialize production tracking for an order
  async initializeProduction(orderNo: string) {
    const response = await fetch(`/api/production?orderNo=${orderNo}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to initialize production");
    }

    return response.json();
  },

  // Get production status for an order
  async getProductionStatus(orderNo: string) {
    const response = await fetch(`/api/production?orderNo=${orderNo}`);

    if (!response.ok) {
      throw new Error("Failed to fetch production status");
    }

    return response.json();
  },

  // Update production status
  async updateProductionStatus({
    orderNo,
    status,
    notes,
  }: UpdateProductionStatusInput) {
    const response = await fetch(`/api/production`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderNo, status, notes }),
    });

    if (!response.ok) {
      throw new Error("Failed to update production status");
    }

    return response.json();
  },

  // Get all orders with their production status
  async getAllProductionStatus() {
    const response = await fetch(`/api/production/all`);

    if (!response.ok) {
      throw new Error("Failed to fetch all production status");
    }

    return response.json();
  },
};

export default productionService;
