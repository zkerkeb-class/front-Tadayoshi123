'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/lib/services/payment.service';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';

interface SubscribeButtonProps {
    planId: string;
    isCurrent: boolean;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const SubscribeButton = ({ planId, isCurrent }: SubscribeButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const session = await createCheckoutSession(planId);
            const stripe = await stripePromise;
            if (stripe) {
                const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
                if (error) {
                    toast({
                        title: 'Error',
                        description: error.message,
                        variant: 'destructive',
                    });
                }
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to create subscription.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            className="w-full"
            onClick={handleSubscribe}
            disabled={isLoading || isCurrent}
        >
            {isLoading ? 'Processing...' : (isCurrent ? 'Current Plan' : 'Subscribe')}
        </Button>
    );
}; 