"use client"

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const processedRef = useRef(false);

  const provider = Array.isArray(params.provider) ? params.provider[0] : params.provider;

  useEffect(() => {
    if (!provider || processedRef.current) {
      return;
    }
    processedRef.current = true;

    const processOAuth = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      
      const storedState = sessionStorage.getItem(`oauth_state_${provider}`);

      if (!code || !state) {
        setError("Code d'autorisation ou état manquant dans l'URL de retour.");
        return;
      }
      
      if (!storedState) {
        setError("L'état de sécurité de la session est introuvable. Veuillez réessayer.");
        return;
      }

      try {
        await authService.handleOAuthCallback(provider, code, state, storedState);
        
        sessionStorage.removeItem(`oauth_state_${provider}`);

        toast({
          title: "Connexion réussie!",
          description: `Bienvenue via ${provider}.`,
        });
        router.push('/dashboard');
      } catch (e: any) {
        setError(e.message || "Une erreur inconnue est survenue lors de l'authentification.");
        toast({
          title: "Échec de l'authentification",
          description: e.message || `Impossible de se connecter avec ${provider}.`,
          variant: "destructive",
        });
        setTimeout(() => router.push('/auth/login'), 3000);
      }
    };

    processOAuth();

  }, [router, searchParams, toast, provider]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Erreur d'authentification</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => router.push('/auth/login')}>Retour à la connexion</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Finalisation de l'authentification...</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OAuthCallback />
        </Suspense>
    );
} 