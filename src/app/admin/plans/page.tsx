
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { plans as initialPlans, Plan } from "@/lib/data";
import { MoreHorizontal, PlusCircle, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const openEditDialog = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsEditDialogOpen(true);
  };

  const handleAddPlan = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newPlan: Plan = {
      id: `plan-${(formData.get("name") as string).toLowerCase()}`,
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      features: (formData.get("features") as string).split('\n'),
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
    
    const updatedPlan = {
      ...selectedPlan,
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      features: (formData.get("features") as string).split('\n'),
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
             <Card key={plan.id}>
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">{plan.name}</h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => openEditDialog(plan)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="mb-6">
                        <span className="text-4xl font-bold">KES {plan.price.toLocaleString()}</span>
                        <span className="text-muted-foreground">/month</span>
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
            </Card>
        ))}
      </div>


      {/* Add Plan Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Plan</DialogTitle>
            <DialogDescription>
              Create a new membership plan for your customers.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPlan}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input id="name" name="name" placeholder="e.g., Gold" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (KES per month)</Label>
                <Input id="price" name="price" type="number" max="15000" placeholder="e.g., 7500" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea id="features" name="features" placeholder="Access to all classes&#10;Towel service" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Add Plan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>
              Update the details for the {selectedPlan?.name} plan.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditPlan}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Plan Name</Label>
                <Input id="edit-name" name="name" defaultValue={selectedPlan?.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (KES per month)</Label>
                <Input id="edit-price" name="price" type="number" max="15000" defaultValue={selectedPlan?.price} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-features">Features (one per line)</Label>
                <Textarea id="edit-features" name="features" defaultValue={selectedPlan?.features.join('\n')} required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
