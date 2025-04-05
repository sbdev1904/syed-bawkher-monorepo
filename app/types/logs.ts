export type LogType = "order" | "inventory" | "status";

// Order-specific details
export interface OrderDetails {
  orderId: string;
  items?: Array<{
    itemId: string;
    quantity: number;
    price?: number;
  }>;
  customerId?: string;
  totalAmount?: number;
  changes?: {
    added?: Array<{ type: string; quantity: number }>;
    modified?: Array<{
      type: string;
      oldQuantity: number;
      newQuantity: number;
    }>;
  };
}

// Inventory-specific details
export interface InventoryDetails {
  itemId: string;
  oldQuantity?: number;
  newQuantity?: number;
  location?: string;
  reason?: string;
}

// Status-specific details
export interface StatusDetails {
  orderId: string;
  oldStatus?: string;
  newStatus?: string;
  completionDate?: string;
  qualityCheck?: "passed" | "failed";
  itemType?: string;
  changes?:
    | {
        [key: string]: string; // Allow any string measurements
      }
    | {
        added?: Array<{ type: string; quantity: number }>;
        modified?: Array<{
          type: string;
          oldQuantity: number;
          newQuantity: number;
        }>;
      };
}

// Main Log interface
export interface Log {
  id: number;
  timestamp: string;
  type: LogType;
  user: string;
  description: string;
  details: OrderDetails | InventoryDetails | StatusDetails;
}
