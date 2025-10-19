

"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { classes as initialClasses, trainers, Class, Trainer } from "@/lib/data";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Edit, Trash, Save, Video, Link as LinkIcon, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const LOCAL_STORAGE_KEY = 'fitsync_all_classes';


const ClassForm = ({ 
    classData,
    trainers, 
    isEditing,
}: { 
    classData: Class | null,
    trainers: Trainer[], 
    isEditing: boolean,
}) => {
  if (!classData) return null;
  const today = new Date().toISOString().split('T')[0];
  const [isOnline, setIsOnline] = useState(classData?.isOnline || false);
  const [paymentType, setPaymentType] = useState(classData?.paymentType || 'free');

  if (!isEditing) {
      return (
         <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-6">
                 <div className="grid gap-3">
                    <div className="font-semibold">Trainer</div>
                    <div className="text-muted-foreground">{classData.trainer}</div>
                </div>
                 <div className="grid gap-3">
                    <div className="font-semibold">Date & Time</div>
                    <div className="text-muted-foreground">{classData.date} at {classData.time}</div>
                </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-3">
                    <div className="font-semibold">Occupancy</div>
                    <Badge variant={classData.booked >= classData.spots ? 'destructive' : 'default'}>{classData.booked} / {classData.spots} booked</Badge>
                </div>
                <div className="grid gap-3">
                    <div className="font-semibold">Duration</div>
                    <div className="text-muted-foreground">{classData.duration} minutes</div>
                </div>
            </div>
             {classData.isOnline && classData.meetingUrl && (
              <>
                <Separator />
                <div className="grid gap-3">
                  <div className="font-semibold flex items-center gap-2"><Video className="w-4 h-4"/> Online Class</div>
                  <a href={classData.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Join Meeting
                  </a>
                </div>
              </>
            )}
            {classData.paymentType === 'paid' && (
              <>
                <Separator />
                <div className="grid gap-3">
                    <div className="font-semibold flex items-center gap-2"><Wallet className="w-4 h-4"/> Paid Class</div>
                    <div className="text-muted-foreground font-bold text-lg">KES {classData.price?.toLocaleString()}</div>
                </div>
              </>
            )}
        </div>
      )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Class Name</Label>
        <Input id="name" name="name" placeholder="e.g., Morning Yoga" defaultValue={classData.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="trainer">Trainer</Label>
        <Select name="trainer" defaultValue={classData.trainer} required>
          <SelectTrigger id="trainer">
            <SelectValue placeholder="Select a trainer" />
          </SelectTrigger>
          <SelectContent>
            {trainers.map(t => (
              <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" defaultValue={classData.date} required min={today} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input id="time" name="time" type="time" defaultValue={classData.time} required />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="spots">Available Spots</Label>
          <Input id="spots" name="spots" type="number" placeholder="25" max="100" defaultValue={classData.spots} required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input id="duration" name="duration" type="number" placeholder="60" defaultValue={classData.duration} required />
        </div>
      </div>
      <div className="space-y-4 rounded-md border p-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="isOnline" className="font-semibold">Online Class</Label>
          <Switch id="isOnline" name="isOnline" checked={isOnline} onCheckedChange={setIsOnline} />
        </div>
        {isOnline && (
          <div className="space-y-2 pt-2">
            <Label htmlFor="meetingUrl">Zoom Meeting URL</Label>
            <Input id="meetingUrl" name="meetingUrl" placeholder="https://zoom.us/j/..." defaultValue={classData?.meetingUrl || ''} />
          </div>
        )}
      </div>
       <div className="space-y-4 rounded-md border p-4">
            <Label className="font-semibold">Payment</Label>
            <RadioGroup value={paymentType} onValueChange={(value) => setPaymentType(value)}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="free" id="r1" />
                    <Label htmlFor="r1">Free</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paid" id="r2" />
                    <Label htmlFor="r2">Paid</Label>
                </div>
            </RadioGroup>
            {paymentType === 'paid' && (
                <div className="space-y-2 pt-2">
                    <Label htmlFor="price">Price (KES)</Label>
                    <Input id="price" name="price" type="number" placeholder="500" defaultValue={classData?.price || ''} required />
                </div>
            )}
        </div>
    </div>
  );
};


export default function ClassDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const classId = params.id as string;
  
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [cls, setCls] = useState<Class | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let allKnownClasses = initialClasses;
    if (typeof window !== 'undefined') {
        const storedClasses = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedClasses) {
            try {
                allKnownClasses = JSON.parse(storedClasses);
            } catch (e) {
                console.error("Failed to parse classes from local storage", e);
            }
        }
    }
    const foundClass = allKnownClasses.find(i => i.id === classId);
    setCls(foundClass);
    setClasses(allKnownClasses);
  }, [classId]);

  if (!cls) {
    return null; 
  }
  
  const handleEditClass = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cls) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const updatedClassData: Class = {
      ...cls,
      name: formData.get("name") as string,
      trainer: formData.get("trainer") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      spots: Number(formData.get("spots")),
      duration: Number(formData.get("duration")),
      isOnline: formData.get('isOnline') === 'on',
      meetingUrl: formData.get('meetingUrl') as string,
      paymentType: formData.get('paymentType') as 'free' | 'paid',
      price: formData.get('paymentType') === 'paid' ? Number(formData.get("price")) : 0,
    };

    const updatedClasses = classes.map(c => c.id === cls.id ? updatedClassData : c);
    setClasses(updatedClasses);
    if(typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedClasses));
    }
    setCls(updatedClassData); // Update the state for the current page
    setIsEditing(false);
  };

  const handleDeleteClass = () => {
    if(!cls) return;

    const updatedClasses = classes.filter(c => c.id !== cls.id);
    setClasses(updatedClasses);
    if(typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedClasses));
    }
    router.push("/admin/schedule");
  }

  return (
    <div className="space-y-8">
      <PageHeader title={cls.name}>
        <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
                <Link href="/admin/schedule">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Schedule
                </Link>
            </Button>
        </div>
      </PageHeader>
        
      <Card>
          <form onSubmit={handleEditClass}>
              <CardHeader>
              <CardTitle>Class Details</CardTitle>
              <CardDescription>
                  {isEditing ? "Edit the details of the class." : "A detailed view of the scheduled class."}
              </CardDescription>
              </CardHeader>
              <CardContent>
                  <ClassForm classData={cls} trainers={trainers} isEditing={isEditing} />
              </CardContent>
                <CardFooter className="flex justify-start gap-2 border-t pt-6">
                  {isEditing ? (
                      <>
                          <Button type="submit">
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                          </Button>
                          <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                              Cancel
                          </Button>
                      </>
                  ) : (
                        <>
                          <Button type="button" onClick={() => setIsEditing(true)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Class
                          </Button>
                          <Button type="button" variant="destructive" onClick={handleDeleteClass}>
                              <Trash className="mr-2 h-4 w-4" />
                              Delete Class
                          </Button>
                      </>
                  )}
              </CardFooter>
          </form>
      </Card>
    </div>
  );
}
