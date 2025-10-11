
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { staff as initialStaff, Staff } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  const openEditDialog = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsEditDialogOpen(true);
  };

  const handleAddStaff = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newStaff: Staff = {
      id: `S${staff.length + 1}`,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as 'Admin' | 'Reception' | 'Trainer',
      status: 'Active',
      avatarUrl: 'https://picsum.photos/seed/newStaff/100/100'
    };
    setStaff([...staff, newStaff]);
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleEditStaff = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedStaff) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const updatedStaff = {
      ...selectedStaff,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as 'Admin' | 'Reception' | 'Trainer',
    };

    setStaff(staff.map(s => s.id === selectedStaff.id ? updatedStaff : s));
    setIsEditDialogOpen(false);
    setSelectedStaff(null);
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Staff Management">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2" />
          Add Staff
        </Button>
      </PageHeader>

      <Card>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map(staffMember => (
                  <TableRow key={staffMember.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="hidden sm:flex">
                          <AvatarImage src={staffMember.avatarUrl} alt={staffMember.name} data-ai-hint="person" />
                          <AvatarFallback>{staffMember.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{staffMember.name}</div>
                          <div className="text-sm text-muted-foreground">{staffMember.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{staffMember.role}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={staffMember.status === 'Active' ? 'default' : 'secondary'}
                        className={staffMember.status === 'Active' ? 'bg-green-500 hover:bg-green-600' : ''}
                      >
                        {staffMember.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditDialog(staffMember)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>
              Onboard a new member to your team.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStaff}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="Jane Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="staff@fitsync.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                 <Select name="role" required>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Reception">Reception</SelectItem>
                    <SelectItem value="Trainer">Trainer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Add Staff</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

       {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
            <DialogDescription>
              Update the details for {selectedStaff?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditStaff}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input id="edit-name" name="name" defaultValue={selectedStaff?.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="email" type="email" defaultValue={selectedStaff?.email} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                 <Select name="role" defaultValue={selectedStaff?.role} required>
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
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
