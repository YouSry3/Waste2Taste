export interface RecentOrder {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: "pending" | "completed" | "cancelled" | "processing" | "shipped";
  date: string;
  product?: string;
  paymentMethod?: string;
}
