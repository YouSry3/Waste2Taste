// src/services/profile/profileService.ts
import { apiClient } from "../api/apiClient";
import { authService } from "../auth/authService";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  businessName?: string;
  registrationNumber?: string;
  description?: string;
  panelType: "admin" | "vendor" | "charity";
  monthlyGoals?: MonthlyGoals;
}

export interface MonthlyGoals {
  foodSaved: number;
  revenue: number;
  customerRating: number;
}

export class ProfileService {
  private getErrorStatus(error: unknown): number | undefined {
    const e = error as any;
    return e?.response?.status ?? e?.statusCode;
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    const e = error as any;
    return e?.response?.data?.message || e?.response?.data?.title || e?.message || fallback;
  }

  private isDemoMode(): boolean {
    const token = localStorage.getItem("authToken");
    return !!token && token.startsWith("demo-token-");
  }

  private getDemoProfile(): UserProfile | null {
    const raw = localStorage.getItem("demoProfile");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch (error) {
      console.warn("Failed to parse demo profile from localStorage:", error);
      return null;
    }
  }

  private saveDemoProfile(profile: UserProfile): void {
    localStorage.setItem("demoProfile", JSON.stringify(profile));
  }

  // Normalize API response to match our UserProfile interface
  private normalizeProfileResponse(data: any): UserProfile {
    const user = authService.getCurrentUser();

    return {
      id: data.id || data.userId || user?.id || "",
      name: data.name || data.fullName || data.userName || user?.name || "",
      email: data.email || data.emailAddress || user?.email || "",
      phone: data.phone || data.phoneNumber || undefined,
      address: data.address || data.businessAddress || undefined,
      businessName:
        data.businessName ||
        data.companyName ||
        data.organizationName ||
        undefined,
      registrationNumber:
        data.registrationNumber || data.regNumber || undefined,
      description:
        data.description || data.bio || data.missionStatement || undefined,
      panelType:
        data.panelType ||
        data.type ||
        data.userType ||
        user?.panelType ||
        "vendor",
      monthlyGoals: data.monthlyGoals || undefined,
    };
  }

  // Get current user profile from localStorage (immediate, no API call)
  getCurrentProfile(): UserProfile | null {
    const user = authService.getCurrentUser();
    if (!user) return null;

    const demoProfile = this.getDemoProfile();
    if (this.isDemoMode() && demoProfile) {
      return {
        ...demoProfile,
        id: user.id,
        name: user.name,
        email: user.email,
        panelType: user.panelType,
      };
    }

    // Return basic data from localStorage immediately
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: undefined,
      address: undefined,
      businessName: undefined,
      registrationNumber: undefined,
      description: undefined,
      panelType: user.panelType,
      monthlyGoals: undefined,
    };
  }

  // Fetch full profile from API (with all details)
  async fetchProfile(): Promise<UserProfile> {
    if (this.isDemoMode()) {
      const demoProfile = this.getDemoProfile();
      if (demoProfile) {
        return demoProfile;
      }

      const fallbackProfile = this.getCurrentProfile();
      if (!fallbackProfile) {
        throw new Error("Not authenticated");
      }
      return fallbackProfile;
    }

    try {
      // Try different possible endpoints
      let response;

      try {
        // Primary endpoint
        response = await apiClient.get("/Profile/me");
      } catch (error: any) {
        if (this.getErrorStatus(error) === 404) {
          // Try alternative endpoint
          try {
            response = await apiClient.get("/api/Profile/me");
          } catch (altError: any) {
            if (this.getErrorStatus(altError) === 404) {
              // Try another alternative
              response = await apiClient.get("/Auth/me");
            } else {
              throw altError;
            }
          }
        } else {
          throw error;
        }
      }

      console.log("✅ Profile API Response:", response.data);
      return this.normalizeProfileResponse(response.data);
    } catch (error: any) {
      console.error("❌ Failed to fetch profile from API:", error);

      // Fallback to localStorage user data
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      console.log("⚠️ Using fallback data from localStorage");
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        panelType: user.panelType,
      };
    }
  }

  // Update profile
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (this.isDemoMode()) {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      const currentProfile =
        this.getDemoProfile() ??
        ({
          id: user.id,
          name: user.name,
          email: user.email,
          panelType: user.panelType,
        } as UserProfile);

      const updatedProfile = {
        ...currentProfile,
        ...updates,
        id: user.id,
        panelType: user.panelType,
      };

      this.saveDemoProfile(updatedProfile);

      // Keep localStorage user data in sync for name/email updates
      const updatedUser = {
        ...user,
        name: updates.name || user.name,
        email: updates.email || user.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return updatedProfile;
    }

    try {
      let response;

      // Try different possible endpoints
      try {
        response = await apiClient.put("/Profile/me", updates);
      } catch (error: any) {
        if (this.getErrorStatus(error) === 404) {
          response = await apiClient.put("/api/Profile/me", updates);
        } else {
          throw error;
        }
      }

      console.log("✅ Profile updated:", response.data);

      // Update localStorage user data with the new name/email
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          name: updates.name || currentUser.name,
          email: updates.email || currentUser.email,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log("💾 Updated localStorage user data");
      }

      return this.normalizeProfileResponse(response.data);
    } catch (error: any) {
      console.error("❌ Failed to update profile:", error);
      const errorMessage = this.getErrorMessage(error, "Failed to update profile");
      throw new Error(errorMessage);
    }
  }

  // Update monthly goals (vendor only)
  async updateMonthlyGoals(goals: MonthlyGoals): Promise<void> {
    if (this.isDemoMode()) {
      const user = authService.getCurrentUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      const currentProfile =
        this.getDemoProfile() ??
        ({
          id: user.id,
          name: user.name,
          email: user.email,
          panelType: user.panelType,
        } as UserProfile);

      const updatedProfile = {
        ...currentProfile,
        monthlyGoals: goals,
      };

      this.saveDemoProfile(updatedProfile);
      return;
    }

    try {
      let response;

      // Try different possible endpoints
      try {
        response = await apiClient.put("/Profile/goals", goals);
      } catch (error: any) {
        if (this.getErrorStatus(error) === 404) {
          try {
            response = await apiClient.put("/api/Profile/goals", goals);
          } catch (altError: any) {
            if (this.getErrorStatus(altError) === 404) {
              response = await apiClient.put("/profile/goals", goals);
            } else {
              throw altError;
            }
          }
        } else {
          throw error;
        }
      }

      console.log("✅ Monthly goals updated:", response.data);
    } catch (error: any) {
      console.error("❌ Failed to update goals:", error);
      const errorMessage = this.getErrorMessage(error, "Failed to update goals");
      throw new Error(errorMessage);
    }
  }

  // Change password
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    try {
      let response;

      // Try different possible endpoints
      try {
        response = await apiClient.post("/Profile/change-password", data);
      } catch (error: any) {
        if (this.getErrorStatus(error) === 404) {
          try {
            response = await apiClient.post(
              "/api/Profile/change-password",
              data,
            );
          } catch (altError: any) {
            if (this.getErrorStatus(altError) === 404) {
              response = await apiClient.post("/Auth/change-password", data);
            } else {
              throw altError;
            }
          }
        } else {
          throw error;
        }
      }

      console.log("✅ Password changed successfully");
    } catch (error: any) {
      console.error("❌ Failed to change password:", error);

      // Handle specific error cases
      const status = this.getErrorStatus(error);
      if (status === 400 || status === 401) {
        throw new Error("Current password is incorrect");
      }

      const errorMessage = this.getErrorMessage(error, "Failed to change password");
      throw new Error(errorMessage);
    }
  }
}

export const profileService = new ProfileService();
