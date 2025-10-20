

"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ClassCalendar } from "@/components/admin/class-calendar";
import { AgendaView } from "@/components/admin/agenda-view";
import { locations, trainers } from "@/lib/data";
import { LocationSwitcher } from "@/components/location-switcher";
import { Button } from "@/components/ui/button";
import { Download, Calendar as CalendarIcon, List, CalendarRange } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { WeekView } from "@/components/admin/week-view";
import { ScheduleSidebar } from "@/components/admin/schedule-sidebar";

type View = "month" | "week" | "agenda";

export default function SchedulePage() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0].id);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("month");

  const viewIcons = {
    month: <CalendarIcon className="mr-2" />,
    week: <CalendarRange className="mr-2" />,
    agenda: <List className="mr-2" />,
  }

  const renderView = () => {
    switch (currentView) {
      case 'month':
        return <ClassCalendar 
          locationId={selectedLocation}
          trainers={trainers}
          role="admin"
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />;
      case 'week':
        return <WeekView 
            locationId={selectedLocation}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
        />;
      case 'agenda':
        return <AgendaView
          locationId={selectedLocation}
          role="admin"
        />;
      default:
        return null;
    }
  }

  return (
    <div className="space-y-8">
       <PageHeader title="Class Schedule">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <LocationSwitcher selectedLocation={selectedLocation} onLocationChange={setSelectedLocation} />
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
          <Button variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2" />
              Export
            </Button>
        </div>
      </PageHeader>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {renderView()}
        </div>
        <div className="lg:col-span-1">
          <ScheduleSidebar 
            locationId={selectedLocation} 
            selectedDate={currentDate}
            onDateSelect={setCurrentDate}
          />
        </div>
      </div>

    </div>
  );
}
