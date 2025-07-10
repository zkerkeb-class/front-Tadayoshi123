"use client"

import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ThemeSwitcher } from "./theme-switcher"
import { CheckCircle, Info, Sun } from "lucide-react"

export function ThemeTest() {
  const { theme, resolvedTheme, themes } = useTheme()

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Theme System Test
          </CardTitle>
          <CardDescription>Testing light and dark mode implementation across all components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <div className="space-y-1">
              <p className="text-sm font-medium">Current Theme: {theme}</p>
              <p className="text-xs text-muted-foreground">Resolved: {resolvedTheme}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-dashed">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span className="text-sm">Primary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-secondary rounded"></div>
                    <span className="text-sm">Secondary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <span className="text-sm">Muted</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Components</h4>
                <div className="space-y-2">
                  <Button size="sm" className="w-full">
                    Button
                  </Button>
                  <Badge variant="secondary">Badge</Badge>
                  <Progress value={60} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">States</h4>
                <div className="space-y-2">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>Info alert</AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Theme Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Persistent theme storage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>System theme detection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Smooth transitions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>SSR compatibility</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
