/*
AI AGENT PROMPT:
This file contains the API client for user management.
When backend is ready, replace the mock implementations with actual API calls.
Keep the same function signatures and return types.
Environment variables for API base URL should be used.
Add proper error handling, interceptors, and authentication headers.
*/

import { User, UserFormData, UsersApiResponse, UsersQueryParams } from "../types";
import { initialUsers } from "../utils/constants";
import type {
  CreateUserDto,
  UpdateUserDto,
  UsersQueryParams as OldUsersQueryParams,
  BulkActionRequest,
  UserResponse,
} from "./users.types";
import { apiClient } from "../../../../services/api/apiClient";
import { API_CONFIG } from "../../../../services/api/apiConfig";

// SIMPLIFIED: Use hardcoded values for now. When backend is ready:
// 1. Uncomment the actual fetch calls below
// 2. Replace these URLs with your actual API endpoint
// 3. Add authentication headers if needed

const API_BASE = "http://localhost:3000/api"; // Replace with your actual API URL
const USERS_ENDPOINT = `${API_BASE}/users`;

// Enable mock data when explicitly requested via env, or when the user is logged in using the demo token.
const USE_MOCK_API = import.meta.env.VITE_ENABLE_MOCK_DATA === "true";

const isDemoToken = (): boolean => {
  try {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("authToken");
    return !!token && token.startsWith("demo-token-");
  } catch {
    return false;
  }
};

const shouldUseMockApi = (): boolean => USE_MOCK_API || isDemoToken();
const USERS_TABLE_PROXY_ENDPOINT = "/__internal/admin/users-table";

const normalizeStoredToken = (value: string | null): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim().replace(/^"+|"+$/g, "");
  if (!trimmed) {
    return null;
  }

  if (trimmed.toLowerCase().startsWith("bearer ")) {
    return trimmed.slice("bearer ".length).trim() || null;
  }

  return trimmed;
};

const getStoredAdminToken = (): string | null => {
  try {
    if (typeof window === "undefined") {
      return null;
    }

    return normalizeStoredToken(
      localStorage.getItem("authToken") ??
        localStorage.getItem("token") ??
        localStorage.getItem("accessToken"),
    );
  } catch {
    return null;
  }
};

const getAdminRequestHeaders = (
  includeJsonContentType = false,
): Record<string, string> => {
  const token = getStoredAdminToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (includeJsonContentType) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

type UsersTableRequestBody = {
  search: string;
  status: "Active" | "Inactive";
  sortBy: "createdAt";
  ascending: false;
  page: number;
  pageSize: number;
};

const buildUsersTableRequestBody = (
  params?: UsersQueryParams,
): UsersTableRequestBody => ({
  search: params?.search ?? "",
  status:
    (params?.status ?? "").toString().toLowerCase() === "inactive"
      ? "Inactive"
      : "Active",
  sortBy: "createdAt",
  ascending: false,
  page: params?.page ?? 1,
  pageSize: params?.pageSize ?? 10,
});

const createApiError = async (response: Response) => {
  let payload: any = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  return {
    message:
      payload?.message ||
      `Request failed with status code ${response.status}`,
    statusCode: response.status,
    errors: payload?.errors || [],
  };
};

/**
 * GET /Admin/Users-Table - Fetch all users with optional filtering, sorting, and pagination
 */
export const fetchUsers = async (
  params?: UsersQueryParams,
): Promise<UsersApiResponse> => {
  console.log("🔍 Fetching users with params:", params);
  const useMock = shouldUseMockApi();
  console.log(
    "USE_MOCK_API:",
    USE_MOCK_API,
    "| demoToken:",
    isDemoToken(),
    "| usingMock:",
    useMock,
  );

  if (useMock) {
    // MOCK IMPLEMENTATION - using the provided data
    console.log("Using mock data");
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      items: initialUsers.map((user) => ({
        id: user.id.toString(),
        fullName: user.name,
        email: user.email,
        phoneNumber: user.phone,
        ordersCount: user.orders,
        totalSpent: parseFloat(user.totalSpent.replace(/[$,]/g, "")),
        lastOrderDate: user.lastOrder,
        isActive: user.status === "Active",
        joinedAt: user.joined,
      })),
      totalCount: initialUsers.length,
      pageSize: params?.pageSize || 10,
      page: params?.page || 0,
    };
  }

  try {
    console.log("Making real API call to:", API_CONFIG.ENDPOINTS.ADMIN.USERS_TABLE);
    const requestBody = buildUsersTableRequestBody(params);

    console.log("Request body:", requestBody);
    // Browsers do not reliably send GET request bodies, so in local Vite development
    // we POST to a small dev proxy that forwards the exact JSON body to the backend as GET.
    if (import.meta.env.DEV) {
      const response = await fetch(USERS_TABLE_PROXY_ENDPOINT, {
        method: "POST",
        headers: getAdminRequestHeaders(true),
        body: JSON.stringify(requestBody),
        credentials: API_CONFIG.WITH_CREDENTIALS ? "include" : "same-origin",
      });

      if (!response.ok) {
        throw await createApiError(response);
      }

      const data = (await response.json()) as UsersApiResponse;
      console.log("API response:", data);
      return data;
    }

    const response = await apiClient.request<UsersApiResponse>({
      method: "GET",
      url: API_CONFIG.ENDPOINTS.ADMIN.USERS_TABLE,
      data: requestBody,
      headers: getAdminRequestHeaders(true),
    });

    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users from API:', error);
    throw error;
  }
};

/**
 * GET /users/:id - Fetch single user by ID
 */
export const fetchUserById = async (id: string): Promise<UserResponse> => {
  console.log(`🔍 Fetching user ${id}`);

  // Uncomment when backend is ready:
  // try {
  //   const response = await fetch(`${USERS_ENDPOINT}/${id}`);
  //   if (!response.ok) throw new Error(`Failed to fetch user ${id}`);
  //   return await response.json();
  // } catch (error) {
  //   console.error(`Error fetching user ${id}:`, error);
  //   throw error;
  // }

  // MOCK IMPLEMENTATION
  await new Promise((resolve) => setTimeout(resolve, 200));
  const user = initialUsers.find((u) => u.id === id);
  if (!user) throw new Error(`User ${id} not found`);
  return user;
};

/**
 * POST /users - Create new user
 */
export const createUser = async (
  userData: CreateUserDto,
): Promise<UserResponse> => {
  console.log("➕ Creating user:", userData);

  // Uncomment when backend is ready:
  // try {
  //   const response = await fetch(USERS_ENDPOINT, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(userData),
  //   });
  //   if (!response.ok) throw new Error('Failed to create user');
  //   return await response.json();
  // } catch (error) {
  //   console.error('Error creating user:', error);
  //   throw error;
  // }

  // MOCK IMPLEMENTATION
  await new Promise((resolve) => setTimeout(resolve, 400));
  const newUser: User = {
    id: (Math.max(...initialUsers.map((u) => Number(u.id)), 0) + 1).toString(),
    ...userData,
    orders: Number(userData.orders),
    totalSpent: userData.totalSpent.startsWith("$")
      ? userData.totalSpent
      : `$${userData.totalSpent}`,
  };
  return newUser;
};

/**
 * PUT /users/:id - Update existing user
 */
export const updateUser = async (
  id: string,
  userData: UpdateUserDto,
): Promise<UserResponse> => {
  console.log(`✏️ Updating user ${id}:`, userData);

  // Uncomment when backend is ready:
  // try {
  //   const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(userData),
  //   });
  //   if (!response.ok) throw new Error(`Failed to update user ${id}`);
  //   return await response.json();
  // } catch (error) {
  //   console.error(`Error updating user ${id}:`, error);
  //   throw error;
  // }

  // MOCK IMPLEMENTATION
  await new Promise((resolve) => setTimeout(resolve, 400));
  const existingUser = initialUsers.find((u) => u.id === id);
  if (!existingUser) throw new Error(`User ${id} not found`);

  return {
    ...existingUser,
    ...userData,
    orders: Number(userData.orders || existingUser.orders),
    totalSpent: userData?.totalSpent?.startsWith("$")
      ? userData.totalSpent
      : userData?.totalSpent
        ? `$${userData.totalSpent}`
        : existingUser.totalSpent,
  };
};

/**
 * PATCH /users/:id/status - Update user status
 */
export const updateUserStatus = async (
  id: string,
  status: "Active" | "Inactive",
): Promise<UserResponse> => {
  console.log(`🔄 Updating user ${id} status to ${status}`);

  // Uncomment when backend is ready:
  // try {
  //   const response = await fetch(`${USERS_ENDPOINT}/${id}/status`, {
  //     method: 'PATCH',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ status }),
  //   });
  //   if (!response.ok) throw new Error(`Failed to update user status`);
  //   return await response.json();
  // } catch (error) {
  //   console.error(`Error updating user ${id} status:`, error);
  //   throw error;
  // }

  // MOCK IMPLEMENTATION
  await new Promise((resolve) => setTimeout(resolve, 300));
  const user = initialUsers.find((u) => u.id === id);
  if (!user) throw new Error(`User ${id} not found`);
  return { ...user, status };
};

/**
 * POST /users/bulk-actions - Perform bulk actions on users
 */
export const bulkActionUsers = async (
  actionRequest: BulkActionRequest,
): Promise<{ affected: number }> => {
  console.log("⚡ Performing bulk action:", actionRequest);

  // Uncomment when backend is ready:
  // try {
  //   const response = await fetch(`${USERS_ENDPOINT}/bulk-actions`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(actionRequest),
  //   });
  //   if (!response.ok) throw new Error(`Failed to perform bulk action`);
  //   return await response.json();
  // } catch (error) {
  //   console.error('Error performing bulk action:', error);
  //   throw error;
  // }

  // MOCK IMPLEMENTATION
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { affected: actionRequest.userIds.length };
};

/**
 * DELETE /users/:id - Delete user by ID
 */
export const deleteUser = async (id: string): Promise<void> => {
  console.log(`🗑️ Deleting user ${id}`);

  // Uncomment when backend is ready:
  // try {
  //   const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
  //     method: 'DELETE',
  //   });
  //   if (!response.ok) throw new Error(`Failed to delete user ${id}`);
  // } catch (error) {
  //   console.error(`Error deleting user ${id}:`, error);
  //   throw error;
  // }

  // MOCK IMPLEMENTATION
  await new Promise((resolve) => setTimeout(resolve, 300));
};

/**
 * GET /Admin/Users-OverView - Fetch users overview data
 */
export const fetchUsersOverview = async (): Promise<UsersOverview> => {
  console.log("🔍 Fetching users overview");

  if (shouldUseMockApi()) {
    // MOCK IMPLEMENTATION - using the provided data
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      totalUsers: 12,
      activeUsers: 11,
      totalOrders: 0,
      topSpenders: [
        {
          id: "66810990-cd54-4900-4712-08de9b0a1dd5",
          fullName: "Ahmad Ayman",
          initials: "A",
          totalSpent: 0.0,
          rank: 1,
        },
        {
          id: "fa10f165-7019-454f-4713-08de9b0a1dd5",
          fullName: "Ahmad Ayman",
          initials: "A",
          totalSpent: 0.0,
          rank: 2,
        },
        {
          id: "c5a52dde-bf16-4b3a-2338-08de9b0b1beb",
          fullName: "Ahmad Ayman",
          initials: "A",
          totalSpent: 0.0,
          rank: 3,
        },
      ],
    };
  }

  // Real API call
  try {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.ADMIN.USERS_OVERVIEW, {
      headers: getAdminRequestHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users overview:', error);
    throw error;
  }
};

// Export all API functions
export const usersApi = {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  updateUserStatus,
  bulkActionUsers,
  deleteUser,
  fetchUsersOverview,
};

// Export the flag to control mock vs real API
export { USE_MOCK_API };
