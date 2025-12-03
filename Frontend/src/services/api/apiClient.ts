/**
 * API Client for ASP.NET Core Backend Integration
 * 
 * This client handles all HTTP requests to the ASP.NET Core API
 * with proper error handling, authentication, and request/response interceptors
 */

import { API_CONFIG, HttpMethod, ApiResponse } from './apiConfig';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Request options interface
 */
interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
}

/**
 * Main API Client class
 */
class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadAuthToken();
  }

  /**
   * Load authentication token from localStorage
   */
  private loadAuthToken(): void {
    this.authToken = localStorage.getItem('authToken');
  }

  /**
   * Set authentication token
   */
  public setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('authToken', token);
  }

  /**
   * Clear authentication token
   */
  public clearAuthToken(): void {
    this.authToken = null;
    localStorage.removeItem('authToken');
  }

  /**
   * Get authentication token
   */
  public getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Build query string from parameters
   */
  private buildQueryString(params?: Record<string, string | number | boolean>): string {
    if (!params) return '';
    
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Build request headers
   */
  private buildHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    // Add authorization header if token exists
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Main request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = HttpMethod.GET,
      headers: customHeaders,
      body,
      params,
    } = options;

    const url = `${this.baseUrl}${endpoint}${this.buildQueryString(params)}`;
    const headers = this.buildHeaders(customHeaders);

    const config: RequestInit = {
      method,
      headers,
      credentials: API_CONFIG.WITH_CREDENTIALS ? 'include' : 'same-origin',
    };

    // Add body for non-GET requests
    if (body && method !== HttpMethod.GET) {
      config.body = JSON.stringify(body);
    }

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      config.signal = controller.signal;

      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Parse response
      const data: ApiResponse<T> = await response.json().catch(() => ({
        success: false,
        message: 'Failed to parse response',
      }));

      // Handle error responses
      if (!response.ok) {
        throw new ApiError(
          data.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data.errors
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout', 408);
        }
        throw new ApiError(error.message);
      }

      throw new ApiError('An unknown error occurred');
    }
  }

  /**
   * HTTP GET request
   */
  public async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: HttpMethod.GET,
      params,
      headers,
    });
  }

  /**
   * HTTP POST request
   */
  public async post<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: HttpMethod.POST,
      body,
      headers,
    });
  }

  /**
   * HTTP PUT request
   */
  public async put<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: HttpMethod.PUT,
      body,
      headers,
    });
  }

  /**
   * HTTP PATCH request
   */
  public async patch<T>(
    endpoint: string,
    body?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: HttpMethod.PATCH,
      body,
      headers,
    });
  }

  /**
   * HTTP DELETE request
   */
  public async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: HttpMethod.DELETE,
      headers,
    });
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient(API_CONFIG.BASE_URL);
