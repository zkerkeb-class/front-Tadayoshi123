"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme, themes } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Add smooth transition class when theme changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.add("theme-transition")
      const timer = setTimeout(() => {
        document.documentElement.classList.remove("theme-transition")
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [theme, mounted])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem] animate-pulse" />
        <span className="sr-only">Loading theme...</span>
      </Button>
    )
  }

  const getThemeIcon = () => {
    switch (resolvedTheme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem]" />
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem]" />
      default:
        return <Monitor className="h-[1.2rem] w-[1.2rem]" />
    }
  }

  const getThemeLabel = (themeValue: string) => {
    switch (themeValue) {
      case "light":
        return "Light Mode"
      case "dark":
        return "Dark Mode"
      case "system":
        return "System Default"
      default:
        return themeValue
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative transition-all duration-200 hover:scale-105">
          {getThemeIcon()}
          <span className="sr-only">Toggle theme</span>
          {theme !== "system" && (
            <Badge variant="secondary" className="absolute -top-1 -right-1 h-2 w-2 p-0 border-2 border-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Theme Settings
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Light Mode</span>
          </div>
          {theme === "light" && (
            <Badge variant="default" className="text-xs">
              Active
            </Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>Dark Mode</span>
          </div>
          {theme === "dark" && (
            <Badge variant="default" className="text-xs">
              Active
            </Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>System Default</span>
          </div>
          {theme === "system" && (
            <Badge variant="default" className="text-xs">
              Active
            </Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          Current: {getThemeLabel(resolvedTheme || "system")}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
