// @/lib/services/auth.service.ts
import ApiClient, { ApiResponse } from './api-client';
import { API_CONFIG, SERVICE_CONFIG } from '../config/api';
import { type User } from '@/lib/types/dashboard';
import { clearAuth } from "../store/slices/authSlice"

// Exporter les types pour qu'ils soient utilisables ailleurs
export type { User };
export interface LoginCredentials { email: string; password: string; }
export interface SignupData extends LoginCredentials { firstName?: string; lastName?: string; }

interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User; // Utilisation du type User importé
}

const API_URL = process.env.NEXT_PUBLIC_AUTH_URL

class AuthService {
  private apiClient: ApiClient;
  private tokenStorageKey: string;
  private refreshTokenStorageKey: string;

  constructor() {
    this.apiClient = new ApiClient(API_CONFIG.BASE_URLS.AUTH, 'auth-service');
    this.tokenStorageKey = SERVICE_CONFIG.AUTH.TOKEN_STORAGE_KEY;
    this.refreshTokenStorageKey = SERVICE_CONFIG.AUTH.REFRESH_TOKEN_KEY;
  }

  async login(credentials: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.apiClient.post<AuthResponse>('/auth/login', credentials);
      if (response.data?.accessToken) {
        this.storeTokens(response.data.accessToken, response.data.refreshToken);
      }
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(data: SignupData): Promise<ApiResponse<{ message: string; user: User }>> {
    try {
      const response = await this.apiClient.post<{ message: string; user: User }>('/auth/register', data);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async getOAuthUrl(provider: 'google' | 'github'): Promise<any> {
    const response = await this.apiClient.get(`/oauth/${provider}/auth`);
    return response.data;
  }

  async getAuth0Url(): Promise<any> {
    const response = await this.apiClient.get('/auth0/login');
    return response.data;
  }

  async handleOAuthCallback(provider: string, code: string, state: string, storedState: string | null): Promise<ApiResponse<AuthResponse>> {
    try {
      if (!storedState || state !== storedState) {
        throw new Error("Invalid OAuth state. CSRF attack suspected.");
      }
      const response = await this.apiClient.get<AuthResponse>(`/oauth/${provider}/callback?code=${code}&state=${state}`);
      if (response.data?.accessToken) {
        this.storeTokens(response.data.accessToken, response.data.refreshToken);
      }
      return response;
    } catch (error) {
      console.error(`OAuth callback for ${provider} failed:`, error);
      throw error;
    }
  }

  async handleAuth0Callback(code: string, state: string, storedState: string | null): Promise<ApiResponse<AuthResponse>> {
    try {
      if (!storedState || state !== storedState) {
        throw new Error("Invalid OAuth state. CSRF attack suspected.");
      }
      const response = await this.apiClient.get<AuthResponse>(`/auth0/callback?code=${code}&state=${state}`);
      if (response.data?.accessToken) {
        this.storeTokens(response.data.accessToken, response.data.refreshToken);
      }
      return response;
    } catch (error) {
      console.error(`Auth0 callback failed:`, error);
      throw error;
    }
  }

  async loginWithAuth0(auth0AccessToken: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await this.apiClient.post<AuthResponse>('/auth/auth0/login', { accessToken: auth0AccessToken });
      if (response.data?.accessToken) {
        this.storeTokens(response.data.accessToken, response.data.refreshToken);
      }
      return response;
    } catch (error) {
      console.error('Auth0 login failed:', error);
      throw error;
    }
  }

  logout() {
    this.apiClient.clearAuthTokens();
  }

  storeTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(this.tokenStorageKey, accessToken);
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenStorageKey, refreshToken);
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenStorageKey);
  }

  decodeToken(): any {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  }

  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.apiClient.post<{ message: string }>(`/auth/verify-email`, { token });
    return response;
  }

  async signup(data: SignupData): Promise<ApiResponse<{ user: User, token: string }>> {
    try {
      const response = await this.apiClient.post<{ user: User, token: string }>('/auth/register', data);
      if (response.data?.token) {
        this.storeTokens(response.data.token);
      }
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async verifyToken(): Promise<User | null> {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      // La vérification se fait côté backend, ici on récupère juste les infos utilisateur
      const response = await this.apiClient.get<User>('/auth/me');
      return response.data;
    } catch (error) {
      this.logout();
      return null;
    }
  }
  
  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available.");
    }
    try {
      const response = await this.apiClient.post<AuthResponse>('/auth/refresh-token', { refreshToken });
      if (response.data.accessToken) {
        this.storeTokens(response.data.accessToken, response.data.refreshToken);
      }
      return response;
    } catch (error) {
      this.logout();
      throw error;
    }
  }
}

export const authService = new AuthService();

