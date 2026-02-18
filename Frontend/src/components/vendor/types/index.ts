// src/components/vendor/types/index.ts
export interface VendorOrder {
  id: string;
  customer: string;
  item: string;
  amount: string;
  status:
    | "Picked Up"
    | "Ready for Pickup"
    | "Pending Pickup"
    | "In Progress"
    | "Cancelled";
  time: string;
  timeSlot: string;
  orderPlacedTime: Date;
  customerEmail: string;
  customerPhone: string;
  pickupAddress: string;
  paymentMethod: string;
  orderNotes: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  avatarColor?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}
