"use client";

import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-background p-4">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <TriangleAlert className="w-16 h-16 text-destructive" />
          </div>
          <CardTitle className="text-3xl">Something Went Wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. Please try again or return to your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>We've logged the issue and our team is looking into it.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => reset()}>
              Try Again
            </Button>
            <Button variant="outline" asChild>
                <Link href="/">
                    Go to Home
                </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
