"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.service';

export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithAuthComponent = (props: P) => {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
      // Cette vérification ne s'exécute que côté client.
      if (!authService.isAuthenticated()) {
        router.replace('/auth/login');
      } else {
        setIsVerified(true);
      }
    }, [router]);

    // Tant que la vérification n'est pas faite, on ne rend rien (ou un loader).
    // Cela évite les erreurs de rendu entre le serveur et le client.
    if (!isVerified) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
} 