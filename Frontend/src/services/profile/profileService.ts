import {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../../types/profile";
import { authService } from "../auth/authService";

class ProfileService {
  private readonly PROFILE_KEY = "userProfile";

  // Get current user profile
  getCurrentProfile(): UserProfile | null {
    try {
      const user = authService.getCurrentUser();
      if (!user) return null;

      // Try to get extended profile from localStorage
      const storedProfile = localStorage.getItem(this.PROFILE_KEY);
      if (storedProfile) {
        return JSON.parse(storedProfile);
      }

      // Return basic user data as profile
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        panelType: user.panelType,
        monthlyGoals: user.monthlyGoals,
      };
    } catch (error) {
      console.error("Error getting profile:", error);
      return null;
    }
  }

  // Update profile
  async updateProfile(updates: UpdateProfilePayload): Promise<UserProfile> {
    try {
      const currentProfile = this.getCurrentProfile();
      if (!currentProfile) {
        throw new Error("No profile found");
      }

      // Merge updates
      const updatedProfile: UserProfile = {
        ...currentProfile,
        ...updates,
      };

      // Save to localStorage
      localStorage.setItem(this.PROFILE_KEY, JSON.stringify(updatedProfile));

      // Also update the user object in auth
      const user = authService.getCurrentUser();
      if (user) {
        const updatedUser = {
          ...user,
          name: updates.name || user.name,
          email: updates.email || user.email,
          monthlyGoals: updates.monthlyGoals || user.monthlyGoals,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return updatedProfile;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  // Change password
  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    try {
      if (payload.newPassword !== payload.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (payload.newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // In a real app, this would call the backend
      // For demo, we'll just simulate success
      console.log("Password changed successfully");
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  }

  // Update monthly goals (vendor only)
  async updateMonthlyGoals(goals: MonthlyGoals): Promise<void> {
    try {
      const currentProfile = this.getCurrentProfile();
      if (!currentProfile) {
        throw new Error("No profile found");
      }

      if (currentProfile.panelType !== "vendor") {
        throw new Error("Only vendors can set monthly goals");
      }

      await this.updateProfile({ monthlyGoals: goals });
    } catch (error) {
      console.error("Error updating monthly goals:", error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();
