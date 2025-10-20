
"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import { add, format, parse, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay, set, getDay, addDays, parseISO, subDays, nextSunday, previousSunday } from "date-fns";
import { ChevronLeft, ChevronRight, Video, PlusCircle, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Class, Trainer, BlockedDate } from "@/lib/types";
import { classes as initialClasses, trainers, blockedDates } from "@/lib/data";
import Link from "next/link";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

const LOCAL_STORAGE_KEY = 'fitsync_all_classes';

interface WeekViewProps {
  locationId: string;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  role?: 'admin' | 'instructor';
  instructorName?: string;
}

const generateTimeSlots = () => {
    const slots = [];
    for (let i = 6; i <= 21; i++) {
        slots.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return slots;
};

export function WeekView({ locationId, currentDate, setCurrentDate, role = 'admin', instructorName }: WeekViewProps) {
  const [allClasses, setAllClasses] = useState<Class[]>(initialClasses);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setAllClasses(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error reading classes from local storage", error);
    }
  }, []);

  const timeSlots = useMemo(generateTimeSlots, []);

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
    return eachDayOfInterval({ start, end: endOfWeek(currentDate, { weekStartsOn: 0 }) });
  }, [currentDate]);

  const handlePrevWeek = () => setCurrentDate(subDays(currentDate, 7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  const classesByDateTime = useMemo(() => {
    const map = new Map<string, Class[]>();
    allClasses.forEach(cls => {
      if (cls.locationId !== locationId) return;
      // For instructors, we show all classes but will style them differently
      // if (role === 'instructor' && cls.trainer !== instructorName) return;
      const key = `${cls.date}_${cls.time.substring(0, 2)}:00`;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(cls);
    });
    return map;
  }, [allClasses, locationId]);
  
  const classColors: { [key: string]: string } = useMemo(() => {
    const uniqueNames = [...new Set(allClasses.map(c => c.name))];
    const colors = ["bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-purple-200", "bg-pink-200", "bg-indigo-200", "bg-red-200"];
    return uniqueNames.reduce((acc, name, index) => {
        acc[name] = colors[index % colors.length];
        return acc;
    }, {} as { [key: string]: string });
  }, [allClasses]);


  if (!isMounted) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <header className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">{format(weekDays[0], "MMMM yyyy")}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <ScrollArea className="h-[calc(100vh-20rem)]">
        <div className="grid grid-cols-8">
          <div className="sticky top-0 bg-background z-10">&nbsp;</div>
          {weekDays.map(day => (
            <div key={day.toString()} className="text-center p-2 border-b border-l sticky top-0 bg-background z-10">
              <p className={cn("text-sm text-muted-foreground", isToday(day) && "text-primary")}>{format(day, 'EEE')}</p>
              <p className={cn("text-lg font-bold", isToday(day) && "text-primary")}>{format(day, 'd')}</p>
            </div>
          ))}
          {timeSlots.map(time => (
            <React.Fragment key={time}>
              <div className="p-2 border-b text-right text-xs text-muted-foreground">{time}</div>
              {weekDays.map(day => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const timeKey = time;
                const slotKey = `${dateKey}_${timeKey}`;
                const slotClasses = classesByDateTime.get(slotKey) || [];

                return (
                  <div key={day.toString()} className="border-b border-l p-1 min-h-[60px] relative">
                    {slotClasses.map(cls => {
                      const isOwner = role === 'admin' || (role === 'instructor' && cls.trainer === instructorName);
                      return (
                       <Link href={`/${role}/schedule/${cls.id}`} key={cls.id}>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="w-full">
                                    <div className={cn("p-1 rounded-md text-xs text-black mb-1", classColors[cls.name] || 'bg-gray-200', !isOwner && "opacity-60")}>
                                        <p className="font-semibold truncate flex items-center gap-1">
                                            {cls.isOnline && <Video className="w-3 h-3 flex-shrink-0" />}
                                            {cls.name}
                                        </p>
                                        <p className="truncate">{cls.time}</p>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="w-64 text-sm" side="top" align="center">
                                    <div className="space-y-2">
                                        <h4 className="font-bold">{cls.name}</h4>
                                        <p><strong>Trainer:</strong> {cls.trainer}</p>
                                        <p><strong>Time:</strong> {format(parse(cls.time, 'HH:mm', new Date()), 'p')} - {format(add(parse(cls.time, 'HH:mm', new Date()), { minutes: cls.duration }), 'p')}</p>
                                        <p><strong>Occupancy:</strong> {cls.booked} / {cls.spots}</p>
                                        {cls.status && <p className="font-semibold capitalize">Status: <span className={cn(cls.status === 'Pending' ? 'text-yellow-600' : cls.status === 'Approved' ? 'text-green-600' : 'text-red-600')}>{cls.status}</span></p>}
                                        {cls.isOnline && <p className="flex items-center gap-2"><Video className="w-4 h-4"/> Online Class</p>}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                      </Link>
                    )})}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
