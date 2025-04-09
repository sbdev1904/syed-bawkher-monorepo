export type ProductionStatus =
  | "pattern_cutting_pending"
  | "tailor_assignment_pending"
  | "base_suit_production"
  | "trial_pending"
  | "final_production"
  | "final_fitting_pending"
  | "delivery_pending"
  | "delivered";

export interface Tailor {
  id: string;
  name: string;
  specialization: "suit" | "shirt" | "both";
  currentLoad: number; // Number of current assignments
}

export interface ProductionOrder {
  orderId: string;
  customerName: string;
  items: {
    type: "suit" | "shirt";
    quantity: number;
  }[];
  status: ProductionStatus;
  assignedTailor?: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  startDate: string;
  notes?: string;
} 