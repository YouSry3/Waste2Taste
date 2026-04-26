import { apiClient, clearAuthToken, setAuthToken } from "../api/apiClient";
import { API_CONFIG } from "../api/apiConfig";

export type PanelType = "admin" | "vendor" | "charity";
export type VendorApprovalStatus = "pending" | "approved" | "rejected";
export type VendorAccessState =
  | "approved"
  | "pending"
  | "rejected"
  | "needs_request";

export interface LoginCredentials {
  email: string;
  password: string;
  panelType?: PanelType;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  panelType: PanelType;
  roles: string[];
  phoneNumber?: string;
  vendorRequestCompleted?: boolean;
  vendorApprovalStatus?: VendorApprovalStatus;
}

export interface LoginResponse {
  token: string;
  expiration: string;
  user: AuthUser;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  role: PanelType;
  businessName?: string;
  address?: string;
  category?: string;
}

const isPanelType = (value: unknown): value is PanelType =>
  value === "admin" || value === "vendor" || value === "charity";

const normalizeApprovalStatus = (
  value: unknown,
): VendorApprovalStatus | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if (
    normalized === "pending" ||
    normalized === "approved" ||
    normalized === "rejected"
  ) {
    return normalized;
  }

  return undefined;
};

const normalizeBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }
  }

  return undefined;
};

export class AuthService {
  private isGenericNotFoundError(error: unknown): boolean {
    if (!error || typeof error !== "object") {
      return false;
    }

    const errorObj = error as {
      statusCode?: unknown;
      message?: unknown;
      response?: { status?: unknown };
    };

    const statusCode =
      typeof errorObj.statusCode === "number"
        ? errorObj.statusCode
        : typeof errorObj.response?.status === "number"
          ? errorObj.response.status
          : undefined;

    if (statusCode !== 404) {
      return false;
    }

    const message =
      typeof errorObj.message === "string"
        ? errorObj.message.trim().toLowerCase()
        : "";

    return (
      message === "" ||
      message === "request failed with status code 404" ||
      message === "404 not found"
    );
  }

  private async postAuthWithFallbacks<TResponse>(
    paths: string[],
    payload?: unknown,
  ): Promise<TResponse> {
    let lastError: unknown;
    const rootBase = (API_CONFIG?.BASE_URL || "").replace(/\/api\/?$/i, "");
    const candidates = Array.from(
      new Set(
        paths.flatMap((path) => {
          const normalized = path.startsWith("/") ? path : `/${path}`;
          const absoluteRoot = rootBase ? `${rootBase}${normalized}` : null;
          return absoluteRoot ? [absoluteRoot, normalized] : [normalized];
        }),
      ),
    );

    for (const path of candidates) {
      try {
        const response = await apiClient.post<TResponse>(path, payload);
        return response.data;
      } catch (error) {
        lastError = error;

        if (!this.isGenericNotFoundError(error)) {
          throw error;
        }
      }
    }

    throw lastError ?? new Error("Authentication request failed.");
  }

  private getStoredVendorRequestStatusByEmail(
    email: string,
  ): VendorApprovalStatus | undefined {
    if (!email) {
      return undefined;
    }

    try {
      const raw = localStorage.getItem("vendorApprovalRequests");
      if (!raw) {
        return undefined;
      }

      const requests = JSON.parse(raw) as Array<{
        email?: string;
        status?: unknown;
      }>;

      const request = requests.find(
        (item) =>
          item?.email?.trim().toLowerCase() === email.trim().toLowerCase(),
      );

      return normalizeApprovalStatus(request?.status);
    } catch {
      return undefined;
    }
  }

  // Normalize API login response
  private normalizeLoginResponse(data: any): LoginResponse {
    // Debug: Log the raw response to see what structure we're getting
    console.log("🔍 Raw API Response:", JSON.stringify(data, null, 2));

    // Many backends wrap responses like: { success: true, data: { token, user, ... } }
    // Some may even wrap twice; unwrap defensively.
    const unwrap = (value: any) => {
      if (
        value &&
        typeof value === "object" &&
        "data" in value &&
        (value as any).data != null
      ) {
        return (value as any).data;
      }
      return value;
    };

    const level1 = unwrap(data);
    const payload = unwrap(level1);

    const normalizeToken = (value: unknown): string => {
      if (typeof value !== "string") return "";
      const trimmed = value.trim();
      if (!trimmed) return "";
      if (trimmed.toLowerCase().startsWith("bearer ")) {
        return trimmed.slice("bearer ".length).trim();
      }
      return trimmed;
    };

    const token = normalizeToken(
      payload?.token ??
        payload?.Token ??
        payload?.accessToken ??
        payload?.AccessToken ??
        level1?.token ??
        level1?.Token ??
        level1?.accessToken ??
        level1?.AccessToken ??
        data?.token ??
        data?.Token ??
        data?.accessToken ??
        data?.AccessToken ??
        "",
    );

    const expiration =
      payload?.expiration ??
      payload?.Expiration ??
      payload?.expiresAt ??
      payload?.ExpiresAt ??
      payload?.expireAt ??
      payload?.ExpireAt ??
      level1?.expiration ??
      level1?.Expiration ??
      level1?.expiresAt ??
      level1?.ExpiresAt ??
      level1?.expireAt ??
      level1?.ExpireAt ??
      data?.expiration ??
      data?.Expiration ??
      data?.expiresAt ??
      data?.ExpiresAt ??
      data?.expireAt ??
      data?.ExpireAt ??
      new Date().toISOString();

    // ASP.NET Core typically returns flat structure or nested user object
    const sourceUser =
      payload?.user ?? level1?.user ?? data?.user ?? payload ?? level1 ?? data ?? {};

    if (!token) {
      throw new Error(
        "Login response did not include an access token. Check backend response shape (expected token in `data.token`).",
      );
    }

    console.log("🔍 User object:", sourceUser);
    console.log("🔍 Data keys:", Object.keys(data));

    // The backend uses 'type' field based on the register endpoint
    let panelType: PanelType | undefined;

    // Use role field from backend as fallback
    const typeValue =
      sourceUser?.type ??
      sourceUser?.Type ??
      data?.type ??
      data?.Type ??
      sourceUser?.userType ??
      sourceUser?.UserType ??
      data?.userType ??
      data?.UserType ??
      sourceUser?.role ??
      sourceUser?.Role ??
      data?.role ??
      data?.Role;

    console.log("🔍 Found type value:", typeValue);

    if (typeValue) {
      const normalized = typeValue.toString().toLowerCase();
      if (
        normalized === "admin" ||
        normalized === "vendor" ||
        normalized === "charity"
      ) {
        panelType = normalized as PanelType;
      }
    }

    // Fallback: check roles array
    if (
      !panelType &&
      (sourceUser?.roles ||
        sourceUser?.Roles ||
        data?.roles ||
        data?.Roles ||
        sourceUser?.role ||
        sourceUser?.Role ||
        data?.role ||
        data?.Role)
    ) {
      const roles =
        sourceUser?.roles ??
        sourceUser?.Roles ??
        data?.roles ??
        data?.Roles ??
        sourceUser?.role ??
        sourceUser?.Role ??
        data?.role ??
        data?.Role;
      const firstRole = Array.isArray(roles) ? roles[0] : roles;
      if (firstRole) {
        const normalized = firstRole.toString().toLowerCase();
        if (
          normalized === "admin" ||
          normalized === "vendor" ||
          normalized === "charity"
        ) {
          panelType = normalized as PanelType;
        }
      }
    }

    console.log("✅ Final panelType:", panelType);

    // Extract roles array
    let roles =
      sourceUser?.roles ??
      sourceUser?.Roles ??
      data?.roles ??
      data?.Roles ??
      sourceUser?.role ??
      sourceUser?.Role ??
      data?.role ??
      data?.Role ??
      [];
    if (!Array.isArray(roles)) {
      roles = [roles];
    }
    // Filter out null/undefined values
    roles = roles
      .filter((value: any) => value != null && value !== "")
      .map((value: any) => String(value).toLowerCase());

    if (!panelType && roles.length > 0) {
      const roleCandidate = roles.find((role: string) => isPanelType(role));
      if (roleCandidate && isPanelType(roleCandidate)) {
        panelType = roleCandidate;
      }
    }

    if (!panelType) {
      throw new Error(
        "Unable to determine user role. Please ensure your account has a valid role.",
      );
    }

    // If roles is empty but we have panelType, use it
    if (roles.length === 0 && panelType) {
      roles = [panelType];
    }

    const vendorRequestCompleted = normalizeBoolean(
      sourceUser?.vendorRequestCompleted ??
        data?.vendorRequestCompleted ??
        sourceUser?.hasVendorRequest ??
        data?.hasVendorRequest ??
        sourceUser?.vendorDataSubmitted ??
        data?.vendorDataSubmitted,
    );

    const vendorApprovalStatus = normalizeApprovalStatus(
      sourceUser?.vendorApprovalStatus ??
        data?.vendorApprovalStatus ??
        sourceUser?.vendorRequestStatus ??
        data?.vendorRequestStatus,
    );

    console.log("✅ Final roles:", roles);

    const normalized = {
      token,
      expiration,
      user: {
        id:
          sourceUser?.id ||
          sourceUser?.Id ||
          sourceUser?.userId ||
          sourceUser?.UserId ||
          data?.id ||
          data?.Id ||
          data?.userId ||
          data?.UserId ||
          sourceUser?.email ||
          sourceUser?.Email ||
          data?.email ||
          data?.Email ||
          "",
        email:
          sourceUser?.email ||
          sourceUser?.Email ||
          data?.email ||
          data?.Email ||
          "",
        name:
          sourceUser?.name ||
          sourceUser?.Name ||
          sourceUser?.fullName ||
          sourceUser?.FullName ||
          sourceUser?.userName ||
          sourceUser?.UserName ||
          data?.name ||
          data?.Name ||
          sourceUser?.email?.split("@")[0] ||
          sourceUser?.Email?.split("@")[0] ||
          data?.email?.split("@")[0] ||
          data?.Email?.split("@")[0] ||
          "",
        panelType,
        roles,
        phoneNumber:
          sourceUser?.phoneNumber ??
          sourceUser?.PhoneNumber ??
          sourceUser?.phone ??
          sourceUser?.Phone ??
          data?.phoneNumber ??
          data?.PhoneNumber ??
          data?.phone ??
          data?.Phone,
        vendorRequestCompleted,
        vendorApprovalStatus,
      },
    };

    console.log("📦 Normalized Response:", normalized);

    return normalized;
  }

  // LOGIN
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const loginResponse = await this.postAuthWithFallbacks<any>(
      [API_CONFIG.ENDPOINTS.AUTH.LOGIN],
      credentials,
    );
    const normalizedLogin = this.normalizeLoginResponse(loginResponse);

    setAuthToken(normalizedLogin.token);
    localStorage.setItem("user", JSON.stringify(normalizedLogin.user));
    localStorage.setItem("panelType", normalizedLogin.user.panelType);

    return normalizedLogin;
  }

  // REGISTER
  async register(payload: RegisterPayload): Promise<any> {
    const response = await this.postAuthWithFallbacks<any>(
      [API_CONFIG.ENDPOINTS.AUTH.REGISTER],
      payload,
    );
    console.log("📡 Register Response:", response);
    return response;
  }

  updateCurrentUser(patch: Partial<AuthUser>): AuthUser | null {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return null;
    }

    const updatedUser: AuthUser = {
      ...currentUser,
      ...patch,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  }

  setVendorRequestState(
    patch: Pick<AuthUser, "vendorRequestCompleted" | "vendorApprovalStatus">,
  ) {
    this.updateCurrentUser(patch);
  }

  getVendorAccessState(userArg?: AuthUser | null): VendorAccessState {
    const user = userArg ?? this.getCurrentUser();

    if (!user || user.panelType !== "vendor") {
      return "approved";
    }

    const storedStatus = this.getStoredVendorRequestStatusByEmail(user.email);
    const effectiveStatus = user.vendorApprovalStatus ?? storedStatus;
    const hasVendorRequest = user.vendorRequestCompleted || !!effectiveStatus;

    if (effectiveStatus && userArg == null) {
      const shouldSync =
        user.vendorRequestCompleted !== true ||
        user.vendorApprovalStatus !== effectiveStatus;

      if (shouldSync) {
        this.updateCurrentUser({
          vendorRequestCompleted: true,
          vendorApprovalStatus: effectiveStatus,
        });
      }
    }

    if (effectiveStatus === "approved") {
      return "approved";
    }

    if (effectiveStatus === "rejected") {
      return "rejected";
    }

    if (effectiveStatus === "pending") {
      return "pending";
    }

    if (!hasVendorRequest) {
      return "needs_request";
    }

    return "pending";
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
      await this.postAuthWithFallbacks([
        API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
        "/Auth/logout",
        "/api/auth/logout",
        "/api/Auth/logout",
      ]);
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
  getCurrentUser(): AuthUser | null {
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
  getPanelType(): PanelType | null {
    const panelType = localStorage.getItem("panelType");
    if (isPanelType(panelType)) {
      return panelType;
    }
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
