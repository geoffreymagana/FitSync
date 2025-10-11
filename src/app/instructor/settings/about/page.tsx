import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="About">
        <Button asChild variant="outline">
            <Link href="/instructor/settings">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
            </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>About FitSync</CardTitle>
          <CardDescription>
            The all-in-one management solution for your fitness center.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Version 1.0.0</p>
        </CardContent>
      </Card>
       <div className="pt-8 text-center text-sm text-muted-foreground">
        <p>
        Powered by{" "}
        <a
            href="https://buniboxafrica.shop"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
        >
            Bunibox Africa
        </a>{" "}
        ©
        </p>
      </div>
    </div>
  );
}
