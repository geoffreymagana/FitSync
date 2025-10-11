
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dumbbell, Target, BarChart, Settings, CreditCard, ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";

export default function MemberProfilePage() {
    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                    <AvatarImage src="https://picsum.photos/seed/member1/100/100" data-ai-hint="person smiling" />
                    <AvatarFallback>WM</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl font-bold">Wanjiku Mwangi</h1>
                    <p className="text-muted-foreground">Premium Member</p>
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

            <div>
                <Link href="/member/billing" className="flex items-center justify-between p-4 rounded-lg hover:bg-accent">
                    <div className="flex items-center gap-4">
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">Billing & Membership</span>
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
