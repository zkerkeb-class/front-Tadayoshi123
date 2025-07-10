"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  XCircle,
  Clock,
  Navigation,
  Home,
  Building2,
  BarChart3,
  Bot,
  MessageSquare,
  Edit3,
  Zap,
  Users,
  Settings,
  Shield,
  Mail,
} from "lucide-react"

interface RouteTest {
  path: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  status: "pending" | "testing" | "success" | "error"
  error?: string
}

export function NavigationTest() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentTest, setCurrentTest] = useState<number>(-1)
  const [isRunning, setIsRunning] = useState(false)

  const [routes, setRoutes] = useState<RouteTest[]>([
    {
      path: "/",
      name: "Home Page",
      icon: Home,
      description: "Landing page with theme toggle",
      status: "pending",
    },
    {
      path: "/auth/login",
      name: "Login Page",
      icon: Shield,
      description: "User authentication with OAuth2 support",
      status: "pending",
    },
    {
      path: "/auth/signup",
      name: "Signup Page",
      icon: Mail,
      description: "User registration with form validation",
      status: "pending",
    },
    {
      path: "/dashboard",
      name: "Dashboard Overview",
      icon: Home,
      description: "Main dashboard with metrics overview",
      status: "pending",
    },
    {
      path: "/dashboard/infrastructure",
      name: "Infrastructure Monitoring",
      icon: Building2,
      description: "Server status and resource monitoring",
      status: "pending",
    },
    {
      path: "/dashboard/metrics",
      name: "Metrics & Analytics",
      icon: BarChart3,
      description: "Performance metrics with tabbed interface",
      status: "pending",
    },
    {
      path: "/dashboard/ai-builder",
      name: "AI Dashboard Builder",
      icon: Bot,
      description: "AI-powered dashboard generation",
      status: "pending",
    },
    {
      path: "/dashboard/assistant",
      name: "AI Assistant",
      icon: MessageSquare,
      description: "Chat interface with AI operations assistant",
      status: "pending",
    },
    {
      path: "/dashboard/editor",
      name: "Dashboard Editor",
      icon: Edit3,
      description: "Drag-and-drop dashboard builder",
      status: "pending",
    },
    {
      path: "/dashboard/alerts",
      name: "Alert Management",
      icon: Zap,
      description: "Alert monitoring and incident response",
      status: "pending",
    },
    {
      path: "/dashboard/users",
      name: "User Management",
      icon: Users,
      description: "User accounts, roles, and permissions",
      status: "pending",
    },
    {
      path: "/dashboard/settings",
      name: "Platform Settings",
      icon: Settings,
      description: "Configuration and platform preferences",
      status: "pending",
    },
  ])

  const updateRouteStatus = (index: number, status: RouteTest["status"], error?: string) => {
    setRoutes((prev) => prev.map((route, i) => (i === index ? { ...route, status, error } : route)))
  }

  const testRoute = async (index: number): Promise<boolean> => {
    const route = routes[index]
    setCurrentTest(index)
    updateRouteStatus(index, "testing")

    try {
      // Navigate to the route
      router.push(route.path)

      // Wait for navigation to complete
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check if we're on the correct path
      const currentPath = window.location.pathname
      const isCorrectPath =
        currentPath === route.path || (route.path === "/" && currentPath === "/") || currentPath.startsWith(route.path)

      if (isCorrectPath) {
        // Check for common error indicators
        const hasError =
          document.querySelector("[data-error]") ||
          document.querySelector(".error") ||
          document.title.toLowerCase().includes("error") ||
          document.body.textContent?.includes("404") ||
          document.body.textContent?.includes("500")

        if (hasError) {
          updateRouteStatus(index, "error", "Page contains error content")
          return false
        } else {
          updateRouteStatus(index, "success")
          return true
        }
      } else {
        updateRouteStatus(index, "error", `Expected ${route.path}, got ${currentPath}`)
        return false
      }
    } catch (error) {
      updateRouteStatus(index, "error", error instanceof Error ? error.message : "Navigation failed")
      return false
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setCurrentTest(-1)

    // Reset all statuses
    setRoutes((prev) => prev.map((route) => ({ ...route, status: "pending" as const })))

    let successCount = 0

    for (let i = 0; i < routes.length; i++) {
      const success = await testRoute(i)
      if (success) successCount++

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setCurrentTest(-1)
    setIsRunning(false)

    // Show summary
    const totalTests = routes.length
    const failedTests = totalTests - successCount

    if (failedTests === 0) {
      console.log(`✅ All ${totalTests} routes tested successfully!`)
    } else {
      console.log(`⚠️ ${successCount}/${totalTests} routes passed. ${failedTests} routes failed.`)
    }
  }

  const getStatusIcon = (status: RouteTest["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "testing":
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: RouteTest["status"]) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
      case "error":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
      case "testing":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
    }
  }

  const successCount = routes.filter((r) => r.status === "success").length
  const errorCount = routes.filter((r) => r.status === "error").length
  const testingCount = routes.filter((r) => r.status === "testing").length
  const progressPercentage = ((successCount + errorCount) / routes.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Navigation className="mr-3 h-8 w-8 text-blue-600" />
            Navigation Test Suite
          </h1>
          <p className="text-muted-foreground">Comprehensive routing verification for all application pages</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={runAllTests} disabled={isRunning} className="flex items-center">
            {isRunning ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Testing Routes...
              </>
            ) : (
              <>
                <Navigation className="mr-2 h-4 w-4" />
                Run All Tests
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{routes.length}</div>
            <p className="text-xs text-muted-foreground">Application routes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
            <p className="text-xs text-muted-foreground">Routes working correctly</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <p className="text-xs text-muted-foreground">Routes with issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Route Test Results</CardTitle>
          <CardDescription>
            Individual test results for each application route
            {isRunning && currentTest >= 0 && (
              <span className="ml-2 text-blue-600">Currently testing: {routes[currentTest]?.name}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routes.map((route, index) => (
              <div
                key={route.path}
                className={`flex items-center justify-between p-4 border rounded-lg transition-all ${getStatusColor(route.status)} ${
                  currentTest === index ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(route.status)}
                  <route.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{route.name}</div>
                    <div className="text-sm text-muted-foreground">{route.description}</div>
                    {route.error && <div className="text-sm text-red-600 mt-1">Error: {route.error}</div>}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="font-mono text-xs">
                    {route.path}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => testRoute(index)} disabled={isRunning}>
                    {route.status === "testing" ? "Testing..." : "Test Route"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Location Info */}
      <Card>
        <CardHeader>
          <CardTitle>Current Navigation State</CardTitle>
          <CardDescription>Information about the current page and routing state</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm font-medium mb-2">Current Pathname</div>
              <Badge variant="outline" className="font-mono">
                {pathname}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Window Location</div>
              <Badge variant="outline" className="font-mono">
                {typeof window !== "undefined" ? window.location.pathname : "N/A"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
