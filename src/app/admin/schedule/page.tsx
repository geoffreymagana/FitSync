
"use client";

import { PageHeader } from "@/components/page-header";
import { ClassCalendar } from "@/components/admin/class-calendar";
import { classes as initialClasses, locations, trainers, Class } from "@/lib/data";
import { useState } from "react";
import { LocationSwitcher } from "@/components/location-switcher";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function SchedulePage() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0].id);
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [currentDate, setCurrentDate] = useState<Date | undefined>(new Date());

  const addClass = (newClass: Omit<Class, 'id' | 'locationId' | 'booked'>) => {
    const classToAdd: Class = {
      id: `C${classes.length + 1}`,
      ...newClass,
      booked: 0,
      locationId: selectedLocation,
    };
    setClasses([...classes, classToAdd]);
  };

  const updateClass = (updatedClass: Class) => {
    setClasses(classes.map(c => c.id === updatedClass.id ? updatedClass : c));
  }

  const deleteClass = (classId: string) => {
    setClasses(classes.filter(c => c.id !== classId));
  }

  const filteredClasses = classes.filter(c => c.locationId === selectedLocation);

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
        classes={filteredClasses}
        allClasses={classes}
        setClasses={setClasses}
        trainers={trainers}
        onAddClass={addClass}
        onUpdateClass={updateClass}
      />
    </div>
  );
}
