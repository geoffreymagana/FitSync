
"use client";

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GrowthChart } from "@/components/analytics/growth-chart"
import { IncomeChart } from "@/components/analytics/income-chart"
import { LocationSwitcher } from "@/components/location-switcher"
import { useState } from "react"
import { locations } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Download, MoreVertical, Calendar as CalendarIcon } from "lucide-react"
import { ClassOccupancyChart } from "@/components/analytics/class-occupancy-chart"
import { PeakHoursChart } from "@/components/analytics/peak-hours-chart"
import { RevenueBreakdownChart } from "@/components/analytics/revenue-breakdown-chart"
import { ExpenseBreakdownChart } from "@/components/analytics/expense-breakdown-chart"
import { RecentTransactions } from "@/components/admin/recent-transactions"
import { CheckInHistoryChart } from "@/components/analytics/check-in-history-chart"
import { SubscriptionByPlanChart } from "@/components/analytics/subscription-by-plan-chart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { NewVsChurnChart } from "@/components/analytics/new-vs-churn-chart"
import { RevenuePerMemberChart } from "@/components/analytics/revenue-per-member-chart"
import { TopSellingItemsChart } from "@/components/analytics/top-selling-items-chart"

function ChartCard({ title, description, children, className }: { title: string, description: string, children: React.ReactNode, className?: string }) {
    const { toast } = useToast();

    const handleExport = () => {
        toast({
            title: "Exporting Data (Simulated)",
            description: `The data for "${title}" is being exported.`,
        });
    };
    
    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleExport}>
                                <Download className="mr-2 h-4 w-4" />
                                Export Data
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}

export default function AnalyticsPage() {
    const [selectedLocation, setSelectedLocation] = useState(locations[0].id);
    const [date, setDate] = useState<DateRange | undefined>(undefined);

    return (
        <div className="space-y-8">
            <PageHeader title="Analytics">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <LocationSwitcher selectedLocation={selectedLocation} onLocationChange={setSelectedLocation} />
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                "w-full sm:w-[260px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                date.to ? (
                                    <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                                ) : (
                                <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button variant="outline" className="w-full sm:w-auto">
                        <Download className="mr-2" />
                        Export All
                    </Button>
                </div>
            </PageHeader>

            <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="financials">Financials</TabsTrigger>
                    <TabsTrigger value="operations">Operations</TabsTrigger>
                    <TabsTrigger value="bi">BI</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-6">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="md:col-span-2 lg:col-span-3">
                            <ChartCard title="Membership Growth" description="See how your member base has grown.">
                                <GrowthChart locationId={selectedLocation} />
                            </ChartCard>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                            <ChartCard title="Monthly Income" description="Track your income over time.">
                                <IncomeChart locationId={selectedLocation} />
                            </ChartCard>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                             <ChartCard title="Subscriptions by Plan" description="See the distribution of members across plans.">
                                <SubscriptionByPlanChart />
                            </ChartCard>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="financials" className="mt-6">
                     <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                         <ChartCard title="Revenue Breakdown" description="See where your income is coming from.">
                            <RevenueBreakdownChart locationId={selectedLocation} />
                        </ChartCard>
                        <ChartCard title="Expense Breakdown" description="Understand your operational costs.">
                            <ExpenseBreakdownChart locationId={selectedLocation} />
                        </ChartCard>
                         <div className="md:col-span-2 lg:col-span-3">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Recent Transactions</CardTitle>
                                    <CardDescription>A log of recent member payments and walk-in sales.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RecentTransactions locationId={selectedLocation} />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="operations" className="mt-6">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <ChartCard title="Class Occupancy" description="View booking rates for classes.">
                            <ClassOccupancyChart locationId={selectedLocation} />
                        </ChartCard>
                        <div className="md:col-span-2 lg:col-span-2">
                             <ChartCard title="Peak Hours" description="See when your gym is busiest.">
                                <PeakHoursChart locationId={selectedLocation} />
                            </ChartCard>
                        </div>
                         <div className="md:col-span-2 lg:col-span-3">
                            <ChartCard title="Check-in History" description="Daily member check-ins for the last 7 days.">
                                <CheckInHistoryChart locationId={selectedLocation} />
                            </ChartCard>
                        </div>
                    </div>
                </TabsContent>
                 <TabsContent value="bi" className="mt-6">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="md:col-span-2 lg:col-span-3">
                            <ChartCard title="New vs. Churn Rate" description="Track member acquisition against churn over time.">
                                <NewVsChurnChart locationId={selectedLocation} />
                            </ChartCard>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                            <ChartCard title="Average Revenue Per Member (ARPU)" description="Monitor the average revenue generated per member.">
                                <RevenuePerMemberChart locationId={selectedLocation} />
                            </ChartCard>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3">
                             <ChartCard title="Top Selling POS Items" description="Identify the most popular walk-in products and services.">
                                <TopSellingItemsChart locationId={selectedLocation} />
                            </ChartCard>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
