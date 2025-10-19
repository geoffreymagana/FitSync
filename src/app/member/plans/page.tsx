
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { plans } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { PlanCard } from "@/components/plan-card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function MemberPlansPage() {
    const { toast } = useToast();
    const currentPlanId = "plan-premium";

    const handleSelectPlan = (planId: string) => {
        const selectedPlan = plans.find(p => p.id === planId);
        toast({
            title: "Plan Changed",
            description: `Your plan has been successfully changed to ${selectedPlan?.name}.`,
        });
        // Here you would typically redirect or update state
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <PageHeader title="Browse Membership Plans">
                 <Button asChild variant="outline">
                    <Link href="/member/billing">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Billing
                    </Link>
                </Button>
            </PageHeader>
            <p className="text-muted-foreground">
                Choose the best plan for your fitness journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map(plan => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        currentPlanId={currentPlanId}
                        onSelect={handleSelectPlan}
                    />
                ))}
            </div>
        </div>
    );
}

    