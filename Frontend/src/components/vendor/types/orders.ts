export type OrderStatus =
  | "Pending"
  | "Ready for Pickup"
  | "Completed"
  | "Cancelled";

export interface Order {
  id: string;
  customer: string;
  listing: string;
  amount: string;
  status: OrderStatus;
  date: string;
  timeSlot: string;
  items: string[];
  phone: string;
  email: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  readyOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface DailyOrderData {
  day: string;
  orders: number;
  revenue: number;
}
