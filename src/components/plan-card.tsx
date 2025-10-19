
"use client";

import { Plan } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlanCardProps {
    plan: Plan;
    currentPlanId?: string;
    onSelect?: (planId: string) => void;
}

export function PlanCard({ plan, currentPlanId, onSelect }: PlanCardProps) {
    const { toast } = useToast();
    const isCurrent = plan.id === currentPlanId;

    const handleSelectPlan = () => {
        if (onSelect) {
            onSelect(plan.id);
            toast({
                title: "Plan Selected",
                description: `You have selected the ${plan.name} plan.`,
            });
        }
    };

    return (
        <Card className={`flex flex-col ${isCurrent ? 'border-primary ring-2 ring-primary' : ''}`}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                        {plan.name === 'VIP' && <Crown className="w-5 h-5 text-yellow-500" />}
                        {plan.name}
                    </CardTitle>
                    {isCurrent && <Badge>Current Plan</Badge>}
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">KES {plan.price.toLocaleString()}</span>
                    <span className="text-muted-foreground">{plan.type === 'subscription' ? '/month' : `for ${plan.checkIns} check-ins`}</span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={handleSelectPlan}
                    disabled={isCurrent}
                >
                    {isCurrent ? "Current Plan" : "Select Plan"}
                </Button>
            </CardFooter>
        </Card>
    );
}
