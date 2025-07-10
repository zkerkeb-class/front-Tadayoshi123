'use client';

import { PricingCard } from '@/components/ui/pricing-card';
import { useAppSelector } from '@/lib/store/hooks';

interface Plan {
    id: string;
    name: string;
    description: string;
    price: string;
    currency: string;
    features: string[];
    isCurrent?: boolean;
    priceId: string;
}

interface PricingClientPageProps {
    plans: Plan[];
}

export default function PricingClientPage({ plans: initialPlans }: PricingClientPageProps) {
    const { subscription } = useAppSelector((state) => state.payment);
    
    const plans = initialPlans.map(plan => ({
        ...plan,
        isCurrent: subscription?.plan?.id === plan.priceId,
    }));

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                    Pricing Plans
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                    Choose the perfect plan for your business. All plans include our AI-powered monitoring and dashboard generation.
                </p>
            </div>

            <div className="mt-16">
                {plans.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <PricingCard key={plan.id} plan={plan} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center">
                        <p>No pricing plans are available at the moment. Please check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
} 