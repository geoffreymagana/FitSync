

"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { classes as initialClasses, trainers, Class } from "@/lib/data";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Video, Link as LinkIcon, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const LOCAL_STORAGE_KEY = 'fitsync_all_classes';

export default function ReceptionClassDetailsPage() {
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

  return (
    <div className="space-y-8">
      <PageHeader title={cls.name}>
        <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
                <Link href="/reception">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>
        </div>
      </PageHeader>
        
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
                            <Badge variant={cls.booked >= cls.spots ? 'destructive' : 'default'}>{cls.booked} / {cls.spots} booked</Badge>
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
  );
}
