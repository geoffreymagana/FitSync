
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";
import { classes, members, trainers } from "@/lib/data";
import { useMemo } from "react";
import Link from "next/link";

export default function InstructorDashboardPage() {
    const instructorName = "Juma Kalama"; // Example instructor
    const instructor = useMemo(() => trainers.find(t => t.name === instructorName), [instructorName]);

    const todaysClasses = useMemo(() => {
        const today = "2023-05-25"; // Mocking today's date for demo
        if (!instructor) return [];
        return classes.filter(c => c.trainer === instructor.name && c.date === today);
    }, [instructor]);
    
    const clientCount = useMemo(() => {
        // Mocking client assignment for demo
        return members.filter(m => ['M001', 'M004', 'M006'].includes(m.id)).length;
    }, []);

    if (!instructor) {
        return <div>Loading instructor data...</div>
    }

    return (
        <div className="space-y-8">
            <PageHeader title={`Welcome, ${instructor.name}!`} />

             <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todaysClasses.length}</div>
                        <p className="text-xs text-muted-foreground">classes scheduled for today</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{clientCount}</div>
                        <p className="text-xs text-muted-foreground">active clients assigned</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Today</CardTitle>
                </CardHeader>
                <CardContent>
                    {todaysClasses.length > 0 ? (
                        <div className="space-y-4">
                            {todaysClasses.map(cls => (
                                <Link key={cls.id} href={`/instructor/schedule`}>
                                <div  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted">
                                    <div>
                                        <p className="font-semibold">{cls.name}</p>
                                        <p className="text-sm text-muted-foreground">{cls.time}</p>
                                    </div>
                                    <Badge variant={cls.booked >= cls.spots ? "destructive" : "default"}>
                                        {cls.booked} / {cls.spots} booked
                                    </Badge>
                                </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">You have no classes scheduled for today.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
