
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Class, BlockedDate } from '@/lib/types';
import { classes as initialClasses, blockedDates } from '@/lib/data';
import { isSameDay, parseISO, format, startOfToday, isToday } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const LOCAL_STORAGE_KEY = 'fitsync_all_classes';

interface ScheduleSidebarProps {
  locationId: string;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  role?: 'admin' | 'instructor';
  instructorName?: string;
}

export function ScheduleSidebar({
  locationId,
  selectedDate,
  onDateSelect,
  role = 'admin',
  instructorName,
}: ScheduleSidebarProps) {
  const [allClasses, setAllClasses] = useState<Class[]>(initialClasses);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let storedClasses: Class[] = [];
    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        storedClasses = JSON.parse(stored);
        setAllClasses(storedClasses);
      }
    } catch (error) {
      console.error("Error reading classes from local storage", error);
    }
  }, []);
    
  const classColors: { [key: string]: string } = useMemo(() => {
    const uniqueNames = [...new Set(allClasses.map(c => c.name))];
    const colors = ["border-blue-500", "border-green-500", "border-yellow-500", "border-purple-500", "border-pink-500", "border-indigo-500", "border-red-500"];
    return uniqueNames.reduce((acc, name, index) => {
        acc[name] = colors[index % colors.length];
        return acc;
    }, {} as { [key: string]: string });
  }, [allClasses]);

  const classDays = useMemo(() => {
    return allClasses
      .filter(cls => cls.locationId === locationId)
      .map(cls => parseISO(cls.date));
  }, [allClasses, locationId]);

  const todaysClasses = useMemo(() => {
    const today = startOfToday();
    return allClasses
      .filter(cls =>
        cls.locationId === locationId &&
        isSameDay(parseISO(cls.date), today) &&
        (role === 'admin' || cls.trainer === instructorName)
      )
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [allClasses, locationId, role, instructorName]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateSelect(date);
    }
  };

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-2">
            <p>Loading calendar...</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Loading schedule...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            modifiers={{ hasClass: classDays }}
            modifiersClassNames={{ hasClass: 'has-class-dot' }}
          />
          <style jsx global>{`
            .has-class-dot {
              position: relative;
            }
            .has-class-dot::after {
              content: '';
              position: absolute;
              bottom: 4px;
              left: 50%;
              transform: translateX(-50%);
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background-color: hsl(var(--primary));
            }
            .rdp-day_today.has-class-dot:not(.rdp-day_selected)::after {
                background-color: hsl(var(--accent-foreground));
            }
            .rdp-day_selected.has-class-dot::after {
                 background-color: hsl(var(--primary-foreground));
            }
          `}</style>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {todaysClasses.length > 0 ? (
            <div className="space-y-2">
              {todaysClasses.map(cls => (
                <Link key={cls.id} href={`/${role}/schedule/${cls.id}`} className={cn("block hover:bg-muted p-2 rounded-md border-l-4", classColors[cls.name])}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{cls.name}</p>
                      <p className="text-sm text-muted-foreground">{cls.time}</p>
                    </div>
                    <Badge variant={cls.booked >= cls.spots ? "destructive" : "secondary"}>
                      {cls.booked}/{cls.spots}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No classes scheduled for today.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
