'use client';

import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '@/lib/store/hooks';
import { useToast } from '@/hooks/use-toast';
import type { Alert } from '@/lib/types/dashboard'; // Je suppose qu'un type Alert existe

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const authToken = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    // Ne pas tenter de se connecter si l'URL n'est pas définie ou si l'utilisateur n'est pas authentifié
    const notificationServiceUrl = process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL;
    if (!notificationServiceUrl || !authToken) {
      return;
    }

    const socket: Socket = io(notificationServiceUrl, {
      path: '/ws', // Assurez-vous que cela correspond à la configuration de votre serveur
      transports: ['websocket'],
      auth: {
        token: authToken,
      },
    });

    socket.on('connect', () => {
      console.log('Socket.IO connected:', socket.id);
      // L'utilisateur peut rejoindre une "room" basée sur son ID pour des notifications ciblées
      // const userId = "get_user_id_from_store";
      // socket.emit('subscribe', `user:${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    // Écouteur pour les nouvelles alertes
    socket.on('new_alert', (alert: Alert) => {
      console.log('New alert received:', alert);
      toast({
        variant: alert.severity === 'critical' ? 'destructive' : 'default',
        title: `Alerte ${alert.severity}: ${alert.service}`,
        description: alert.message,
      });
    });

    // Écouteur pour les alertes résolues
    socket.on('alert_resolved', (alert: Alert) => {
      console.log('Alert resolved:', alert);
      toast({
        variant: 'default',
        title: `Alerte Résolue: ${alert.service}`,
        description: `${alert.alertName} est maintenant résolue.`,
      });
    });

    // Gestion des erreurs de connexion
    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
    });

    // Nettoyage à la déconnexion du composant
    return () => {
      socket.disconnect();
    };
  }, [authToken, toast]);

  return <>{children}</>;
} 