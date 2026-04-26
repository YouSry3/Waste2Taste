export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  isActive: boolean;
  joinedAt: string;
}

export interface UsersApiResponse {
  items: User[];
  totalCount: number;
  pageSize: number;
  page: number;
}

export interface UsersQueryParams {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  page?: number;
  pageSize?: number;
}

export type SortField = "fullName" | "ordersCount" | "totalSpent" | "lastOrderDate";
export type SortOrder = "asc" | "desc";
export type UserStatus = "Active" | "Inactive";

export interface UserFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  ordersCount: string;
  totalSpent: string;
  isActive: boolean;
  joinedAt: string;
  lastOrderDate: string;
}

export interface TableColumn {
  id: string;
  label: string;
  sortable: boolean;
  width?: string;
}

export interface TopSpender {
  id: string;
  fullName: string;
  initials: string;
  totalSpent: number;
  rank: number;
}

export interface UsersOverview {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  topSpenders: TopSpender[];
}
