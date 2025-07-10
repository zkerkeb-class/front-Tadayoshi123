/**
 * Service Verification System
 * Comprehensive health checking and validation for all integrated services
 */

import { API_CONFIG, validateEnvironment } from "@/lib/config/api"
import {
  gatewayApi,
  authApi,
  metricsApi,
  aiApi,
  notifierApi,
  paymentApi,
  grafanaApi,
  prometheusApi,
} from "./api-client"

export interface ServiceVerificationResult {
  serviceName: string
  endpoint: string
  status: "healthy" | "degraded" | "unhealthy" | "unreachable"
  responseTime: number
  statusCode?: number
  version?: string
  error?: string
  details?: Record<string, any>
  timestamp: string
  lastSuccessfulCheck?: string
}

export interface SystemVerificationReport {
  overall: "healthy" | "degraded" | "critical" | "failed"
  timestamp: string
  duration: number
  services: ServiceVerificationResult[]
  environment: {
    isValid: boolean
    errors: string[]
  }
  summary: {
    total: number
    healthy: number
    degraded: number
    unhealthy: number
    unreachable: number
  }
  recommendations: string[]
}

class ServiceVerifier {
  private verificationHistory: Map<string, ServiceVerificationResult[]> = new Map()
  private readonly maxHistorySize = 100

  /**
   * Verify a single service with comprehensive checks
   */
  async verifyService(
    serviceName: string,
    apiClient: any,
    customEndpoint?: string,
  ): Promise<ServiceVerificationResult> {
    const startTime = Date.now()
    const timestamp = new Date().toISOString()
    const baseURL = apiClient.baseURL || "unknown"
    const endpoint =
      customEndpoint ||
      API_CONFIG.HEALTH_CHECKS[serviceName.toUpperCase() as keyof typeof API_CONFIG.HEALTH_CHECKS] ||
      "/health"
    const fullEndpoint = `${baseURL}${endpoint}`

    const result: ServiceVerificationResult = {
      serviceName,
      endpoint: fullEndpoint,
      status: "unhealthy",
      responseTime: 0,
      timestamp,
    }

    try {
      // Perform health check with timeout
      const healthResult = await this.performHealthCheck(fullEndpoint, serviceName)

      result.responseTime = Date.now() - startTime
      result.statusCode = healthResult.statusCode
      result.status = healthResult.healthy ? "healthy" : "degraded"
      result.version = healthResult.version
      result.details = healthResult.details

      // Additional service-specific checks
      const specificChecks = await this.performServiceSpecificChecks(serviceName, apiClient)
      if (specificChecks) {
        result.details = { ...result.details, ...specificChecks }

        // Adjust status based on specific checks
        if (result.status === "healthy" && specificChecks.hasIssues) {
          result.status = "degraded"
        }
      }
    } catch (error) {
      result.responseTime = Date.now() - startTime
      result.status = "unreachable"
      result.error = error instanceof Error ? error.message : "Unknown error"

      // Determine if it's a network issue or service issue
      if (result.error.includes("fetch") || result.error.includes("network")) {
        result.status = "unreachable"
      } else {
        result.status = "unhealthy"
      }
    }

    // Store in history
    this.addToHistory(serviceName, result)

    return result
  }

  /**
   * Perform basic health check with detailed response analysis
   */
  private async performHealthCheck(
    endpoint: string,
    serviceName: string,
  ): Promise<{
    healthy: boolean
    statusCode: number
    version?: string
    details?: Record<string, any>
  }> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "SupervIA-HealthChecker/1.0",
          "X-Health-Check": "true",
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const statusCode = response.status
      let details: Record<string, any> = {}
      let version: string | undefined

      // Try to parse response body
      try {
        const contentType = response.headers.get("content-type")
        if (contentType?.includes("application/json")) {
          const body = await response.json()
          details = body
          version = body.version || body.build?.version || body.info?.version
        } else {
          const text = await response.text()
          details = { response: text.substring(0, 200) } // Limit response size
        }
      } catch {
        // Ignore JSON parsing errors
      }

      return {
        healthy: response.ok,
        statusCode,
        version,
        details,
      }
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Perform service-specific checks beyond basic health
   */
  private async performServiceSpecificChecks(serviceName: string, apiClient: any): Promise<Record<string, any> | null> {
    try {
      switch (serviceName.toLowerCase()) {
        case "auth":
          return await this.checkAuthService(apiClient)
        case "metrics":
        case "prometheus":
          return await this.checkMetricsService(apiClient)
        case "ai":
          return await this.checkAIService(apiClient)
        case "grafana":
          return await this.checkGrafanaService(apiClient)
        case "gateway":
          return await this.checkGatewayService(apiClient)
        default:
          return null
      }
    } catch (error) {
      return {
        hasIssues: true,
        specificCheckError: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Auth service specific checks
   */
  private async checkAuthService(apiClient: any): Promise<Record<string, any>> {
    const checks: Record<string, any> = {}

    try {
      // Check if auth endpoints are accessible
      const response = await fetch(`${apiClient.baseURL}/auth/status`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      })

      checks.statusEndpoint = response.ok
      checks.authEndpointsAccessible = true
    } catch {
      checks.authEndpointsAccessible = false
      checks.hasIssues = true
    }

    return checks
  }

  /**
   * Metrics/Prometheus service specific checks
   */
  private async checkMetricsService(apiClient: any): Promise<Record<string, any>> {
    const checks: Record<string, any> = {}

    try {
      // Check Prometheus query endpoint
      const response = await fetch(`${apiClient.baseURL}/api/v1/query?query=up`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      })

      checks.queryEndpoint = response.ok

      if (response.ok) {
        const data = await response.json()
        checks.metricsAvailable = data.status === "success"
        checks.activeTargets = data.data?.result?.length || 0
      }
    } catch {
      checks.queryEndpoint = false
      checks.hasIssues = true
    }

    return checks
  }

  /**
   * AI service specific checks
   */
  private async checkAIService(apiClient: any): Promise<Record<string, any>> {
    const checks: Record<string, any> = {}

    try {
      // Check AI models endpoint
      const response = await fetch(`${apiClient.baseURL}/ai/models/status`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      })

      checks.modelsEndpoint = response.ok

      if (response.ok) {
        const data = await response.json()
        checks.modelsLoaded = data.loaded || false
        checks.availableModels = data.models?.length || 0
      }
    } catch {
      checks.modelsEndpoint = false
      checks.hasIssues = true
    }

    return checks
  }

  /**
   * Grafana service specific checks
   */
  private async checkGrafanaService(apiClient: any): Promise<Record<string, any>> {
    const checks: Record<string, any> = {}

    try {
      // Check Grafana API
      const response = await fetch(`${apiClient.baseURL}/api/health`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      })

      checks.apiEndpoint = response.ok

      if (response.ok) {
        const data = await response.json()
        checks.database = data.database === "ok"
        checks.version = data.version
      }
    } catch {
      checks.apiEndpoint = false
      checks.hasIssues = true
    }

    return checks
  }

  /**
   * Gateway service specific checks
   */
  private async checkGatewayService(apiClient: any): Promise<Record<string, any>> {
    const checks: Record<string, any> = {}

    try {
      // Check gateway status
      const response = await fetch(`${apiClient.baseURL}/status`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      })

      checks.statusEndpoint = response.ok

      if (response.ok) {
        const data = await response.json()
        checks.uptime = data.uptime
        checks.connectedServices = data.services?.length || 0
      }
    } catch {
      checks.statusEndpoint = false
      checks.hasIssues = true
    }

    return checks
  }

  /**
   * Verify all services and generate comprehensive report
   */
  async verifyAllServices(): Promise<SystemVerificationReport> {
    const startTime = Date.now()
    const timestamp = new Date().toISOString()

    // Validate environment first
    const environment = validateEnvironment()

    // Define all services to check
    const servicesToCheck = [
      { name: "gateway", client: gatewayApi },
      { name: "auth", client: authApi },
      { name: "metrics", client: metricsApi },
      { name: "ai", client: aiApi },
      { name: "notifier", client: notifierApi },
      { name: "payment", client: paymentApi },
      { name: "grafana", client: grafanaApi },
      { name: "prometheus", client: prometheusApi },
    ]

    // Perform all service checks in parallel with individual timeouts
    const serviceResults = await Promise.allSettled(
      servicesToCheck.map(({ name, client }) => this.verifyService(name, client)),
    )

    // Process results
    const services: ServiceVerificationResult[] = serviceResults.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value
      } else {
        return {
          serviceName: servicesToCheck[index].name,
          endpoint: servicesToCheck[index].client.baseURL || "unknown",
          status: "unreachable",
          responseTime: 0,
          timestamp,
          error: "Verification failed: " + (result.reason?.message || "Unknown error"),
        }
      }
    })

    // Calculate summary
    const summary = {
      total: services.length,
      healthy: services.filter((s) => s.status === "healthy").length,
      degraded: services.filter((s) => s.status === "degraded").length,
      unhealthy: services.filter((s) => s.status === "unhealthy").length,
      unreachable: services.filter((s) => s.status === "unreachable").length,
    }

    // Determine overall status
    let overall: "healthy" | "degraded" | "critical" | "failed"
    if (summary.healthy === summary.total) {
      overall = "healthy"
    } else if (summary.healthy >= summary.total * 0.8) {
      overall = "degraded"
    } else if (summary.healthy >= summary.total * 0.5) {
      overall = "critical"
    } else {
      overall = "failed"
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(services, environment)

    const report: SystemVerificationReport = {
      overall,
      timestamp,
      duration: Date.now() - startTime,
      services,
      environment,
      summary,
      recommendations,
    }

    // Log the report
    this.logVerificationReport(report)

    return report
  }

  /**
   * Generate actionable recommendations based on verification results
   */
  private generateRecommendations(
    services: ServiceVerificationResult[],
    environment: { isValid: boolean; errors: string[] },
  ): string[] {
    const recommendations: string[] = []

    // Environment recommendations
    if (!environment.isValid) {
      recommendations.push("Fix environment configuration issues before proceeding")
      environment.errors.forEach((error) => {
        recommendations.push(`Environment: ${error}`)
      })
    }

    // Service-specific recommendations
    services.forEach((service) => {
      switch (service.status) {
        case "unreachable":
          recommendations.push(`${service.serviceName}: Check if service is running and network connectivity`)
          break
        case "unhealthy":
          recommendations.push(`${service.serviceName}: Service is responding but reporting unhealthy status`)
          break
        case "degraded":
          recommendations.push(`${service.serviceName}: Service has performance issues or partial functionality`)
          break
      }

      // Response time recommendations
      if (service.responseTime > 5000) {
        recommendations.push(
          `${service.serviceName}: High response time (${service.responseTime}ms) - check performance`,
        )
      }
    })

    // Critical service recommendations
    const criticalServices = ["gateway", "auth"]
    const criticalIssues = services.filter((s) => criticalServices.includes(s.serviceName) && s.status !== "healthy")

    if (criticalIssues.length > 0) {
      recommendations.unshift("CRITICAL: Core services are not healthy - application may not function properly")
    }

    return recommendations
  }

  /**
   * Add result to history with size management
   */
  private addToHistory(serviceName: string, result: ServiceVerificationResult): void {
    if (!this.verificationHistory.has(serviceName)) {
      this.verificationHistory.set(serviceName, [])
    }

    const history = this.verificationHistory.get(serviceName)!
    history.push(result)

    // Keep only recent history
    if (history.length > this.maxHistorySize) {
      history.splice(0, history.length - this.maxHistorySize)
    }
  }

  /**
   * Get verification history for a service
   */
  getServiceHistory(serviceName: string): ServiceVerificationResult[] {
    return this.verificationHistory.get(serviceName) || []
  }

  /**
   * Log comprehensive verification report
   */
  private logVerificationReport(report: SystemVerificationReport): void {
    const logLevel = this.getLogLevel(report.overall)

    console.group(`🔍 Service Verification Report - ${report.overall.toUpperCase()}`)
    console.log(`📊 Overall Status: ${report.overall}`)
    console.log(`⏱️  Duration: ${report.duration}ms`)
    console.log(`📅 Timestamp: ${report.timestamp}`)

    console.group("📈 Summary")
    console.log(`Total Services: ${report.summary.total}`)
    console.log(`✅ Healthy: ${report.summary.healthy}`)
    console.log(`⚠️  Degraded: ${report.summary.degraded}`)
    console.log(`❌ Unhealthy: ${report.summary.unhealthy}`)
    console.log(`🔌 Unreachable: ${report.summary.unreachable}`)
    console.groupEnd()

    console.group("🔧 Service Details")
    report.services.forEach((service) => {
      const icon = this.getStatusIcon(service.status)
      const message = `${icon} ${service.serviceName.toUpperCase()}: ${service.status} (${service.responseTime}ms)`

      if (service.status === "healthy") {
        console.log(`%c${message}`, "color: green")
      } else if (service.status === "degraded") {
        console.warn(`%c${message}`, "color: orange")
      } else {
        console.error(`%c${message}`, "color: red")
      }

      if (service.error) {
        console.error(`  Error: ${service.error}`)
      }

      if (service.details) {
        console.log(`  Details:`, service.details)
      }
    })
    console.groupEnd()

    if (!report.environment.isValid) {
      console.group("🌍 Environment Issues")
      report.environment.errors.forEach((error) => {
        console.error(`❌ ${error}`)
      })
      console.groupEnd()
    }

    if (report.recommendations.length > 0) {
      console.group("💡 Recommendations")
      report.recommendations.forEach((rec) => {
        console.log(`• ${rec}`)
      })
      console.groupEnd()
    }

    console.groupEnd()
  }

  /**
   * Get appropriate log level for overall status
   */
  private getLogLevel(status: string): "info" | "warn" | "error" {
    switch (status) {
      case "healthy":
        return "info"
      case "degraded":
        return "warn"
      default:
        return "error"
    }
  }

  /**
   * Get status icon for display
   */
  private getStatusIcon(status: string): string {
    switch (status) {
      case "healthy":
        return "✅"
      case "degraded":
        return "⚠️"
      case "unhealthy":
        return "❌"
      case "unreachable":
        return "🔌"
      default:
        return "❓"
    }
  }

  /**
   * Export verification report as JSON
   */
  exportReport(report: SystemVerificationReport): string {
    return JSON.stringify(report, null, 2)
  }

  /**
   * Clear all history
   */
  clearHistory(): void {
    this.verificationHistory.clear()
  }
}

export const serviceVerifier = new ServiceVerifier()
export default ServiceVerifier
