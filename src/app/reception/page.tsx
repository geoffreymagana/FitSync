
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, QrCode } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useContext, useState, useEffect } from "react";
import { upcomingClasses, recentActivities as initialRecentActivities, members, Member, Activity } from "@/lib/data";
import { ReceptionContext } from "@/context/reception-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";
import Link from "next/link";
import { differenceInHours, formatDistanceToNow } from "date-fns";

const QrScanner = dynamic(() => import('@/components/qr-scanner').then(mod => mod.QrScanner), {
  loading: () => <p>Loading scanner...</p>,
  ssr: false,
});


export default function ReceptionDashboardPage() {
  const { selectedLocation } = useContext(ReceptionContext);
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [recentActivities, setRecentActivities] = useState<Activity[]>(initialRecentActivities);

  useEffect(() => {
    if (!selectedLocation) return;
    const handleSearch = () => {
      setHasSearched(true);
      if (!searchQuery) {
        setSearchResults([]);
        setHasSearched(false);
        return;
      }
      const lowercasedQuery = searchQuery.toLowerCase();
      const results = members.filter(member =>
        member.locationId === selectedLocation.id &&
        (member.name.toLowerCase().includes(lowercasedQuery) ||
         member.email.toLowerCase().includes(lowercasedQuery) ||
         member.id.toLowerCase().includes(lowercasedQuery))
      );
      setSearchResults(results);
    };

    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 300); // Debounce search to avoid too many re-renders

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedLocation]);

  const openCheckInDialog = (member: Member) => {
    setSelectedMember(member);
    setIsCheckInDialogOpen(true);
  }
  
  const handleCheckIn = () => {
    if (!selectedMember) return;
    
    const lastCheckIn = recentActivities
        .filter(activity => activity.member.id === selectedMember.id && activity.description.includes('Checked in'))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    if (lastCheckIn && differenceInHours(new Date(), new Date(lastCheckIn.timestamp)) < 24) {
        toast({
            variant: "destructive",
            title: "Already Checked In",
            description: `${selectedMember.name} has already checked in within the last 24 hours.`,
        });
        setIsCheckInDialogOpen(false);
        return;
    }

    const newActivity: Activity = {
      id: `A${Date.now()}`,
      description: `Checked in successfully.`,
      timestamp: new Date().toISOString(),
      member: {
        id: selectedMember.id,
        name: selectedMember.name,
        avatarUrl: selectedMember.avatarUrl
      }
    };
    
    setRecentActivities([newActivity, ...recentActivities]);

    toast({
      title: "Check-in Successful",
      description: `${selectedMember.name} has been checked in.`,
    });
    
    setIsCheckInDialogOpen(false);
    setSelectedMember(null);
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  }

  const handleQrScan = (result: string | null) => {
    if (result) {
      setIsQrDialogOpen(false);
      const member = members.find(m => m.id === result && m.locationId === selectedLocation?.id);
      if (member) {
        openCheckInDialog(member);
      } else {
        toast({
          variant: "destructive",
          title: "Member not found",
          description: "No member with the scanned ID found at this location."
        });
      }
    }
  };

  if (!selectedLocation) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <PageHeader title={`Reception: ${selectedLocation.name}`} />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Check-in Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Member Check-In</CardTitle>
              <CardDescription>Search for a member to check them in or scan their QR code.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex w-full items-center space-x-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name, email, or member ID..." 
                    className="pl-12 h-12 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="h-12">
                            <QrCode className="mr-2 h-4 w-4" />
                            Scan QR
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Scan Member QR Code</DialogTitle>
                        </DialogHeader>
                        <QrScanner onScan={handleQrScan} />
                    </DialogContent>
                </Dialog>
              </div>
              {hasSearched && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium">Search Results</h3>
                  {searchResults.length > 0 ? (
                    searchResults.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person" />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <Button size="sm" onClick={() => openCheckInDialog(member)}>Check-in</Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground p-4 border rounded-md">
                        No members found matching your search.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

           <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest member check-ins and activities at this location.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={activity.member.avatarUrl} alt={activity.member.name} data-ai-hint="person" />
                      <AvatarFallback>{activity.member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <p className="text-sm font-medium">{activity.member.name}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Classes happening today at this location.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingClasses.map(cls => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">
                        <Link href={`/admin/schedule/${cls.id}`} className="hover:underline">
                            <div>{cls.name}</div>
                        </Link>
                        <div className="text-xs text-muted-foreground">{cls.trainer}</div>
                      </TableCell>
                      <TableCell>{cls.time}</TableCell>
                      <TableCell>
                        <Badge
                          variant={cls.booked >= cls.spots ? "destructive" : "default"}
                          className={cls.booked < cls.spots ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {cls.booked >= cls.spots ? 'Full' : `${cls.booked}/${cls.spots}`}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Check-in Dialog */}
      <Dialog open={isCheckInDialogOpen} onOpenChange={setIsCheckInDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Confirm Check-in</DialogTitle>
                <DialogDescription>
                    Please confirm the details before checking in the member.
                </DialogDescription>
            </DialogHeader>
            {selectedMember && (
                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={selectedMember.avatarUrl} alt={selectedMember.name} data-ai-hint="person" />
                            <AvatarFallback>{selectedMember.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-lg font-semibold">{selectedMember.name}</h3>
                            <p className="text-muted-foreground">{selectedMember.email}</p>
                            <p className="text-sm text-muted-foreground">Member ID: {selectedMember.id}</p>
                        </div>
                    </div>
                     <Alert variant={selectedMember.status === 'Active' ? "default" : "destructive"}>
                        <AlertTitle>Membership Status</AlertTitle>
                        <AlertDescription className="flex items-center gap-2">
                           <Badge 
                                variant={selectedMember.status === 'Active' ? 'default' : selectedMember.status === 'Inactive' ? 'secondary' : 'outline'}
                                className={selectedMember.status === 'Active' ? 'bg-green-500 hover:bg-green-600' : ''}
                            >
                                {selectedMember.status}
                            </Badge>
                             - {selectedMember.plan} Plan
                        </AlertDescription>
                    </Alert>
                </div>
            )}
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsCheckInDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCheckIn} disabled={selectedMember?.status !== 'Active'}>
                    Confirm Check-in
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    