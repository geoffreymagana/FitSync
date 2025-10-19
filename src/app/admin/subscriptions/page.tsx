

"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  Filter,
  MoreHorizontal,
  Info,
  Calendar as CalendarIcon,
  RefreshCw,
  X,
  Pin,
  PinOff,
  Eye,
  Plus,
  Download,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, parseISO } from "date-fns";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Subscription, subscriptions as initialSubscriptions, Member, Plan } from "@/lib/data";
import { members, plans, locations } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


type SubscriptionStatus = "active" | "churned" | "delinquent" | "paused";

const statusColors: Record<SubscriptionStatus, string> = {
    active: "bg-green-500",
    churned: "bg-red-500",
    delinquent: "bg-yellow-500",
    paused: "bg-gray-500",
};

const allColumns: { key: keyof Subscription | 'member.name' | 'member.email' | 'planName', label: string, description: string }[] = [
    { key: 'member.name', label: 'Subscriber', description: 'The member who owns the subscription.' },
    { key: 'planName', label: 'Plan', description: 'The name of the subscription plan.' },
    { key: 'status', label: 'Status', description: 'The current state of the subscription (e.g., active, churned).' },
    { key: 'lastOrderAmount', label: 'Last Order Amount', description: 'The amount of the last payment made.' },
    { key: 'lastPaymentDate', label: 'Last Payment Date', description: 'The date of the most recent payment.' },
    { key: 'autoPayStatus', label: 'Auto-Pay', description: 'Whether the subscription is set to renew automatically.' },
    { key: 'cardOnFile', label: 'Card on File', description: 'Indicates if there is a saved payment method.' },
    { key: 'purchasedDate', label: 'Purchased Date', description: 'The date the subscription was originally purchased.' },
    { key: 'firstScheduleAttended', label: 'First Schedule', description: 'The date the member first attended a class with this subscription.' },
    { key: 'lastScheduleAttended', label: 'Last Schedule', description: 'The date the member last attended a class.' },
    { key: 'timeRemaining', label: 'Time Remaining', description: 'Time left until the current subscription period expires.' },
];

const defaultVisibleColumns: (keyof Subscription | 'member.name' | 'member.email' | 'planName')[] = [
    'member.name', 'planName', 'status', 'lastOrderAmount', 'lastPaymentDate'
];

type FilterItem = {
    type: 'status' | 'plan' | 'location';
    value: string;
    label: string;
};

const statusTooltips: Record<SubscriptionStatus, string> = {
    active: "Subscriptions that are current and paid.",
    churned: "Subscriptions that have been canceled or have expired.",
    delinquent: "Subscriptions with failed payments.",
    paused: "Subscriptions that are temporarily paused by the member or admin.",
};

const trialStatusTooltips: Record<string, string> = {
    'trial': "Total number of subscriptions that started as a trial.",
    'active': "Trial subscriptions that are currently active.",
    'churned': "Trial subscriptions that were canceled or expired during the trial period.",
    'converted': "Trial subscriptions that have successfully converted to a paid plan.",
    'conversion': "The percentage of trials that converted to a paid plan.",
};


export default function SubscriptionsPage() {
    const { toast } = useToast();
    const [subscriptions, setSubscriptions] = React.useState<Subscription[]>(initialSubscriptions);
    const [date, setDate] = React.useState<DateRange | undefined>(undefined);
    const [activeFilters, setActiveFilters] = React.useState<FilterItem[]>([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['member.name']);
    const [visibleColumns, setVisibleColumns] = React.useState<string[]>(defaultVisibleColumns);
    const [isCreateOrderOpen, setIsCreateOrderOpen] = React.useState(false);

    const statusCounts = React.useMemo(() => {
        return initialSubscriptions.reduce((acc, sub) => {
            acc[sub.status] = (acc[sub.status] || 0) + 1;
            return acc;
        }, {} as Record<SubscriptionStatus, number>);
    }, []);

    const filteredSubscriptions = React.useMemo(() => {
        let filtered = subscriptions;

        const statusFilters = activeFilters.filter(f => f.type === 'status').map(f => f.value);
        if (statusFilters.length > 0) {
            filtered = filtered.filter(s => statusFilters.includes(s.status as SubscriptionStatus));
        }

        const planFilters = activeFilters.filter(f => f.type === 'plan').map(f => f.value);
        if (planFilters.length > 0) {
            filtered = filtered.filter(s => planFilters.includes(s.planName));
        }
        
        const locationFilters = activeFilters.filter(f => f.type === 'location').map(f => f.value);
        if (locationFilters.length > 0) {
            filtered = filtered.filter(s => locationFilters.includes(s.member.locationId));
        }
        
        if(date?.from && date?.to) {
            filtered = filtered.filter(s => {
                const paymentDate = parseISO(s.lastPaymentDate);
                return paymentDate >= date!.from! && paymentDate <= date!.to!;
            });
        }
        
        if (searchTerm) {
            const lowercasedQuery = searchTerm.toLowerCase();
            filtered = filtered.filter(s => 
                s.member.name.toLowerCase().includes(lowercasedQuery) ||
                s.member.email.toLowerCase().includes(lowercasedQuery) ||
                s.id.toLowerCase().includes(lowercasedQuery)
            )
        }
        return filtered;
    }, [subscriptions, activeFilters, date, searchTerm]);
    
    const statusCards = {
        'total': initialSubscriptions.length,
        'active': statusCounts.active || 0,
        'churned': statusCounts.churned || 0,
        'delinquent': statusCounts.delinquent || 0,
        'paused': statusCounts.paused || 0,
    };
    
    const trialCards = {
        'trial': 52,
        'active': 38,
        'churned': 14,
        'converted': 28,
        'conversion': "73.7%"
    }


    const addFilter = (filter: FilterItem) => {
        if (!activeFilters.some(f => f.type === filter.type && f.value === filter.value)) {
            setActiveFilters(prev => [...prev, filter]);
        }
    };
    
    const removeFilter = (filter: FilterItem) => {
        setActiveFilters(prev => prev.filter(f => !(f.type === filter.type && f.value === filter.value)));
    }

    const clearFilters = () => {
        setActiveFilters([]);
        setDate(undefined);
        setSearchTerm("");
    }
    
    const togglePin = (columnKey: string) => {
        setPinnedColumns(prev => {
            if (prev.includes(columnKey)) {
                return prev.filter(c => c !== columnKey);
            }
            return [...prev, columnKey];
        });
    }

    const orderedColumns = React.useMemo(() => {
        const pinned = pinnedColumns.map(key => allColumns.find(c => c.key === key)!);
        const unpinned = allColumns.filter(c => !pinnedColumns.includes(c.key) && visibleColumns.includes(c.key));
        return { pinned, unpinned };
    }, [pinnedColumns, visibleColumns]);
    
    const filterOptions = [
        {
            type: 'status',
            heading: 'Status',
            options: (Object.keys(statusCounts) as SubscriptionStatus[]).map(status => ({
                value: status,
                label: `${status.charAt(0).toUpperCase() + status.slice(1)}`
            }))
        },
        {
            type: 'plan',
            heading: 'Plan',
            options: [...new Set(subscriptions.map(s => s.planName))].map(planName => ({
                value: planName,
                label: planName,
            }))
        },
        {
            type: 'location',
            heading: 'Location',
            options: locations.map(loc => ({
                value: loc.id,
                label: loc.name,
            }))
        }
    ];

    const getNestedValue = (obj: any, path: string) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

    const handleExport = () => {
        const headers = orderedColumns.pinned.concat(orderedColumns.unpinned).map(col => col.label);
        const keys = orderedColumns.pinned.concat(orderedColumns.unpinned).map(col => col.key);

        const csvContent = [
            headers.join(','),
            ...filteredSubscriptions.map(sub => 
                keys.map(key => {
                    const value = getNestedValue(sub, key);
                    if (typeof value === 'string' && value.includes(',')) {
                        return `"${value}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `subscriptions-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({ title: "Export Started", description: "Your data is being downloaded." });
    };

  return (
    <div className="space-y-6">
       <Tabs defaultValue="all">
        <PageHeader title="Subscriptions">
            <TabsList className="grid w-full grid-cols-2 max-w-[200px]">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="trials">Trials</TabsTrigger>
            </TabsList>
        </PageHeader>

        <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <TooltipProvider>
                    {(Object.keys(statusCards) as (keyof typeof statusCards)[]).map(statusKey => (
                         <Tooltip key={statusKey}>
                            <TooltipTrigger asChild>
                                <Card className="flex-1 min-w-[180px] cursor-pointer hover:bg-muted" onClick={() => { if(statusKey !== 'total') addFilter({type: 'status', value: statusKey, label: statusKey})}}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium capitalize">{statusKey}</CardTitle>
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{statusCards[statusKey]}</div>
                                    </CardContent>
                                </Card>
                            </TooltipTrigger>
                             <TooltipContent className="bg-black text-white">
                                <p>{statusKey === 'total' ? 'All subscriptions regardless of status.' : statusTooltips[statusKey as SubscriptionStatus]}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>
        </TabsContent>
        <TabsContent value="trials" className="space-y-6">
             <div className="flex flex-wrap items-center gap-2">
                <TooltipProvider>
                {(Object.keys(trialCards) as (keyof typeof trialCards)[]).map(key => (
                     <Tooltip key={key}>
                        <TooltipTrigger asChild>
                            <Card key={key} className="flex-1 min-w-[150px]">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium capitalize">{key}</CardTitle>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{trialCards[key]}</div>
                                </CardContent>
                            </Card>
                         </TooltipTrigger>
                         <TooltipContent className="bg-black text-white">
                            <p>{trialStatusTooltips[key]}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
                </TooltipProvider>
            </div>
        </TabsContent>
      </Tabs>
      
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-2 pb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <Input placeholder="Search..." className="pl-8 h-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                             <ChevronsUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button id="date" variant="outline" className={cn("w-[240px] justify-start text-left font-normal h-9", !date && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (date.to ? `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}` : format(date.from, "LLL dd, y")) : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
                            </PopoverContent>
                        </Popover>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="gap-2 h-9">
                                <Filter className="h-4 w-4" />
                                Add Filter
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start" className="p-0">
                                <Command>
                                    <CommandInput placeholder="Filter by..."/>
                                    <CommandList>
                                        <CommandEmpty>No filters found.</CommandEmpty>
                                        {filterOptions.map(group => (
                                             <CommandGroup key={group.type} heading={group.heading}>
                                                {group.options.map(option => (
                                                    <CommandItem key={option.value} onSelect={() => addFilter({ type: group.type as 'status' | 'plan' | 'location', value: option.value, label: option.label })}>
                                                        {option.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        ))}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                     <div className="flex items-center gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="h-9 gap-2">
                                    <Eye className="h-4 w-4" />
                                    Columns
                                </Button>
                            </PopoverTrigger>
                             <PopoverContent>
                                <div className="space-y-2">
                                    <p className="font-medium">Visible Columns</p>
                                    <TooltipProvider>
                                    {allColumns.map(col => (
                                        <div key={col.key} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`col-${col.key}`}
                                                checked={visibleColumns.includes(col.key)}
                                                onCheckedChange={(checked) => {
                                                    setVisibleColumns(prev => 
                                                        checked ? [...prev, col.key] : prev.filter(c => c !== col.key)
                                                    );
                                                }}
                                            />
                                             <Label htmlFor={`col-${col.key}`} className="flex items-center justify-between w-full">
                                                <span>{col.label}</span>
                                                <Tooltip delayDuration={300}>
                                                    <TooltipTrigger asChild>
                                                        <Info className="w-3 h-3 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-black text-white" side="right">
                                                        <p>{col.description}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Label>
                                        </div>
                                    ))}
                                    </TooltipProvider>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Button onClick={handleExport} variant="outline" className="h-9 gap-2">
                            <Download className="h-4 w-4" />
                            Export
                        </Button>
                        <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> Create Order
                                </Button>
                            </DialogTrigger>
                            <CreateOrderDialog onClose={() => setIsCreateOrderOpen(false)} />
                        </Dialog>
                    </div>
                </div>
                 {activeFilters.length > 0 && (
                    <div className="flex items-center gap-2 pb-4">
                        {activeFilters.map(filter => (
                             <Badge key={`${filter.type}-${filter.value}`} variant="secondary" className="pl-1.5 pr-1">
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-muted-foreground">{filter.type}:</span>
                                    <span className="font-semibold">{filter.label}</span>
                                    <button onClick={() => removeFilter(filter)} className="rounded-full hover:bg-muted p-0.5">
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            </Badge>
                        ))}
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-primary hover:text-primary gap-1 h-auto p-1">
                            <RefreshCw className="h-3 w-3" />
                            Clear all
                        </Button>
                    </div>
                )}
                 <div className="relative w-full overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {orderedColumns.pinned.map((col, index) => (
                                <TableCell 
                                    key={col.key} 
                                    className="font-semibold sticky top-0 bg-background group whitespace-nowrap"
                                    style={{ left: `${index * 150}px`, zIndex: 21 - index }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{col.label}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 opacity-0 group-hover:opacity-100"
                                            onClick={() => {
                                                if (!pinnedColumns.includes(col.key) && pinnedColumns.length >= 3) {
                                                    toast({
                                                        variant: "destructive",
                                                        title: "Pin Limit Reached",
                                                        description: "You can only pin a maximum of 3 columns.",
                                                    });
                                                } else {
                                                    togglePin(col.key);
                                                }
                                            }}
                                        >
                                            {pinnedColumns.includes(col.key) ? <PinOff className="h-3 w-3"/> : <Pin className="h-3 w-3" />}
                                        </Button>
                                    </div>
                                </TableCell>
                                ))}
                                {orderedColumns.unpinned.map(col => (
                                    <TableCell key={col.key} className="font-semibold bg-background top-0 sticky group whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span>{col.label}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 opacity-0 group-hover:opacity-100"
                                                onClick={() => {
                                                     if (!pinnedColumns.includes(col.key) && pinnedColumns.length >= 3) {
                                                        toast({
                                                            variant: "destructive",
                                                            title: "Pin Limit Reached",
                                                            description: "You can only pin a maximum of 3 columns.",
                                                        });
                                                    } else {
                                                        togglePin(col.key);
                                                    }
                                                }}
                                            >
                                                {pinnedColumns.includes(col.key) ? <PinOff className="h-3 w-3"/> : <Pin className="h-3 w-3" />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                ))}
                                <TableCell className="font-semibold text-right bg-background top-0 sticky right-0">Actions</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredSubscriptions.length > 0 ? (
                            filteredSubscriptions.map((sub) => (
                            <TableRow key={sub.id}>
                                {orderedColumns.pinned.map((col, index) => (
                                    <TableCell key={col.key} className={cn("sticky bg-background", { 'border-r': index === orderedColumns.pinned.length -1 })} style={{ left: `${index * 150}px`, zIndex: 11 - index }}>
                                        {col.key === 'member.name' ? (
                                            <div className="flex items-center space-x-3">
                                                <Avatar>
                                                    <AvatarImage src={sub.member.avatarUrl} alt={sub.member.name} data-ai-hint="person" />
                                                    <AvatarFallback>{sub.member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{sub.member.name}</div>
                                                    <div className="text-sm text-muted-foreground">{sub.member.email}</div>
                                                </div>
                                            </div>
                                        ) : col.key === 'status' ? (
                                            <Badge variant="outline" className="capitalize flex items-center gap-2 w-fit">
                                                <span className={`w-2 h-2 rounded-full ${statusColors[sub.status]}`}></span>
                                                {sub.status}
                                            </Badge>
                                        ) : col.key === 'lastOrderAmount' ? (
                                            `KES ${getNestedValue(sub, col.key).toLocaleString()}`
                                        ) : (
                                            <span>{getNestedValue(sub, col.key)}</span>
                                        )}
                                    </TableCell>
                                ))}
                                {orderedColumns.unpinned.map(col => (
                                    <TableCell key={col.key}>
                                        {col.key === 'status' ? (
                                            <Badge variant="outline" className="capitalize flex items-center gap-2 w-fit">
                                                <span className={`w-2 h-2 rounded-full ${statusColors[sub.status]}`}></span>
                                                {sub.status}
                                            </Badge>
                                        ) : col.key === 'lastOrderAmount' ? (
                                            `KES ${sub.lastOrderAmount.toLocaleString()}`
                                        ) : col.key === 'autoPayStatus' || col.key === 'cardOnFile' ? (
                                            getNestedValue(sub, col.key) ? 'Yes' : 'No'
                                        ) : (
                                            <span>{getNestedValue(sub, col.key)}</span>
                                        )}
                                    </TableCell>
                                ))}
                                <TableCell className="text-right sticky right-0 bg-background z-10">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem>Pause Subscription</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Cancel Subscription</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={visibleColumns.length + 1} className="h-24 text-center">
                                No results.
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


function CreateOrderDialog({ onClose }: { onClose: () => void }) {
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | null>(null);
  const { toast } = useToast();

  const handleCreateOrder = () => {
    if (!selectedMember || !selectedPlan) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a member and a plan.",
      });
      return;
    }
    toast({
      title: "Order Created (Simulated)",
      description: `New subscription for ${selectedMember.name} on the ${selectedPlan.name} plan created.`,
    });
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New Subscription Order</DialogTitle>
        <DialogDescription>
          Select a member and a plan to create a new subscription.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="member" className="text-right">
            Member
          </Label>
          <MemberCombobox onSelectMember={setSelectedMember} />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="plan" className="text-right">
            Plan
          </Label>
          <Select onValueChange={(planId) => setSelectedPlan(plans.find(p => p.id === planId) || null)}>
            <SelectTrigger id="plan" className="col-span-3">
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              {plans.map(plan => (
                <SelectItem key={plan.id} value={plan.id}>{plan.name} - KES {plan.price.toLocaleString()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" onClick={handleCreateOrder}>Create Order</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function MemberCombobox({ onSelectMember }: { onSelectMember: (member: Member | null) => void }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="col-span-3 justify-between"
        >
          {value
            ? members.find((member) => member.name === value)?.name
            : "Select member..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search member..." />
          <CommandList>
            <CommandEmpty>No member found.</CommandEmpty>
            <CommandGroup>
              {members.map((member) => (
                <CommandItem
                  key={member.id}
                  value={member.name}
                  onSelect={(currentValue) => {
                    const selected = members.find(m => m.name.toLowerCase() === currentValue.toLowerCase()) || null;
                    setValue(selected ? selected.name : "");
                    onSelectMember(selected);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === member.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {member.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

    