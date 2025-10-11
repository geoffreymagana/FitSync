
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { payments } from "@/lib/data";

interface RecentTransactionsProps {
  locationId: string;
}

export function RecentTransactions({ locationId }: RecentTransactionsProps) {
  const recentPayments = useMemo(() => {
    return payments
      .filter(p => p.locationId === locationId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [locationId]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead className="hidden sm:table-cell">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentPayments.map(payment => (
          <TableRow key={payment.id}>
            <TableCell>
              <Link href={`/admin/payments/${payment.id}`} className="flex items-center space-x-3 hover:underline">
                <Avatar className="hidden sm:flex">
                  <AvatarImage src={payment.memberAvatarUrl} alt={payment.memberName} data-ai-hint="person" />
                  <AvatarFallback>{payment.memberName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{payment.memberName}</div>
                </div>
              </Link>
            </TableCell>
            <TableCell className="hidden sm:table-cell">KES {payment.amount.toLocaleString()}</TableCell>
            <TableCell>
              <Badge
                variant={payment.status === 'Paid' ? 'default' : payment.status === 'Failed' ? 'destructive' : 'outline'}
                className={payment.status === 'Paid' ? 'bg-green-500 hover:bg-green-600' : ''}
              >
                {payment.status}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">{payment.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
