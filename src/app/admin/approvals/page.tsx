
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { members as initialMembers, classes as initialClasses, locations, Class, Member } from "@/lib/data";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const CLASSES_STORAGE_KEY = 'fitsync_all_classes';

export default function ApprovalsPage() {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [allClasses, setAllClasses] = useState<Class[]>(initialClasses);
  
  useEffect(() => {
    const storedClasses = localStorage.getItem(CLASSES_STORAGE_KEY);
    if (storedClasses) {
        try {
            setAllClasses(JSON.parse(storedClasses));
        } catch (e) {
            console.error("Failed to parse classes from local storage", e);
        }
    }
  }, []);

  const pendingMembers = members.filter(member => member.status === 'Pending');
  const pendingClasses = allClasses.filter(cls => cls.status === 'Pending');

  const handleMemberApproval = (memberId: string, approve: boolean) => {
    setMembers(prev => prev.map(member => 
        member.id === memberId ? { ...member, status: approve ? 'Active' : 'Inactive' } : member
    ));
    const member = members.find(m => m.id === memberId);
    toast({
        title: `Member ${approve ? 'Approved' : 'Rejected'}`,
        description: `${member?.name}'s account has been ${approve ? 'activated' : 'rejected'}.`
    });
  };

  const handleClassApproval = (classId: string, approve: boolean) => {
    const updatedClasses = allClasses.map(cls => 
        cls.id === classId ? { ...cls, status: approve ? 'Approved' : 'Rejected' } : cls
    );
    setAllClasses(updatedClasses);
    localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(updatedClasses));

    const cls = allClasses.find(c => c.id === classId);
    toast({
        title: `Class ${approve ? 'Approved' : 'Rejected'}`,
        description: `The class "${cls?.name}" has been ${approve ? 'approved' : 'rejected'}.`
    });
  };


  return (
    <div className="space-y-8">
      <PageHeader title="Approvals" />

      <Card>
        <CardHeader>
          <CardTitle>Pending Sign-ups</CardTitle>
          <CardDescription>Review and approve new customer accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Location</TableHead>
                  <TableHead className="hidden md:table-cell">Sign-up Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingMembers.length > 0 ? (
                  pendingMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="hidden sm:flex">
                            <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person" />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{locations.find(l => l.id === member.locationId)?.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{member.joinDate}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="mr-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white" onClick={() => handleMemberApproval(member.id, true)}>
                          <Check className="mr-1 h-4 w-4" />
                          <span className="hidden sm:inline">Approve</span>
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white" onClick={() => handleMemberApproval(member.id, false)}>
                          <X className="mr-1 h-4 w-4" />
                          <span className="hidden sm:inline">Reject</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      No pending sign-ups.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Class Schedules</CardTitle>
          <CardDescription>Review and approve new classes created by instructors.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingClasses.length > 0 ? (
                  pendingClasses.map(cls => (
                    <TableRow key={cls.id}>
                      <TableCell>
                        <div className="font-medium">{cls.name}</div>
                        <div className="text-sm text-muted-foreground">{locations.find(l => l.id === cls.locationId)?.name}</div>
                      </TableCell>
                      <TableCell>{cls.trainer}</TableCell>
                      <TableCell>{cls.date} at {cls.time}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="mr-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white" onClick={() => handleClassApproval(cls.id, true)}>
                          <Check className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white" onClick={() => handleClassApproval(cls.id, false)}>
                          <X className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      No pending classes to review.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
