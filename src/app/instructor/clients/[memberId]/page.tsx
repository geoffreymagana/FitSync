
"use client";

import { notFound, useParams } from "next/navigation";
import { members } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const progressData = [
    { date: "Jan", weight: 85 },
    { date: "Feb", weight: 83 },
    { date: "Mar", weight: 82 },
    { date: "Apr", weight: 80 },
    { date: "May", weight: 78 },
];

const chartConfig = {
  weight: {
    label: "Weight (kg)",
    color: "hsl(var(--primary))",
  },
}

const initialWorkoutPlan = `Monday: Chest & Triceps
- Bench Press: 3 sets of 8-10 reps
- Incline Dumbbell Press: 3 sets of 10-12 reps

Wednesday: Back & Biceps
- Deadlifts: 3 sets of 5 reps
- Pull-ups: 3 sets to failure

Friday: Legs & Shoulders
- Squats: 4 sets of 8 reps
- Overhead Press: 3 sets of 8-10 reps`;

const initialMealPlan = `Breakfast: Oatmeal with berries and nuts.

Lunch: Grilled chicken salad with a light vinaigrette.

Dinner: Salmon with quinoa and steamed vegetables.

Snacks: Greek yogurt, almonds, apple.`;


export default function ClientProfilePage() {
    const params = useParams();
    const { toast } = useToast();
    const memberId = params.memberId as string;
    const member = members.find(m => m.id === memberId);

    const [workoutPlan, setWorkoutPlan] = useState(initialWorkoutPlan);
    const [mealPlan, setMealPlan] = useState(initialMealPlan);
    const [notes, setNotes] = useState("Client mentioned struggling with squat form... Check next session.");

    if (!member) {
        notFound();
    }
    
    const handleSavePlan = (planType: 'Workout' | 'Meal') => {
        toast({
            title: `${planType} Plan Saved`,
            description: `The ${planType.toLowerCase()} plan for ${member.name} has been saved and sent.`,
        });
    }

    return (
        <div className="space-y-8">
            <PageHeader title="Client Profile">
                 <div className="flex items-center space-x-2">
                    <Button asChild variant="outline">
                        <Link href="/instructor/clients">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back to Clients
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/instructor/messages/${member.id}`}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                        </Link>
                    </Button>
                </div>
            </PageHeader>

            <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                    <AvatarImage src={member.avatarUrl} data-ai-hint="person smiling" />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl font-bold">{member.name}</h1>
                    <p className="text-muted-foreground">{member.email}</p>
                    <Badge className="mt-1">{member.plan} Plan</Badge>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Assigned Workout Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            value={workoutPlan}
                            onChange={(e) => setWorkoutPlan(e.target.value)}
                            rows={10}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleSavePlan('Workout')}>Save & Send Workout</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Meal Plan Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                           value={mealPlan}
                           onChange={(e) => setMealPlan(e.target.value)}
                            rows={10}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => handleSavePlan('Meal')}>Save & Send Meal</Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Progress Tracking (Weight)</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                            <LineChart accessibilityLayer data={progressData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                />
                                <YAxis
                                tickFormatter={(value) => `${value} kg`}
                                />
                                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" strokeWidth={2} />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Trainer's Private Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} />
                    </CardContent>
                    <CardFooter>
                        <Button>Save Notes</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
