
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { payments } from "@/lib/data";
import { CreditCard, Plus, Crown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function MemberBillingPage() {
    const { toast } = useToast();
    const memberPayments = payments.filter(p => p.memberId === 'M001'); // Example filter

    const handleMpesaPay = () => {
        toast({
            title: "Processing Payment",
            description: "A push notification has been sent to your phone. Please complete the payment.",
        });
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <PageHeader title="Billing & Membership" />

            <Card>
                <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="flex items-center gap-2 text-lg font-semibold">
                                <Crown className="w-5 h-5 text-yellow-500" />
                                <span>Premium Plan</span>
                            </p>
                            <p className="text-muted-foreground">KES 5,000 / month</p>
                            <p className="text-sm text-muted-foreground mt-1">Next payment on: 2024-08-01</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button onClick={handleMpesaPay}>Pay with M-Pesa</Button>
                    <Button variant="outline">Change Plan</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                        <CreditCard className="w-8 h-8" />
                        <div>
                            <p className="font-semibold">Visa ending in 1234</p>
                            <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">Remove</Button>
                    </div>
                </CardContent>
                <CardFooter>
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Payment Method
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Payment Method</DialogTitle>
                                <DialogDescription>Enter your card details.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="card-number">Card Number</Label>
                                    <Input id="card-number" placeholder="**** **** **** ****" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiry</Label>
                                        <Input id="expiry" placeholder="MM/YY" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvc">CVC</Label>
                                        <Input id="cvc" placeholder="123" />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Card</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {memberPayments.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        <Link href={`/member/billing/${p.id}`} className="hover:underline">
                                            {p.date}
                                        </Link>
                                    </TableCell>
                                    <TableCell>Premium Plan Membership</TableCell>
                                    <TableCell className="text-right">KES {p.amount.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}
