
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { payments } from "@/lib/data";
import { MoreHorizontal, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LocationSwitcher } from "@/components/location-switcher";
import { useState } from "react";
import { locations } from "@/lib/data";
import Link from "next/link";

export default function PaymentsPage() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0].id);

  const filteredPayments = payments.filter(payment => payment.locationId === selectedLocation);

  return (
    <div className="space-y-8">
      <PageHeader title="Payments">
         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <LocationSwitcher selectedLocation={selectedLocation} onLocationChange={setSelectedLocation} />
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2" />
            Export
          </Button>
        </div>
      </PageHeader>

      <Card>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead className="hidden sm:table-cell">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map(payment => (
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
                          <DropdownMenuItem>Mark as Pending</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
