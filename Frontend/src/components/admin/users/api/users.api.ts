/*
AI AGENT PROMPT:
This file contains the API client for user management.
When backend is ready, replace the mock implementations with actual API calls.
Keep the same function signatures and return types.
Environment variables for API base URL should be used.
Add proper error handling, interceptors, and authentication headers.
*/

import { User, UserFormData } from "../types";
import { initialUsers } from "../utils/constants";
import type {
  CreateUserDto,
  UpdateUserDto,
  UsersQueryParams,
  BulkActionRequest,
  UserResponse,
} from "./users.types";

// SIMPLIFIED: Use hardcoded values for now. When backend is ready:
// 1. Uncomment the actual fetch calls below
// 2. Replace these URLs with your actual API endpoint
// 3. Add authentication headers if needed

const API_BASE = "http://localhost:3000/api"; // Replace with your actual API URL
const USERS_ENDPOINT = `${API_BASE}/users`;

// Set to false when backend is ready
const USE_MOCK_API = true;

/**
 * GET /users - Fetch all users with optional filtering, sorting, and pagination
 */
export const fetchUsers = async (
  params?: UsersQueryParams,
): Promise<UserResponse[]> => {
  console.log("🔍 Fetching users with params:", params);

  // Uncomment when backend is ready:
  // try {
  //   const queryParams = new URLSearchParams();
  //   if (params?.search) queryParams.append('search', params.search);
  //   if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
  //   if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  //   if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  //   if (params?.page) queryParams.append('page', params.page.toString());
  //   if (params?.limit) queryParams.append('limit', params.limit.toString());
  //
  //   const queryString = queryParams.toString();
  //   const url = queryString ? `${USERS_ENDPOINT}?${queryString}` : USERS_ENDPOINT;
  //
  //   const response = await fetch(url);
  //   if (!response.ok) throw new Error('Failed to fetch users');
  //   return await response.json();
  // } catch (error) {
  //   console.error('Error fetching users:', error);
  //   throw error;
  // }

  // MOCK IMPLEMENTATION
  await new Promise((resolve) => setTimeout(resolve, 300));
  return initialUsers.map((user) => ({
    ...user,
  }));
};

/**
 * GET /users/:id - Fetch single user by ID
 */
export const fetchUserById = async (id: number): Promise<UserResponse> => {
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
    id: Math.max(...initialUsers.map((u) => u.id), 0) + 1,
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
  id: number,
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
  id: number,
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
export const deleteUser = async (id: number): Promise<void> => {
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

// Export all API functions
export const usersApi = {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  updateUserStatus,
  bulkActionUsers,
  deleteUser,
};

// Export the flag to control mock vs real API
export { USE_MOCK_API };
