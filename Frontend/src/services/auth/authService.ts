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
  type: "admin" | "vendor" | "charity";
}

export interface RegisterResponse {
  email: string;
  name: string;
  type: "admin" | "vendor" | "charity";
}

export interface TokenVerificationResponse {
  isValid: boolean;
  user?: LoginResponse["user"];
}

class AuthService {
  private convertLoginResponse(data: any): LoginResponse {
    return {
      token: data.token,
      expiration: new Date(data.expireAt * 1000).toISOString(),
      user: {
        id: data.id || data.email,
        email: data.email,
        name: data.name,
        panelType: data.type,
        roles: [data.type],
      },
    };
  }

  // Get the panel type of the current user
  getPanelType(): "admin" | "vendor" | "charity" | null {
    const userJson = localStorage.getItem("user");
    if (!userJson) return null;
    try {
      const user = JSON.parse(userJson);
      return user.panelType || null;
    } catch {
      return null;
    }
  }

  // LOGIN
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post("/Auth/login", credentials);

    const normalized = this.convertLoginResponse(response.data);

    setAuthToken(normalized.token);
    localStorage.setItem("authToken", normalized.token);
    localStorage.setItem("user", JSON.stringify(normalized.user));

    return normalized;
  }

  // REGISTER — now accepts a single payload object
  // REGISTER — now accepts a single payload object
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const response = await apiClient.post("/Auth/register", {
      email: payload.email,
      password: payload.password,
      name: payload.name,
      type: payload.type, // ✅ send "type", not "panelType"
    });

    return {
      email: response.data.email,
      name: response.data.name,
      type: response.data.type, // ✅ matches RegisterResponse interface
    };
  }

  // LOGOUT
  async logout(): Promise<void> {
    try {
      await apiClient.post("/Auth/logout");
    } catch {}
    clearAuthToken();
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }

  // GET CURRENT USER
  getCurrentUser(): LoginResponse["user"] | null {
    const userJson = localStorage.getItem("user");
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  // CHECK IF AUTHENTICATED
  isAuthenticated(): boolean {
    return !!localStorage.getItem("authToken") && !!this.getCurrentUser();
  }

  // VERIFY TOKEN
  async verifyToken(): Promise<TokenVerificationResponse> {
    try {
      const response = await apiClient.get("/Auth/verify-token");
      const user = this.getCurrentUser();
      return { isValid: !!response.data, user: user || undefined };
    } catch {
      return { isValid: false };
    }
  }
}

export const authService = new AuthService();
