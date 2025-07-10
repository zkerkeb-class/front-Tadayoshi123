'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch } from '@/lib/store/hooks';
import { verifyEmail } from '@/lib/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type VerificationStatus = 'verifying' | 'success' | 'error';

function VerifyEmailComponent() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [message, setMessage] = useState('Nous vérifions votre adresse e-mail...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Le lien de vérification est invalide ou manquant.');
      return;
    }

    const verifyToken = async () => {
      try {
        // Le thunk retourne une "fulfilled" ou "rejected" action
        const resultAction = await dispatch(verifyEmail(token));
        if (verifyEmail.fulfilled.match(resultAction)) {
          setStatus('success');
          setMessage(resultAction.payload.message || 'Votre adresse e-mail a été vérifiée avec succès !');
        } else {
          setStatus('error');
          setMessage((resultAction.payload as string) || 'Une erreur est survenue lors de la vérification.');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage('Une erreur inattendue est survenue.');
      }
    };

    verifyToken();
  }, [token, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Vérification de l'E-mail</CardTitle>
          <CardDescription>
            {status === 'verifying' && 'Un instant...'}
            {status === 'success' && 'Vérification terminée !'}
            {status === 'error' && 'Une erreur est survenue'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="mb-4">{message}</p>
            {status !== 'verifying' && (
              <Button asChild>
                <Link href="/auth/login">Se connecter</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Chargement...</div>}>
            <VerifyEmailComponent />
        </Suspense>
    )
} 