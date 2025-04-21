import { InventoryItem } from "@prisma/client";

export interface InventoryItemWithBunch extends InventoryItem {
  unit: {
    id: number;
    name: string;
    symbol: string;
  };
}
