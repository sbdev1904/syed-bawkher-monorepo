export type ItemType = "fabric" | "raw_material" | "packaging";
export type UnitType = "meters" | "yards" | "pieces" | "kilograms" | "rolls";

export interface Location {
  id: string;
  name: string;
  description?: string;
}

export interface Rack {
  id: string;
  name: string;
  location_id: string;
  capacity: number;
  currentOccupancy: number;
}

export interface Bunch {
  id: string;
  rack_id: string;
  items: string[]; // Array of item IDs
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  activeFrom: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  type: ItemType;
  description: string;
  quantity: number;
  unit: UnitType;
  minStockLevel: number;
  bunch_id?: string;
  suppliers: {
    supplier_id: number;
    price: number;
    leadTime: number; // in days
    minimumOrderQuantity: number;
    lastOrderDate?: string;
  }[];
  tags: string[];
  created_at: string;
  updatedAt: string;
}
