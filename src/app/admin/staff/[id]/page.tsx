

"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { staff as initialStaff, Staff, locations } from "@/lib/data";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Edit, Trash, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const StaffForm = ({ 
    staff, 
    isEditing,
}: { 
    staff: Staff | null,
    isEditing: boolean,
}) => {
  if (!staff) return null;
  
  if (!isEditing) {
      return (
         <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-6">
                 <div className="grid gap-3">
                    <div className="font-semibold">Role</div>
                    <div className="text-muted-foreground">{staff.role}</div>
                </div>
                 <div className="grid gap-3">
                    <div className="font-semibold">Location</div>
                    <div className="text-muted-foreground">{locations.find(l => l.id === staff.locationId)?.name}</div>
                </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-3">
                    <div className="font-semibold">Email Address</div>
                    <div className="text-muted-foreground">{staff.email}</div>
                </div>
                 <div className="grid gap-3">
                    <div className="font-semibold">Phone Number</div>
                    <div className="text-muted-foreground">{staff.phone}</div>
                </div>
            </div>
            <Separator />
             <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-3">
                    <div className="font-semibold">Join Date</div>
                    <div className="text-muted-foreground">{staff.joinDate}</div>
                </div>
                <div className="grid gap-3">
                    <div className="font-semibold">Status</div>
                    <Badge 
                        variant={staff.status === 'Active' ? 'default' : 'secondary'}
                        className={`w-fit ${staff.status === 'Active' ? 'bg-green-500 hover:bg-green-600' : ''}`}
                      >
                        {staff.status}
                    </Badge>
                </div>
            </div>
        </div>
      )
  }

  return (
    <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="edit-name">Full Name</Label>
            <Input id="edit-name" name="name" defaultValue={staff?.name} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="email" type="email" defaultValue={staff?.email} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" name="phone" type="tel" defaultValue={staff?.phone} required />
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="edit-locationId">Location</Label>
            <Select name="locationId" defaultValue={staff?.locationId} required>
            <SelectTrigger id="edit-locationId">
                <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
                {locations.map(loc => (
                <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select name="role" defaultValue={staff?.role} required>
                <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Reception">Reception</SelectItem>
                    <SelectItem value="Trainer">Trainer</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input id="joinDate" name="joinDate" type="date" defaultValue={staff?.joinDate} required />
            </div>
        </div>
    </div>
  );
};


export default function StaffDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const staffId = params.id as string;
  
  const [allStaff, setAllStaff] = useState<Staff[]>(initialStaff);
  const [staffMember, setStaffMember] = useState<Staff | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch this from a DB
    const foundStaff = allStaff.find(i => i.id === staffId);
    setStaffMember(foundStaff);
  }, [staffId, allStaff]);

  if (!staffMember) {
    // This can be a loading state or the notFound
    return null; 
  }
  
  const handleEditItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!staffMember) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const updatedStaffData: Staff = {
      ...staffMember,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      joinDate: formData.get("joinDate") as string,
      role: formData.get("role") as 'Admin' | 'Reception' | 'Trainer',
      locationId: formData.get("locationId") as string,
    };

    const newStaffList = allStaff.map(s => s.id === staffMember.id ? updatedStaffData : s);
    setAllStaff(newStaffList);
    setStaffMember(updatedStaffData);
    setIsEditing(false);
    toast({
        title: "Staff Member Updated",
        description: `${updatedStaffData.name}'s details have been successfully updated.`
    });
  };

  const handleDeleteItem = () => {
    if (!staffMember) return;

    const newStaffList = allStaff.filter(s => s.id !== staffMember.id);
    setAllStaff(newStaffList);
    toast({
        variant: "destructive",
        title: "Staff Member Deleted",
        description: `${staffMember.name} has been removed.`
    });
    router.push("/admin/staff");
  }

  return (
    <div className="space-y-8">
      <PageHeader title={staffMember.name}>
        <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
                <Link href="/admin/staff">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Staff List
                </Link>
            </Button>
        </div>
      </PageHeader>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="flex flex-col gap-8 md:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle>Staff Photo</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col items-center gap-4">
                        <Avatar className="w-32 h-32">
                           <AvatarImage src={staffMember.avatarUrl} alt={staffMember.name} data-ai-hint="person" />
                           <AvatarFallback>{staffMember.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                     </div>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <form onSubmit={handleEditItem}>
                    <CardHeader>
                    <CardTitle>Staff Details</CardTitle>
                    <CardDescription>
                        {isEditing ? "Edit the details of the staff member." : "A detailed view of the staff member."}
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <StaffForm staff={staffMember} isEditing={isEditing} />
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
                                    Edit Staff
                                </Button>
                                <Button type="button" variant="destructive" onClick={handleDeleteItem}>
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete Staff
                                </Button>
                            </>
                        )}
                    </CardFooter>
                </form>
            </Card>
        </div>
      </div>
    </div>
  );
}
