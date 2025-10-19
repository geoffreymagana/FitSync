

"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { plans as initialPlans, Plan } from "@/lib/data";
import { MoreHorizontal, PlusCircle, Check, X } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";

function PlanCard({ plan, onEdit, onToggleStatus }: { plan: Plan; onEdit: (plan: Plan) => void; onToggleStatus: (planId: string) => void; }) {
  const [memberCount, setMemberCount] = useState<number | null>(null);

  useEffect(() => {
    // Generate random number only on the client
    setMemberCount(Math.floor(Math.random() * 50) + 5);
  }, []);

  return (
    <Card key={plan.id} className="flex flex-col">
      <CardContent className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <Badge variant={plan.status === 'Active' ? 'default' : 'secondary'} className={plan.status === 'Active' ? 'bg-green-500' : ''}>
              {plan.status}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(plan)}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onToggleStatus(plan.id)}>
                {plan.status === 'Active' ? <><X className="mr-2 h-4 w-4" />Deactivate</> : <><Check className="mr-2 h-4 w-4" />Activate</>}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mb-6">
          <span className="text-4xl font-bold">KES {plan.price.toLocaleString()}</span>
          <span className="text-muted-foreground">{plan.type === 'subscription' ? '/month' : ` for ${plan.checkIns} check-ins`}</span>
        </div>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/admin/subscriptions?plan=${plan.id}`}>
            View Members {memberCount !== null ? `(${memberCount})` : ''}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const openEditDialog = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsEditDialogOpen(true);
  };

  const handleToggleStatus = (planId: string) => {
    setPlans(prev => prev.map(p =>
      p.id === planId ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p
    ));
  };

  const handleAddPlan = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const planType = formData.get("type") as 'subscription' | 'pay-per-use';

    const newPlan: Plan = {
      id: `plan-${(formData.get("name") as string).toLowerCase().replace(' ', '-')}`,
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      features: (formData.get("features") as string).split('\n'),
      type: planType,
      checkIns: planType === 'pay-per-use' ? Number(formData.get("checkIns")) : undefined,
      status: 'Active',
    };
    setPlans([...plans, newPlan]);
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleEditPlan = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedPlan) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const planType = formData.get("type") as 'subscription' | 'pay-per-use';

    const updatedPlan: Plan = {
      ...selectedPlan,
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      features: (formData.get("features") as string).split('\n'),
      type: planType,
      checkIns: planType === 'pay-per-use' ? Number(formData.get("checkIns")) : undefined,
    };

    setPlans(plans.map(p => p.id === selectedPlan.id ? updatedPlan : p));
    setIsEditDialogOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Membership Plans">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2" />
          Add Plan
        </Button>
      </PageHeader>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {plans.map(plan => (
          <PlanCard 
            key={plan.id}
            plan={plan}
            onEdit={openEditDialog}
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </div>

      <PlanFormDialog
        title="Add New Plan"
        description="Create a new membership plan for your customers."
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddPlan}
      />
      <PlanFormDialog
        title="Edit Plan"
        description="Update the details for this plan."
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditPlan}
        plan={selectedPlan}
      />

    </div>
  );
}

interface PlanFormDialogProps {
  title: string;
  description: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  plan?: Plan | null;
}

function PlanFormDialog({ title, description, isOpen, onOpenChange, onSubmit, plan }: PlanFormDialogProps) {
  const [planType, setPlanType] = useState(plan?.type || 'subscription');

  useEffect(() => {
    if (plan) {
      setPlanType(plan.type);
    } else {
      setPlanType('subscription');
    }
  }, [plan, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Plan Type</Label>
              <RadioGroup name="type" value={planType} onValueChange={(value) => setPlanType(value as 'subscription' | 'pay-per-use')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="subscription" id="r1" />
                  <Label htmlFor="r1">Subscription</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pay-per-use" id="r2" />
                  <Label htmlFor="r2">Pay-Per-Use</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input id="name" name="name" placeholder="e.g., Gold, 10-Session Pass" defaultValue={plan?.name} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Total Price (KES)</Label>
                <Input id="price" name="price" type="number" max="15000" placeholder="e.g., 7500" defaultValue={plan?.price} required />
              </div>
              {planType === 'pay-per-use' && (
                <div className="space-y-2">
                  <Label htmlFor="checkIns">Number of Check-ins</Label>
                  <Input id="checkIns" name="checkIns" type="number" placeholder="e.g., 10" defaultValue={plan?.checkIns} required />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea id="features" name="features" placeholder="Access to all classes\nTowel service" defaultValue={plan?.features.join('\n')} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save Plan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
