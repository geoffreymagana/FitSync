
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { fitSyncPlans } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { PlanCard } from "@/components/plan-card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AdminBillingPage() {
    const { toast } = useToast();
    const currentPlanId = "fitsync-pro";

    const handleSelectPlan = (planId: string) => {
        toast({
            title: "Action required",
            description: `Please contact support to change your plan to ${planId}.`,
        });
    }

    return (
        <div className="space-y-8">
            <PageHeader title="FitSync Subscription">
                 <Button asChild variant="outline">
                    <Link href="/admin/settings">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Settings
                    </Link>
                </Button>
            </PageHeader>
            <p className="text-muted-foreground">
                Choose the best plan for your gym. To upgrade or downgrade, please select a plan and contact support.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {fitSyncPlans.map(plan => (
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

    