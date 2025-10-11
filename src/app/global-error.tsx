"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
          <Card className="w-full max-w-2xl text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <TriangleAlert className="w-16 h-16 text-destructive" />
              </div>
              <CardTitle className="text-3xl">Application Error</CardTitle>
              <CardDescription>
                Something went wrong. We've logged the issue and are looking into it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="text-left bg-muted p-4 rounded-md">
                <p className="font-semibold">Error Details:</p>
                <code className="text-sm text-destructive">{error.message}</code>
              </div>
              <p>You can try to reload the page or navigate back to your dashboard.</p>
              <div className="flex justify-center gap-4">
                 <Button onClick={() => reset()}>Try again</Button>
                 <Button asChild variant="outline">
                    <Link href="/">Go to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  );
}
