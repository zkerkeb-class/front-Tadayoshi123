/**
 * Error Boundary Component
 * Catches and handles React errors gracefully
 */

"use client"

import React, { Component, ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, RefreshCw, Bug, Copy, Download, ChevronDown, ChevronUp } from "lucide-react"
import type { DashboardError, ErrorBoundaryState } from "@/lib/types/dashboard"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: DashboardError) => void
  level?: 'component' | 'panel' | 'dashboard' | 'app'
  context?: string
}

interface ErrorBoundaryLocalState extends ErrorBoundaryState {
  showDetails: boolean
  retryCount: number
  lastRetry?: Date
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryLocalState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      showDetails: false,
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryLocalState> {
    const dashboardError: DashboardError = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'runtime',
      message: error.message,
      details: error.stack || '',
      timestamp: new Date().toISOString(),
      recoverable: true,
    }

    return {
      hasError: true,
      error: dashboardError,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const dashboardError: DashboardError = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'runtime',
      message: error.message,
      details: JSON.stringify({
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        context: this.props.context,
      }, null, 2),
      timestamp: new Date().toISOString(),
      component: this.props.context || 'Unknown',
      recoverable: this.state.retryCount < 3,
    }

    this.setState({
      error: dashboardError,
      errorInfo,
    })

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(dashboardError)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      showDetails: false,
      retryCount: prevState.retryCount + 1,
      lastRetry: new Date(),
    }))
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      showDetails: false,
      retryCount: 0,
      lastRetry: undefined,
    })
  }

  handleCopyError = () => {
    if (this.state.error) {
      const errorText = JSON.stringify({
        message: this.state.error.message,
        details: this.state.error.details,
        timestamp: this.state.error.timestamp,
        component: this.state.error.component,
        context: this.props.context,
      }, null, 2)
      
      navigator.clipboard.writeText(errorText).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = errorText
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      })
    }
  }

  handleExportError = () => {
    if (this.state.error) {
      const errorData = {
        error: this.state.error,
        context: this.props.context,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      }
      
      const blob = new Blob([JSON.stringify(errorData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `error-report-${this.state.error.id}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  renderErrorDetails() {
    const { error } = this.state

    if (!error || !this.state.showDetails) return null

    return (
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Error ID:</span>
            <code className="ml-2 text-xs bg-muted px-1 rounded">{error.id}</code>
          </div>
          <div>
            <span className="font-medium">Type:</span>
            <Badge variant="destructive" className="ml-2 text-xs">{error.type}</Badge>
          </div>
          <div>
            <span className="font-medium">Component:</span>
            <span className="ml-2">{error.component || 'Unknown'}</span>
          </div>
          <div>
            <span className="font-medium">Time:</span>
            <span className="ml-2">{new Date(error.timestamp).toLocaleString()}</span>
          </div>
        </div>

        {error.details && (
          <div>
            <span className="font-medium text-sm">Stack Trace:</span>
            <ScrollArea className="h-32 mt-2">
              <pre className="text-xs bg-muted p-3 rounded font-mono whitespace-pre-wrap">
                {error.details}
              </pre>
            </ScrollArea>
          </div>
        )}
      </div>
    )
  }

  renderFallback() {
    const { error } = this.state
    const canRetry = error?.recoverable && this.state.retryCount < 3

    if (this.props.fallback) {
      return this.props.fallback
    }

    return (
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">
              {this.props.level === 'dashboard' ? 'Dashboard Error' : 
               this.props.level === 'panel' ? 'Panel Error' : 
               'Component Error'}
            </CardTitle>
          </div>
          <CardDescription>
            {error?.message || 'An unexpected error occurred'}
            {this.state.retryCount > 0 && (
              <span className="ml-2">
                (Retry attempt: {this.state.retryCount})
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This {this.props.level || 'component'} has encountered an error and stopped working. 
              {canRetry ? ' You can try to reload it.' : ' Please refresh the page or contact support.'}
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap gap-2">
            {canRetry && (
              <Button
                onClick={this.handleRetry}
                size="sm"
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry</span>
              </Button>
            )}

            <Button
              onClick={this.handleReset}
              size="sm"
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset</span>
            </Button>

            <Button
              onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
              size="sm"
              variant="ghost"
              className="flex items-center space-x-2"
            >
              {this.state.showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span>{this.state.showDetails ? 'Hide' : 'Show'} Details</span>
            </Button>

            <Button
              onClick={this.handleCopyError}
              size="sm"
              variant="ghost"
              className="flex items-center space-x-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Error</span>
            </Button>

            <Button
              onClick={this.handleExportError}
              size="sm"
              variant="ghost"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>

          {this.renderErrorDetails()}

          {process.env.NODE_ENV === 'development' && (
            <Alert>
              <Bug className="h-4 w-4" />
              <AlertDescription>
                <strong>Development Mode:</strong> Check the console for additional debugging information.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  render() {
    if (this.state.hasError) {
      return this.renderFallback()
    }

    return this.props.children
  }
}

// Hook for functional components
export function useErrorHandler() {
  return (error: Error, context?: string) => {
    const dashboardError: DashboardError = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'runtime',
      message: error.message,
      details: error.stack || '',
      timestamp: new Date().toISOString(),
      component: context,
      recoverable: true,
    }

    console.error('Error handled:', dashboardError)
    throw error // Re-throw to be caught by ErrorBoundary
  }
}

// Specific error boundaries for different levels
export const DashboardErrorBoundary = ({ children, onError }: { children: ReactNode, onError?: (error: DashboardError) => void }) => (
  <ErrorBoundary level="dashboard" context="Dashboard" onError={onError}>
    {children}
  </ErrorBoundary>
)

export const PanelErrorBoundary = ({ children, panelId, onError }: { children: ReactNode, panelId: string, onError?: (error: DashboardError) => void }) => (
  <ErrorBoundary level="panel" context={`Panel-${panelId}`} onError={onError}>
    {children}
  </ErrorBoundary>
)

export const ComponentErrorBoundary = ({ children, componentName, onError }: { children: ReactNode, componentName: string, onError?: (error: DashboardError) => void }) => (
  <ErrorBoundary level="component" context={componentName} onError={onError}>
    {children}
  </ErrorBoundary>
)
