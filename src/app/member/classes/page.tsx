
"use client";

import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { classes as initialClasses, Class, members, locations } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { format, isFuture, parseISO } from "date-fns";

const CLASSES_STORAGE_KEY = 'fitsync_all_classes';
const BOOKINGS_STORAGE_KEY = 'fitsync_member_bookings';
const MEMBER_ID = 'M001'; // Mock member ID

export default function MemberClassesPage() {
    const [allClasses, setAllClasses] = useState<Class[]>([]);
    const [bookedClassIds, setBookedClassIds] = useState<string[]>([]);
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);

    const member = useMemo(() => members.find(m => m.id === MEMBER_ID), []);
    const memberLocation = useMemo(() => locations.find(l => l.id === member?.locationId), [member]);

    useEffect(() => {
        setIsMounted(true);
        const storedClasses = localStorage.getItem(CLASSES_STORAGE_KEY);
        if (storedClasses) {
            try {
                setAllClasses(JSON.parse(storedClasses));
            } catch (e) {
                console.error("Failed to parse classes from local storage", e);
                setAllClasses(initialClasses);
            }
        } else {
             setAllClasses(initialClasses);
        }
        
        const storedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
        if (storedBookings) {
            try {
                setBookedClassIds(JSON.parse(storedBookings));
            } catch(e) {
                console.error("Failed to parse bookings from local storage", e);
            }
        }
    }, []);

    const handleBookClass = (classId: string) => {
        const updatedClasses = allClasses.map(cls => 
            cls.id === classId ? { ...cls, booked: cls.booked + 1 } : cls
        );
        
        setAllClasses(updatedClasses);
        localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(updatedClasses));

        const updatedBookedIds = [...bookedClassIds, classId];
        setBookedClassIds(updatedBookedIds);
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updatedBookedIds));
        
        const bookedClass = allClasses.find(c => c.id === classId);
        if (bookedClass) {
             toast({
                title: "Booking Successful!",
                description: `You've booked a spot in ${bookedClass.name}.`,
            });
        }
    };

    const availableClasses = useMemo(() => {
        if (!member) return [];
        return allClasses.filter(cls => 
            cls.locationId === member.locationId &&
            cls.status === 'Approved' && 
            isFuture(parseISO(`${cls.date}T${cls.time}`))
        ).sort((a,b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    }, [allClasses, member]);

    if (!isMounted || !member) {
        return (
            <div className="p-4 md:p-6 space-y-6">
                <PageHeader title="Classes" />
                 <Card>
                    <CardContent className="p-12 text-center text-muted-foreground">
                        Loading classes...
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <PageHeader title={`Classes at ${memberLocation?.name}`} />

            <div className="space-y-4">
                {availableClasses.length > 0 ? (
                    availableClasses.map((cls) => {
                        const isBooked = bookedClassIds.includes(cls.id);
                        const isFull = cls.booked >= cls.spots;
                        return (
                            <Card key={cls.id}>
                                <CardHeader>
                                    <CardTitle>{cls.name}</CardTitle>
                                    <CardDescription>With {cls.trainer}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex justify-between items-center">
                                    <div>
                                        <p>{format(parseISO(cls.date), "EEE, MMM d")}</p>
                                        <p>{cls.time}</p>
                                    </div>
                                    <Badge variant={isFull ? "destructive" : "default"}>
                                        {cls.booked} / {cls.spots} booked
                                    </Badge>
                                </CardContent>
                                <CardFooter>
                                    <Button 
                                        className="w-full" 
                                        disabled={isFull || isBooked}
                                        onClick={() => handleBookClass(cls.id)}
                                    >
                                        {isBooked ? (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />
                                                Booked
                                            </>
                                        ) : isFull ? (
                                            "Fully Booked"
                                        ) : (
                                            "Book Spot"
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })
                ) : (
                    <Card>
                        <CardContent className="p-12 text-center text-muted-foreground">
                            No upcoming classes available at this location.
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
