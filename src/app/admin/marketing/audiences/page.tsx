
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { audiences as initialAudiences, MarketingAudience } from "@/lib/marketing-data";
import { MoreHorizontal, Upload, Mail, MessageCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const AUDIENCES_STORAGE_KEY = 'fitsync_marketing_audiences';

export default function AudiencesPage() {
    const [audiences, setAudiences] = useState<MarketingAudience[]>([]);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const storedAudiences = localStorage.getItem(AUDIENCES_STORAGE_KEY);
        if (storedAudiences) {
            setAudiences(JSON.parse(storedAudiences));
        } else {
            setAudiences(initialAudiences);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(AUDIENCES_STORAGE_KEY, JSON.stringify(audiences));
    }, [audiences]);

    const handleImport = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('audience-name') as string;
        const contacts = (formData.get('contacts') as string).split(',').map(c => c.trim()).filter(Boolean);

        if (!name || contacts.length === 0) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Audience name and at least one contact are required."
            });
            return;
        }

        const newAudience: MarketingAudience = {
            id: `AUD${Date.now()}`,
            name,
            count: contacts.length,
            type: 'Email', // Assuming email for now
            createdAt: new Date().toISOString().split('T')[0]
        };

        setAudiences(prev => [...prev, newAudience]);
        toast({
            title: "Audience Imported",
            description: `Successfully created the "${name}" audience with ${contacts.length} contacts.`
        });
        setIsImportOpen(false);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Audiences</CardTitle>
                    <CardDescription>
                        Manage your contact lists for marketing campaigns.
                    </CardDescription>
                </div>
                <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Upload className="mr-2" />
                            Import Contacts
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Import New Audience</DialogTitle>
                            <DialogDescription>
                                Create a new contact list by entering a name and pasting contacts.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleImport}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="audience-name">Audience Name</Label>
                                    <Input id="audience-name" name="audience-name" placeholder="e.g., Summer Leads" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contacts">Contacts</Label>
                                    <Textarea id="contacts" name="contacts" placeholder="Paste comma-separated emails or phone numbers" rows={5} />
                                    <p className="text-xs text-muted-foreground">
                                        Each email or phone number should be separated by a comma.
                                    </p>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsImportOpen(false)}>Cancel</Button>
                                <Button type="submit">Create Audience</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Audience Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Contacts</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {audiences.map((audience) => (
                            <TableRow key={audience.id}>
                                <TableCell className="font-medium">{audience.name}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {audience.type === 'Email' ? <Mail className="mr-2"/> : <MessageCircle className="mr-2"/>}
                                        {audience.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>{audience.count.toLocaleString()}</TableCell>
                                <TableCell>{audience.createdAt}</TableCell>
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
                                        <DropdownMenuItem>View Contacts</DropdownMenuItem>
                                        <DropdownMenuItem>Rename</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
