
"use client";

import { notFound, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText } from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";

const subscriptionPayments = [
    { invoice: 'INV-2024-005', date: '2024-07-01', amount: 10000, status: 'Paid' },
    { invoice: 'INV-2024-004', date: '2024-06-01', amount: 10000, status: 'Paid' },
    { invoice: 'INV-2024-003', date: '2024-05-01', amount: 10000, status: 'Paid' },
]

export default function InvoicePage() {
    const params = useParams();
    const invoiceId = params.invoiceId as string;
    const payment = subscriptionPayments.find(p => p.invoice === invoiceId);

    if (!payment) {
        notFound();
    }

    return (
        <Card className="w-full max-w-lg shadow-xl">
            <CardContent className="p-10 flex flex-col items-center text-center">
                <div className="relative mb-4">
                    <FileText className="w-20 h-20 text-muted-foreground/30" />
                    <CheckCircle className="absolute -bottom-1 -right-1 w-8 h-8 text-white bg-green-500 rounded-full border-4 border-card" />
                </div>
                <p className="text-lg text-muted-foreground">Invoice paid</p>
                <p className="text-5xl font-bold mt-1 mb-2">KES {payment.amount.toLocaleString()}</p>
                <Button variant="link" asChild className="text-sm">
                    <Link href="#">View invoice and payment details</Link>
                </Button>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-left w-full mt-8">
                    <div className="text-muted-foreground">Invoice number</div>
                    <div className="font-medium text-right">{payment.invoice}</div>
                    <div className="text-muted-foreground">Payment date</div>
                    <div className="font-medium text-right">{format(parseISO(payment.date), "MMMM d, yyyy")}</div>
                </div>

                <div className="flex gap-4 w-full mt-8">
                    <Button variant="outline" className="flex-1">Download invoice</Button>
                    <Button className="flex-1">Download receipt</Button>
                </div>
            </CardContent>
        </Card>
    );
}
