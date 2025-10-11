
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { inventory as initialInventory, InventoryItem } from "@/lib/data";
import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Edit, Trash, Save } from "lucide-react";
import Image from 'next/image';
import { useState, useEffect } from "react";
import { InventoryForm } from "@/components/forms/inventory-form";
import { useToast } from "@/hooks/use-toast";

export default function InventoryDetailsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const itemId = params.id as string;
  
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [item, setItem] = useState<InventoryItem | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch this from a DB
    const foundItem = inventory.find(i => i.id === itemId);
    setItem(foundItem);
  }, [itemId, inventory]);

  if (!item) {
    // This can be a loading state or the notFound
    return null; 
  }
  
  const handleEditItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!item) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const updatedItemData = {
      ...item,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      subCategory: formData.get("subCategory") as string,
      quantity: Number(formData.get("quantity")),
      price: Number(formData.get("price")),
      showInPOS: (formData.get("showInPOS") as string) === 'on',
    };

    const newInventory = inventory.map(i => i.id === item.id ? updatedItemData : i);
    setInventory(newInventory);
    // In a real app, you would also save this to local storage or a DB
    setItem(updatedItemData);
    setIsEditing(false);
    toast({
        title: "Item Updated",
        description: `${updatedItemData.name} has been successfully updated.`
    });
  };

  const handleDeleteItem = () => {
    if (!item) return;

    const newInventory = inventory.filter(i => i.id !== item.id);
    setInventory(newInventory);
    // In a real app, you would also save this to local storage or a DB
    toast({
        variant: "destructive",
        title: "Item Deleted",
        description: `${item.name} has been removed from inventory.`
    });
    router.push("/admin/inventory");
  }

  return (
    <div className="space-y-8">
      <PageHeader title={item.name}>
        <div className="flex items-center space-x-2">
            <Button asChild variant="outline">
                <Link href="/admin/inventory">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Inventory
                </Link>
            </Button>
        </div>
      </PageHeader>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="flex flex-col gap-8 md:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle>Product Image</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="aspect-square relative bg-muted rounded-lg">
                       <Image 
                        src={`https://picsum.photos/seed/${item.id}/600/600`}
                        alt={item.name}
                        fill
                        className="rounded-lg object-cover"
                        data-ai-hint="product image"
                       />
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <form onSubmit={handleEditItem}>
                    <CardHeader>
                    <CardTitle>Item Details</CardTitle>
                    <CardDescription>
                        {isEditing ? "Edit the details of the inventory item." : "A detailed view of the inventory item."}
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <InventoryForm item={item} isEditing={isEditing} />
                    </CardContent>
                     <CardFooter className="flex justify-start gap-2 border-t pt-6">
                        {isEditing ? (
                            <>
                                <Button type="submit">
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </Button>
                                <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                             <>
                                <Button type="button" onClick={() => setIsEditing(true)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Item
                                </Button>
                                <Button type="button" variant="destructive" onClick={handleDeleteItem}>
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete Item
                                </Button>
                            </>
                        )}
                    </CardFooter>
                </form>
            </Card>
        </div>
      </div>
    </div>
  );
}
