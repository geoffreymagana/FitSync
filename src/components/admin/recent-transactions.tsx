
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { payments as memberPayments, locations } from "@/lib/data";
import { Transaction as WalkInTransaction, Payment } from "@/lib/types";

interface RecentTransactionsProps {
  locationId: string;
}

type UnifiedTransaction = {
  id: string;
  type: 'Payment' | 'Walk-in';
  date: string;
  amount: number;
  status?: 'Paid' | 'Pending' | 'Failed';
  customerName: string;
  customerAvatarUrl?: string;
};

export function RecentTransactions({ locationId }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<UnifiedTransaction[]>([]);

  useEffect(() => {
    const storedWalkInTransactions = localStorage.getItem('walkInTransactions');
    const walkInTransactions: WalkInTransaction[] = storedWalkInTransactions ? JSON.parse(storedWalkInTransactions) : [];
    
    const locationPrefix = locations.find(l => l.id === locationId)?.name.split(' ')[1].slice(0, 3).toUpperCase() || 'UNK';
    
    const relevantWalkIns = walkInTransactions.filter(t => t.id.startsWith(locationPrefix));

    const formattedWalkIns: UnifiedTransaction[] = relevantWalkIns.map(t => ({
        id: t.id,
        type: 'Walk-in',
        date: t.timestamp,
        amount: t.total,
        status: 'Paid',
        customerName: t.id,
    }));

    const formattedPayments: UnifiedTransaction[] = memberPayments
        .filter(p => p.locationId === locationId)
        .map(p => ({
            id: p.id,
            type: 'Payment',
            date: p.date,
            amount: p.amount,
            status: p.status,
            customerName: p.memberName,
            customerAvatarUrl: p.memberAvatarUrl,
        }));

    const combined = [...formattedPayments, ...formattedWalkIns]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    setTransactions(combined);

  }, [locationId]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer / Details</TableHead>
          <TableHead className="hidden sm:table-cell">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map(transaction => {
          const href = transaction.type === 'Payment'
            ? `/admin/payments/${transaction.id}`
            : `/admin/transactions/${transaction.id}`;
          
          return (
            <TableRow key={transaction.id}>
              <TableCell>
                <Link href={href} className="flex items-center space-x-3 hover:underline">
                  <Avatar className="hidden sm:flex">
                    {transaction.customerAvatarUrl ? (
                      <AvatarImage src={transaction.customerAvatarUrl} alt={transaction.customerName} data-ai-hint="person" />
                    ) : null}
                    <AvatarFallback>{transaction.customerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{transaction.customerName}</div>
                    <div className="text-xs text-muted-foreground">{transaction.type}</div>
                  </div>
                </Link>
              </TableCell>
              <TableCell className="hidden sm:table-cell">KES {transaction.amount.toLocaleString()}</TableCell>
              <TableCell>
                 {transaction.status && (
                    <Badge
                        variant={transaction.status === 'Paid' ? 'default' : transaction.status === 'Failed' ? 'destructive' : 'outline'}
                        className={transaction.status === 'Paid' ? 'bg-green-500 hover:bg-green-600' : ''}
                    >
                        {transaction.status}
                    </Badge>
                 )}
              </TableCell>
              <TableCell className="hidden md:table-cell">{new Date(transaction.date).toLocaleDateString()}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );
}
