import axios from "axios";

interface AssignTailorInput {
  orderNo: string;
  tailorId: number;
  dueDate?: Date;
  notes?: string;
}

interface UpdateAssignmentInput {
  orderNo: string;
  tailorId: number;
  status: "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";
  notes?: string;
}

const tailorAssignmentService = {
  // Assign a tailor to an order
  assignTailorToOrder: async (input: AssignTailorInput) => {
    try {
      const response = await axios.post("/api/tailor-assignments", input);
      return response.data;
    } catch (error) {
      console.error("Failed to assign tailor to order:", error);
      throw error;
    }
  },

  // Get all tailors assigned to an order
  getTailorsByOrder: async (orderNo: string) => {
    try {
      const response = await axios.get(
        `/api/tailor-assignments/order/${encodeURIComponent(orderNo)}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get tailors for order:", error);
      throw error;
    }
  },

  // Get all orders assigned to a tailor
  getOrdersByTailor: async (tailorId: number) => {
    try {
      const response = await axios.get(
        `/api/tailor-assignments/tailor/${tailorId}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get orders for tailor:", error);
      throw error;
    }
  },

  // Update assignment status
  updateAssignmentStatus: async (input: UpdateAssignmentInput) => {
    try {
      const response = await axios.put(`/api/tailor-assignments`, input);
      return response.data;
    } catch (error) {
      console.error("Failed to update assignment status:", error);
      throw error;
    }
  },

  // Remove a tailor from an order
  removeTailorFromOrder: async (orderNo: string, tailorId: number) => {
    try {
      const response = await axios.delete(`/api/tailor-assignments`, {
        data: { orderNo, tailorId },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to remove tailor from order:", error);
      throw error;
    }
  },
};

export default tailorAssignmentService;
