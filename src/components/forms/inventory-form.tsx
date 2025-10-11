
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { inventory as initialInventory, InventoryItem } from "@/lib/data";
import { Switch } from "../ui/switch";

const categories = [...new Set(initialInventory.map(item => item.category))];
const subCategories = [...new Set(initialInventory.map(item => item.subCategory))];

interface InventoryFormProps {
  item?: InventoryItem | null;
  isEditing?: boolean;
}

export function InventoryForm({ item, isEditing = false }: InventoryFormProps) {
  if (!isEditing && item) {
    return (
      <div className="grid gap-6">
        <div className="grid gap-3">
          <div className="font-semibold">Name</div>
          <div className="text-muted-foreground">{item.name}</div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-6">
          <div className="grid gap-3">
            <div className="font-semibold">Category</div>
            <div className="text-muted-foreground">{item.category}</div>
          </div>
          <div className="grid gap-3">
            <div className="font-semibold">Sub-category</div>
            <div className="text-muted-foreground">{item.subCategory}</div>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-6">
          <div className="grid gap-3">
            <div className="font-semibold">Stock Quantity</div>
            <Badge variant={item.quantity > 10 ? "default" : "destructive"} className={`w-fit ${item.quantity > 20 ? "bg-green-500" : ""}`}>
              {item.quantity} in stock
            </Badge>
          </div>
          <div className="grid gap-3">
            <div className="font-semibold">Price</div>
            <div className="text-muted-foreground">KES {item.price.toLocaleString()}</div>
          </div>
        </div>
        <Separator />
        <div className="grid gap-3">
            <div className="font-semibold">Show in POS</div>
            <div className="text-muted-foreground">{item.showInPOS ? 'Yes' : 'No'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Item Name</Label>
        <Input id="name" name="name" placeholder="e.g., 5kg Dumbbell" defaultValue={item?.name} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={item?.category} required>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subCategory">Sub-category</Label>
          <Select name="subCategory" defaultValue={item?.subCategory} required>
            <SelectTrigger id="subCategory">
              <SelectValue placeholder="Select a sub-category" />
            </SelectTrigger>
            <SelectContent>
              {subCategories.map(sub => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" placeholder="50" defaultValue={item?.quantity} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (KES)</Label>
          <Input id="price" name="price" type="number" placeholder="2500" defaultValue={item?.price} required />
        </div>
      </div>
      <div className="flex items-center space-x-2 rounded-md border p-4">
        <Switch id="showInPOS" name="showInPOS" defaultChecked={item?.showInPOS} />
        <Label htmlFor="showInPOS" className="flex flex-col space-y-1">
            <span>Show in POS</span>
            <span className="font-normal leading-snug text-muted-foreground">
                Make this item available for sale in the reception walk-in (POS) screen.
            </span>
        </Label>
      </div>
    </div>
  );
}
