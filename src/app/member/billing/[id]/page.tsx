
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { payments, members } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Printer, Crown } from "lucide-react";

export default function MemberPaymentDetailsPage() {
  const params = useParams();
  const paymentId = params.id as string;
  const payment = payments.find(p => p.id === paymentId && p.memberId === 'M001'); // extra check
  const member = payment ? members.find(m => m.id === payment.memberId) : null;

  if (!payment || !member) {
    notFound();
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <PageHeader title={`Payment ${payment.id}`}>
        <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
                <Link href="/member/billing">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Billing
                </Link>
            </Button>
            <Button>
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
            </Button>
        </div>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
          <CardDescription>
            A detailed view of your payment transaction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">

            {/* Payment Details Section */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Payment Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Transaction ID</p>
                  <p>{payment.id}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Payment Date</p>
                  <p>{payment.date}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Payment Status</p>
                  <Badge
                    variant={payment.status === 'Paid' ? 'default' : payment.status === 'Failed' ? 'destructive' : 'outline'}
                    className={payment.status === 'Paid' ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    {payment.status}
                  </Badge>
                </div>
                 <div>
                  <p className="font-medium text-muted-foreground">Next Payment Date</p>
                  <p>2024-08-01</p>
                </div>
              </div>
            </div>

            <Separator />
            
            {/* Order Summary Section */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <p className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span>{member.plan} Plan Membership</span>
                  </p>
                  <p>KES {payment.amount.toLocaleString()}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-xl">
                <p>Total Paid</p>
                <p>KES {payment.amount.toLocaleString()}</p>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
