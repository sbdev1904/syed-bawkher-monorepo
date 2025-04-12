import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      const assignment = await prisma.orderTailor.create({
        data: {
          orderNo: input.orderNo,
          tailor_id: input.tailorId,
          due_date: input.dueDate,
          notes: input.notes,
        },
        include: {
          tailor: true,
          order: true,
        },
      });
      return assignment;
    } catch (error) {
      console.error("Failed to assign tailor to order:", error);
      throw error;
    }
  },

  // Get all tailors assigned to an order
  getTailorsByOrder: async (orderNo: string) => {
    try {
      const assignments = await prisma.orderTailor.findMany({
        where: { orderNo },
        include: {
          tailor: true,
        },
      });
      return assignments;
    } catch (error) {
      console.error("Failed to get tailors for order:", error);
      throw error;
    }
  },

  // Get all orders assigned to a tailor
  getOrdersByTailor: async (tailorId: number) => {
    try {
      const assignments = await prisma.orderTailor.findMany({
        where: { tailor_id: tailorId },
        include: {
          order: true,
        },
      });
      return assignments;
    } catch (error) {
      console.error("Failed to get orders for tailor:", error);
      throw error;
    }
  },

  // Update assignment status
  updateAssignmentStatus: async (input: UpdateAssignmentInput) => {
    try {
      const assignment = await prisma.orderTailor.updateMany({
        where: {
          orderNo: input.orderNo,
          tailor_id: input.tailorId,
        },
        data: {
          status: input.status,
          notes: input.notes,
        },
      });
      return assignment;
    } catch (error) {
      console.error("Failed to update assignment status:", error);
      throw error;
    }
  },

  // Remove a tailor from an order
  removeTailorFromOrder: async (orderNo: string, tailorId: number) => {
    try {
      const assignment = await prisma.orderTailor.deleteMany({
        where: {
          orderNo,
          tailor_id: tailorId,
        },
      });
      return assignment;
    } catch (error) {
      console.error("Failed to remove tailor from order:", error);
      throw error;
    }
  },
};

export default tailorAssignmentService;
