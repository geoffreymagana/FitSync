
"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { ClassCalendar } from "@/components/admin/class-calendar";
import { AgendaView } from "@/components/admin/agenda-view";
import { trainers } from "@/lib/data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, List, CalendarRange } from "lucide-react";
import { WeekView } from "@/components/admin/week-view";
import { ScheduleSidebar } from "@/components/admin/schedule-sidebar";

type View = "month" | "week" | "agenda";

export default function InstructorSchedulePage() {
  const [currentView, setCurrentView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  // In a real app, this would be dynamically determined from auth
  const instructorName = "Juma Kalama"; 
  const instructor = useMemo(() => trainers.find(t => t.name === instructorName), [instructorName]);
  
  if (!instructor) {
    return <div>Instructor not found.</div>
  }

  const viewIcons = {
    month: <CalendarIcon className="mr-2" />,
    week: <CalendarRange className="mr-2" />,
    agenda: <List className="mr-2" />,
  };

  const renderView = () => {
    switch (currentView) {
      case 'month':
        return <ClassCalendar 
            locationId={instructor.locationId}
            trainers={trainers}
            role="instructor"
            instructorName={instructor.name}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
          />;
      case 'week':
        return <WeekView
            locationId={instructor.locationId}
            role="instructor"
            instructorName={instructor.name}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
        />
      case 'agenda':
        return <AgendaView
            locationId={instructor.locationId}
            role="instructor"
            instructorName={instructor.name}
          />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
       <PageHeader title="My Schedule">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                {viewIcons[currentView]}
                <span className="capitalize">{currentView} View</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCurrentView('month')}>
                <CalendarIcon className="mr-2" />
                Month
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => setCurrentView('week')}>
                <CalendarRange className="mr-2" />
                Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentView('agenda')}>
                <List className="mr-2" />
                Agenda
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
       </PageHeader>
      
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
            {renderView()}
            </div>
            <div className="lg:col-span-1">
            <ScheduleSidebar 
                locationId={instructor.locationId} 
                selectedDate={currentDate}
                onDateSelect={setCurrentDate}
                role="instructor"
                instructorName={instructor.name}
            />
            </div>
        </div>
    </div>
  );
}
