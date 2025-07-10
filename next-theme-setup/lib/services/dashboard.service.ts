/**
 * Dashboard Service
 * Handles dashboard CRUD operations through the gateway API
 */

import { gatewayApi } from "./api-client"
import { API_CONFIG } from "@/lib/config/api"

export interface Dashboard {
  id: string
  name: string
  description?: string
  modules: DashboardModule[]
  layout: DashboardLayout
  settings: DashboardSettings
  metadata: {
    createdBy: string
    createdAt: string
    updatedAt: string
    version: number
    tags: string[]
    isPublic: boolean
    isTemplate: boolean
  }
}

export interface DashboardModule {
  id: string
  type: "chart" | "metric" | "table" | "gauge" | "alert" | "status" | "heatmap" | "log"
  title: string
  description?: string
  config: Record<string, any>
  position: {
    x: number
    y: number
    w: number
    h: number
  }
  dataSource?: {
    type: "prometheus" | "grafana" | "custom"
    query: string
    refreshInterval: number
  }
}

export interface DashboardLayout {
  columns: number
  rows: number
  gap: number
  responsive: boolean
  breakpoints?: Record<string, { columns: number; gap: number }>
}

export interface DashboardSettings {
  refreshInterval: number
  timeRange: string
  autoRefresh: boolean
  theme: "light" | "dark" | "auto"
  showGrid: boolean
  allowEdit: boolean
}

export interface DashboardTemplate {
  id: string
  name: string
  description: string
  category: "infrastructure" | "application" | "security" | "business"
  modules: DashboardModule[]
  layout: DashboardLayout
  settings: DashboardSettings
  preview?: string
  tags: string[]
}

export interface CreateDashboardRequest {
  name: string
  description?: string
  modules?: DashboardModule[]
  layout?: Partial<DashboardLayout>
  settings?: Partial<DashboardSettings>
  tags?: string[]
  isPublic?: boolean
}

export interface UpdateDashboardRequest {
  name?: string
  description?: string
  modules?: DashboardModule[]
  layout?: Partial<DashboardLayout>
  settings?: Partial<DashboardSettings>
  tags?: string[]
  isPublic?: boolean
}

export interface DashboardListOptions {
  page?: number
  limit?: number
  search?: string
  tags?: string[]
  category?: string
  sortBy?: "name" | "createdAt" | "updatedAt"
  sortOrder?: "asc" | "desc"
  includeTemplates?: boolean
}

class DashboardService {
  /**
   * Get all dashboards with filtering and pagination
   */
  async getDashboards(options: DashboardListOptions = {}): Promise<{
    dashboards: Dashboard[]
    total: number
    page: number
    limit: number
  }> {
    const params = new URLSearchParams()

    if (options.page) params.append("page", options.page.toString())
    if (options.limit) params.append("limit", options.limit.toString())
    if (options.search) params.append("search", options.search)
    if (options.tags?.length) params.append("tags", options.tags.join(","))
    if (options.category) params.append("category", options.category)
    if (options.sortBy) params.append("sortBy", options.sortBy)
    if (options.sortOrder) params.append("sortOrder", options.sortOrder)
    if (options.includeTemplates) params.append("includeTemplates", "true")

    const response = await gatewayApi.get<{
      dashboards: Dashboard[]
      total: number
      page: number
      limit: number
    }>(`${API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARDS}?${params}`, undefined, { cache: true })

    return response.data
  }

  /**
   * Get dashboard by ID
   */
  async getDashboard(id: string): Promise<Dashboard> {
    const response = await gatewayApi.get<Dashboard>(`${API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARDS}/${id}`, undefined, {
      cache: true,
    })

    return response.data
  }

  /**
   * Create new dashboard
   */
  async createDashboard(data: CreateDashboardRequest): Promise<Dashboard> {
    const response = await gatewayApi.post<Dashboard>(API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARDS, data)

    return response.data
  }

  /**
   * Update existing dashboard
   */
  async updateDashboard(id: string, data: UpdateDashboardRequest): Promise<Dashboard> {
    const response = await gatewayApi.put<Dashboard>(`${API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARDS}/${id}`, data)

    return response.data
  }

  /**
   * Delete dashboard
   */
  async deleteDashboard(id: string): Promise<void> {
    await gatewayApi.delete(`${API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARDS}/${id}`)
  }

  /**
   * Duplicate dashboard
   */
  async duplicateDashboard(id: string, name?: string): Promise<Dashboard> {
    const response = await gatewayApi.post<Dashboard>(`${API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARDS}/${id}/duplicate`, {
      name,
    })

    return response.data
  }

  /**
   * Get dashboard templates
   */
  async getTemplates(): Promise<DashboardTemplate[]> {
    const response = await gatewayApi.get<DashboardTemplate[]>(
      API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARD_TEMPLATES,
      undefined,
      {
        cache: true,
      },
    )

    return response.data
  }

  /**
   * Create dashboard from template
   */
  async createFromTemplate(templateId: string, name: string, customizations?: Partial<Dashboard>): Promise<Dashboard> {
    const response = await gatewayApi.post<Dashboard>(
      `${API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARD_TEMPLATES}/${templateId}/create`,
      {
        name,
        customizations,
      },
    )

    return response.data
  }

  /**
   * Share dashboard
   */
  async shareDashboard(
    id: string,
    options: {
      isPublic: boolean
      allowEdit?: boolean
      expiresAt?: string
      password?: string
    },
  ): Promise<{
    shareUrl: string
    shareId: string
    expiresAt?: string
  }> {
    const response = await gatewayApi.post<{
      shareUrl: string
      shareId: string
      expiresAt?: string
    }>(`${API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARD_SHARE}/${id}`, options)

    return response.data
  }

  /**
   * Get shared dashboard
   */
  async getSharedDashboard(shareId: string, password?: string): Promise<Dashboard> {
    const response = await gatewayApi.get<Dashboard>(`${API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARD_SHARE}/${shareId}`, {
      password,
    })

    return response.data
  }

  /**
   * Export dashboard
   */
  async exportDashboard(id: string, format: "json" | "yaml" = "json"): Promise<Blob> {
    const response = await fetch(
      `${API_CONFIG.BASE_URLS.GATEWAY}${API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARDS}/${id}/export?format=${format}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("supervia_token")}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to export dashboard")
    }

    return response.blob()
  }

  /**
   * Import dashboard
   */
  async importDashboard(file: File): Promise<Dashboard> {
    const formData = new FormData()
    formData.append("dashboard", file)

    const response = await fetch(`${API_CONFIG.BASE_URLS.GATEWAY}${API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARDS}/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("supervia_token")}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to import dashboard")
    }

    const data = await response.json()
    return data.data
  }

  /**
   * Get dashboard analytics
   */
  async getDashboardAnalytics(
    id: string,
    timeRange = "7d",
  ): Promise<{
    views: number
    uniqueUsers: number
    avgSessionTime: number
    popularModules: Array<{ moduleId: string; views: number }>
    timeSeriesData: Array<{ timestamp: string; views: number }>
  }> {
    const response = await gatewayApi.get<{
      views: number
      uniqueUsers: number
      avgSessionTime: number
      popularModules: Array<{ moduleId: string; views: number }>
      timeSeriesData: Array<{ timestamp: string; views: number }>
    }>(`${API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARDS}/${id}/analytics`, { timeRange })

    return response.data
  }

  /**
   * Auto-save dashboard (for editor)
   */
  async autoSaveDashboard(id: string, data: Partial<UpdateDashboardRequest>): Promise<void> {
    // Use a different endpoint for auto-save to avoid conflicts
    await gatewayApi.patch(`${API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARDS}/${id}/autosave`, data)
  }

  /**
   * Get dashboard revision history
   */
  async getDashboardHistory(id: string): Promise<
    Array<{
      version: number
      createdAt: string
      createdBy: string
      changes: string[]
      size: number
    }>
  > {
    const response = await gatewayApi.get<
      Array<{
        version: number
        createdAt: string
        createdBy: string
        changes: string[]
        size: number
      }>
    >(`${API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARDS}/${id}/history`)

    return response.data
  }

  /**
   * Restore dashboard to specific version
   */
  async restoreDashboard(id: string, version: number): Promise<Dashboard> {
    const response = await gatewayApi.post<Dashboard>(`${API_CONFIG.ENDPOINTS.GATEWAY.DASHBOARDS}/${id}/restore`, {
      version,
    })

    return response.data
  }
}

export const dashboardService = new DashboardService()
export default DashboardService
