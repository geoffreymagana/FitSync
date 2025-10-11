
"use client";

import { useState, useEffect, useContext } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Transaction, OrderItem } from "@/lib/types";
import { format } from "date-fns";
import { MoreHorizontal, Mail, Receipt, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ReceptionContext } from '@/context/reception-context';
import Link from 'next/link';

export default function TransactionsPage() {
  const { selectedLocation } = useContext(ReceptionContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isResendDialogOpen, setIsResendDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [receiptEmail, setReceiptEmail] = useState("");
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedTransactions = localStorage.getItem('walkInTransactions');
    if (storedTransactions) {
      const parsedTransactions: Transaction[] = JSON.parse(storedTransactions);
      setTransactions(parsedTransactions);
    }
  }, []);

  useEffect(() => {
    if (!selectedLocation) return;
    const locationPrefix = selectedLocation.name.split(' ')[1].slice(0, 3).toUpperCase();
    const locationTransactions = transactions.filter(t => t.id.startsWith(locationPrefix));

    const results = locationTransactions.filter(t => 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer.phone.includes(searchTerm) ||
      (t.customer.email && t.customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredTransactions(results);
  }, [searchTerm, transactions, selectedLocation]);

  if (!selectedLocation) {
    return <div>Loading...</div>;
  }

  const openResendDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setReceiptEmail(transaction.customer.email || "");
    setIsResendDialogOpen(true);
  };

  const openDetailsDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsDialogOpen(true);
  };

  const handleResendReceipt = () => {
    if (!selectedTransaction || !receiptEmail) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please enter a valid email address.",
        });
        return;
    }
    
    // Update the email in the transaction if it has changed
    const updatedTransactions = transactions.map(t =>
      t.id === selectedTransaction.id
        ? { ...t, customer: { ...t.customer, email: receiptEmail } }
        : t
    );
    setTransactions(updatedTransactions);
    localStorage.setItem('walkInTransactions', JSON.stringify(updatedTransactions));


    toast({
      title: "Receipt Sent",
      description: `Receipt for transaction ${selectedTransaction.id} has been resent to ${receiptEmail}.`
    });
    
    setIsResendDialogOpen(false);
    setSelectedTransaction(null);
    setReceiptEmail("");
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Walk-in Transactions">
          <div className="flex items-center space-x-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by ID, phone, email..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
      </PageHeader>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer Phone</TableHead>
                <TableHead>Total (KES)</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      <Link href={`/reception/transactions/${transaction.id}`} className="hover:underline">
                        {transaction.id}
                      </Link>
                    </TableCell>
                    <TableCell>{format(new Date(transaction.timestamp), "PPpp")}</TableCell>
                    <TableCell>{transaction.customer.phone}</TableCell>
                    <TableCell>{transaction.total.toLocaleString()}</TableCell>
                    <TableCell>
                        <Badge variant={transaction.paymentMethod === 'Cash' ? 'secondary' : 'default'} className={transaction.paymentMethod === 'M-Pesa' ? 'bg-green-500 hover:bg-green-600' : ''}>
                             {transaction.paymentMethod}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => openDetailsDialog(transaction)}>
                            <Receipt className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => openResendDialog(transaction)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Receipt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No transactions found for this location.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Resend Receipt Dialog */}
      <Dialog open={isResendDialogOpen} onOpenChange={setIsResendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Receipt</DialogTitle>
            <DialogDescription>
              Enter the customer's email address to send the receipt for transaction {selectedTransaction?.id}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resend-email">Email Address</Label>
              <Input
                id="resend-email"
                type="email"
                placeholder="customer@example.com"
                value={receiptEmail}
                onChange={(e) => setReceiptEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResendDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleResendReceipt}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              ID: {selectedTransaction?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
              <div className="space-y-2">
                {selectedTransaction?.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                        <p>{item.name} <span className="text-muted-foreground">x {item.quantity}</span></p>
                        <p>KES {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                ))}
              </div>
              <Separator />
               <div className="flex justify-between items-center font-bold text-lg">
                  <p>Total</p>
                  <p>KES {selectedTransaction?.total.toLocaleString()}</p>
              </div>
              <Separator />
               <div className="text-sm space-y-2">
                    <p><span className="font-medium">Date:</span> {selectedTransaction && format(new Date(selectedTransaction.timestamp), "PPpp")}</p>
                    <p><span className="font-medium">Customer Phone:</span> {selectedTransaction?.customer.phone}</p>
                    <p><span className="font-medium">Payment Method:</span> {selectedTransaction?.paymentMethod}</p>
                    {selectedTransaction?.customer.email && <p><span className="font-medium">Receipt Sent to:</span> {selectedTransaction.customer.email}</p>}
               </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
