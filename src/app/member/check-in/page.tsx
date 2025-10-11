
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QrCode } from "lucide-react";

export default function MemberCheckInPage() {
    const memberId = "M001"; // Example member ID

    return (
        <div className="p-4 md:p-6 space-y-6">
            <PageHeader title="Check-in QR Code" />
            <Card>
                <CardHeader>
                    <CardTitle>Your Personal QR Code</CardTitle>
                    <CardDescription>Present this code at the reception to check in.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                         <QrCode className="w-48 h-48" />
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">Member ID: {memberId}</p>
                </CardContent>
            </Card>
        </div>
    );
}
