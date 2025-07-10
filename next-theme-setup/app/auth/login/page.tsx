"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Activity, Github, Mail, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/services/auth.service"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authService.login({ email, password })

      if (response.success) {
        toast({
          title: "Login successful",
          description: "Welcome back to SupervIA!",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: response.message || "Please check your credentials.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "An error occurred",
        description: error.message || "Unable to connect to the server.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      const response = await authService.getOAuthUrl(provider);

      const authUrl = response?.authUrl;
      const state = response?.state;

      if (authUrl && state) {
        sessionStorage.setItem(`oauth_state_${provider}`, state);
        window.location.href = authUrl;
      } else {
        console.error(`Réponse invalide du serveur pour ${provider}:`, response);
        throw new Error(`Could not retrieve a valid OAuth URL or state for ${provider}.`);
      }
    } catch (error: any) {
      console.error(`[LoginPage] OAuth login failed for ${provider}:`, error);
      toast({
        title: "Login Error",
        description: error.message || `Failed to initiate login with ${provider}.`,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleAuth0Login = async () => {
    setIsLoading(true);
    try {
      const response = await authService.getAuth0Url();
      
      const authUrl = response?.authUrl;
      const state = response?.state;

      if (authUrl && state) {
        sessionStorage.setItem('oauth_state_auth0', state);
        window.location.href = authUrl;
      } else {
        console.error("Réponse invalide du serveur pour Auth0 :", response);
        throw new Error('Could not retrieve a valid Auth0 URL.');
      }
    } catch (error: any) {
      console.error('[LoginPage] Auth0 login failed:', error);
      toast({
        title: "Login Error",
        description: error.message || 'Failed to initiate login with Auth0.',
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">SupervIA</span>
          </Link>
          <p className="text-sm text-muted-foreground">AI-powered infrastructure monitoring</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">Sign in to your SupervIA account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center justify-between">
                <Link href="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-primary">
                  Forgot password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => handleOAuthLogin('github')} disabled={isLoading}>
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" onClick={() => handleOAuthLogin('google')} disabled={isLoading}>
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
            
            <Button variant="outline" className="w-full" onClick={handleAuth0Login} disabled={isLoading}>
              <Lock className="mr-2 h-4 w-4" />
              Sign in with Auth0
            </Button>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
