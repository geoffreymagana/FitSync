

"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { classes as initialClasses, members } from "@/lib/data";
import { Class } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Video, Link as LinkIcon, Wallet, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const LOCAL_STORAGE_KEY = 'fitsync_all_classes';

export default function InstructorClassDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;
  
  const [cls, setCls] = useState<Class | undefined>(undefined);

  useEffect(() => {
    let allKnownClasses = initialClasses;
    if (typeof window !== 'undefined') {
        const storedClasses = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedClasses) {
            try {
                allKnownClasses = JSON.parse(storedClasses);
            } catch (e) {
                console.error("Failed to parse classes from local storage", e);
            }
        }
    }
    const foundClass = allKnownClasses.find(i => i.id === classId);
    setCls(foundClass);
  }, [classId]);

  if (!cls) {
    return null; 
  }
  
  // Mock booked members
  const bookedMembers = members.slice(0, cls.booked);

  return (
    <div className="space-y-8">
      <PageHeader title={cls.name}>
        <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
                <Link href="/instructor/schedule">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Schedule
                </Link>
            </Button>
        </div>
      </PageHeader>
        
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Class Details</CardTitle>
                    <CardDescription>A detailed view of the scheduled class.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-3">
                                <div className="font-semibold">Trainer</div>
                                <div className="text-muted-foreground">{cls.trainer}</div>
                            </div>
                            <div className="grid gap-3">
                                <div className="font-semibold">Date & Time</div>
                                <div className="text-muted-foreground">{cls.date} at {cls.time}</div>
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-3">
                                <div className="font-semibold">Occupancy</div>
                                <span className={cn("text-sm w-fit", cls.booked >= cls.spots ? "text-destructive" : "text-muted-foreground")}>{cls.booked} / {cls.spots} booked</span>
                            </div>
                            <div className="grid gap-3">
                                <div className="font-semibold">Duration</div>
                                <div className="text-muted-foreground">{cls.duration} minutes</div>
                            </div>
                        </div>
                        {cls.isOnline && cls.meetingUrl && (
                        <>
                            <Separator />
                            <div className="grid gap-3">
                            <div className="font-semibold flex items-center gap-2"><Video className="w-4 h-4"/> Online Class</div>
                            <a href={cls.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" />
                                Join Meeting
                            </a>
                            </div>
                        </>
                        )}
                        {cls.paymentType === 'paid' && (
                            <>
                                <Separator />
                                <div className="grid gap-3">
                                    <div className="font-semibold flex items-center gap-2"><Wallet className="w-4 h-4"/> Paid Class</div>
                                    <div className="text-muted-foreground font-bold text-lg">KES {cls.price?.toLocaleString()}</div>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
         <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5"/> Booked Clients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {bookedMembers.length > 0 ? (
                            <div className="space-y-4">
                                {bookedMembers.map(member => (
                                    <div key={member.id} className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={member.avatarUrl} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{member.name}</p>
                                            <p className="text-xs text-muted-foreground">{member.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm text-center py-4">No clients have booked this class yet.</p>
                        )}
                    </CardContent>
                </Card>
           </div>
      </div>
    </div>
  );
}
