import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export interface Order {
  id: string;
  orderNo: string;
  customerId: string;
  customer: {
    name: string;
  };
  items: {
    name: string;
  }[];
  status: string;
  deliveryDate: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface DashboardStats {
  totalCustomers: number;
  activeOrders: number;
  inProduction: number;
  lowStockItems: number;
}

export const getRecentOrders = async (): Promise<Order[]> => {
  const { data } = await api.get("/orders/recent");
  return data;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get("/dashboard/stats");
  return data;
};

export const getUpcomingDeliveries = async (): Promise<Order[]> => {
  const { data } = await api.get("/orders/upcoming-deliveries");
  return data;
};
