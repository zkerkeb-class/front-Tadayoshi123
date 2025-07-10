"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  WifiOff,
  Clock,
  Activity,
  Server,
  Download,
} from "lucide-react"
import { serviceVerifier, type SystemVerificationReport } from "@/lib/services/service-verifier"

interface ServiceVerificationDashboardProps {
  autoRefresh?: boolean
  refreshInterval?: number
}

export function ServiceVerificationDashboard({
  autoRefresh = false,
  refreshInterval = 60000,
}: ServiceVerificationDashboardProps) {
  const [report, setReport] = useState<SystemVerificationReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const runVerification = async () => {
    setIsLoading(true)
    try {
      const newReport = await serviceVerifier.verifyAllServices()
      setReport(newReport)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Verification failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Run initial verification
    runVerification()

    // Set up auto-refresh if enabled
    if (autoRefresh) {
      const interval = setInterval(runVerification, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50 border-green-200"
      case "degraded":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "unhealthy":
        return "text-red-600 bg-red-50 border-red-200"
      case "unreachable":
        return "text-gray-600 bg-gray-50 border-gray-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "unhealthy":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "unreachable":
        return <WifiOff className="h-4 w-4 text-gray-600" />
      default:
        return <Server className="h-4 w-4 text-gray-600" />
    }
  }

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "border-green-500 bg-green-50"
      case "degraded":
        return "border-yellow-500 bg-yellow-50"
      case "critical":
        return "border-orange-500 bg-orange-50"
      case "failed":
        return "border-red-500 bg-red-50"
      default:
        return "border-gray-500 bg-gray-50"
    }
  }

  const calculateHealthPercentage = () => {
    if (!report) return 0
    return Math.round((report.summary.healthy / report.summary.total) * 100)
  }

  const downloadReport = () => {
    if (!report) return

    const dataStr = serviceVerifier.exportReport(report)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `service-verification-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  if (!report && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Service Verification</CardTitle>
          <CardDescription>Click to start service verification</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runVerification} className="w-full">
            <Activity className="mr-2 h-4 w-4" />
            Start Verification
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Service Verification</h2>
          <p className="text-muted-foreground">Monitor the health and availability of all integrated services</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={downloadReport} disabled={!report}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" onClick={runVerification} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      {report && (
        <Card className={`border-2 ${getOverallStatusColor(report.overall)}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>System Status: {report.overall.toUpperCase()}</span>
                </CardTitle>
                <CardDescription>{lastUpdate && `Last updated: ${lastUpdate.toLocaleString()}`}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{calculateHealthPercentage()}%</div>
                <div className="text-sm text-muted-foreground">Services Healthy</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={calculateHealthPercentage()} className="mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{report.summary.healthy}</div>
                <div className="text-muted-foreground">Healthy</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-600">{report.summary.degraded}</div>
                <div className="text-muted-foreground">Degraded</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">{report.summary.unhealthy}</div>
                <div className="text-muted-foreground">Unhealthy</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-600">{report.summary.unreachable}</div>
                <div className="text-muted-foreground">Unreachable</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Environment Issues */}
      {report && !report.environment.isValid && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Environment Configuration Issues</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {report.environment.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Recommendations */}
      {report && report.recommendations.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Recommendations</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {report.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Service Details */}
      {report && (
        <Tabs defaultValue="services" className="space-y-4">
          <TabsList>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="details">Detailed View</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {report.services.map((service) => (
                <Card key={service.serviceName} className={`border ${getStatusColor(service.status)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center space-x-2">
                        {getStatusIcon(service.status)}
                        <span>{service.serviceName.toUpperCase()}</span>
                      </CardTitle>
                      <Badge variant="outline" className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Response Time:</span>
                        <span className="font-medium">{service.responseTime}ms</span>
                      </div>
                      {service.statusCode && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status Code:</span>
                          <span className="font-medium">{service.statusCode}</span>
                        </div>
                      )}
                      {service.version && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Version:</span>
                          <span className="font-medium">{service.version}</span>
                        </div>
                      )}
                      {service.error && (
                        <div className="text-red-600 text-xs mt-2 p-2 bg-red-50 rounded">{service.error}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {report.services.map((service) => (
                  <Card key={service.serviceName}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {getStatusIcon(service.status)}
                        <span>{service.serviceName.toUpperCase()}</span>
                        <Badge variant="outline" className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{service.endpoint}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Response Time:</strong> {service.responseTime}ms
                        </div>
                        <div>
                          <strong>Timestamp:</strong> {new Date(service.timestamp).toLocaleString()}
                        </div>
                        {service.statusCode && (
                          <div>
                            <strong>Status Code:</strong> {service.statusCode}
                          </div>
                        )}
                        {service.version && (
                          <div>
                            <strong>Version:</strong> {service.version}
                          </div>
                        )}
                      </div>

                      {service.details && Object.keys(service.details).length > 0 && (
                        <div className="mt-4">
                          <strong className="text-sm">Additional Details:</strong>
                          <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto">
                            {JSON.stringify(service.details, null, 2)}
                          </pre>
                        </div>
                      )}

                      {service.error && (
                        <Alert variant="destructive" className="mt-4">
                          <XCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{service.error}</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Verification History</CardTitle>
                <CardDescription>Historical data for service health checks (feature coming soon)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Historical data visualization will be available in the next update</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Running service verification...</span>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ServiceVerificationDashboard
