"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, Settings, User, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useMediaQuery } from "@/hooks/use-media-query"
import { authService } from "@/lib/services/auth.service"

interface DashboardHeaderProps {
  onToggleSidebar?: () => void
}

interface AuthenticatedUser {
  name: string
  email: string
}

export function DashboardHeader({ onToggleSidebar }: DashboardHeaderProps) {
  const isMobile = useMediaQuery("(max-width: 640px)")
  const router = useRouter()
  const [user, setUser] = useState<AuthenticatedUser | null>(null)

  useEffect(() => {
    if (authService.isAuthenticated()) {
      const decodedToken = authService.decodeToken();
      if (decodedToken) {
        setUser({ 
          name: `${decodedToken.firstName || ''} ${decodedToken.lastName || ''}`.trim() || decodedToken.email, 
          email: decodedToken.email 
        });
      }
    }
  }, [])

  const handleLogout = () => {
    authService.logout()
    router.push("/auth/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-200">
      <div className="flex h-14 md:h-16 items-center justify-between px-3 md:px-4">
        {/* Left section */}
        <div className="flex items-center gap-2 md:gap-4">
          {onToggleSidebar && (
            <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search dashboards, metrics..."
                className="w-full pl-10 bg-muted/50 border-0 focus-visible:bg-background transition-colors duration-200"
              />
            </div>
          </div>
          
          {/* Mobile search button */}
          {isMobile && (
            <Button variant="ghost" size="icon" className="ml-auto mr-1">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              3
            </Badge>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-bold">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={() => router.push('/auth/login')}>
              Sign In
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile search bar (conditionally rendered) */}
      {isMobile && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-full pl-10 bg-muted/50 border-0 h-9 focus-visible:bg-background transition-colors duration-200"
            />
          </div>
        </div>
      )}
    </header>
  )
}
