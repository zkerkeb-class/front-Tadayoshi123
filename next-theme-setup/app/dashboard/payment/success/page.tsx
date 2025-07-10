'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/lib/store/hooks';
import { fetchSubscriptionStatus } from '@/lib/store/slices/paymentSlice';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (sessionId) {
            // Re-fetch subscription status to get the latest data
            dispatch(fetchSubscriptionStatus());
        }
    }, [dispatch, sessionId]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-6">
                Thank you for subscribing. Your plan is now active.
            </p>
            <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
        </div>
    );
} 