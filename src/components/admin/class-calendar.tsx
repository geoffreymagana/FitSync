
"use client";

import { useState, useMemo, useEffect } from "react";
import { add, format, parse, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, isSameDay, set, getDay, addDays, eachWeekOfInterval, nextByDay, parseISO } from "date-fns";
import { Calendar as CalendarIcon, PlusCircle, Ban, Lock, Unlock, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Class, Trainer, BlockedDate } from "@/lib/types";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { blockedDates as initialBlockedDates, classes as initialClasses } from "@/lib/data";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";

const LOCAL_STORAGE_KEY = 'fitsync_all_classes';

interface ClassCalendarProps {
  locationId: string;
  trainers: Trainer[];
  role?: 'admin' | 'instructor';
  instructorName?: string;
}

const generateTimeSlots = (date: Date) => {
    const slots = [];
    let currentTime = set(date, { hours: 6, minutes: 0, seconds: 0, milliseconds: 0 });
    const endTime = set(date, { hours: 21, minutes: 0, seconds: 0, milliseconds: 0 });

    while (currentTime <= endTime) {
        slots.push(format(currentTime, 'HH:mm'));
        currentTime = add(currentTime, { minutes: 30 });
    }
    return slots;
};

const ClassForm = ({
  selectedDate,
  trainers,
  onSave,
  classData,
  classesForDay,
  onAddRecurring,
  role = 'admin',
  instructorName,
}: {
  selectedDate: Date;
  trainers: Trainer[];
  onSave: (data: any) => void;
  classData?: Class | null;
  classesForDay: Class[];
  onAddRecurring: (data: any, recurrence: any) => void;
  role?: 'admin' | 'instructor';
  instructorName?: string;
}) => {
    const { toast } = useToast();
    const today = format(new Date(), "yyyy-MM-dd");
    const [date, setDate] = useState(
        classData ? classData.date : format(selectedDate, "yyyy-MM-dd")
    );
    
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceDays, setRecurrenceDays] = useState<string[]>([]);
    const [recurrenceEndDate, setRecurrenceEndDate] = useState('');

    const timeSlots = useMemo(() => generateTimeSlots(selectedDate), [selectedDate]);

    const isSlotBooked = (slot: string) => {
        const slotTime = parse(slot, 'HH:mm', new Date());
        return classesForDay.some(cls => {
            if (cls.id === classData?.id) return false; // Ignore self when editing
            const classStartTime = parse(cls.time, 'HH:mm', new Date());
            const classEndTime = add(classStartTime, { minutes: cls.duration });
            return slotTime < classEndTime && add(slotTime, { minutes: 30 }) > classStartTime;
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name") as string,
            trainer: role === 'instructor' && instructorName ? instructorName : formData.get("trainer") as string,
            date: formData.get("date") as string,
            time: formData.get("time") as string,
            spots: Number(formData.get("spots")),
            duration: Number(formData.get("duration")),
        };

        if (classesForDay.length >= 5 && !classData) {
            toast({ variant: 'destructive', title: 'Daily Limit Reached', description: 'A maximum of 5 classes can be scheduled per day.' });
            return;
        }

        if (isRecurring) {
            const recurrence = {
                days: recurrenceDays,
                endDate: recurrenceEndDate
            };
            onAddRecurring(data, recurrence);
        } else {
            onSave(data);
        }
    };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Class Name</Label>
          <Input id="name" name="name" placeholder="e.g., Morning Yoga" defaultValue={classData?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trainer">Trainer</Label>
          {role === 'instructor' ? (
            <p className="font-semibold text-muted-foreground pt-2">{instructorName}</p>
          ) : (
            <Select name="trainer" defaultValue={classData?.trainer} required>
              <SelectTrigger id="trainer">
                <SelectValue placeholder="Select a trainer" />
              </SelectTrigger>
              <SelectContent>
                {trainers.map(t => (
                  <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" value={date} required min={today} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Select name="time" defaultValue={classData?.time} required>
                <SelectTrigger>
                    <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                    {timeSlots.map(slot => (
                        <SelectItem key={slot} value={slot} disabled={isSlotBooked(slot)}>
                            {slot} {isSlotBooked(slot) && "(Booked)"}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="spots">Available Spots</Label>
                <Input id="spots" name="spots" type="number" placeholder="25" defaultValue={classData?.spots} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select name="duration" defaultValue={classData?.duration?.toString() || '60'} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
            </div>
        </div>

        {!classData && (
          <div className="space-y-4 rounded-md border p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="recurring-switch" className="font-semibold">Set Recurring Class</Label>
                <Switch id="recurring-switch" checked={isRecurring} onCheckedChange={setIsRecurring} />
              </div>

              {isRecurring && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Repeat on</Label>
                    <ToggleGroup type="multiple" variant="outline" className="mt-2 justify-start" value={recurrenceDays} onValueChange={setRecurrenceDays}>
                        <ToggleGroupItem value="1">Mon</ToggleGroupItem>
                        <ToggleGroupItem value="2">Tue</ToggleGroupItem>
                        <ToggleGroupItem value="3">Wed</ToggleGroupItem>
                        <ToggleGroupItem value="4">Thu</ToggleGroupItem>
                        <ToggleGroupItem value="5">Fri</ToggleGroupItem>
                        <ToggleGroupItem value="6">Sat</ToggleGroupItem>
                        <ToggleGroupItem value="0">Sun</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  <div>
                    <Label htmlFor="recurrence-end-date" className="text-sm">End Date</Label>
                    <Input id="recurrence-end-date" type="date" min={date} value={recurrenceEndDate} onChange={(e) => setRecurrenceEndDate(e.target.value)} required />
                  </div>
                </div>
              )}
          </div>
        )}

      </div>
      <DialogFooter>
        <Button type="submit">
            {isRecurring ? 'Add Recurring Classes' : 'Save Class'}
        </Button>
      </DialogFooter>
    </form>
  );
};


const ScheduleGridCalendar = ({ locationId, trainers, role = 'admin', instructorName }: ClassCalendarProps) => {
  const [allClasses, setAllClasses] = useState<Class[]>(() => {
    if (typeof window === 'undefined') return initialClasses;
    try {
        const storedClasses = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedClasses ? JSON.parse(storedClasses) : initialClasses;
    } catch (error) {
        console.error("Error reading classes from local storage", error);
        return initialClasses;
    }
  });

  useEffect(() => {
    try {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allClasses));
        }
    } catch (error) {
        console.error("Error writing classes to local storage", error);
    }
  }, [allClasses]);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(initialBlockedDates);
  const [reason, setReason] = useState("");
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const classColors: { [key: string]: string } = useMemo(() => {
    const uniqueNames = [...new Set(allClasses.map(c => c.name))];
    const colors = ["bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-purple-200", "bg-pink-200", "bg-indigo-200", "bg-red-200"];
    return uniqueNames.reduce((acc, name, index) => {
        acc[name] = colors[index % colors.length];
        return acc;
    }, {} as { [key: string]: string });
  }, [allClasses]);

  const classesByDate = useMemo(() => {
    return allClasses.reduce((acc, cls) => {
      if (cls.locationId !== locationId) return acc;
      const classDate = cls.date;
      if (!acc[classDate]) {
        acc[classDate] = [];
      }
      acc[classDate].push({ ...cls, color: classColors[cls.name] });
      return acc;
    }, {} as Record<string, Class[]>);
  }, [allClasses, locationId, classColors]);

  const blockedDatesMap = useMemo(() => {
      return blockedDates.reduce((acc, bd) => {
          acc[bd.date] = bd.reason;
          return acc;
      }, {} as Record<string, string>);
  }, [blockedDates]);

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 });
  const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const handlePrevMonth = () => setCurrentDate(add(currentDate, { months: -1 }));
  const handleNextMonth = () => setCurrentDate(add(currentDate, { months: 1 }));

  const openAddDialog = (day: Date) => {
    setSelectedDate(day);
    setIsAddDialogOpen(true);
  };
  
  const openBlockDialog = (day: Date) => {
    setSelectedDate(day);
    setIsBlockDialogOpen(true);
  }
  
  const handleAddClass = (data: Omit<Class, 'id' | 'locationId' | 'booked'>) => {
    const newClass: Class = {
        id: `C${Date.now()}-${Math.random()}`,
        ...data,
        booked: 0,
        locationId,
    };
    setAllClasses(prev => [...prev, newClass]);
    setIsAddDialogOpen(false);
  };

  const handleAddRecurringClasses = (classData: any, recurrence: any) => {
      const { days, endDate } = recurrence;
      const startDate = parseISO(classData.date);
      const finalEndDate = parseISO(endDate);

      if (!recurrence.days || recurrence.days.length === 0 || !recurrence.endDate) {
        toast({ variant: 'destructive', title: 'Missing Information', description: 'Please select recurrence days and an end date.' });
        return;
      }

      const weekDayMap = { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '0': 0 };

      const recurrenceDaysAsNumbers = days.map((d: string) => weekDayMap[d as keyof typeof weekDayMap]);

      let newClassesBatch: Class[] = [];

      let currentDay = startDate;

      while(currentDay <= finalEndDate) {
          if (recurrenceDaysAsNumbers.includes(getDay(currentDay))) {
              const formattedDate = format(currentDay, 'yyyy-MM-dd');
              if (!blockedDatesMap[formattedDate]) {
                  const newClass = { 
                      id: `C${Date.now()}-${Math.random()}`,
                      ...classData, 
                      date: formattedDate,
                      booked: 0,
                      locationId,
                    };
                  newClassesBatch.push(newClass);
              }
          }
          currentDay = addDays(currentDay, 1);
      }
      
      setAllClasses(prev => [...prev, ...newClassesBatch]);
      toast({ title: 'Success', description: `${newClassesBatch.length} recurring classes have been added.` });
      setIsAddDialogOpen(false);
  }

  const handleBlockDay = () => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    if (classesByDate[formattedDate]) {
      toast({
        variant: "destructive",
        title: "Cannot block day",
        description: "There are classes scheduled on this day. Please remove them first.",
      });
      return;
    }
    setBlockedDates([...blockedDates, { date: formattedDate, reason }]);
    setIsBlockDialogOpen(false);
    setReason("");
  };

  const handleUnblockDay = (day: Date) => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    setBlockedDates(blockedDates.filter(bd => bd.date !== formattedDate));
  }

  const DayCell = ({ day }: { day: Date }) => {
    const formattedDay = format(day, "yyyy-MM-dd");
    const dayClasses = classesByDate[formattedDay] || [];
    const isBlocked = blockedDatesMap[formattedDay];

    const CellContent = () => (
      <div className="flex-grow overflow-y-auto mt-1 space-y-1">
        {isBlocked && (
          <div className="flex items-center gap-1 text-xs text-destructive p-1 bg-destructive/10 rounded-md">
            <Ban className="h-3 w-3" />
            <span className="truncate">{blockedDatesMap[formattedDay]}</span>
          </div>
        )}
        {dayClasses.map((cls) => {
          const href = role === 'instructor' 
            ? `/instructor/schedule/${cls.id}`
            : `/admin/schedule/${cls.id}`;
          
          return (
            <Link
              key={cls.id}
              href={href}
              onClick={(e) => e.stopPropagation()}
              className="block"
            >
              <div className={cn("p-1 rounded-md text-xs text-black", cls.color, role === 'instructor' && cls.trainer !== instructorName ? 'opacity-50 border border-dashed border-gray-500' : '')}>
                <p className="font-semibold truncate">{cls.name}</p>
                <p className="truncate">{cls.time}</p>
                {role === 'instructor' && cls.trainer !== instructorName && <p className="truncate text-[10px]">({cls.trainer})</p>}
              </div>
            </Link>
          );
        })}
      </div>
    );
    
    return (
       <div
            key={day.toString()}
            className={cn(
                "h-40 border-b border-r p-1 flex flex-col relative group",
                !isSameMonth(day, currentDate) && "bg-muted/50 text-muted-foreground",
                isBlocked && "bg-destructive/10"
            )}
        >
            <span className={cn("font-medium", isToday(day) && "bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center")}>
                {format(day, "d")}
            </span>
            <CellContent />
            {!isBlocked && (
              <Popover>
                  <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 h-6 w-6">
                          <PlusCircle className="h-4 w-4" />
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => openAddDialog(day)}>Add Class</Button>
                      {role === 'admin' && <Button variant="ghost" className="w-full justify-start" onClick={() => openBlockDialog(day)}>Block Day</Button>}
                  </PopoverContent>
              </Popover>
            )}
            {isBlocked && role === 'admin' && (
              <Button variant="ghost" size="icon" className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 h-6 w-6" onClick={() => handleUnblockDay(day)}>
                  <Unlock className="h-4 w-4" />
              </Button>
            )}
        </div>
    )
  }

  return (
    <Card>
      <header className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-7">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="p-2 text-center font-medium text-muted-foreground text-sm border-b border-r">
            {day}
          </div>
        ))}
        {days.map(day => (
          <DayCell key={day.toString()} day={day} />
        ))}
      </div>
       <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                    <DialogDescription>
                      Schedule a new class for {format(selectedDate, "PPP")}.
                  </DialogDescription>
              </DialogHeader>
              <ClassForm 
                selectedDate={selectedDate} 
                trainers={trainers} 
                onSave={handleAddClass} 
                classesForDay={allClasses.filter(c => c.date === format(selectedDate, 'yyyy-MM-dd') && c.locationId === locationId)}
                onAddRecurring={handleAddRecurringClasses}
                role={role}
                instructorName={instructorName}
              />
          </DialogContent>
      </Dialog>
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Block Date</DialogTitle>
                    <DialogDescription>
                      Block off {format(selectedDate, "PPP")} to prevent scheduling.
                  </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-2">
                  <Label htmlFor="reason">Reason (optional)</Label>
                  <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g., Public Holiday" />
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleBlockDay}>Block Day</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </Card>
  );
}

export { ScheduleGridCalendar as ClassCalendar };
