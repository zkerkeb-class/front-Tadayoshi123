"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/services/auth.service';

function Auth0Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    const handleCallback = async () => {
      if (error) {
        toast({
          title: 'Authentication Error',
          description: errorDescription || error,
          variant: 'destructive',
        });
        router.push('/auth/login');
        return;
      }

      if (!code || !state) {
        toast({
          title: 'Authentication Failed',
          description: 'Could not get authorization code or state from Auth0.',
          variant: 'destructive',
        });
        router.push('/auth/login');
        return;
      }

      const storedState = sessionStorage.getItem('oauth_state_auth0');
      sessionStorage.removeItem('oauth_state_auth0'); // Clean up state

      try {
        // @ts-ignore - Le service sera mis à jour
        const response = await authService.handleAuth0Callback(code, state, storedState);
        
        if (response.success) {
          toast({
            title: 'Login Successful',
            description: 'Welcome to SupervIA!',
          });
          router.push('/dashboard');
        } else {
          throw new Error(response.error?.message || 'An unknown error occurred.');
        }
      } catch (err: any) {
        toast({
          title: 'Authentication Failed',
          description: err.message || 'An error occurred during authentication.',
          variant: 'destructive',
        });
        router.push('/auth/login');
      }
    };

    handleCallback();
  }, [searchParams, router, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Authenticating with Auth0, please wait...</p>
    </div>
  );
}

export default function Auth0CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Auth0Callback />
    </Suspense>
  )
} 