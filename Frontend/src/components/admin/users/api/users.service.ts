/*
AI AGENT PROMPT:
This file contains business logic and service layer functions.
It acts as an abstraction between components and API calls.
Add caching, data transformation, and business rules here.
*/

import { usersApi } from "./users.api";
import { User, UserFormData } from "../types";
import type { UsersQueryParams, BulkActionRequest } from "./users.types";

export class UsersService {
  private cache: Map<string, User[]> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  async getUsers(params?: UsersQueryParams): Promise<User[]> {
    const cacheKey = JSON.stringify(params || "all");

    // Check cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const users = await usersApi.fetchUsers(params);

      // Cache the result
      this.cache.set(cacheKey, users);
      setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);

      return users;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw new Error("Unable to load users. Please try again.");
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      return await usersApi.fetchUserById(id);
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw new Error("User not found. Please try again.");
    }
  }

  async createUser(formData: UserFormData): Promise<User> {
    try {
      // Transform form data to API format
      const userData = {
        ...formData,
        orders: Number(formData.orders),
        totalSpent: formData.totalSpent.startsWith("$")
          ? formData.totalSpent
          : `$${formData.totalSpent}`,
      };

      const user = await usersApi.createUser(userData);

      // Invalidate cache
      this.cache.clear();

      return user;
    } catch (error) {
      console.error("Failed to create user:", error);
      throw new Error("Unable to create user. Please try again.");
    }
  }

  async updateUser(id: number, formData: UserFormData): Promise<User> {
    try {
      // Transform form data to API format
      const userData = {
        ...formData,
        orders: Number(formData.orders),
        totalSpent: formData.totalSpent.startsWith("$")
          ? formData.totalSpent
          : `$${formData.totalSpent}`,
      };

      const user = await usersApi.updateUser(id, userData);

      // Invalidate cache
      this.cache.clear();

      return user;
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error);
      throw new Error("Unable to update user. Please try again.");
    }
  }

  async toggleUserStatus(id: number): Promise<User> {
    try {
      // First get current user to know current status
      const user = await this.getUserById(id);
      const newStatus = user.status === "Active" ? "Inactive" : "Active";

      const updatedUser = await usersApi.updateUserStatus(id, newStatus);

      // Invalidate cache
      this.cache.clear();

      return updatedUser;
    } catch (error) {
      console.error(`Failed to toggle status for user ${id}:`, error);
      throw new Error("Unable to update user status. Please try again.");
    }
  }

  async bulkAction(
    actionRequest: BulkActionRequest,
  ): Promise<{ affected: number }> {
    try {
      const result = await usersApi.bulkActionUsers(actionRequest);

      // Invalidate cache
      this.cache.clear();

      return result;
    } catch (error) {
      console.error("Failed to perform bulk action:", error);
      throw new Error("Unable to perform bulk action. Please try again.");
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await usersApi.deleteUser(id);

      // Invalidate cache
      this.cache.clear();
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw new Error("Unable to delete user. Please try again.");
    }
  }

  // Clear cache (useful for testing or manual refresh)
  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
export const usersService = new UsersService();
