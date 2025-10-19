
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Link from "next/link"
import { ChevronRight, CreditCard, Fingerprint, QrCode, Search, FileText, Banknote, BookLock, FileSignature, Settings2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"


const subscriptionPayments = [
    { invoice: 'INV-2024-005', date: '2024-07-01', amount: 10000, status: 'Paid' },
    { invoice: 'INV-2024-004', date: '2024-06-01', amount: 10000, status: 'Paid' },
    { invoice: 'INV-2024-003', date: '2024-05-01', amount: 10000, status: 'Paid' },
]

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [checkInMethods, setCheckInMethods] = useState({
    qr: true,
    manual: true,
    fingerprint: false,
  });


  const handleCheckInMethodChange = (method: 'qr' | 'manual' | 'fingerprint') => {
    setCheckInMethods(prev => ({
        ...prev,
        [method]: !prev[method]
    }));
  }
  
  const handleSaveSettings = () => {
    toast({
        title: "Settings Saved",
        description: "Your changes have been saved successfully."
    });
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" />
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-4xl grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="checkin">Check-in</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                This is how others will see you on the site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Maina Kamau" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@fitsync.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input id="new-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-signup" className="font-medium">New Member Sign-ups</Label>
                  <p className="text-sm text-muted-foreground">Notify me when a new customer creates an account.</p>
                </div>
                <Switch id="new-signup" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="payment-status" className="font-medium">Payment Status</Label>
                  <p className="text-sm text-muted-foreground">Notify me about failed or pending membership payments.</p>
                </div>
                <Switch id="payment-status" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                 <div>
                  <Label htmlFor="class-booking" className="font-medium">Class Bookings</Label>
                  <p className="text-sm text-muted-foreground">Notify when a class is almost full or fully booked.</p>
                </div>
                <Switch id="class-booking" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
         <TabsContent value="billing">
          <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Subscription Plan</CardTitle>
                    <CardDescription>You are currently on the Pro Plan. You can manage your subscription here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-start p-4 border rounded-lg">
                        <div>
                            <h4 className="font-bold text-lg">FitSync Pro Plan</h4>
                            <p className="text-2xl font-bold mt-1">KES 10,000 <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
                            <p className="text-xs text-muted-foreground">Next payment on August 1, 2024</p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/admin/settings/billing">Change Plan</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>The primary payment method used for your subscription.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                        <CreditCard className="w-8 h-8 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">Visa ending in 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-auto">Update</Button>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>Your past payments to Bunibox Africa for FitSync.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subscriptionPayments.map(payment => (
                                <TableRow key={payment.invoice}>
                                    <TableCell className="font-medium">
                                        <Link href={`/billing/invoice/${payment.invoice}`} className="hover:underline text-primary" target="_blank">
                                            {payment.invoice}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{payment.date}</TableCell>
                                    <TableCell>KES {payment.amount.toLocaleString()}</TableCell>
                                    <TableCell>{payment.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </div>
        </TabsContent>
         <TabsContent value="checkin">
          <Card>
            <CardHeader>
              <CardTitle>Check-in Method</CardTitle>
              <CardDescription>
                Select how members will check into your facility at the reception.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-4 space-y-1 rounded-md border p-4 cursor-pointer has-[:checked]:border-primary">
                   <Checkbox id="checkin-qr" checked={checkInMethods.qr} onCheckedChange={() => handleCheckInMethodChange('qr')} />
                  <Label htmlFor="checkin-qr" className="grid gap-1.5 cursor-pointer">
                    <div className="font-semibold flex items-center gap-2"><QrCode/> QR Code Scan</div>
                    <div className="text-sm text-muted-foreground">Members present a QR code on their phone for the receptionist to scan.</div>
                  </Label>
                </div>
                 <div className="flex items-start gap-4 space-y-1 rounded-md border p-4 cursor-pointer has-[:checked]:border-primary">
                   <Checkbox id="checkin-manual" checked={checkInMethods.manual} onCheckedChange={() => handleCheckInMethodChange('manual')} />
                  <Label htmlFor="checkin-manual" className="grid gap-1.5 cursor-pointer">
                    <div className="font-semibold flex items-center gap-2"><Search /> Manual Search</div>
                    <div className="text-sm text-muted-foreground">Receptionist searches for a member by name, email, or ID to check them in.</div>
                  </Label>
                </div>
                 <div className="flex items-start gap-4 space-y-1 rounded-md border p-4 cursor-pointer has-[:checked]:border-primary disabled:cursor-not-allowed opacity-60">
                   <Checkbox id="checkin-fingerprint" checked={checkInMethods.fingerprint} onCheckedChange={() => handleCheckInMethodChange('fingerprint')} disabled />
                  <Label htmlFor="checkin-fingerprint" className="grid gap-1.5 cursor-pointer">
                    <div className="font-semibold flex items-center gap-2"><Fingerprint /> Fingerprint Scan</div>
                    <div className="text-sm text-muted-foreground">Members scan their fingerprint for instant check-in. (Requires compatible hardware)</div>
                  </Label>
                </div>
            </CardContent>
             <CardFooter>
              <Button onClick={handleSaveSettings}>Save check-in preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
         <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Settings</CardTitle>
              <CardDescription>Manage your business-wide settings like taxes and waivers.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                <Link href="/admin/settings/taxes" className="flex items-center justify-between py-4">
                  <div className="flex items-start gap-4">
                    <Banknote className="h-6 w-6 text-muted-foreground mt-1" />
                    <div>
                      <h4 className="font-medium">Taxes & Charges</h4>
                      <p className="text-sm text-muted-foreground">Add taxes & charges for your Services.</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link href="/admin/settings/waivers" className="flex items-center justify-between py-4">
                  <div className="flex items-start gap-4">
                    <FileSignature className="h-6 w-6 text-muted-foreground mt-1" />
                    <div>
                      <h4 className="font-medium">Waivers</h4>
                      <p className="text-sm text-muted-foreground">Create & issue waivers to your clients.</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Bookings & Payments</CardTitle>
              <CardDescription>Control how you handle bookings and take payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                <Link href="/admin/settings/booking" className="flex items-center justify-between py-4">
                  <div className="flex items-start gap-4">
                    <BookLock className="h-6 w-6 text-muted-foreground mt-1" />
                    <div>
                      <h4 className="font-medium">Booking Flow</h4>
                      <p className="text-sm text-muted-foreground">Control how your clients make bookings with you.</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                 <Link href="/admin/settings/payments" className="flex items-center justify-between py-4">
                  <div className="flex items-start gap-4">
                    <Settings2 className="h-6 w-6 text-muted-foreground mt-1" />
                    <div>
                      <h4 className="font-medium">Payments</h4>
                      <p className="text-sm text-muted-foreground">Set up how you take payments in the business.</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link href="/admin/settings/invoices" className="flex items-center justify-between py-4">
                  <div className="flex items-start gap-4">
                    <FileText className="h-6 w-6 text-muted-foreground mt-1" />
                    <div>
                      <h4 className="font-medium">Invoices</h4>
                      <p className="text-sm text-muted-foreground">Customise how invoices are generated and sent.</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>
                Manage general application settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                <Link href="/admin/settings/billing" className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium">Billing</h4>
                    <p className="text-sm text-muted-foreground">Manage your subscription and payment methods.</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link href="/admin/settings/help" className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium">Help</h4>
                    <p className="text-sm text-muted-foreground">Find answers to your questions.</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                 <Link href="/admin/settings/support" className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium">Support</h4>
                    <p className="text-sm text-muted-foreground">Contact our support team.</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                 <Link href="/admin/settings/feedback" className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium">Feedback</h4>
                    <p className="text-sm text-muted-foreground">Share your thoughts and suggestions.</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                 <Link href="/admin/settings/about" className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium">About</h4>
                    <p className="text-sm text-muted-foreground">Learn more about FitSync.</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

    