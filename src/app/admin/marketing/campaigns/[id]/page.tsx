
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { campaigns as initialCampaigns, MarketingCampaign, EmailTemplate, templates as initialTemplates } from "@/lib/marketing-data";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Users, Mail, BarChart, Send, CheckCircle, Settings, Play, Pause, Repeat, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const CAMPAIGNS_STORAGE_KEY = 'fitsync_marketing_campaigns';
const TEMPLATES_STORAGE_KEY = 'fitsync_marketing_templates';

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const [campaign, setCampaign] = useState<MarketingCampaign | null>(null);
  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [isSimulatedSendOpen, setIsSimulatedSendOpen] = useState(false);
  const [isConfirmSendOpen, setIsConfirmSendOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedCampaigns = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    const campaigns: MarketingCampaign[] = storedCampaigns ? JSON.parse(storedCampaigns) : initialCampaigns;
    const foundCampaign = campaigns.find(c => c.id === campaignId);
    setCampaign(foundCampaign || null);

    if (foundCampaign?.templateId) {
      const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      const templates: EmailTemplate[] = storedTemplates ? JSON.parse(storedTemplates) : initialTemplates;
      const foundTemplate = templates.find(t => t.id === foundCampaign.templateId);
      setTemplate(foundTemplate || null);
    }
  }, [campaignId]);

  if (!campaign) {
    return null; // or a loading state
  }

  const handleSendCampaign = () => {
    setIsConfirmSendOpen(false);
    setIsSimulatedSendOpen(true);
    // In a real app, you would trigger the backend sending process here.
  };

  return (
    <div className="space-y-8">
      <PageHeader title={campaign.name}>
        <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
                <Link href="/admin/marketing">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Campaigns
                </Link>
            </Button>
            <Button onClick={() => setIsConfirmSendOpen(true)} disabled={campaign.status === 'Finished' || campaign.status === 'Active'}>
                <Send className="mr-2 h-4 w-4" />
                Send Campaign
            </Button>
        </div>
      </PageHeader>
      
      <div className="flex items-center gap-2">
        <span className="font-semibold">Status:</span>
        <Badge
            variant={
                campaign.status === "Active" ? "default" : campaign.status === "Finished" ? "secondary" : "outline"
            }
            className={campaign.status === "Active" ? "bg-green-500" : ""}
            >
            {campaign.status}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recipients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.sent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">emails sent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.openRate}</div>
            <p className="text-xs text-muted-foreground">of recipients opened</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((campaign.clicks / campaign.sent) * 100 || 0).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{campaign.clicks} total clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.conversions}</div>
            <p className="text-xs text-muted-foreground">new sign-ups from campaign</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Email Preview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full border rounded-lg overflow-hidden">
                        <div className="bg-muted p-4">
                            <h3 className="font-semibold text-lg">{template?.name || campaign.name}</h3>
                            <p className="text-sm text-muted-foreground">To: {campaign.audience}</p>
                        </div>
                        <div className="p-8 bg-background prose dark:prose-invert">
                           {template ? (
                               <div dangerouslySetInnerHTML={{ __html: template.body.replace(/\n/g, '<br />') }} />
                           ) : (
                                <p className="text-muted-foreground text-sm">No template selected for this campaign.</p>
                           )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Workflow Triggers</CardTitle>
                    <CardDescription>Automate when this campaign is sent.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="trigger-event">Trigger Event</Label>
                        <Select>
                            <SelectTrigger id="trigger-event">
                                <SelectValue placeholder="Select an event" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="signup">New Member Sign-up</SelectItem>
                                <SelectItem value="class_booked">Member Books a Class</SelectItem>
                                <SelectItem value="inactive">Member Becomes Inactive</SelectItem>
                                <SelectItem value="manual">Manual Send Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="delay">Delay</Label>
                        <div className="flex gap-2">
                             <Input id="delay" type="number" placeholder="3" className="w-1/2" />
                             <Select defaultValue="days">
                                <SelectTrigger className="w-1/2">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="minutes">Minutes</SelectItem>
                                    <SelectItem value="hours">Hours</SelectItem>
                                    <SelectItem value="days">Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <p className="text-xs text-muted-foreground">e.g., Send 3 days after sign-up.</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">
                        <Play className="mr-2" />
                        Activate Workflow
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
      
       <AlertDialog open={isConfirmSendOpen} onOpenChange={setIsConfirmSendOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will send the campaign "{campaign.name}" to the "{campaign.audience}" audience. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button variant="outline" onClick={() => setIsConfirmSendOpen(false)}>Cancel</Button>
                    <Button onClick={handleSendCampaign}>Yes, Send Campaign</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={isSimulatedSendOpen} onOpenChange={setIsSimulatedSendOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex justify-center mb-2">
                        <AlertTriangle className="w-10 h-10 text-primary" />
                    </div>
                    <AlertDialogTitle className="text-center">Simulated Event</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        This is a demo environment. Marketing campaigns are not actually sent.
                        This action has been simulated for demonstration purposes.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setIsSimulatedSendOpen(false)}>Okay</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
