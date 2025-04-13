import axios from "axios";

interface FabricOrder {
  id?: string;
  fabricId: string;
  quantity: number;
  status: string;
  orderDate: string;
  deliveryDate?: string;
  notes?: string;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3000";

const fabricOrderListService = {
  getAllFabricOrders: async () => {
    try {
      const response = await axios.get<FabricOrder[]>(
        `${BASE_URL}/api/fabric-orders`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching fabric orders:", error);
      throw error;
    }
  },

  getFabricOrderById: async (orderId: string) => {
    try {
      const response = await axios.get<FabricOrder>(
        `${BASE_URL}/api/fabric-orders/${encodeURIComponent(orderId)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching fabric order:", error);
      throw error;
    }
  },

  getFabricOrdersByFabricCode: async (fabricId: string) => {
    try {
      const response = await axios.get<FabricOrder[]>(
        `${BASE_URL}/api/fabric-orders/fabricId/${encodeURIComponent(fabricId)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching fabric orders by fabric code:", error);
      throw error;
    }
  },

  createFabricOrder: async (orderData: Omit<FabricOrder, "id">) => {
    try {
      const response = await axios.post<FabricOrder>(
        `${BASE_URL}/api/fabric-orders`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating fabric order:", error);
      throw error;
    }
  },

  updateFabricOrder: async (
    orderId: string,
    orderData: Partial<FabricOrder>
  ) => {
    try {
      const response = await axios.put<FabricOrder>(
        `${BASE_URL}/api/fabric-orders/${encodeURIComponent(orderId)}`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating fabric order:", error);
      throw error;
    }
  },

  deleteFabricOrder: async (orderId: string) => {
    try {
      const response = await axios.delete<{ success: boolean }>(
        `${BASE_URL}/api/fabric-orders/${encodeURIComponent(orderId)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting fabric order:", error);
      throw error;
    }
  },
};

export default fabricOrderListService;
