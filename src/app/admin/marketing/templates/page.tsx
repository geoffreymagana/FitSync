
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { templates as initialTemplates, EmailTemplate } from "@/lib/marketing-data";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const TEMPLATES_STORAGE_KEY = 'fitsync_marketing_templates';

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const storedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY);
        if (storedTemplates) {
            setTemplates(JSON.parse(storedTemplates));
        } else {
            setTemplates(initialTemplates);
        }
    }, []);

    useEffect(() => {
        if (templates.length > 0) {
            localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
        }
    }, [templates]);

    const openEditor = (template: EmailTemplate | null) => {
        setSelectedTemplate(template);
        setIsEditorOpen(true);
    };

    const handleSaveTemplate = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get("template-name") as string;
        const category = formData.get("template-category") as string;
        const body = formData.get("template-body") as string;
        
        if (!name || !category || !body) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Please fill out all fields."
            });
            return;
        }

        if (selectedTemplate) {
            // Editing existing template
            const updatedTemplate = { ...selectedTemplate, name, category, body };
            setTemplates(prev => prev.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
            toast({ title: "Template Updated", description: `"${name}" has been saved.` });
        } else {
            // Creating new template
            const newTemplate: EmailTemplate = {
                id: `TMPL${Date.now()}`,
                name,
                category,
                body,
                thumbnailUrl: `https://picsum.photos/seed/template${Date.now()}/400/225`,
                createdAt: new Date().toISOString().split('T')[0]
            };
            setTemplates(prev => [newTemplate, ...prev]);
            toast({ title: "Template Created", description: `"${name}" has been added.` });
        }

        setIsEditorOpen(false);
        setSelectedTemplate(null);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Email Templates</CardTitle>
                        <CardDescription>
                            Create and manage your reusable email templates.
                        </CardDescription>
                    </div>
                    <Button onClick={() => openEditor(null)}>
                        <PlusCircle className="mr-2" />
                        Create Template
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template) => (
                            <Card key={template.id} className="overflow-hidden group flex flex-col">
                                <div className="aspect-video bg-muted overflow-hidden">
                                    <Image
                                        src={template.thumbnailUrl}
                                        alt={template.name}
                                        width={400}
                                        height={225}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                                        data-ai-hint="email template"
                                    />
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-base">{template.name}</CardTitle>
                                    <CardDescription>{template.category}</CardDescription>
                                </CardHeader>
                                <CardFooter className="mt-auto">
                                    <Button variant="outline" className="w-full" onClick={() => openEditor(template)}>
                                        Edit
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{selectedTemplate ? 'Edit Template' : 'Create New Template'}</DialogTitle>
                        <DialogDescription>
                            {selectedTemplate ? `Editing template: ${selectedTemplate.name}` : "Design the content for your marketing emails. Use `{{name}}` to personalize."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveTemplate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="template-name">Template Name</Label>
                                <Input id="template-name" name="template-name" placeholder="e.g., Welcome Email" defaultValue={selectedTemplate?.name} required />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="template-category">Category</Label>
                                <Input id="template-category" name="template-category" placeholder="e.g., Welcome Series" defaultValue={selectedTemplate?.category} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="template-body">Body</Label>
                                <Textarea id="template-body" name="template-body" placeholder="Hi {{name}}, welcome to FitSync!..." rows={10} defaultValue={selectedTemplate?.body} required />
                            </div>
                        </div>
                        <DialogFooter>
                             <Button type="button" variant="outline" onClick={() => setIsEditorOpen(false)}>Cancel</Button>
                             <Button type="submit">Save Template</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
