'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ManageBillingButton } from '@/components/ui/manage-billing-button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function BillingPage() {
    const { subscription, loading, error } = useAppSelector((state) => state.payment);

    const renderSubscriptionDetails = () => {
        if (loading) {
            return <Skeleton className="h-24 w-full" />;
        }

        if (error) {
            return <p className="text-destructive">Error loading subscription details.</p>;
        }

        if (!subscription) {
            return (
                <div>
                    <p>You are not subscribed to any plan.</p>
                    <p className="text-muted-foreground text-sm">Visit the pricing page to choose a plan.</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">{subscription.plan.name}</p>
                        <p className="text-sm text-muted-foreground">
                            Next renewal: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                        </p>
                    </div>
                    <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                        {subscription.status}
                    </Badge>
                </div>
                <ManageBillingButton />
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Billing & Subscription</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Your Subscription</CardTitle>
                    <CardDescription>Manage your current subscription and billing details.</CardDescription>
                </CardHeader>
                <CardContent>
                    {renderSubscriptionDetails()}
                </CardContent>
            </Card>
        </div>
    );
} 