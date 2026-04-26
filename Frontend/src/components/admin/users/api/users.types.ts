/*
AI AGENT PROMPT:
These are TypeScript interfaces that should match your backend API.
Update these types to match your actual API response structure.
Consider adding pagination types, error responses, and metadata.
*/

import { User } from "../types";

// API Response Types
export interface UserResponse extends User {
  // Add any API-specific fields here
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
}

// Request DTOs (Data Transfer Objects)
export interface CreateUserDto {
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: string;
  status: "Active" | "Inactive";
  joined: string;
  lastOrder: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface BulkActionRequest {
  action: "activate" | "deactivate" | "delete";
  userIds: string[];
}

export interface UsersQueryParams {
  search?: string;
  status?: "all" | "active" | "inactive";
  sortBy?: "name" | "orders" | "totalSpent" | "lastOrder";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
