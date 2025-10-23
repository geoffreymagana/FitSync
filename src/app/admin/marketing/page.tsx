
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Integrations } from "@/lib/integrations";
import { Integration } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { CheckCircle, Workflow } from "lucide-react";

export default function MarketingPage() {
    const [integrations, setIntegrations] = useState<Integration[]>(Integrations);
    const { toast } = useToast();

    const handleConnect = (integrationId: string) => {
        setIntegrations(prev =>
            prev.map(int =>
                int.id === integrationId ? { ...int, status: 'Connected' } : int
            )
        );
        const integration = integrations.find(int => int.id === integrationId);
        toast({
            title: "Integration Connected (Simulated)",
            description: `Successfully connected to ${integration?.name}.`,
        });
    };

    return (
        <div className="space-y-8">
            <PageHeader title="Marketing Integrations" />

            <Card>
                <CardHeader>
                    <CardTitle>Connect Your Marketing Tools</CardTitle>
                    <CardDescription>
                        Supercharge your marketing by connecting FitSync with the services you already use.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {integrations.map(integration => (
                            <Card key={integration.id} className="flex flex-col">
                                <CardHeader className="flex flex-row items-start gap-4">
                                    <div className="w-12 h-12 flex-shrink-0 relative">
                                        <Image src={integration.logo} alt={`${integration.name} logo`} width={48} height={48} className="object-contain" />
                                    </div>
                                    <div>
                                        <CardTitle>{integration.name}</CardTitle>
                                        <CardDescription>{integration.category}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                                </CardContent>
                                <CardFooter>
                                    {integration.status === 'Connected' ? (
                                        <Button variant="outline" disabled className="w-full">
                                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                            Connected
                                        </Button>
                                    ) : (
                                        <Button className="w-full" onClick={() => handleConnect(integration.id)}>
                                            <Workflow className="mr-2 h-4 w-4" />
                                            Connect
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
