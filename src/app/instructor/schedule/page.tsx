
"use client";

import { PageHeader } from "@/components/page-header";
import { ClassCalendar } from "@/components/admin/class-calendar";
import { trainers } from "@/lib/data";
import { useMemo } from "react";

export default function InstructorSchedulePage() {
  // In a real app, this would be dynamically determined from auth
  const instructorName = "Juma Kalama"; 
  const instructor = useMemo(() => trainers.find(t => t.name === instructorName), [instructorName]);
  
  if (!instructor) {
    return <div>Instructor not found.</div>
  }

  return (
    <div className="space-y-8">
       <PageHeader title="My Schedule" />
      
      <ClassCalendar 
        locationId={instructor.locationId}
        trainers={trainers}
        role="instructor"
        instructorName={instructor.name}
      />
    </div>
  );
}
