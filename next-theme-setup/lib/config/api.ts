/**
 * API Configuration
 * Centralized configuration using provided environment variables
 */

export const API_CONFIG = {
  // Base URLs from environment variables
  BASE_URLS: {
    API: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
    GATEWAY: process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:4000",
    AUTH: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3001/api/v1",
    METRICS: process.env.NEXT_PUBLIC_METRICS_URL || "http://localhost:3003",
    DB: process.env.NEXT_PUBLIC_DB_URL || "http://localhost:3002",
    AI: process.env.NEXT_PUBLIC_AI_URL || "http://localhost:3004",
    NOTIFIER: process.env.NEXT_PUBLIC_NOTIFIER_URL || "http://localhost:3000/api/notifier",
    PAYMENT: process.env.NEXT_PUBLIC_PAYMENT_URL || "http://localhost:3006/api/v1/payments",
    GRAFANA: process.env.NEXT_PUBLIC_GRAFANA_URL || "http://localhost:3030/grafana",
    PROMETHEUS: process.env.NEXT_PUBLIC_PROMETHEUS_URL || "http://localhost:3000/prometheus",
  },

  // API Endpoints organized by service
  ENDPOINTS: {
    // Gateway API (main application API)
    GATEWAY: {
      HEALTH: "/health",
      STATUS: "/status",
      DASHBOARDS: "/api/dashboards",
      DASHBOARD_TEMPLATES: "/api/dashboards/templates",
      DASHBOARD_SHARE: "/api/dashboards/share",
      USERS: "/api/users",
      TEAMS: "/api/teams",
      PERMISSIONS: "/api/permissions",
      SETTINGS: "/api/settings",
    },

    // Authentication Service
    AUTH: {
      LOGIN: "/auth/login",
      SIGNUP: "/auth/register",
      LOGOUT: "/auth/logout",
      VERIFY: "/auth/verify",
      REFRESH: "/auth/refresh",
      PROFILE: "/auth/profile",
      OAUTH_GITHUB: "/auth/oauth/github",
      OAUTH_GOOGLE: "/auth/oauth/google",
      RESET_PASSWORD: "/auth/reset-password",
      CHANGE_PASSWORD: "/auth/change-password",
      HEALTH: "/health",
    },

    // AI Service (unified for chat and dashboard generation)
    AI: {
      // Chat endpoints
      CHAT: "/ai/chat",
      CHAT_HISTORY: "/ai/chat/history",
      CHAT_SESSIONS: "/ai/chat/sessions",
      CHAT_CLEAR: "/ai/chat/clear",

      // Dashboard generation endpoints
      DASHBOARD_GENERATE: "/ai/dashboard/generate",
      DASHBOARD_OPTIMIZE: "/ai/dashboard/optimize",
      DASHBOARD_SUGGESTIONS: "/ai/dashboard/suggestions",
      DASHBOARD_ANALYZE: "/ai/dashboard/analyze",

      // AI operations endpoints
      PREDICT: "/ai/predict",
      ANALYZE: "/ai/analyze",
      ANOMALY_DETECTION: "/ai/anomaly-detection",
      RECOMMENDATIONS: "/ai/recommendations",
      INSIGHTS: "/ai/insights",

      // Model management
      MODELS: "/ai/models",
      MODEL_STATUS: "/ai/models/status",
      MODEL_TRAIN: "/ai/models/train",

      HEALTH: "/health",
    },

    // Metrics Service (Prometheus integration)
    METRICS: {
      QUERY: "/api/v1/query",
      QUERY_RANGE: "/api/v1/query_range",
      SERIES: "/api/v1/series",
      LIST: "/api/metrics/list",
      LABELS: "/api/v1/labels",
      LABEL_VALUES: "/api/v1/label/:name/values",
      TARGETS: "/api/v1/targets",
      RULES: "/api/v1/rules",
      ALERTS: "/api/v1/alerts",
      ALERTMANAGERS: "/api/v1/alertmanagers",
      STATUS: "/api/v1/status",
      CONFIG: "/api/v1/status/config",
      FLAGS: "/api/v1/status/flags",
      RUNTIME_INFO: "/api/v1/status/runtimeinfo",
      BUILD_INFO: "/api/v1/status/buildinfo",
      HEALTH: "/-/healthy",
      READY: "/-/ready",
    },

    // Notification Service
    NOTIFIER: {
      SEND: "/notifications/send",
      SEND_BULK: "/notifications/send/bulk",
      TEMPLATES: "/notifications/templates",
      CHANNELS: "/notifications/channels",
      HISTORY: "/notifications/history",
      PREFERENCES: "/notifications/preferences",
      SUBSCRIPTIONS: "/notifications/subscriptions",
      HEALTH: "/health",
    },

    // Payment Service
    PAYMENT: {
      PLANS: "/plans",
      SUBSCRIPTION: "/subscription",
      BILLING: "/portal-sessions",
      CHECKOUT: "/checkout-sessions",
      INVOICES: "/invoices",
      PAYMENT_METHODS: "/payment-methods",
      USAGE: "/usage",
      CREDITS: "/credits",
      HEALTH: "/health",
    },

    // Grafana Integration
    GRAFANA: {
      DASHBOARDS: "/api/dashboards",
      DASHBOARD_BY_UID: "/api/dashboards/uid/:uid",
      DATASOURCES: "/api/datasources",
      ALERTS: "/api/alerts",
      ANNOTATIONS: "/api/annotations",
      SEARCH: "/api/search",
      HEALTH: "/api/health",
    },
  },

  // Request configuration
  DEFAULTS: {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
    CACHE_TTL: 300000, // 5 minutes
    MAX_CONCURRENT_REQUESTS: 10,
  },

  // Default headers
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Client": "supervia-frontend",
    "X-Version": "1.0.0",
  },

  // Service health check endpoints
  HEALTH_CHECKS: {
    GATEWAY: "/health",
    AUTH: "/health",
    AI: "/health",
    METRICS: "/-/healthy",
    NOTIFIER: "/health",
    PAYMENT: "/health",
    GRAFANA: "/api/health",
    PROMETHEUS: "/-/healthy",
  },
} as const

// Service-specific configurations
export const SERVICE_CONFIG = {
  AUTH: {
    TOKEN_STORAGE_KEY: "supervia_token",
    REFRESH_TOKEN_KEY: "supervia_refresh_token",
    USER_STORAGE_KEY: "supervia_user",
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
    REFRESH_THRESHOLD: 5 * 60 * 1000, // Refresh token 5 minutes before expiry
  },

  AI: {
    MAX_CHAT_HISTORY: 50,
    CHAT_TIMEOUT: 60000, // 1 minute
    GENERATION_TIMEOUT: 120000, // 2 minutes
    MAX_RETRIES: 3,
    STREAM_TIMEOUT: 180000, // 3 minutes for streaming responses
  },

  METRICS: {
    DEFAULT_STEP: "15s",
    MAX_SERIES: 1000,
    QUERY_TIMEOUT: 30000,
    DEFAULT_TIME_RANGE: "1h",
    REFRESH_INTERVAL: 30000, // 30 seconds
  },

  DASHBOARD: {
    AUTO_SAVE_INTERVAL: 30000, // 30 seconds
    MAX_MODULES: 50,
    DEFAULT_REFRESH_INTERVAL: 60000, // 1 minute
    EXPORT_FORMAT: "json",
  },

  NOTIFIER: {
    DEFAULT_CHANNEL: "email",
    RETRY_ATTEMPTS: 5,
    BATCH_SIZE: 100,
  },

  PAYMENT: {
    CURRENCY: "USD",
    DEFAULT_PLAN: "free",
    BILLING_CYCLE: "monthly",
  },
} as const

// Environment validation
export function validateEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  const requiredVars = [
    "NEXT_PUBLIC_API_URL",
    "NEXT_PUBLIC_GATEWAY_URL",
    "NEXT_PUBLIC_AUTH_URL",
    "NEXT_PUBLIC_METRICS_URL",
    "NEXT_PUBLIC_DB_URL",
    "NEXT_PUBLIC_AI_URL",
    "NEXT_PUBLIC_NOTIFIER_URL",
    "NEXT_PUBLIC_PAYMENT_URL",
    "NEXT_PUBLIC_GRAFANA_URL",
    "NEXT_PUBLIC_PROMETHEUS_URL",
  ]

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`)
    }
  })

  // Validate URL formats
  Object.entries(API_CONFIG.BASE_URLS).forEach(([service, url]) => {
    try {
      new URL(url)
    } catch {
      errors.push(`Invalid URL format for ${service}: ${url}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export type ApiConfig = typeof API_CONFIG
export type ServiceConfig = typeof SERVICE_CONFIG
