
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { classes as initialClasses, Class } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

export default function MemberClassesPage() {
    const [classes, setClasses] = useState<Class[]>(initialClasses);
    const [bookedClassIds, setBookedClassIds] = useState<string[]>([]);
    const { toast } = useToast();

    const handleBookClass = (classId: string) => {
        setClasses(prevClasses => 
            prevClasses.map(cls => 
                cls.id === classId ? { ...cls, booked: cls.booked + 1 } : cls
            )
        );
        setBookedClassIds(prev => [...prev, classId]);
        
        const bookedClass = classes.find(c => c.id === classId);
        if (bookedClass) {
             toast({
                title: "Booking Successful!",
                description: `You've booked a spot in ${bookedClass.name}.`,
            });
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <PageHeader title="Classes" />

            <div className="space-y-4">
                {classes.map((cls) => {
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
                                    <p>{cls.date}</p>
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
                })}
            </div>
        </div>
    );
}
