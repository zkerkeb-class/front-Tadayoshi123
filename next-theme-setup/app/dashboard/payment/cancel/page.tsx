'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentCancelPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <XCircle className="h-16 w-16 text-destructive mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
            <p className="text-muted-foreground mb-6">
                Your payment process was cancelled. You have not been charged.
            </p>
            <div className="flex gap-4">
                <Button asChild>
                    <Link href="/dashboard/pricing">View Pricing Plans</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
            </div>
        </div>
    );
} 