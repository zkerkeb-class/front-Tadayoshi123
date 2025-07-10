import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscribeButton } from "@/components/ui/subscribe-button";
import { CheckCircle } from "lucide-react";

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

interface PricingCardProps {
    plan: Plan;
}

export const PricingCard = ({ plan }: PricingCardProps) => {
    return (
        <Card className={`flex flex-col ${plan.isCurrent ? 'border-primary' : ''}`}>
            <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="ml-1 text-muted-foreground">/ month</span>
                </div>
                <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <SubscribeButton planId={plan.priceId} isCurrent={plan.isCurrent || false} />
            </CardFooter>
        </Card>
    );
}; 