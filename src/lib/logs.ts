export interface LogDetails {
  orderId?: string;
  customerName?: string;
  items?: Array<{ type: string; quantity: number }>;
  totalAmount?: number;
  fabricId?: string;
  fabricName?: string;
  quantity?: number;
  unit?: string;
  location?: string;
  oldStatus?: string;
  newStatus?: string;
  notes?: string;
  changes?: {
    added?: Array<{ type: string; quantity: number }>;
    modified?: Array<{
      type: string;
      oldQuantity: number;
      newQuantity: number;
    }>;
    chest?: string;
    shoulder?: string;
    sleeve?: string;
  };
  itemType?: string;

  oldQuantity?: number;
  newQuantity?: number;
  reason?: string;
  completionDate?: string;
  qualityCheck?: string;
  currentStock?: number;
  minimumRequired?: number;
  reorderSuggested?: boolean;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  type: "order" | "inventory" | "status";
  user: string;
  description: string;
  details: LogDetails;
}
