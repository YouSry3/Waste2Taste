/**
 * Authentication Service
 * 
 * Handles authentication operations with ASP.NET Core backend
 * Converts backend responses to frontend format
 */

import { apiClient } from '../api/apiClient';
import { API_CONFIG } from '../api/apiConfig';
import type { BackendLoginResponse, BackendRegisterResponse, LoginResponse, RegisterResponse } from '../../types/models';

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Token verification response
 */
export interface TokenVerificationResponse {
  isValid: boolean;
  user?: LoginResponse['user'];
}

/**
 * Authentication service class
 */
class AuthService {
  /**
   * Extract user ID from JWT token claims
   * Falls back to email if ID not found
   */
  private extractUserIdFromToken(token: string): string {
    try {
      // JWT format: header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) return '';

      // Decode payload
      const payload = JSON.parse(atob(parts[1]));
      // Try 'sub' (subject) claim first, then 'id'
      return payload.sub || payload.id || '';
    } catch (error) {
      console.warn('Failed to extract user ID from token:', error);
      return '';
    }
  }

  /**
   * Convert backend login response to frontend format
   */
  private convertLoginResponse(backendResponse: BackendLoginResponse, panelType: string): LoginResponse {
    const userId = this.extractUserIdFromToken(backendResponse.token);
    
    return {
      token: backendResponse.token,
      expiration: new Date(backendResponse.expireAt * 1000).toISOString(),
      user: {
        id: userId,
        email: backendResponse.email,
        name: backendResponse.name,
        panelType: backendResponse.type as 'admin' | 'vendor' | 'charity',
        roles: [backendResponse.type] // Use type as role
      }
    };
  }

  /**
   * Convert backend register response to frontend format
   */
  private convertRegisterResponse(backendResponse: BackendRegisterResponse): RegisterResponse {
    return {
      email: backendResponse.email,
      name: backendResponse.name,
      panelType: backendResponse.type as 'admin' | 'vendor' | 'charity'
    };
  }

  /**
   * Login user
   * 
   * @param credentials - User login credentials
   * @returns Login response with token and user data
   */
  async login(credentials: LoginCredentials, panelType: 'admin' | 'vendor' | 'charity'): Promise<LoginResponse> {
    try {
      // Send request to backend with panelType included
      const response = await apiClient.post<BackendLoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        { ...credentials, panelType }
      );

      // Handle backend response (no wrapper expected, direct object)
      const backendResponse = response as any;
      
      // Check if it's an error response
      if (backendResponse.code) {
        throw new Error(backendResponse.description || 'Login failed');
      }

      // If it has a token, it's successful
      if (backendResponse.token) {
        const normalizedResponse = this.convertLoginResponse(backendResponse, panelType);
        
        // Store auth token
        apiClient.setAuthToken(normalizedResponse.token);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(normalizedResponse.user));
        localStorage.setItem('panelType', panelType);

        return normalizedResponse;
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register user
   * 
   * @param email - User email
   * @param password - User password
   * @param name - User name
   * @param panelType - Type of panel (admin, vendor, charity)
   * @returns Register response
   */
  async register(
    email: string,
    password: string,
    name: string,
    panelType: 'admin' | 'vendor' | 'charity'
  ): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<BackendRegisterResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        { email, password, name, type: panelType }
      );

      const backendResponse = response as any;

      // Check if it's an error response
      if (backendResponse.code) {
        throw new Error(backendResponse.description || 'Registration failed');
      }

      if (backendResponse.email) {
        return this.convertRegisterResponse(backendResponse);
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if it exists
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error (non-critical):', error);
      // Continue with cleanup even if logout fails
    } finally {
      // Clear local storage
      apiClient.clearAuthToken();
      localStorage.removeItem('user');
      localStorage.removeItem('panelType');
      localStorage.removeItem('refreshToken');
    }
  }

  /**
   * Refresh authentication token
   * 
   * @returns New login response with refreshed token
   */
  async refreshToken(): Promise<LoginResponse> {
    try {
      const user = this.getCurrentUser();
      const panelType = localStorage.getItem('panelType');

      if (!user || !panelType) {
        throw new Error('No user session available');
      }

      const response = await apiClient.post<BackendLoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN,
        {} // Backend will use current token from Authorization header
      );

      const backendResponse = response as any;

      if (backendResponse.token) {
        const normalizedResponse = this.convertLoginResponse(backendResponse, panelType);
        
        // Update auth token
        apiClient.setAuthToken(normalizedResponse.token);
        localStorage.setItem('user', JSON.stringify(normalizedResponse.user));

        return normalizedResponse;
      }

      throw new Error('Token refresh failed');
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear auth data on refresh failure
      this.logout();
      throw error;
    }
  }

  /**
   * Verify current authentication token
   * 
   * @returns Token verification result
   */
  async verifyToken(): Promise<TokenVerificationResponse> {
    try {
      const response = await apiClient.get<any>(
        API_CONFIG.ENDPOINTS.AUTH.VERIFY_TOKEN
      );

      const user = this.getCurrentUser();
      if (user && response) {
        return { isValid: true, user };
      }

      return { isValid: false };
    } catch (error) {
      console.error('Token verification error:', error);
      return { isValid: false };
    }
  }

  /**
   * Get current user from localStorage
   * 
   * @returns Current user data or null
   */
  getCurrentUser(): LoginResponse['user'] | null {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * 
   * @returns True if user has valid token
   */
  isAuthenticated(): boolean {
    return !!apiClient.getAuthToken() && !!this.getCurrentUser();
  }

  /**
   * Get current user's panel type
   * 
   * @returns Panel type or null
   */
  getPanelType(): 'admin' | 'vendor' | 'charity' | null {
    const panelType = localStorage.getItem('panelType');
    return (panelType as 'admin' | 'vendor' | 'charity') || null;
  }
}

// Create and export singleton instance
export const authService = new AuthService();
