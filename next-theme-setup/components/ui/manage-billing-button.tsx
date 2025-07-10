'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createPortalSession } from '@/lib/services/payment.service';
import { useToast } from '@/hooks/use-toast';

export const ManageBillingButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleManageBilling = async () => {
        setIsLoading(true);
        try {
            const { url } = await createPortalSession();
            window.location.href = url;
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Could not open billing portal. Please try again.',
                variant: 'destructive',
            });
            setIsLoading(false);
        }
    };

    return (
        <Button onClick={handleManageBilling} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Manage Billing & Subscription'}
        </Button>
    );
}; 