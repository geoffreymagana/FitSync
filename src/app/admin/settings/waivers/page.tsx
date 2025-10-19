
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Construction } from "lucide-react";

export default function WaiversPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Waivers">
        <Button asChild variant="outline">
            <Link href="/admin/settings">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Settings
            </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Waivers</CardTitle>
          <CardDescription>
            Create & issue waivers to your clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg">
                <Construction className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Feature Coming Soon</h3>
                <p>This feature is currently under development and will be available shortly.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    