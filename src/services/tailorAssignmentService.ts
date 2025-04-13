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
      const response = await fetch("/api/tailor-assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("Failed to assign tailor to order");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to assign tailor to order:", error);
      throw error;
    }
  },

  // Get all tailors assigned to an order
  getTailorsByOrder: async (orderNo: string) => {
    try {
      const response = await fetch(`/api/tailor-assignments/order/${orderNo}`);

      if (!response.ok) {
        throw new Error("Failed to get tailors for order");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to get tailors for order:", error);
      throw error;
    }
  },

  // Get all orders assigned to a tailor
  getOrdersByTailor: async (tailorId: number) => {
    try {
      const response = await fetch(
        `/api/tailor-assignments/tailor/${tailorId}`
      );

      if (!response.ok) {
        throw new Error("Failed to get orders for tailor");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to get orders for tailor:", error);
      throw error;
    }
  },

  // Update assignment status
  updateAssignmentStatus: async (input: UpdateAssignmentInput) => {
    try {
      const response = await fetch(`/api/tailor-assignments`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("Failed to update assignment status");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to update assignment status:", error);
      throw error;
    }
  },

  // Remove a tailor from an order
  removeTailorFromOrder: async (orderNo: string, tailorId: number) => {
    try {
      const response = await fetch(`/api/tailor-assignments`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderNo, tailorId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove tailor from order");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to remove tailor from order:", error);
      throw error;
    }
  },
};

export default tailorAssignmentService;
