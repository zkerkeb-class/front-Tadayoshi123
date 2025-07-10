/**
 * AI Service
 * Corrected and simplified for unified AI service handling
 */

import { aiApi } from "./api-client"
import type { ApiResponse } from "./api-client"
import type { DashboardBlock, DashboardLayout } from "@/lib/types/dashboard"

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  metadata?: {
    type?: "query" | "dashboard" | "analysis"
    context?: Record<string, any>
  }
}

export interface ChatResponse {
  message: ChatMessage
  sessionId: string
  suggestions?: string[]
  actions?: any[]
  context?: Record<string, any>
  success: boolean
  metadata: {
    messageCount: number
    hasContext: boolean
    cached: boolean
  }
}

// Simplified from the original to match backend reality
export interface DashboardGenerationRequest {
  prompt: string
  context?: {
    existingBlocks?: { id: string; type: string; title: string }[];
    dashboardTitle?: string;
    preferredMetrics?: string[]
  }
  options?: {
    complexity?: "simple" | "detailed" | "advanced"
  }
}

// This interface should align with the actual dashboard structure
export interface GeneratedDashboard {
  dashboard: {
    title: string
    description: string
    blocks: DashboardBlock[]
  }
  recommendations: string[]
  explanation: string
}

class AIService {
  /**
   * Chat Assistant Methods
   */
  async sendChatMessage(message: string, sessionId?: string, context?: Record<string, any>): Promise<ChatResponse> {
    try {
      // Route correcte selon ops-assistant.routes.js
      const response = await aiApi.post<ChatResponse>("/api/ops-assistant/chat", {
        message,
        sessionId,
        context,
      })
      return response.data
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API chat:", error);
      throw error;
    }
  }

  /**
   * Dashboard Generation Methods
   */
  async generateDashboard(request: DashboardGenerationRequest): Promise<GeneratedDashboard> {
    try {
      // Route correcte selon dashboard.routes.js
      const response = await aiApi.post<GeneratedDashboard>(
        "/api/dashboard/generate",
        {
          requirements: request.prompt,
          context: request.context,
          complexity: request.options?.complexity || "medium",
        }
      )
      return response.data
    } catch (error) {
      console.error("Erreur lors de la génération du dashboard:", error);
      throw error;
    }
  }

  /**
   * Utility Methods
   */
  async healthCheck(): Promise<{
    status: "healthy" | "degraded" | "unhealthy"
    services: Record<string, boolean>
    latency: number
  }> {
    try {
      const healthStatus = await aiApi.healthCheck()
      const latency = healthStatus.latency

      return {
        status: healthStatus.healthy ? "healthy" : "unhealthy",
        services: {
          chat: healthStatus.healthy,
          dashboard: healthStatus.healthy,
        },
        latency,
      }
    } catch {
      return {
        status: "unhealthy",
        services: {
          chat: false,
          dashboard: false,
        },
        latency: -1,
      }
    }
  }
}

export const aiService = new AIService()
export default AIService
