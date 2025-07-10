"use client"

import type { DashboardError, DashboardEvent } from "@/lib/types/dashboard"

export interface ErrorNotification {
  id: string
  error: DashboardError
  shown: boolean
  dismissed: boolean
  timestamp: string
}

export interface ErrorServiceConfig {
  maxErrors: number
  enableConsoleLogging: boolean
  enableRemoteLogging: boolean
  remoteEndpoint?: string
  enableUserNotifications: boolean
  autoRetryAttempts: number
  retryDelay: number
}

class ErrorService {
  private static instance: ErrorService
  private errors: Map<string, DashboardError> = new Map()
  private notifications: Map<string, ErrorNotification> = new Map()
  private listeners: Set<(error: DashboardError) => void> = new Set()
  private config: ErrorServiceConfig

  private constructor() {
    this.config = {
      maxErrors: 50,
      enableConsoleLogging: process.env.NODE_ENV === 'development',
      enableRemoteLogging: process.env.NODE_ENV === 'production',
      enableUserNotifications: true,
      autoRetryAttempts: 3,
      retryDelay: 1000,
    }
  }

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService()
    }
    return ErrorService.instance
  }

  configure(config: Partial<ErrorServiceConfig>) {
    this.config = { ...this.config, ...config }
  }

  // Add error to the service
  addError(error: DashboardError): void {
    // Add to errors map
    this.errors.set(error.id, error)

    // Create notification
    const notification: ErrorNotification = {
      id: `notification-${error.id}`,
      error,
      shown: false,
      dismissed: false,
      timestamp: new Date().toISOString(),
    }
    this.notifications.set(notification.id, notification)

    // Clean up old errors if we exceed max
    if (this.errors.size > this.config.maxErrors) {
      this.cleanupOldErrors()
    }

    // Log to console if enabled
    if (this.config.enableConsoleLogging) {
      this.logToConsole(error)
    }

    // Send to remote service if enabled
    if (this.config.enableRemoteLogging) {
      this.logToRemote(error).catch(console.warn)
    }

    // Notify listeners
    this.notifyListeners(error)

    // Create user notification if enabled
    if (this.config.enableUserNotifications) {
      this.createUserNotification(error)
    }
  }

  // Get error by ID
  getError(id: string): DashboardError | undefined {
    return this.errors.get(id)
  }

  // Get all errors
  getAllErrors(): DashboardError[] {
    return Array.from(this.errors.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }

  // Get errors by type
  getErrorsByType(type: DashboardError['type']): DashboardError[] {
    return this.getAllErrors().filter(error => error.type === type)
  }

  // Get errors by component
  getErrorsByComponent(component: string): DashboardError[] {
    return this.getAllErrors().filter(error => error.component === component)
  }

  // Get recent errors (last hour)
  getRecentErrors(): DashboardError[] {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    return this.getAllErrors().filter(
      error => new Date(error.timestamp) > oneHourAgo
    )
  }

  // Clear error by ID
  clearError(id: string): void {
    this.errors.delete(id)
    // Also clear related notification
    const notification = Array.from(this.notifications.values()).find(n => n.error.id === id)
    if (notification) {
      this.notifications.delete(notification.id)
    }
  }

  // Clear all errors
  clearAllErrors(): void {
    this.errors.clear()
    this.notifications.clear()
  }

  // Clear errors by type
  clearErrorsByType(type: DashboardError['type']): void {
    for (const [id, error] of this.errors.entries()) {
      if (error.type === type) {
        this.clearError(id)
      }
    }
  }

  // Subscribe to error events
  subscribe(listener: (error: DashboardError) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  // Get error statistics
  getErrorStats() {
    const errors = this.getAllErrors()
    const stats = {
      total: errors.length,
      byType: {} as Record<string, number>,
      byComponent: {} as Record<string, number>,
      recent: this.getRecentErrors().length,
      recoverable: errors.filter(e => e.recoverable).length,
    }

    errors.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1
      if (error.component) {
        stats.byComponent[error.component] = (stats.byComponent[error.component] || 0) + 1
      }
    })

    return stats
  }

  // Handle specific error types
  handleValidationError(message: string, details?: string, component?: string): DashboardError {
    const error: DashboardError = {
      id: `validation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'validation',
      message,
      details,
      timestamp: new Date().toISOString(),
      component,
      recoverable: true,
    }
    this.addError(error)
    return error
  }

  handleNetworkError(message: string, details?: string, component?: string): DashboardError {
    const error: DashboardError = {
      id: `network-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'network',
      message,
      details,
      timestamp: new Date().toISOString(),
      component,
      recoverable: true,
    }
    this.addError(error)
    return error
  }

  handlePermissionError(message: string, details?: string, component?: string): DashboardError {
    const error: DashboardError = {
      id: `permission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'permission',
      message,
      details,
      timestamp: new Date().toISOString(),
      component,
      recoverable: false,
    }
    this.addError(error)
    return error
  }

  // Retry mechanism for recoverable errors
  async retryOperation<T>(
    operation: () => Promise<T>,
    errorContext: string,
    maxAttempts = this.config.autoRetryAttempts
  ): Promise<T> {
    let lastError: Error | undefined

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        if (attempt === maxAttempts) {
          // Final attempt failed, log error
          this.addError({
            id: `retry-failed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'runtime',
            message: `Operation failed after ${maxAttempts} attempts: ${lastError.message}`,
            details: `Context: ${errorContext}\nLast error: ${lastError.stack}`,
            timestamp: new Date().toISOString(),
            component: errorContext,
            recoverable: false,
          })
          throw lastError
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempt))
      }
    }

    throw lastError
  }

  // Private methods
  private logToConsole(error: DashboardError): void {
    const logMethod = error.type === 'validation' ? console.warn : console.error
    logMethod(`[${error.type.toUpperCase()}] ${error.message}`, {
      id: error.id,
      component: error.component,
      details: error.details,
      timestamp: error.timestamp,
    })
  }

  private async logToRemote(error: DashboardError): Promise<void> {
    if (!this.config.remoteEndpoint) return

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (logError) {
      console.warn('Failed to log error to remote service:', logError)
    }
  }

  private notifyListeners(error: DashboardError): void {
    this.listeners.forEach(listener => {
      try {
        listener(error)
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError)
      }
    })
  }

  private createUserNotification(error: DashboardError): void {
    // This would integrate with a toast notification system
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted' && error.type === 'runtime') {
        new Notification('Dashboard Error', {
          body: error.message,
          icon: '/favicon.ico',
        })
      }
    }
  }

  private cleanupOldErrors(): void {
    const errors = Array.from(this.errors.entries()).sort(
      ([, a], [, b]) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    // Remove oldest errors beyond max limit
    const toRemove = errors.slice(0, errors.length - this.config.maxErrors + 10)
    toRemove.forEach(([id]) => this.clearError(id))
  }

  // Export errors for debugging
  exportErrors(): string {
    const exportData = {
      timestamp: new Date().toISOString(),
      config: this.config,
      errors: this.getAllErrors(),
      stats: this.getErrorStats(),
    }
    return JSON.stringify(exportData, null, 2)
  }
}

// Export singleton instance
export const errorService = ErrorService.getInstance()

// Utility functions
export function createErrorHandler(component: string) {
  return (error: Error | string, details?: string) => {
    const errorMessage = typeof error === 'string' ? error : error.message
    const errorDetails = typeof error === 'string' ? details : (details || error.stack)
    
    return errorService.addError({
      id: `${component}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'runtime',
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString(),
      component,
      recoverable: true,
    })
  }
}

// Hook for React components
export function useErrorService() {
  return {
    addError: errorService.addError.bind(errorService),
    getErrors: errorService.getAllErrors.bind(errorService),
    clearError: errorService.clearError.bind(errorService),
    clearAllErrors: errorService.clearAllErrors.bind(errorService),
    subscribe: errorService.subscribe.bind(errorService),
    getStats: errorService.getErrorStats.bind(errorService),
    createHandler: createErrorHandler,
    retry: errorService.retryOperation.bind(errorService),
  }
} 