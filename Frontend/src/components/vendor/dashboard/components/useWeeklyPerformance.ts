// src/hooks/useWeeklyPerformance.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../services/api/apiClient";
//D:\Graduation Project\GraduationProject\Frontend\src\services\api\apiClient.ts
export interface WeeklyDataItem {
  day: string;
  sales: number;
  items: number;
  pickups: number;
}

interface Order {
  orderDate: string;
  totalPrice: number;
  status: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const fetchWeeklyPerformance = async (): Promise<WeeklyDataItem[]> => {
  const response = await apiClient.get<{ orders: Order[] }>("/api/dashboard/orders");
  const orders = response.data.orders || [];

  const now = new Date();
  const currentDay = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - currentDay);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const weeklyData: WeeklyDataItem[] = DAYS.map((day) => ({
    day,
    sales: 0,
    items: 0,
    pickups: 0,
  }));

  orders.forEach((order) => {
    const orderDate = new Date(order.orderDate);
    if (orderDate >= startOfWeek && orderDate <= endOfWeek) {
      const dayIndex = orderDate.getDay();
      weeklyData[dayIndex].sales += order.totalPrice || 0;
      weeklyData[dayIndex].items += 1;
      if (order.status === "Completed" || order.status === "Ready for Pickup") {
        weeklyData[dayIndex].pickups += 1;
      }
    }
  });

  return [...weeklyData.slice(1), weeklyData[0]];
};

export const useWeeklyPerformance = () => {
  return useQuery({
    queryKey: ["weekly-performance"],
    queryFn: fetchWeeklyPerformance,
    staleTime: 5 * 60 * 1000,
  });
};