import { useState, useEffect } from "react";
import {
  Order,
  DashboardStats,
  getRecentOrders,
  getDashboardStats,
  getUpcomingDeliveries,
} from "@/services/api";

export interface DashboardData {
  isLoading: boolean;
  error: Error | null;
  stats: DashboardStats | null;
  recentOrders: Order[];
  upcomingDeliveries: Order[];
  refetch: () => Promise<void>;
}

export function useDashboard(): DashboardData {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [upcomingDeliveries, setUpcomingDeliveries] = useState<Order[]>([]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [statsData, ordersData, deliveriesData] = await Promise.all([
        getDashboardStats(),
        getRecentOrders(),
        getUpcomingDeliveries(),
      ]);

      setStats(statsData);
      setRecentOrders(ordersData);
      setUpcomingDeliveries(deliveriesData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch dashboard data")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    isLoading,
    error,
    stats,
    recentOrders,
    upcomingDeliveries,
    refetch: fetchData,
  };
}
