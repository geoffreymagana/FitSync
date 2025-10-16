
"use client";

import { useEffect, useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/lib/types";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Printer } from "lucide-react";
import { format } from "date-fns";

export default function AdminTransactionDetailsPage() {
  const params = useParams();
  const transactionId = params.id as string;
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedTransactions = localStorage.getItem('walkInTransactions');
    if (storedTransactions) {
      const parsedTransactions: Transaction[] = JSON.parse(storedTransactions);
      const foundTransaction = parsedTransactions.find(t => t.id === transactionId);
      setTransaction(foundTransaction || null);
    }
    setLoading(false);
  }, [transactionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!transaction) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader title={`Transaction ${transaction.id}`}>
        <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
                <Link href="/admin/transactions">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Transactions
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
          <CardTitle>Receipt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Transaction ID</p>
                  <p>{transaction.id}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Date</p>
                  <p>{format(new Date(transaction.timestamp), "PPpp")}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Customer Phone</p>
                  <p>{transaction.customer.phone}</p>
                </div>
                 {transaction.customer.email && (
                    <div>
                        <p className="font-medium text-muted-foreground">Customer Email</p>
                        <p>{transaction.customer.email}</p>
                    </div>
                )}
                <div>
                  <p className="font-medium text-muted-foreground">Payment Method</p>
                  <Badge variant={transaction.paymentMethod === 'Cash' ? 'secondary' : 'default'} className={transaction.paymentMethod === 'M-Pesa' ? 'bg-green-500 hover:bg-green-600' : ''}>
                    {transaction.paymentMethod}
                  </Badge>
                </div>
              </div>

            <Separator />
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Summary</h3>
              <div className="space-y-2 text-sm">
                {transaction.items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <p>{item.name} <span className="text-muted-foreground">x {item.quantity}</span></p>
                    <p>KES {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <Separator className="my-2" />
               <div className="space-y-2 text-sm">
                 <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>KES {transaction.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString()}</p>
                  </div>
                {transaction.discount && (
                    <div className="flex justify-between text-green-600">
                        <p>Discount ({transaction.discount.name})</p>
                        <p>- KES {transaction.discount.amount.toLocaleString()}</p>
                    </div>
                )}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-xl">
                <p>Total Paid</p>
                <p>KES {transaction.total.toLocaleString()}</p>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
