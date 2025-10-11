
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trainers as initialTrainers, locations, Trainer, trainerSpecializations } from "@/lib/data";
import { MoreHorizontal, PlusCircle, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LocationSwitcher } from "@/components/location-switcher";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function TrainersPage() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0].id);
  const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  const filteredTrainers = trainers.filter(trainer => trainer.locationId === selectedLocation);

  const openEditDialog = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setIsEditDialogOpen(true);
  };

  const handleAddTrainer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newTrainer: Trainer = {
      id: `T${trainers.length + 1}`,
      name: formData.get("name") as string,
      specialization: formData.get("specialization") as string,
      locationId: formData.get("locationId") as string,
      status: 'On-Duty',
      clients: 0,
      avatarUrl: 'https://picsum.photos/seed/newTrainer/100/100',
    };
    setTrainers([...trainers, newTrainer]);
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleEditTrainer = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTrainer) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const updatedTrainer = {
      ...selectedTrainer,
      name: formData.get("name") as string,
      specialization: formData.get("specialization") as string,
      locationId: formData.get("locationId") as string,
    };

    setTrainers(trainers.map(t => t.id === selectedTrainer.id ? updatedTrainer : t));
    setIsEditDialogOpen(false);
    setSelectedTrainer(null);
  };


  return (
    <div className="space-y-8">
      <PageHeader title="Trainers">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <LocationSwitcher selectedLocation={selectedLocation} onLocationChange={setSelectedLocation} />
          <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
            <PlusCircle className="mr-2" />
            Add Trainer
          </Button>
           <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2" />
            Export
          </Button>
        </div>
      </PageHeader>

      <Card>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Specialization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Clients</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrainers.map(trainer => (
                  <TableRow key={trainer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="hidden sm:flex">
                          <AvatarImage src={trainer.avatarUrl} alt={trainer.name} data-ai-hint="person" />
                          <AvatarFallback>{trainer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{trainer.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{trainer.specialization}</TableCell>
                    <TableCell>
                      <Badge variant={trainer.status === 'On-Duty' ? 'default' : 'secondary'}>
                        {trainer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{trainer.clients}</TableCell>
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
                          <DropdownMenuItem onClick={() => openEditDialog(trainer)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Schedule</DropdownMenuItem>
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

      {/* Add Trainer Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Trainer</DialogTitle>
            <DialogDescription>
              Add a new trainer to your staff.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTrainer}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Smith" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select name="specialization" required>
                    <SelectTrigger id="specialization">
                        <SelectValue placeholder="Select a specialization" />
                    </SelectTrigger>
                    <SelectContent>
                        {trainerSpecializations.map(spec => (
                            <SelectItem key={spec.value} value={spec.label}>{spec.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationId">Location</Label>
                 <Select name="locationId" defaultValue={selectedLocation} required>
                  <SelectTrigger id="locationId">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => (
                      <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Add Trainer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Trainer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Trainer</DialogTitle>
            <DialogDescription>
              Update the details for {selectedTrainer?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditTrainer}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input id="edit-name" name="name" defaultValue={selectedTrainer?.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-specialization">Specialization</Label>
                 <Select name="specialization" defaultValue={selectedTrainer?.specialization} required>
                    <SelectTrigger id="edit-specialization">
                        <SelectValue placeholder="Select a specialization" />
                    </SelectTrigger>
                    <SelectContent>
                        {trainerSpecializations.map(spec => (
                            <SelectItem key={spec.value} value={spec.label}>{spec.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-locationId">Location</Label>
                 <Select name="locationId" defaultValue={selectedTrainer?.locationId} required>
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
