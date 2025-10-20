

"use client";

import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Class, Trainer, Member } from "@/lib/types";
import { members, classes as initialClasses } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { format, parseISO, parse, add, set } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Check, X, MessageSquareWarning, FileText } from "lucide-react";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

const LOCAL_STORAGE_KEY = 'fitsync_all_classes';

interface ClassDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    classData: Class;
    role: 'admin' | 'instructor';
    onUpdateClass: (updatedClass: Class) => void;
    trainers: Trainer[];
    onApproveReject?: (classId: string, approved: boolean, reason?: string) => void;
    isOwner: boolean;
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

export function ClassDetailsModal({ isOpen, onClose, classData, role, onUpdateClass, trainers, onApproveReject, isOwner }: ClassDetailsModalProps) {
    const { toast } = useToast();
    const bookedMembers = members.slice(0, classData.booked);
    const today = new Date().toISOString().split('T')[0];

    const [allClasses, setAllClasses] = useState<Class[]>([]);
    const [rescheduleDate, setRescheduleDate] = useState(classData.date);
    const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        if (isOpen) {
            const storedClasses = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedClasses) {
                setAllClasses(JSON.parse(storedClasses));
            } else {
                setAllClasses(initialClasses);
            }
            setRescheduleDate(classData.date);
        }
    }, [isOpen, classData.date]);

    const classesForDay = useMemo(() => {
        return allClasses.filter(c => c.date === rescheduleDate && c.locationId === classData.locationId);
    }, [allClasses, rescheduleDate, classData.locationId]);

    const timeSlots = useMemo(() => generateTimeSlots(parseISO(rescheduleDate)), [rescheduleDate]);

    const isSlotBooked = (slot: string) => {
        if (!classesForDay) return false;
        const slotTime = parse(slot, 'HH:mm', new Date());
        return classesForDay.some(cls => {
            if (cls.id === classData?.id) return false; // Ignore self when editing
            const classStartTime = parse(cls.time, 'HH:mm', new Date());
            const classEndTime = add(classStartTime, { minutes: cls.duration });
            return slotTime < classEndTime && add(slotTime, { minutes: 30 }) > classStartTime;
        });
    };

    const handleReschedule = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const reason = formData.get('rescheduleReason') as string;

        const updatedClass = {
            ...classData,
            date: formData.get('date') as string,
            time: formData.get('time') as string,
            status: role === 'instructor' ? 'Pending' as const : classData.status,
            notes: reason || `Rescheduled by ${role}.`
        };
        onUpdateClass(updatedClass);
        onClose();
    }
    
    const openRejectionDialog = () => {
        onClose(); // Close the details modal first
        setTimeout(() => setIsRejectionDialogOpen(true), 150); // Open rejection dialog after a short delay
    }

    const handleApproval = (approve: boolean) => {
        if (!onApproveReject) return;
        
        if (approve) {
             onApproveReject(classData.id, true);
             onClose();
        } else {
            // Open a dialog to get the reason
            openRejectionDialog();
        }
    }
    
    const handleConfirmRejection = () => {
        if(onApproveReject && rejectionReason) {
            onApproveReject(classData.id, false, rejectionReason);
            setIsRejectionDialogOpen(false);
            setRejectionReason("");
        } else {
            toast({ variant: "destructive", title: "Reason required", description: "Please provide a reason for rejection."});
        }
    }
    
    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {classData.name}
                            {classData.status === 'Pending' && <Badge variant="outline">Pending</Badge>}
                            {classData.status === 'Rejected' && <Badge variant="destructive">Rejected</Badge>}
                        </DialogTitle>
                        <DialogDescription>
                            {format(parseISO(classData.date), "PPP")} at {classData.time} with {classData.trainer}
                        </DialogDescription>
                         {classData.notes && (
                            <div className="pt-2 text-xs text-muted-foreground flex items-start gap-2">
                                <FileText className="w-4 h-4 mt-0.5" />
                                <span>Note: {classData.notes}</span>
                            </div>
                        )}
                    </DialogHeader>
                    
                    <Tabs defaultValue="clients">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="clients">Booked Clients</TabsTrigger>
                            <TabsTrigger value="reschedule" disabled={!isOwner}>Reschedule</TabsTrigger>
                        </TabsList>
                        <TabsContent value="clients" className="mt-4">
                            <div className="space-y-4 max-h-80 overflow-y-auto">
                                {bookedMembers.length > 0 ? (
                                    bookedMembers.map((member) => (
                                        <div key={member.id} className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={member.avatarUrl} alt={member.name} />
                                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{member.name}</p>
                                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">No clients have booked this class yet.</p>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="reschedule" className="mt-4">
                            <form onSubmit={handleReschedule}>
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        {role === 'instructor' ? 'Request a new date and time. This will require admin approval.' : 'Select a new date and time for this class.'}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="reschedule-date">New Date</Label>
                                            <Input id="reschedule-date" name="date" type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} min={today} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="reschedule-time">New Time</Label>
                                            <Select name="time" defaultValue={classData.time} required>
                                                <SelectTrigger id="reschedule-time">
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
                                    <div className="space-y-2">
                                        <Label htmlFor="rescheduleReason">Reason for Rescheduling (Optional)</Label>
                                        <Textarea id="rescheduleReason" name="rescheduleReason" placeholder="e.g., Trainer unavailable" />
                                    </div>
                                    <Button type="submit" className="w-full">Save Changes</Button>
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                    
                    {role === 'admin' && classData.status === 'Pending' && (
                        <DialogFooter className="pt-4 border-t">
                            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleApproval(false)}>
                                <X className="mr-2" />
                                Reject
                            </Button>
                            <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600" onClick={() => handleApproval(true)}>
                                <Check className="mr-2" />
                                Approve
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>

             <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reason for Rejection</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting the class "{classData.name}". This will be sent to the instructor.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea 
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="e.g., Scheduling conflict with another event..."
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRejectionDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleConfirmRejection}>Confirm Rejection</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
