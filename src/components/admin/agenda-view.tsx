
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Class } from '@/lib/types';
import { classes as initialClasses } from '@/lib/data';
import { MoreHorizontal, Video, Calendar as CalendarIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format, parseISO, isFuture, startOfToday, compareAsc, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

const LOCAL_STORAGE_KEY = 'fitsync_all_classes';

interface AgendaViewProps {
  locationId: string;
  role?: 'admin' | 'instructor';
  instructorName?: string;
}

export function AgendaView({ locationId, role = 'admin', instructorName }: AgendaViewProps) {
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

  const groupedClasses = useMemo(() => {
    const today = startOfToday();
    const filteredClasses = allClasses.filter(cls => 
      cls.locationId === locationId && (isFuture(parseISO(cls.date)) || isSameDay(parseISO(cls.date), today))
    );

    // Unlike calendar view, we don't filter out other instructor's classes for transparency
    // We will just visually distinguish them
    
    // Sort classes by date and then by time
    filteredClasses.sort((a, b) => {
        const dateComparison = compareAsc(parseISO(a.date), parseISO(b.date));
        if (dateComparison !== 0) return dateComparison;
        return a.time.localeCompare(b.time);
    });

    return filteredClasses.reduce((acc, cls) => {
      const date = format(parseISO(cls.date), 'EEEE, MMMM d, yyyy');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({ ...cls, color: classColors[cls.name] });
      return acc;
    }, {} as Record<string, Class[]>);
  }, [allClasses, locationId, classColors]);

  if (!isMounted) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">Loading agenda...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {Object.keys(groupedClasses).length > 0 ? (
        Object.entries(groupedClasses).map(([date, classesOnDate]) => (
          <div key={date}>
            <h3 className="text-lg font-semibold mb-4">{date}</h3>
            <div className="space-y-4">
              {classesOnDate.map(cls => {
                  const href = role === 'instructor' 
                    ? `/instructor/schedule/${cls.id}`
                    : `/admin/schedule/${cls.id}`;
                  const isOwner = role === 'admin' || (role === 'instructor' && cls.trainer === instructorName);
                  
                  return (
                    <Card key={cls.id} className={cn("flex items-center p-4 gap-4 border-l-4", cls.color, !isOwner && 'opacity-60')}>
                        <div className="flex-none w-20 text-center">
                            <p className="font-bold text-lg">{cls.time}</p>
                        </div>
                        <div className="flex-grow">
                            <Link href={href} className="hover:underline">
                                <h4 className="font-semibold text-base flex items-center gap-2">{cls.name} {cls.isOnline && <Video className="w-4 h-4"/>}</h4>
                            </Link>
                            <p className="text-sm text-muted-foreground">with {cls.trainer}</p>
                        </div>
                        <div className="flex-none w-32 text-center">
                            <Badge variant={cls.booked >= cls.spots ? "destructive" : "default"}>
                                {cls.booked} / {cls.spots} booked
                            </Badge>
                        </div>
                        <div className="flex-none">
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link href={href}>View Details</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </Card>
                  );
              })}
            </div>
          </div>
        ))
      ) : (
        <Card>
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <CalendarIcon className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">No Upcoming Classes</h3>
            <p className="text-muted-foreground mt-1">There are no classes scheduled for this location.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
