"use client"

import type React from "react"
import { useState, useEffect } from "react"
import withAuth from "@/components/auth/withAuth"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useAppDispatch } from '@/lib/store/hooks'
import { fetchSubscriptionStatus } from '@/lib/store/slices/paymentSlice'

interface DashboardLayoutProps {
  children: React.ReactNode
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  // TODO: Get user data from auth context or API
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: undefined,
  }

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSubscriptionStatus());
  }, [dispatch]);

  const [isCollapsed, setCollapsed] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  const toggleSidebar = () => {
    setCollapsed(!isCollapsed)
  }

  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Mes Dashboards",
      href: "/dashboard/my-dashboards",
      icon: "folder",
    },
    {
      title: "Editor",
      href: "/dashboard/editor",
      icon: "edit",
    },
    {
      title: "Assistant",
      href: "/dashboard/assistant",
      icon: "bot",
    },
    {
      title: "Alerts",
      href: "/dashboard/alerts",
      icon: "alert",
    },
    {
      title: "Metrics",
      href: "/dashboard/metrics",
      icon: "chart",
    },
    {
      title: "Infrastructure",
      href: "/dashboard/infrastructure",
      icon: "server",
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: "users",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ]

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-background">
      <div className={`h-full border-r bg-background transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"} ${isMobile ? 'fixed z-30' : ''}`}>
        <DashboardSidebar isCollapsed={isCollapsed} />
      </div>
      
      <div className={`flex flex-col flex-1 h-full ${isMobile && !isCollapsed ? 'ml-20' : isCollapsed ? 'ml-20' : ''}`}>
        <DashboardHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-auto p-3 md:p-6">{children}</main>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && !isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  )
}

export default withAuth(DashboardLayout)
