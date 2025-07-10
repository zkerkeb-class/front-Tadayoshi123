"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/services/auth.service"

// Il faudrait créer un service dédié pour le callback OAuth
// mais pour l'instant, nous le mettons ici.
async function handleOAuthCallback(provider: string, code: string) {
  // Cette fonction devrait être dans auth.service.ts
  // const response = await apiClient.post(`/oauth/${provider}/callback`, { code });
  // if (response.success) {
  //   authService.storeTokens(response.data.accessToken, response.data.refreshToken);
  // }
  // return response;

  // Pour l'instant, on simule le succès et on stocke des tokens factices
  console.log(`Handling OAuth callback for ${provider} with code ${code}`);
  localStorage.setItem("supervia_token", "fake_oauth_access_token");
  localStorage.setItem("supervia_refresh_token", "fake_oauth_refresh_token");
}


export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const code = searchParams.get("code")
    const error = searchParams.get("error")
    const provider = sessionStorage.getItem('oauth_provider');

    if (error) {
      toast({
        title: "Authentication Failed",
        description: error,
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    if (code && provider) {
      authService.handleOAuthCallback(provider, code)
        .then((response) => {
          if (response.success) {
            toast({
              title: "Logged in successfully!",
              description: "Welcome to your dashboard.",
            });
            router.push("/dashboard");
          } else {
            throw new Error(response.message || 'OAuth callback failed');
          }
        })
        .catch((err) => {
          toast({
            title: "Authentication Failed",
            description: err.message || "An unknown error occurred.",
            variant: "destructive",
          });
          router.push("/auth/login");
        })
        .finally(() => {
          sessionStorage.removeItem('oauth_provider');
        });
    } else {
        // Rediriger si le code ou le provider est manquant
        router.push("/auth/login");
    }
  }, [router, searchParams, toast])

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <p className="text-lg">Finalizing your authentication...</p>
        <p className="text-sm text-muted-foreground">Please wait while we securely log you in.</p>
      </div>
    </div>
  )
} 