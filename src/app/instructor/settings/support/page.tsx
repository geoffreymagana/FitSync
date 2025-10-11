
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Support">
        <Button asChild variant="outline">
            <Link href="/instructor/settings">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
            </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            Get help from our support team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Support page content goes here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
