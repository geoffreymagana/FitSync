
"use client";

import { PageHeader } from "@/components/page-header";
import { ClassCalendar } from "@/components/admin/class-calendar";
import { classes as initialClasses, locations, trainers } from "@/lib/data";
import { useState } from "react";
import { LocationSwitcher } from "@/components/location-switcher";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function SchedulePage() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0].id);

  return (
    <div className="space-y-8">
       <PageHeader title="Class Schedule">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <LocationSwitcher selectedLocation={selectedLocation} onLocationChange={setSelectedLocation} />
          <Button variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2" />
              Export
            </Button>
        </div>
      </PageHeader>
      
      <ClassCalendar 
        locationId={selectedLocation}
        trainers={trainers}
        role="admin"
      />
    </div>
  );
}
