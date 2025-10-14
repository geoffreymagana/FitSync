
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QrCode, CheckCircle, CalendarDays } from "lucide-react";
import { recentActivities } from "@/lib/data";
import { useMemo, useState, useEffect } from "react";
import { differenceInHours, format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Activity } from "@/lib/types";

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

export default function MemberCheckInPage() {
    const memberId = "M001"; // Example member ID

    const { isCheckedIn, checkInHistory } = useMemo(() => {
        const memberCheckIns = recentActivities
            .filter(activity => activity.member.id === memberId && activity.description.includes('Checked in'))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        const lastCheckIn = memberCheckIns[0];
        const checkedIn = lastCheckIn ? differenceInHours(new Date(), parseISO(lastCheckIn.timestamp)) < 24 : false;
        
        return { isCheckedIn: checkedIn, checkInHistory: memberCheckIns.slice(0, 5) };
    }, [memberId]);

    return (
        <div className="p-4 md:p-6 space-y-6">
            <PageHeader title="Check-in QR Code" />
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Your Personal QR Code</CardTitle>
                            <CardDescription>Present this code at the reception to check in.</CardDescription>
                        </div>
                         {isCheckedIn && (
                            <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Checked-In
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                         <QrCode className="w-48 h-48" />
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">Member ID: {memberId}</p>
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
        </div>
    );
}
