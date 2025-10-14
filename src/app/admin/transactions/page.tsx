
"use client";

import { useState, useEffect, useContext } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/lib/types";
import { format } from "date-fns";
import { MoreHorizontal, Search, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { LocationSwitcher } from '@/components/location-switcher';
import { locations } from '@/lib/data';
import Link from 'next/link';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState('all');

  useEffect(() => {
    const storedTransactions = localStorage.getItem('walkInTransactions');
    if (storedTransactions) {
      const parsedTransactions: Transaction[] = JSON.parse(storedTransactions);
      setTransactions(parsedTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }
  }, []);

  useEffect(() => {
    let locationTransactions = transactions;

    if (selectedLocation !== 'all') {
      const locationPrefix = locations.find(l => l.id === selectedLocation)?.name.split(' ')[1].slice(0, 3).toUpperCase() || 'UNK';
      locationTransactions = transactions.filter(t => t.id.startsWith(locationPrefix));
    }
    
    const results = locationTransactions.filter(t => 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer.phone.includes(searchTerm) ||
      (t.customer.email && t.customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredTransactions(results);
  }, [searchTerm, transactions, selectedLocation]);

  const allLocations = [{ id: 'all', name: 'All Locations' }, ...locations];

  return (
    <div className="space-y-8">
      <PageHeader title="Walk-in Transactions">
          <div className="flex items-center space-x-2">
            <LocationSwitcher selectedLocation={selectedLocation} onLocationChange={setSelectedLocation} />
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by ID, phone, email..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2" />
              Export
            </Button>
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
                      <Link href={`/admin/transactions/${transaction.id}`} className="hover:underline">
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
                          <DropdownMenuItem asChild>
                             <Link href={`/admin/transactions/${transaction.id}`}>View Details</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
