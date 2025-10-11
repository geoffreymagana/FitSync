
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inventory as initialInventory, InventoryItem } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { InventoryForm } from "@/components/forms/inventory-form";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const openEditDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newItem: InventoryItem = {
      id: `INV${inventory.length + 1}`,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      subCategory: formData.get("subCategory") as string,
      quantity: Number(formData.get("quantity")),
      price: Number(formData.get("price")),
      showInPOS: (formData.get("showInPOS") as string) === 'on',
    };
    setInventory([...inventory, newItem]);
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleEditItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedItem) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const updatedItem = {
      ...selectedItem,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      subCategory: formData.get("subCategory") as string,
      quantity: Number(formData.get("quantity")),
      price: Number(formData.get("price")),
      showInPOS: (formData.get("showInPOS") as string) === 'on',
    };

    setInventory(inventory.map(item => item.id === selectedItem.id ? updatedItem : item));
    setIsEditDialogOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = () => {
    if(!selectedItem) return;

    setInventory(inventory.filter(item => item.id !== selectedItem.id));
    setIsEditDialogOpen(false);
    setSelectedItem(null);
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Inventory Management">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2" />
          Add Item
        </Button>
      </PageHeader>

      <Card>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden sm:table-cell">Stock Quantity</TableHead>
                  <TableHead className="hidden sm:table-cell">Unit Price (KES)</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                        <Image
                          src={`https://picsum.photos/seed/${item.id}/100/100`}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                          data-ai-hint="product image"
                        />
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/admin/inventory/${item.id}`} className="hover:underline">
                        {item.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col">
                          <span className="font-semibold">{item.category}</span>
                          <span className="text-xs text-muted-foreground">{item.subCategory}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={item.quantity > 10 ? "default" : "destructive" } className={item.quantity > 20 ? "bg-green-500" : ""}>
                          {item.quantity} in stock
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">KES {item.price.toLocaleString()}</TableCell>
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
                          <DropdownMenuItem onClick={() => openEditDialog(item)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => openEditDialog(item)}>Delete</DropdownMenuItem>
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

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
            <DialogDescription>
              Fill in the details for the new item.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddItem}>
            <div className="py-4">
                <InventoryForm isEditing={true} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Add Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update the details for {selectedItem?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditItem}>
            <div className="py-4">
                <InventoryForm item={selectedItem} isEditing={true} />
            </div>
            <DialogFooter className="justify-between">
              <Button type="button" variant="destructive" onClick={handleDeleteItem}>Delete</Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
