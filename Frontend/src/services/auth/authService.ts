// src/services/auth/authService.ts
import { apiClient, setAuthToken, clearAuthToken } from "../api/apiClient";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiration: string;
  user: {
    id: string;
    email: string;
    name: string;
    panelType: "admin" | "vendor" | "charity";
    roles: string[];
  };
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  role: "admin" | "vendor" | "charity";
  businessName?: string;
  address?: string;
  category?: string;
}

export class AuthService {
  // Normalize API login response
  private normalizeLoginResponse(data: any): LoginResponse {
    // Debug: Log the raw response to see what structure we're getting
    console.log("🔍 Raw API Response:", JSON.stringify(data, null, 2));

    // ASP.NET Core typically returns flat structure or nested user object
    const user = data.user || data;
    const token = data.token || data.accessToken || "";
    const expiration =
      data.expiration || data.expiresAt || new Date().toISOString();

    console.log("🔍 User object:", user);
    console.log("🔍 Data keys:", Object.keys(data));

    // The backend uses 'type' field based on the register endpoint
    let panelType: "admin" | "vendor" | "charity" | undefined;

    // Use role field from backend as fallback
    const typeValue =
      user.type ||
      data.type ||
      user.userType ||
      data.userType ||
      user.role ||
      data.role;

    console.log("🔍 Found type value:", typeValue);

    if (typeValue) {
      const normalized = typeValue.toString().toLowerCase();
      if (
        normalized === "admin" ||
        normalized === "vendor" ||
        normalized === "charity"
      ) {
        panelType = normalized as "admin" | "vendor" | "charity";
      }
    }

    // Fallback: check roles array
    if (!panelType && (user.roles || data.roles)) {
      const roles = user.roles || data.roles;
      const firstRole = Array.isArray(roles) ? roles[0] : roles;
      if (firstRole) {
        const normalized = firstRole.toString().toLowerCase();
        if (
          normalized === "admin" ||
          normalized === "vendor" ||
          normalized === "charity"
        ) {
          panelType = normalized as "admin" | "vendor" | "charity";
        }
      }
    }

    console.log("✅ Final panelType:", panelType);

    // Extract roles array
    let roles = user.roles || data.roles || [];
    if (!Array.isArray(roles)) {
      roles = [roles];
    }
    // Filter out null/undefined values
    roles = roles.filter((r: any) => r != null && r !== "");

    // If roles is empty but we have panelType, use it
    if (roles.length === 0 && panelType) {
      roles = [panelType];
    }

    console.log("✅ Final roles:", roles);

    const normalized = {
      token,
      expiration,
      user: {
        id:
          user.id ||
          user.userId ||
          data.id ||
          data.userId ||
          user.email ||
          data.email ||
          "",
        email: user.email || data.email || "",
        name:
          user.name ||
          user.fullName ||
          user.userName ||
          data.name ||
          user.email?.split("@")[0] ||
          "",
        panelType: panelType!,
        roles: roles,
      },
    };

    console.log("📦 Normalized Response:", normalized);

    return normalized;
  }

  // LOGIN
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post("/Auth/login", credentials);
    console.log("📡 Login Response Status:", response.status);
    console.log("📡 Full Response:", response);

    const normalized = this.normalizeLoginResponse(response.data);

    // Validate panelType exists
    if (!normalized.user.panelType) {
      console.error("❌ panelType is missing from response!");
      console.error("❌ Backend response:", response.data);

      // Show helpful error to user
      throw new Error(
        "Unable to determine user role. Please ensure your account has a valid user type (admin/vendor/charity) assigned.",
      );
    }

    // Validate panelType is valid
    if (!["admin", "vendor", "charity"].includes(normalized.user.panelType)) {
      console.error("❌ Invalid panelType:", normalized.user.panelType);
      throw new Error(`Invalid user role: ${normalized.user.panelType}`);
    }

    // Save token, user, and panel type
    setAuthToken(normalized.token);
    localStorage.setItem("authToken", normalized.token);
    localStorage.setItem("user", JSON.stringify(normalized.user));
    localStorage.setItem("panelType", normalized.user.panelType);

    console.log("💾 Saved to localStorage successfully");

    return normalized;
  }

  // REGISTER
  async register(payload: RegisterPayload): Promise<any> {
    const response = await apiClient.post("/Auth/register", payload);
    console.log("📡 Register Response:", response.data);
    return response.data;
  }

  // CLIENT-SIDE ONLY LOGOUT (no API call)
  clearLocalAuth(): void {
    clearAuthToken();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("panelType");
    console.log("🧹 Cleared local auth data");
  }

  // LOGOUT (with API call)
  async logout(): Promise<void> {
    try {
      await apiClient.post("/Auth/logout");
    } catch (error) {
      console.warn(
        "Logout API call failed (this is normal if endpoint doesn't exist):",
        error,
      );
    }
    this.clearLocalAuth();
    console.log("🚪 Logged out successfully");
  }

  // GET CURRENT USER
  getCurrentUser(): LoginResponse["user"] | null {
    const userJson = localStorage.getItem("user");
    if (!userJson) return null;
    try {
      const user = JSON.parse(userJson);
      return user;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  }

  // GET CURRENT PANEL TYPE
  getPanelType(): "admin" | "vendor" | "charity" | null {
    const panelType = localStorage.getItem("panelType");
    if (!panelType || panelType === "undefined" || panelType === "null") {
      return null;
    }
    if (
      panelType === "admin" ||
      panelType === "vendor" ||
      panelType === "charity"
    ) {
      return panelType;
    }
    console.warn("Invalid panelType in localStorage:", panelType);
    return null;
  }

  // CHECK AUTH
  isAuthenticated(): boolean {
    const hasToken = !!localStorage.getItem("authToken");
    const hasUser = !!this.getCurrentUser();
    return hasToken && hasUser;
  }
}

export const authService = new AuthService();
