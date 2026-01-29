export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: string;
  status: "Active" | "Inactive";
  joined: string;
  lastOrder: string;
}

export type SortField = "name" | "orders" | "totalSpent" | "lastOrder";
export type SortOrder = "asc" | "desc";
export type UserStatus = "Active" | "Inactive";

export interface UserFormData {
  name: string;
  email: string;
  phone: string;
  orders: string;
  totalSpent: string;
  status: UserStatus;
  joined: string;
  lastOrder: string;
}

export interface TableColumn {
  id: string;
  label: string;
  sortable: boolean;
  width?: string;
}
