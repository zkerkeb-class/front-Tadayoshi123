"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

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

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light")
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="transition-all duration-200 hover:scale-105">
      {resolvedTheme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-transform duration-200" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-200" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
