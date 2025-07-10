/**
 * Service Health Monitor
 * Monitors the health of all SupervIA services
 */

import { gatewayApi, authApi, metricsApi, aiApi, notifierApi, paymentApi, grafanaApi } from "./api-client"

export interface ServiceHealth {
  name: string
  status: "healthy" | "degraded" | "unhealthy" | "unknown"
  latency: number
  lastCheck: Date
  error?: string
}

export interface SystemHealth {
  overall: "healthy" | "degraded" | "unhealthy"
  services: ServiceHealth[]
  timestamp: Date
}

class HealthMonitor {
  private healthCache: Map<string, ServiceHealth> = new Map()
  private checkInterval: NodeJS.Timeout | null = null

  /**
   * Check health of a specific service
   */
  async checkServiceHealth(serviceName: string, apiClient: any): Promise<ServiceHealth> {
    const startTime = Date.now()

    try {
      const isHealthy = await apiClient.healthCheck()
      const latency = Date.now() - startTime

      const health: ServiceHealth = {
        name: serviceName,
        status: isHealthy ? "healthy" : "unhealthy",
        latency,
        lastCheck: new Date(),
      }

      this.healthCache.set(serviceName, health)
      return health
    } catch (error) {
      const health: ServiceHealth = {
        name: serviceName,
        status: "unhealthy",
        latency: Date.now() - startTime,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : "Unknown error",
      }

      this.healthCache.set(serviceName, health)
      return health
    }
  }

  /**
   * Check health of all services
   */
  async checkAllServices(): Promise<SystemHealth> {
    const services = [
      { name: "gateway", client: gatewayApi },
      { name: "auth", client: authApi },
      { name: "metrics", client: metricsApi },
      { name: "ai", client: aiApi },
      { name: "notifier", client: notifierApi },
      { name: "payment", client: paymentApi },
      { name: "grafana", client: grafanaApi },
    ]

    const healthChecks = await Promise.allSettled(
      services.map(({ name, client }) => this.checkServiceHealth(name, client)),
    )

    const serviceHealths: ServiceHealth[] = healthChecks.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value
      } else {
        return {
          name: services[index].name,
          status: "unknown",
          latency: 0,
          lastCheck: new Date(),
          error: "Health check failed",
        }
      }
    })

    // Determine overall system health
    const healthyCount = serviceHealths.filter((s) => s.status === "healthy").length
    const totalCount = serviceHealths.length

    let overall: "healthy" | "degraded" | "unhealthy"
    if (healthyCount === totalCount) {
      overall = "healthy"
    } else if (healthyCount >= totalCount * 0.7) {
      overall = "degraded"
    } else {
      overall = "unhealthy"
    }

    return {
      overall,
      services: serviceHealths,
      timestamp: new Date(),
    }
  }

  /**
   * Start continuous health monitoring
   */
  startMonitoring(intervalMs = 60000): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
    }

    this.checkInterval = setInterval(() => {
      this.checkAllServices().catch(console.error)
    }, intervalMs)
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }

  /**
   * Get cached health status
   */
  getCachedHealth(): ServiceHealth[] {
    return Array.from(this.healthCache.values())
  }

  /**
   * Get health status for specific service
   */
  getServiceHealth(serviceName: string): ServiceHealth | null {
    return this.healthCache.get(serviceName) || null
  }
}

export const healthMonitor = new HealthMonitor()
export default HealthMonitor
