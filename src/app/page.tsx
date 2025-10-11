import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-headline font-bold text-primary">FitSync</h1>
            <p className="text-muted-foreground mt-2">Select a dashboard to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle>Admin Dashboard</CardTitle>
                    <CardDescription>Manage members, trainers, payments, and analytics.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="/login/admin">
                            Go to Admin
                            <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle>Member Dashboard</CardTitle>
                    <CardDescription>View and book classes, track your progress.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button asChild className="w-full">
                        <Link href="/login/member">
                            Go to Member
                            <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle>Reception Dashboard</CardTitle>
                    <CardDescription>Check-in members and view today's schedule.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button asChild className="w-full">
                        <Link href="/login/reception">
                            Go to Reception
                            <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle>Instructor Dashboard</CardTitle>
                    <CardDescription>Manage your schedule and clients.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button asChild className="w-full">
                        <Link href="/login/instructor">
                            Go to Instructor
                            <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>

        <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
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
        </footer>
    </div>
  );
}
