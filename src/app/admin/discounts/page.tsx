
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { discounts as initialDiscounts, Discount, walkInServices, locations } from "@/lib/data";
import { MoreHorizontal, PlusCircle, Check, X, Calendar as CalendarIcon, ChevronsUpDown } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, parseISO, isWithinInterval, startOfToday, isBefore, isAfter, isSameDay } from "date-fns";
import { LocationSwitcher } from "@/components/location-switcher";

const getDiscountStatus = (discount: Discount): { text: string; variant: "default" | "secondary" | "outline" | "destructive", className?: string } => {
    if (discount.status === 'Inactive') {
        return { text: 'Inactive', variant: 'secondary' };
    }
    
    const today = startOfToday();
    const hasStartDate = !!discount.startDate;
    const hasEndDate = !!discount.endDate;

    if (hasStartDate && hasEndDate) {
        const start = parseISO(discount.startDate!);
        const end = parseISO(discount.endDate!);
        if (isWithinInterval(today, { start, end })) {
            return { text: 'Active', variant: 'default', className: 'bg-green-500' };
        } else if (isBefore(today, start)) {
            return { text: 'Scheduled', variant: 'outline' };
        } else {
            return { text: 'Expired', variant: 'destructive' };
        }
    } else if (hasStartDate) {
        const start = parseISO(discount.startDate!);
        return isAfter(today, start) || isSameDay(today, start) 
            ? { text: 'Active', variant: 'default', className: 'bg-green-500' }
            : { text: 'Scheduled', variant: 'outline' };
    } else if (hasEndDate) {
        const end = parseISO(discount.endDate!);
        return isBefore(today, end) || isSameDay(today, end)
            ? { text: 'Active', variant: 'default', className: 'bg-green-500' }
            : { text: 'Expired', variant: 'destructive' };
    }

    return { text: 'Active', variant: 'default', className: 'bg-green-500' };
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('all');

  const filteredDiscounts = useMemo(() => {
    if (selectedLocation === 'all') return discounts;
    return discounts.filter(d => d.locationId === selectedLocation || d.locationId === 'all');
  }, [discounts, selectedLocation]);

  const openEditDialog = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsEditDialogOpen(true);
  };
  
  const handleToggleStatus = (discountId: string) => {
    setDiscounts(prev => prev.map(d => 
        d.id === discountId ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d
    ));
  };

  const handleAddDiscount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newDiscount: Discount = {
      id: `D${discounts.length + 1}`,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as 'percentage' | 'fixed',
      value: Number(formData.get("value")),
      appliesTo: formData.get("appliesTo") as 'all' | 'service',
      serviceId: formData.get("serviceId") as string || undefined,
      locationId: formData.get("locationId") as string,
      status: 'Active',
      startDate: formData.get("startDate") as string || undefined,
      endDate: formData.get("endDate") as string || undefined,
    };
    setDiscounts([...discounts, newDiscount]);
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleEditDiscount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDiscount) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const updatedDiscount: Discount = {
      ...selectedDiscount,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as 'percentage' | 'fixed',
      value: Number(formData.get("value")),
      appliesTo: formData.get("appliesTo") as 'all' | 'service',
      serviceId: formData.get("serviceId") as string || undefined,
      locationId: formData.get("locationId") as string,
      startDate: formData.get("startDate") as string || undefined,
      endDate: formData.get("endDate") as string || undefined,
    };

    setDiscounts(discounts.map(d => d.id === selectedDiscount.id ? updatedDiscount : d));
    setIsEditDialogOpen(false);
    setSelectedDiscount(null);
  };
  
  const sortedServices = useMemo(() => {
    return [...walkInServices].sort((a, b) => a.name.localeCompare(b.name));
  }, []);
  
  const allLocations = [{ id: 'all', name: 'All Locations' }, ...locations];

  return (
    <div className="space-y-8">
      <PageHeader title="Discounts & Promotions">
        <div className="flex items-center gap-2">
            <LocationSwitcher 
                locations={allLocations} 
                selectedLocation={selectedLocation} 
                onLocationChange={setSelectedLocation} 
            />
            <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2" />
            Add Discount
            </Button>
        </div>
      </PageHeader>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="hidden md:table-cell">Applies To</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden sm:table-cell">Date Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDiscounts.map(discount => {
                const statusInfo = getDiscountStatus(discount);
                const locationName = discount.locationId === 'all' 
                    ? 'All Locations' 
                    : locations.find(l => l.id === discount.locationId)?.name || 'Unknown';
                return (
                    <TableRow key={discount.id}>
                    <TableCell className="font-medium">{discount.name}</TableCell>
                    <TableCell>
                        {discount.type === 'percentage' ? `${discount.value}%` : `KES ${discount.value.toLocaleString()}`}
                    </TableCell>
                    <TableCell className="capitalize hidden md:table-cell">
                        {discount.appliesTo === 'all' ? 'All Items' : walkInServices.find(s => s.id === discount.serviceId)?.name || 'Specific Service'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{locationName}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                        {discount.startDate || discount.endDate ? (
                            `${discount.startDate ? format(parseISO(discount.startDate), 'PP') : '...'} - ${discount.endDate ? format(parseISO(discount.endDate), 'PP') : '...'}`
                        ) : (
                            <span className="text-muted-foreground">Always active</span>
                        )}
                    </TableCell>
                    <TableCell>
                        <Badge variant={statusInfo.variant} className={statusInfo.className}>
                            {statusInfo.text}
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
                            <DropdownMenuItem onClick={() => openEditDialog(discount)}>Edit</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleStatus(discount.id)}>
                                {discount.status === 'Active' ? <><X className="mr-2 h-4 w-4"/>Deactivate</> : <><Check className="mr-2 h-4 w-4"/>Activate</>}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <DiscountFormDialog
        title="Add New Discount"
        description="Create a new discount or promotion for your POS system."
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddDiscount}
        services={sortedServices}
        locations={allLocations}
      />
      <DiscountFormDialog
        title="Edit Discount"
        description="Update the details for this discount."
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditDiscount}
        discount={selectedDiscount}
        services={sortedServices}
        locations={allLocations}
      />

    </div>
  );
}

interface DiscountFormDialogProps {
    title: string;
    description: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    discount?: Discount | null;
    services: { id: string; name: string }[];
    locations: { id: string; name: string }[];
}

function ServiceCombobox({ services, value, onValueChange, ...props }: { services: { id: string, name: string }[], value: string, onValueChange: (value: string) => void }) {
    const [open, setOpen] = useState(false);
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <Input type="hidden" name="serviceId" value={value} />
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between" {...props}>
            {value ? services.find((s) => s.id === value)?.name : "Select a service..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search service..." />
            <CommandList>
              <CommandEmpty>No service found.</CommandEmpty>
              <CommandGroup>
                {services.map((s) => (
                  <CommandItem key={s.id} value={s.name} onSelect={() => { onValueChange(s.id); setOpen(false); }}>
                    <Check className={cn("mr-2 h-4 w-4", value === s.id ? "opacity-100" : "opacity-0")} />
                    {s.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
}

function DiscountFormDialog({ title, description, isOpen, onOpenChange, onSubmit, discount, services, locations }: DiscountFormDialogProps) {
    const [appliesTo, setAppliesTo] = useState(discount?.appliesTo || 'all');
    const [startDate, setStartDate] = React.useState<Date | undefined>(discount?.startDate ? parseISO(discount.startDate) : undefined);
    const [endDate, setEndDate] = React.useState<Date | undefined>(discount?.endDate ? parseISO(discount.endDate) : undefined);
    const [serviceId, setServiceId] = useState(discount?.serviceId || "");

    React.useEffect(() => {
        if (isOpen) {
          if (discount) {
            setAppliesTo(discount.appliesTo);
            setStartDate(discount.startDate ? parseISO(discount.startDate) : undefined);
            setEndDate(discount.endDate ? parseISO(discount.endDate) : undefined);
            setServiceId(discount.serviceId || "");
          } else {
            // Reset for new entry
            setAppliesTo('all');
            setStartDate(undefined);
            setEndDate(undefined);
            setServiceId("");
          }
        }
    }, [isOpen, discount]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Discount Name</Label>
                            <Input id="name" name="name" placeholder="e.g., Student Discount" defaultValue={discount?.name} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" placeholder="A short description of the discount." defaultValue={discount?.description} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select name="type" defaultValue={discount?.type || 'percentage'} required>
                                    <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount (KES)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="value">Value</Label>
                                <Input id="value" name="value" type="number" placeholder="e.g., 15 or 200" defaultValue={discount?.value} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="locationId">Location</Label>
                            <Select name="locationId" defaultValue={discount?.locationId || 'all'} required>
                                <SelectTrigger id="locationId"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {locations.map(loc => (
                                        <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                            <div className="space-y-2">
                                <Label htmlFor="appliesTo">Applies To</Label>
                                <Select name="appliesTo" value={appliesTo} onValueChange={(value) => setAppliesTo(value as 'all' | 'service')} required>
                                    <SelectTrigger id="appliesTo"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Walk-in Items</SelectItem>
                                        <SelectItem value="service">A Specific Service</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {appliesTo === 'service' && (
                                <div className="space-y-2">
                                    <Label htmlFor="serviceId">Specific Service</Label>
                                    <ServiceCombobox services={services} value={serviceId} onValueChange={setServiceId} />
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date (optional)</Label>
                                <Input name="startDate" type="hidden" value={startDate ? format(startDate, 'yyyy-MM-dd') : ''} />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                             <div className="space-y-2">
                                <Label>End Date (optional)</Label>
                                 <Input name="endDate" type="hidden" value={endDate ? format(endDate, 'yyyy-MM-dd') : ''} />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={(date) => startDate ? isBefore(date, startDate) : false} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">Save Discount</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

    

    