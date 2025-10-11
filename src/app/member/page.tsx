
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Calendar, Target, Plus, Flame, Utensils } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function MemberDashboardPage() {
    const { toast } = useToast();
    const [isWorkoutDialogOpen, setIsWorkoutDialogOpen] = useState(false);
    const [isMealDialogOpen, setIsMealDialogOpen] = useState(false);

    const handleLogSubmit = (type: 'Workout' | 'Meal') => {
        if (type === 'Workout') {
            setIsWorkoutDialogOpen(false);
        } else {
            setIsMealDialogOpen(false);
        }
        toast({
            title: `${type} Logged!`,
            description: `Your ${type.toLowerCase()} has been successfully logged.`,
        });
    };


    return (
        <div className="p-4 md:p-6 space-y-6">
            <PageHeader title="Welcome, Wanjiku!" />
            
            <Card>
                <CardHeader>
                    <CardTitle>Today's Focus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-accent/50 rounded-lg">
                        <h4 className="font-semibold">HIIT Blast at 9:00 AM</h4>
                        <p className="text-sm text-muted-foreground">with Juma Kalama</p>
                    </div>
                    <Button className="w-full" asChild>
                        <Link href="/member/classes">
                            <Calendar className="mr-2 h-4 w-4" />
                            View All Classes
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Weekly Goal</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center text-center">
                        <Target className="w-8 h-8 text-primary mb-2" />
                        <p className="font-bold">3/5 Workouts</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Book a Class</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center text-center">
                         <Dumbbell className="w-8 h-8 text-primary mb-2" />
                        <p className="font-bold">Find a workout</p>
                        <Button size="sm" className="mt-2" asChild>
                            <Link href="/member/classes">Book Now</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <Dialog open={isWorkoutDialogOpen} onOpenChange={setIsWorkoutDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Log Workout
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Log a Workout</DialogTitle>
                                <DialogDescription>Record your latest training session.</DialogDescription>
                            </DialogHeader>
                             <form onSubmit={(e) => { e.preventDefault(); handleLogSubmit('Workout'); }}>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="workout-type">Workout Type</Label>
                                        <Select name="workout-type" required>
                                            <SelectTrigger id="workout-type">
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cardio">Cardio</SelectItem>
                                                <SelectItem value="strength">Strength Training</SelectItem>
                                                <SelectItem value="flexibility">Flexibility</SelectItem>
                                                <SelectItem value="sports">Sports</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Duration (minutes)</Label>
                                        <Input id="duration" name="duration" type="number" min="1" max="240" placeholder="60" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="calories">Calories Burned (optional)</Label>
                                        <Input id="calories" name="calories" type="number" min="0" max="5000" placeholder="300" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsWorkoutDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit">Log Workout</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                     <Dialog open={isMealDialogOpen} onOpenChange={setIsMealDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Log Meal
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Log a Meal</DialogTitle>
                                <DialogDescription>Keep track of your nutrition.</DialogDescription>
                            </DialogHeader>
                             <form onSubmit={(e) => { e.preventDefault(); handleLogSubmit('Meal'); }}>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="meal-type">Meal Type</Label>
                                        <Select name="meal-type" required>
                                            <SelectTrigger id="meal-type">
                                                <SelectValue placeholder="Select a meal" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="breakfast">Breakfast</SelectItem>
                                                <SelectItem value="lunch">Lunch</SelectItem>
                                                <SelectItem value="dinner">Dinner</SelectItem>
                                                <SelectItem value="snack">Snack</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="meal-description">Description</Label>
                                        <Input id="meal-description" name="meal-description" placeholder="e.g., Chicken salad, apple" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="meal-calories">Calories (optional)</Label>
                                        <Input id="meal-calories" name="meal-calories" type="number" min="0" max="5000" placeholder="500" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsMealDialogOpen(false)}>Cancel</Button>
                                    <Button type="submit">Log Meal</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    );
}
