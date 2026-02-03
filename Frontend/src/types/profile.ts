export interface MonthlyGoals {
  foodSaved: number;
  revenue: number;
  customerRating: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
   monthlyGoals?: MonthlyGoals; // For vendors
  registrationNumber?: string; // For charity
  businessName?: string; // For vendor/charity
  description?: string;
  panelType: "admin" | "vendor" | "charity";
  avatarColor?: string;
  createdAt?: Date;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  businessName?: string;
  description?: string;
  monthlyGoals?: MonthlyGoals;
  registrationNumber?: string;
}
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
