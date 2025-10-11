
"use client";

import { PageHeader } from "@/components/page-header";
import { ClassCalendar } from "@/components/admin/class-calendar";
import { classes as initialClasses, trainers } from "@/lib/data";
import { useState } from "react";
import { Class } from "@/lib/types";

export default function InstructorSchedulePage() {
  // In a real app, this would be dynamically determined
  const instructorName = "Juma Kalama"; 

  const [classes, setClasses] = useState<Class[]>(initialClasses);

  const addClass = (newClass: Omit<Class, 'id' | 'locationId' | 'booked'>) => {
    const classToAdd: Class = {
      id: `C${classes.length + 1}`,
      ...newClass,
      booked: 0,
      locationId: 'L01', // Default location for this prototype
    };
    setClasses([...classes, classToAdd]);
    return classToAdd;
  };

  const updateClass = (updatedClass: Class) => {
    setClasses(classes.map(c => c.id === updatedClass.id ? updatedClass : c));
  }

  const instructorClasses = classes.filter(c => c.trainer === instructorName);

  return (
    <div className="space-y-8">
       <PageHeader title="My Schedule" />
      
      <ClassCalendar 
        classes={instructorClasses}
        allClasses={classes}
        setClasses={setClasses}
        trainers={trainers}
        onAddClass={addClass}
        onUpdateClass={updateClass}
      />
    </div>
  );
}
