
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { members as initialMembers, Member } from "@/lib/data";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

// For this prototype, we'll just assign a few members to the instructor
const instructorClients = initialMembers.filter(m => ['M001', 'M004', 'M006'].includes(m.id));

export default function InstructorClientsPage() {
  const [clients, setClients] = useState<Member[]>(instructorClients);

  return (
    <div className="space-y-8">
      <PageHeader title="My Clients" />

      <Card>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Plan</TableHead>
                  <TableHead className="hidden md:table-cell">Join Date</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map(member => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="hidden sm:flex">
                          <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person" />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge 
                          variant={member.status === 'Active' ? 'default' : member.status === 'Inactive' ? 'secondary' : 'outline'}
                          className={member.status === 'Active' ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{member.plan}</TableCell>
                    <TableCell className="hidden md:table-cell">{member.joinDate}</TableCell>
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
                            <Link href={`/instructor/clients/${member.id}`}>View Profile</Link>
                            </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/instructor/messages/${member.id}`}>Message</Link>
                          </DropdownMenuItem>
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
