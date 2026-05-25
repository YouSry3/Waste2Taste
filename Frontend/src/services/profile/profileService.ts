// src/services/profile/profileService.ts
import { apiClient } from "../api/apiClient";
import { authService } from "../auth/authService";
import { getVendorRequestByEmail } from "../vendorApproval/vendorApprovalStore";

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
  // Unwrap nested response shapes: { data: {...} }, { value: {...} }, etc.
  const d = data?.data ?? data?.value ?? data?.Value ?? data;

  return {
    id: d.id ?? d.userId ?? d.vendorId ?? user?.id ?? "",
    name: d.name ?? d.fullName ?? d.userName ?? d.displayName ?? user?.name ?? "",
    email: d.email ?? d.emailAddress ?? d.userEmail ?? user?.email ?? "",
    phone: d.phoneNumber ?? d.phone ?? d.mobile ?? d.contactPhone ?? undefined,
    address: d.address ?? d.businessAddress ?? d.streetAddress ?? d.location ?? undefined,
    businessName:
      d.businessName ??
      d.storeName ??
      d.companyName ??
      d.organizationName ??
      d.vendorName ??
      undefined,
    registrationNumber: d.registrationNumber ?? d.regNumber ?? d.taxId ?? undefined,
    description: d.description ?? d.bio ?? d.about ?? d.missionStatement ?? undefined,
    panelType: d.panelType ?? d.type ?? d.userType ?? user?.panelType ?? "vendor",
    monthlyGoals: d.monthlyGoals ?? undefined,
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
    if (demoProfile) return demoProfile;
    const fallbackProfile = this.getCurrentProfile();
    if (!fallbackProfile) throw new Error("Not authenticated");
    return fallbackProfile;
  }

  try {
    const user = authService.getCurrentUser();
    if (!user) throw new Error("Not authenticated");

    if (user.panelType === "vendor") {
  const res = await apiClient.get("/User/vendors");
  console.log("✅ GET /vendors/vendor response:", JSON.stringify(res.data));

  // Response is { value: [...vendors] } — find the one matching current user's email
  const list: any[] = res.data?.value ?? res.data?.data ?? res.data?.items ?? [];
  const vd = list.find(
    (v: any) => (v.email ?? v.ownerEmail ?? "").toLowerCase() === user.email.toLowerCase()
  ) ?? list[0] ?? {};

  return {
    id: vd.id ?? user.id ?? "",
    name: user.name ?? vd.name ?? "",           // name comes from auth token, more reliable
    email: vd.email ?? user.email ?? "",
    phone: vd.phoneNumber ?? vd.phone ?? undefined,
    address: vd.address ?? vd.businessAddress ?? undefined,
    businessName: vd.businessName ?? vd.storeName ?? vd.name ?? undefined, // API has no businessName, use name as fallback
    registrationNumber: vd.registrationNumber ?? undefined,
    description: vd.description ?? undefined,
    panelType: "vendor",
    monthlyGoals: vd.monthlyGoals ?? undefined,
  };

    } else {
      // Admin and charity use GET /User/profile
      const response = await apiClient.get("/User/profile");
      console.log("✅ GET /User/profile response:", response.data);
      return this.normalizeProfileResponse(response.data);
    }

  } catch (error: any) {
    console.error("❌ Failed to fetch profile:", error);
    const user = authService.getCurrentUser();
    if (!user) throw new Error("Not authenticated");
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
      // Use correct endpoint: /User/profile
      const response = await apiClient.put("/User/profile", updates);

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
   await apiClient.put("/User/profile/change-password", {
  OldPassword: data.currentPassword,
  NewPassword: data.newPassword,
});
    console.log("✅ Password changed successfully");
  } catch (error: any) {
    console.error("❌ Failed to change password:", error);
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
