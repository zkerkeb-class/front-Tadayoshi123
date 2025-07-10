"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Server,
  Database,
  Network,
  HardDrive,
  Cpu,
  MemoryStick,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

export default function InfrastructurePage() {
  const servers = [
    { name: "web-server-01", status: "healthy", cpu: 45, memory: 62, disk: 78 },
    { name: "web-server-02", status: "healthy", cpu: 38, memory: 58, disk: 65 },
    { name: "db-primary", status: "warning", cpu: 78, memory: 85, disk: 45 },
    { name: "cache-server", status: "critical", cpu: 92, memory: 95, disk: 88 },
    { name: "api-gateway", status: "healthy", cpu: 55, memory: 70, disk: 42 },
    { name: "load-balancer", status: "healthy", cpu: 25, memory: 35, disk: 30 },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600"
      case "warning":
        return "text-orange-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getProgressColor = (value: number) => {
    if (value >= 90) return "bg-red-500"
    if (value >= 70) return "bg-orange-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Infrastructure Monitoring</h1>
        <p className="text-muted-foreground">Monitor your servers, networks, and infrastructure components</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Servers</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">4 healthy, 1 warning, 1 critical</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">Warning</div>
            <p className="text-xs text-muted-foreground">High memory usage detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Health</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
            <p className="text-xs text-muted-foreground">All connections stable</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">2.1TB of 3TB used</p>
          </CardContent>
        </Card>
      </div>

      {/* Server Details */}
      <Card>
        <CardHeader>
          <CardTitle>Server Status</CardTitle>
          <CardDescription>Real-time status and resource usage for all servers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {servers.map((server) => (
              <div key={server.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(server.status)}
                  <div>
                    <div className="font-medium">{server.name}</div>
                    <div className={`text-sm ${getStatusColor(server.status)}`}>
                      {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="flex items-center space-x-2 mb-1">
                      <Cpu className="h-3 w-3" />
                      <span className="text-xs font-medium">CPU</span>
                    </div>
                    <div className="w-16">
                      <Progress value={server.cpu} className="h-2" />
                      <div className="text-xs text-center mt-1">{server.cpu}%</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center space-x-2 mb-1">
                      <MemoryStick className="h-3 w-3" />
                      <span className="text-xs font-medium">Memory</span>
                    </div>
                    <div className="w-16">
                      <Progress value={server.memory} className="h-2" />
                      <div className="text-xs text-center mt-1">{server.memory}%</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center space-x-2 mb-1">
                      <HardDrive className="h-3 w-3" />
                      <span className="text-xs font-medium">Disk</span>
                    </div>
                    <div className="w-16">
                      <Progress value={server.disk} className="h-2" />
                      <div className="text-xs text-center mt-1">{server.disk}%</div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    <Activity className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
