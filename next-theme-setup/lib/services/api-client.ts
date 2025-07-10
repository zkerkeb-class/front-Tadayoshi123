/**
 * Enhanced API Client with proper environment variable integration
 */

import { API_CONFIG, SERVICE_CONFIG, validateEnvironment } from "@/lib/config/api"

export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
  meta?: {
    total?: number
    page?: number
    limit?: number
    timestamp?: string
    requestId?: string
  }
}

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: any
  service?: string
  requestId?: string
  timestamp?: string
}

class ApiClient {
  private baseURL: string
  private serviceName: string
  private defaultHeaders: Record<string, string>
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private requestQueue: Map<string, Promise<any>> = new Map()

  constructor(baseURL: string, serviceName = "unknown") {
    // Validate environment on initialization
    const validation = validateEnvironment()
    if (!validation.isValid) {
      console.warn("Environment validation failed:", validation.errors)
    }

    this.baseURL = baseURL
    this.serviceName = serviceName
    this.defaultHeaders = {
      ...API_CONFIG.HEADERS,
      "X-Service": serviceName,
      "X-Environment": process.env.NODE_ENV || "development",
    }
  }

  /**
   * Get authentication token with validation
   */
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null

    const token = localStorage.getItem(SERVICE_CONFIG.AUTH.TOKEN_STORAGE_KEY)
    if (!token) return null

    // Check if token is expired (basic check)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const isExpired = payload.exp * 1000 < Date.now()
      if (isExpired) {
        this.clearAuthTokens()
        return null
      }
      return token
    } catch {
      // Invalid token format
      this.clearAuthTokens()
      return null
    }
  }

  /**
   * Build headers with proper authentication and tracing
   */
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders }
    const token = this.getAuthToken()

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    // Add request tracing
    headers["X-Request-ID"] = this.generateRequestId()
    headers["X-Timestamp"] = new Date().toISOString()

    return headers
  }

  /**
   * Generate unique request ID for tracing
   */
  private generateRequestId(): string {
    return `${this.serviceName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Enhanced error handling with service context
   */
  private handleError(error: any, requestId?: string): ApiError {
    const timestamp = new Date().toISOString()
    const baseError: ApiError = {
      message: "An unexpected error occurred",
      status: 500,
      service: this.serviceName,
      requestId,
      timestamp,
    }

    if (error.response) {
      const status = error.response.status
      const data = error.response.data || {}

      // Handle specific HTTP status codes
      const message = data.message || this.getStatusMessage(status)

      return {
        ...baseError,
        message,
        status,
        code: data.code || this.getStatusCode(status),
        details: data,
      }
    } else if (error.request) {
      return {
        ...baseError,
        message: `${this.serviceName} service is unavailable. Please check your connection.`,
        status: 0,
        code: "NETWORK_ERROR",
      }
    } else if (error.name === "AbortError") {
      return {
        ...baseError,
        message: `Request to ${this.serviceName} service timed out`,
        status: 408,
        code: "TIMEOUT_ERROR",
      }
    } else {
      return {
        ...baseError,
        message: error.message || `${this.serviceName} service error`,
        code: "UNKNOWN_ERROR",
      }
    }
  }

  /**
   * Get user-friendly status messages
   */
  private getStatusMessage(status: number): string {
    const messages: Record<number, string> = {
      400: "Invalid request data",
      401: "Authentication required",
      403: "Access denied",
      404: "Resource not found",
      409: "Resource conflict",
      422: "Validation failed",
      429: "Too many requests",
      500: "Internal server error",
      502: "Service unavailable",
      503: "Service temporarily unavailable",
      504: "Service timeout",
    }

    return messages[status] || `HTTP ${status} error`
  }

  /**
   * Get error codes for status
   */
  private getStatusCode(status: number): string {
    const codes: Record<number, string> = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
      422: "VALIDATION_ERROR",
      429: "RATE_LIMITED",
      500: "INTERNAL_ERROR",
      502: "BAD_GATEWAY",
      503: "SERVICE_UNAVAILABLE",
      504: "GATEWAY_TIMEOUT",
    }

    return codes[status] || "HTTP_ERROR"
  }

  /**
   * Request deduplication
   */
  private async deduplicateRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.requestQueue.has(key)) {
      return this.requestQueue.get(key)!
    }

    const promise = requestFn().finally(() => {
      this.requestQueue.delete(key)
    })

    this.requestQueue.set(key, promise)
    return promise
  }

  /**
   * Cache management with TTL
   */
  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : ""
    return `${this.serviceName}:${endpoint}:${paramString}`
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const isExpired = Date.now() - cached.timestamp > API_CONFIG.DEFAULTS.CACHE_TTL
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  private setCache(key: string, data: unknown): void {
    // Prevent cache from growing too large
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, { data, timestamp: Date.now() })
  }

  /**
   * Retry logic with exponential backoff
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    attempts: number = API_CONFIG.DEFAULTS.RETRY_ATTEMPTS,
    delay: number = API_CONFIG.DEFAULTS.RETRY_DELAY,
  ): Promise<T> {
    try {
      return await requestFn()
    } catch (error) {
      if (attempts > 1 && this.shouldRetry(error)) {
        await new Promise((resolve) => setTimeout(resolve, delay))
        return this.retryRequest(requestFn, attempts - 1, delay * 2) // Exponential backoff
      }
      throw error
    }
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: any): boolean {
    if (!error.response) return true // Network errors

    const status = error.response.status
    // Retry on server errors and rate limiting
    return status >= 500 || status === 429
  }

  /**
   * Generic request method with all enhancements
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit & { useCache?: boolean; dedupe?: boolean } = {},
  ): Promise<ApiResponse<T>> {
    const { useCache = false, dedupe = true, ...requestOptions } = options
    const url = `${this.baseURL}${endpoint}`
    const headers = this.buildHeaders(requestOptions.headers as Record<string, string>)
    const requestId = headers["X-Request-ID"]

    // Check cache for GET requests
    if (useCache && requestOptions.method === "GET") {
      const cacheKey = this.getCacheKey(endpoint)
      const cached = this.getFromCache<ApiResponse<T>>(cacheKey)
      if (cached) return cached
    }

    const requestFn = async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.DEFAULTS.TIMEOUT)

      try {
        const response = await fetch(url, {
          ...requestOptions,
          headers,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw {
            response: {
              status: response.status,
              statusText: response.statusText,
              data: errorData,
            },
          }
        }

        const data = await response.json()
        const result: ApiResponse<T> = {
          data: data.data || data,
          success: true,
          message: data.message,
          meta: {
            ...data.meta,
            requestId,
            timestamp: new Date().toISOString(),
          },
        }

        // Cache successful GET requests
        if (useCache && requestOptions.method === "GET") {
          const cacheKey = this.getCacheKey(endpoint)
          this.setCache(cacheKey, result)
        }

        return result
      } catch (error) {
        clearTimeout(timeoutId)
        throw this.handleError(error, requestId)
      }
    }

    // Use deduplication for GET requests
    if (dedupe && requestOptions.method === "GET") {
      const dedupeKey = this.getCacheKey(endpoint)
      return this.deduplicateRequest(dedupeKey, () => this.retryRequest(requestFn))
    }

    return this.retryRequest(requestFn)
  }

  /**
   * HTTP Methods with proper typing
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
    options: { useCache?: boolean } = {},
  ): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params as Record<string, string>)}` : endpoint
    return this.request<T>(url, { method: "GET", ...options })
  }

  async post<T>(endpoint: string, data?: unknown, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async put<T>(endpoint: string, data?: unknown, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async patch<T>(endpoint: string, data?: unknown, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE", ...options })
  }

  /**
   * Service health check
   */
  async healthCheck(): Promise<{
    healthy: boolean
    latency: number
    timestamp: string
  }> {
    const startTime = Date.now()
    const timestamp = new Date().toISOString()

    try {
      const healthEndpoint =
        API_CONFIG.HEALTH_CHECKS[this.serviceName.toUpperCase() as keyof typeof API_CONFIG.HEALTH_CHECKS]
      if (!healthEndpoint) {
        return { healthy: false, latency: 0, timestamp }
      }

      const response = await fetch(`${this.baseURL}${healthEndpoint}`, {
        method: "GET",
        headers: this.buildHeaders(),
        signal: AbortSignal.timeout(5000),
      })

      const latency = Date.now() - startTime
      return {
        healthy: response.ok,
        latency,
        timestamp,
      }
    } catch {
      return {
        healthy: false,
        latency: Date.now() - startTime,
        timestamp,
      }
    }
  }

  /**
   * Token management
   */
  public clearAuthTokens(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(SERVICE_CONFIG.AUTH.TOKEN_STORAGE_KEY)
    localStorage.removeItem(SERVICE_CONFIG.AUTH.REFRESH_TOKEN_KEY)
  }

  /**
   * Clear cache and reset client
   */
  clearCache(): void {
    this.cache.clear()
    this.requestQueue.clear()
  }

  /**
   * Get service info
   */
  getServiceInfo(): {
    name: string
    baseURL: string
    healthy: boolean
    cacheSize: number
    queueSize: number
  } {
    return {
      name: this.serviceName,
      baseURL: this.baseURL,
      healthy: this.requestQueue.size === 0, // Simplified health check
      cacheSize: this.cache.size,
      queueSize: this.requestQueue.size,
    }
  }
}

// Create service instances using environment variables
export const mainApi = new ApiClient(API_CONFIG.BASE_URLS.API, "main-api")
export const gatewayApi = new ApiClient(API_CONFIG.BASE_URLS.API, "gateway")
export const authApi = new ApiClient(API_CONFIG.BASE_URLS.AUTH, "auth-service")
export const metricsApi = new ApiClient(API_CONFIG.BASE_URLS.METRICS, "metrics-service")
export const aiApi = new ApiClient(API_CONFIG.BASE_URLS.AI, "ai-service")
export const notifierApi = new ApiClient(API_CONFIG.BASE_URLS.NOTIFIER, "notifier-service")
export const paymentApi = new ApiClient(API_CONFIG.BASE_URLS.PAYMENT, "payment-service")
export const grafanaApi = new ApiClient(API_CONFIG.BASE_URLS.GRAFANA, "grafana")
export const prometheusApi = new ApiClient(API_CONFIG.BASE_URLS.PROMETHEUS, "prometheus")

export default ApiClient
