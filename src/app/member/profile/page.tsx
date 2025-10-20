
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dumbbell, Target, BarChart, Settings, CreditCard, ChevronRight, LogOut, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { recentActivities, members, locations } from "@/lib/data";
import { useMemo, useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Activity } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";


// Client-side component to prevent hydration mismatch
function CheckInRow({ activity }: { activity: Activity }) {
    const [formattedTime, setFormattedTime] = useState('');

    useEffect(() => {
        setFormattedTime(format(parseISO(activity.timestamp), "p"));
    }, [activity.timestamp]);

    return (
        <TableRow>
            <TableCell>{format(parseISO(activity.timestamp), "PPP")}</TableCell>
            <TableCell>{formattedTime}</TableCell>
        </TableRow>
    );
}

export default function MemberProfilePage() {
    const memberId = "M001"; // Example member ID
    const { toast } = useToast();
    
    const member = useMemo(() => members.find(m => m.id === memberId), [memberId]);
    const location = useMemo(() => locations.find(l => l.id === member?.locationId), [member]);

    const checkInHistory = useMemo(() => {
        return recentActivities
            .filter(activity => activity.member.id === memberId && activity.description.includes('Checked in'))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5);
    }, [memberId]);

    const handleTrackerToggle = (trackerName: string, connected: boolean) => {
        toast({
            title: `${trackerName} ${connected ? 'Connected' : 'Disconnected'}`,
            description: `Successfully ${connected ? 'connected to' : 'disconnected from'} ${trackerName}.`,
        });
    }

    if (!member) {
        return null;
    }

    return (
       <div className="p-4 md:p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                    <AvatarImage src={member.avatarUrl} data-ai-hint="person smiling" />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl font-bold">{member.name}</h1>
                    <p className="text-muted-foreground capitalize">{member.plan} Member</p>
                    {location && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3"/>
                            {location.name}
                        </div>
                    )}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Activity</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <Dumbbell className="w-6 h-6 mx-auto mb-1 text-primary" />
                        <p className="font-bold">28</p>
                        <p className="text-xs text-muted-foreground">Workouts</p>
                    </div>
                     <div>
                        <BarChart className="w-6 h-6 mx-auto mb-1 text-primary" />
                        <p className="font-bold">45</p>
                        <p className="text-xs text-muted-foreground">Avg. Mins</p>
                    </div>
                     <div>
                        <Target className="w-6 h-6 mx-auto mb-1 text-primary" />
                        <p className="font-bold">12</p>
                        <p className="text-xs text-muted-foreground">Goals Met</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Weekly Goal</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm">Workouts Completed</p>
                        <p className="text-sm font-bold">3 / 5</p>
                    </div>
                    <Progress value={60} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Fitness Trackers</CardTitle>
                    <CardDescription>Connect your health apps to sync your workout data automatically.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <Image src="data:image/png;base64,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" alt="Google Health Connect Logo" width={40} height={40} />
                            <p className="font-semibold">Google Health Connect</p>
                        </div>
                        <Switch onCheckedChange={(c) => handleTrackerToggle("Google Health", c)} />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <Image src="data:image/png;base64,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" alt="Apple Health Logo" width={40} height={40} />
                            <p className="font-semibold">Apple Health</p>
                        </div>
                        <Switch onCheckedChange={(c) => handleTrackerToggle("Apple Health", c)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-primary" />
                        Recent Check-ins
                    </CardTitle>
                    <CardDescription>Your last 5 check-in records.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {checkInHistory.length > 0 ? (
                                checkInHistory.map(activity => (
                                    <CheckInRow key={activity.id} activity={activity} />
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center h-24">No check-in history found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div>
                <Link href="/member/billing" className="flex items-center justify-between p-4 rounded-lg hover:bg-accent">
                    <div className="flex items-center gap-4">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">Billing & Plans</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
                <Separator />
                 <Link href="/member/settings" className="flex items-center justify-between p-4 rounded-lg hover:bg-accent">
                    <div className="flex items-center gap-4">
                        <Settings className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">Settings</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
            </div>
            
            <div className="pt-4">
                 <Button variant="destructive" className="w-full" asChild>
                    <Link href="/">Log Out</Link>
                </Button>
            </div>
        </div>
    );
}
