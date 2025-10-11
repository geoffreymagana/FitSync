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
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Settings" />
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
              <Button>Save changes</Button>
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
              <Button>Save password</Button>
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
              <Button>Save preferences</Button>
            </CardFooter>
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

    