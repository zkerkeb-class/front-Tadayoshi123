import { getPlans } from '@/lib/services/payment.service';
import { Metadata } from 'next';
import PricingClientPage from './pricing-client-page';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
    title: 'Pricing - SupervIA',
    description: 'Choose the best plan for your needs.',
};

const renderSkeletons = () => (
    Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    ))
);

export default async function PricingPage() {
    let plans = [];
    let error = null;

    try {
        const data = await getPlans();
        
        // Temp: map raw stripe data to what component expects
        plans = data.map((plan: any) => ({
            id: plan.id,
            name: plan.nickname,
            description: plan.metadata.description || 'No description',
            price: (plan.unit_amount / 100).toFixed(2),
            currency: plan.currency.toUpperCase(),
            features: plan.metadata.features ? plan.metadata.features.split(', ') : [],
            priceId: plan.id, // The plan object from stripe is the price object
            isCurrent: false, // This needs to be fetched from user's subscription status
        }));

    } catch (e: any) {
        error = e.message || 'Failed to load pricing plans.';
        console.error(error);
    }

    if (error) {
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
                <div className="mt-12 text-center text-red-500">
                    <p>Could not load pricing plans. Please try again later.</p>
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            </div>
        )
    }
    
    // The Suspense boundary should be in a parent component
    // For now, we will just show the client page
    return <PricingClientPage plans={plans} />;
} 