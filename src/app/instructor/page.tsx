
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users } from "lucide-react";
import { classes as initialClasses, members, trainers } from "@/lib/data";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Class } from "@/lib/types";
import { isToday, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

const CLASSES_STORAGE_KEY = 'fitsync_all_classes';

export default function InstructorDashboardPage() {
    const [allClasses, setAllClasses] = useState<Class[]>(initialClasses);
    const instructorName = "Juma Kalama"; // Example instructor
    const instructor = useMemo(() => trainers.find(t => t.name === instructorName), [instructorName]);

     useEffect(() => {
        const storedClasses = localStorage.getItem(CLASSES_STORAGE_KEY);
        if (storedClasses) {
            try {
                setAllClasses(JSON.parse(storedClasses));
            } catch (e) {
                console.error("Failed to parse classes from local storage", e);
            }
        }
    }, []);

    const classColors: { [key: string]: string } = useMemo(() => {
        const uniqueNames = [...new Set(allClasses.map(c => c.name))];
        const colors = ["border-blue-500", "border-green-500", "border-yellow-500", "border-purple-500", "border-pink-500", "border-indigo-500", "border-red-500"];
        return uniqueNames.reduce((acc, name, index) => {
            acc[name] = colors[index % colors.length];
            return acc;
        }, {} as { [key: string]: string });
    }, [allClasses]);

    const todaysClasses = useMemo(() => {
        if (!instructor) return [];
        return allClasses.filter(c => 
            c.trainer === instructor.name && 
            c.status === 'Approved' &&
            isToday(parseISO(c.date))
        ).sort((a, b) => a.time.localeCompare(b.time));
    }, [instructor, allClasses]);
    
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
                        <div className="flex flex-col gap-2">
                            {todaysClasses.map(cls => (
                                <Link key={cls.id} href={`/instructor/schedule/${cls.id}`}>
                                <div  className={cn("flex items-center justify-between p-3 rounded-lg hover:bg-muted border-l-4", classColors[cls.name] || 'border-gray-500')}>
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
                        <p className="text-muted-foreground text-center py-4">You have no classes scheduled for today.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
