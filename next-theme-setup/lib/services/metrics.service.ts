/**
 * Metrics Service
 * Handles all metrics and monitoring API calls
 */

import { metricsApi } from "./api-client";
import type { ApiResponse } from "./api-client";

export interface PrometheusQuery {
  query: string;
  time?: string;
  step?: string;
}

export interface PrometheusData {
  resultType: "matrix" | "vector" | "scalar" | "string";
  result: any[];
}

export interface MetricQuery {
  query: string
  start?: string
  end?: string
  step?: string
}

export interface MetricValue {
  timestamp: number
  value: string
}

export interface MetricSeries {
  metric: Record<string, string>
  values: MetricValue[]
}

export interface QueryResponse {
  status: "success" | "error"
  data: {
    resultType: "matrix" | "vector" | "scalar" | "string"
    result: MetricSeries[]
  }
  error?: string
}

export interface Alert {
  id: string
  name: string
  state: "pending" | "firing" | "resolved"
  severity: "critical" | "warning" | "info"
  description: string
  summary: string
  labels: Record<string, string>
  annotations: Record<string, string>
  startsAt: string
  endsAt?: string
  generatorURL: string
}

export interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy"
  checks: Array<{
    name: string
    status: "pass" | "fail" | "warn"
    message?: string
    lastCheck: string
  }>
  uptime: number
  version: string
}

class MetricsService {
  /**
   * @deprecated Use fetchPrometheusQuery instead
   */
  async query(query: string, time?: string): Promise<QueryResponse> {
    const params: Record<string, string> = { query }
    if (time) params.time = time

    const response = await metricsApi.get<QueryResponse>(API_CONFIG.ENDPOINTS.METRICS.QUERY, params)

    return response.data
  }

  /**
   * @deprecated Use fetchPrometheusQuery instead
   */
  async queryRange(query: string, start: string, end: string, step = "15s"): Promise<QueryResponse> {
    const response = await metricsApi.get<QueryResponse>(API_CONFIG.ENDPOINTS.METRICS.QUERY_RANGE, {
      query,
      start,
      end,
      step,
    })

    return response.data
  }

  /**
   * Get system health status
   */
  async getHealthStatus(): Promise<HealthStatus> {
    const response = await metricsApi.get<HealthStatus>(API_CONFIG.ENDPOINTS.METRICS.HEALTH)

    return response.data
  }

  /**
   * Get active alerts
   */
  async getAlerts(filters?: {
    state?: string[]
    severity?: string[]
    labels?: Record<string, string>
  }): Promise<Alert[]> {
    const params: Record<string, any> = {}

    if (filters?.state) params.state = filters.state.join(",")
    if (filters?.severity) params.severity = filters.severity.join(",")
    if (filters?.labels) {
      Object.entries(filters.labels).forEach(([key, value]) => {
        params[`label.${key}`] = value
      })
    }

    const response = await metricsApi.get<Alert[]>(API_CONFIG.ENDPOINTS.METRICS.ALERTS, params)

    return response.data
  }

  async getAvailableMetrics(): Promise<string[]> {
    try {
      const response = await metricsApi.get<{ metrics: string[] }>('/api/metrics/list');
      return response.data.metrics || [];
    } catch (error) {
      console.error("Failed to fetch available metrics:", error);
      return [];
    }
  }

  async fetchPrometheusQuery(params: {
    query: string;
    start?: string;
    end?: string;
    step?: string;
  }): Promise<PrometheusData> {
    try {
      let response: ApiResponse<PrometheusData>;
      // Si start, end et step sont fournis, c'est une range query
      if (params.start && params.end && params.step) {
        response = await metricsApi.post(
          '/api/v1/metrics/prometheus/query_range',
          {
            query: params.query,
            start: params.start,
            end: params.end,
            step: params.step,
          }
        );
      } else {
        // Sinon, c'est une query instantanée
        response = await metricsApi.post('/api/v1/metrics/prometheus/query', {
          query: params.query,
        });
      }

      // La structure de la réponse du backend est { success: true, data: { ... } }
      // Nous retournons directement la partie `data`.
      // @ts-ignore
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch prometheus query "${params.query}":`, error);
      throw error;
    }
  }

  async fetchApiEndpoint(endpoint: string): Promise<any> {
    try {
      // Assuming the endpoint is relative to the API gateway or a full URL
      const response = await metricsApi.get(endpoint);
      return response.data;
    } catch (error) {
       console.error(`Failed to fetch API endpoint "${endpoint}":`, error);
      throw error;
    }
  }

  async getServiceHealth() {
    return await metricsApi.healthCheck();
  }

  /**
   * Get common system metrics
   * @deprecated This logic should be moved to dashboard templates
   */
  async getSystemMetrics(timeRange = "1h"): Promise<{
    cpu: MetricSeries[]
    memory: MetricSeries[]
    disk: MetricSeries[]
    network: MetricSeries[]
  }> {
    const end = new Date().toISOString()
    const start = new Date(Date.now() - this.parseTimeRange(timeRange)).toISOString()

    const [cpu, memory, disk, network] = await Promise.all([
      this.fetchPrometheusQuery({ query:"rate(cpu_usage_total[5m])", start, end, step: '1m' }),
      this.fetchPrometheusQuery({ query:"memory_usage_percent", start, end, step: '1m' }),
      this.fetchPrometheusQuery({ query:"disk_usage_percent", start, end, step: '1m' }),
      this.fetchPrometheusQuery({ query:"rate(network_bytes_total[5m])", start, end, step: '1m' }),
    ])

    return {
      // @ts-ignore
      cpu: cpu.result,
      // @ts-ignore
      memory: memory.result,
      // @ts-ignore
      disk: disk.result,
      // @ts-ignore
      network: network.result,
    }
  }

  /**
   * Parse time range string to milliseconds
   */
  private parseTimeRange(timeRange: string): number {
    const match = timeRange.match(/^(\d+)([smhd])$/)
    if (!match) return 3600000 // Default 1 hour

    const value = Number.parseInt(match[1])
    const unit = match[2]

    switch (unit) {
      case "s":
        return value * 1000
      case "m":
        return value * 60 * 1000
      case "h":
        return value * 60 * 60 * 1000
      case "d":
        return value * 24 * 60 * 60 * 1000
      default:
        return 3600000
    }
  }
}

export const metricsService = new MetricsService();
export default MetricsService;
