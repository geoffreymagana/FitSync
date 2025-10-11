"use client";

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GrowthChart } from "@/components/analytics/growth-chart"
import { IncomeChart } from "@/components/analytics/income-chart"
import { LocationSwitcher } from "@/components/location-switcher"
import { useState } from "react"
import { locations } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClassOccupancyChart } from "@/components/analytics/class-occupancy-chart"
import { PeakHoursChart } from "@/components/analytics/peak-hours-chart"

export default function AnalyticsPage() {
    const [selectedLocation, setSelectedLocation] = useState(locations[0].id);

    return (
        <div className="space-y-8">
            <PageHeader title="Analytics">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <LocationSwitcher selectedLocation={selectedLocation} onLocationChange={setSelectedLocation} />
                    <Select defaultValue="30">
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="30">Last 30 days</SelectItem>
                            <SelectItem value="90">Last 90 days</SelectItem>
                            <SelectItem value="365">Last Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="w-full sm:w-auto">
                        <Download className="mr-2" />
                        Export
                    </Button>
                </div>
            </PageHeader>

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Membership Growth</CardTitle>
                        <CardDescription>
                            See how your member base has grown.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GrowthChart locationId={selectedLocation} />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Monthly Income</CardTitle>
                        <CardDescription>
                            Track your income over time.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <IncomeChart locationId={selectedLocation} />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Class Occupancy</CardTitle>
                        <CardDescription>
                            View booking rates for classes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ClassOccupancyChart locationId={selectedLocation} />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Peak Hours</CardTitle>
                        <CardDescription>
                            See when your gym is busiest.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PeakHoursChart locationId={selectedLocation} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
