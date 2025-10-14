

"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dumbbell, Users, Activity, BarChart3, ArrowRight } from "lucide-react";
import { LocationSwitcher } from "@/components/location-switcher";
import { useState, useMemo } from "react";
import { locations, members, trainers, payments } from "@/lib/data";
import { RecentTransactions } from "@/components/admin/recent-transactions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RecentTransactions } from "@/components/admin/recent-transactions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboardPage() {
    const [selectedLocation, setSelectedLocation] = useState(locations[0].id);

    const locationData = useMemo(() => {
        const locationMembers = members.filter(m => m.locationId === selectedLocation);
        const locationTrainers = trainers.filter(t => t.locationId === selectedLocation);
        const locationPayments = payments.filter(p => p.locationId === selectedLocation && p.status === 'Paid');

        const totalMembers = locationMembers.length;
        const activeMembers = locationMembers.filter(m => m.status === 'Active').length;
        const trainersOnDuty = locationTrainers.filter(t => t.status === 'On-Duty').length;
        const totalTrainers = locationTrainers.length;
        const monthlyRevenue = locationPayments.reduce((sum, p) => sum + p.amount, 0);

        return {
            totalMembers,
            activeMembers,
            trainersOnDuty,
            totalTrainers,
            monthlyRevenue
        }
    }, [selectedLocation]);


    return (
        <div className="space-y-8">
            <PageHeader title="Admin Dashboard">
                <LocationSwitcher selectedLocation={selectedLocation} onLocationChange={setSelectedLocation} />
            </PageHeader>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{locationData.totalMembers}</div>
                        <p className="text-xs text-muted-foreground">in this location</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{locationData.activeMembers}</div>
                         <p className="text-xs text-muted-foreground">out of {locationData.totalMembers} total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trainers On-Duty</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{locationData.trainersOnDuty}</div>
                        <p className="text-xs text-muted-foreground">out of {locationData.totalTrainers} total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">KES {locationData.monthlyRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">from this location</p>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>
                            The latest membership payments and walk-in sales.
                        </CardDescription>
                    </div>
                    <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href="/admin/payments">
                        View All
                        <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <RecentTransactions locationId={selectedLocation} />
                </CardContent>
            </Card>
        </div>
    );
}
