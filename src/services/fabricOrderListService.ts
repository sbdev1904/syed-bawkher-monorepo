import axios from "axios";

interface FabricOrder {
  fabric_id: number;
  supplier_id: number;
  order_id: string;
  description: string;
  supplier_name: string;
  meters: number;
  ordered_date: string;
  ordered_for: string;
}

const fabricOrderListService = {
  getAllFabricOrders: async () => {
    try {
      const response = await axios.get<FabricOrder[]>(`/api/fabric-orders`);
      return response.data;
    } catch (error) {
      console.error("Error fetching fabric orders:", error);
      throw error;
    }
  },

  getFabricOrderById: async (orderId: string) => {
    try {
      const response = await axios.get<FabricOrder>(
        `/api/fabric-orders/${encodeURIComponent(orderId)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching fabric order:", error);
      throw error;
    }
  },

  getFabricOrdersByFabricCode: async (fabricId: number) => {
    try {
      const response = await axios.get<FabricOrder[]>(
        `/api/fabric-orders/fabricId/${encodeURIComponent(fabricId)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching fabric orders by fabric code:", error);
      throw error;
    }
  },

  createFabricOrder: async (orderData: Omit<FabricOrder, "order_id">) => {
    try {
      const response = await axios.post<FabricOrder>(
        `/api/fabric-orders`,
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
        `/api/fabric-orders/${encodeURIComponent(orderId)}`,
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
        `/api/fabric-orders/${encodeURIComponent(orderId)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting fabric order:", error);
      throw error;
    }
  },
};

export default fabricOrderListService;
