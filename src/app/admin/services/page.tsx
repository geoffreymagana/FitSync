
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { walkInServices as initialServices, WalkInService } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import * as Lucide from "lucide-react";
import { useState, useMemo }from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";


const iconComponents: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    Activity: Lucide.Activity,
    Airplay: Lucide.Airplay,
    AlarmClock: Lucide.AlarmClock,
    Award: Lucide.Award,
    BadgeCheck: Lucide.BadgeCheck,
    Banknote: Lucide.Banknote,
    BarChart: Lucide.BarChart,
    Bell: Lucide.Bell,
    Bike: Lucide.Bike,
    Bitcoin: Lucide.Bitcoin,
    Book: Lucide.Book,
    Briefcase: Lucide.Briefcase,
    Building: Lucide.Building,
    Calendar: Lucide.Calendar,
    Camera: Lucide.Camera,
    Check: Lucide.Check,
    ChevronDown: Lucide.ChevronDown,
    ChevronUp: Lucide.ChevronUp,
    Clipboard: Lucide.Clipboard,
    Clock: Lucide.Clock,
    Cloud: Lucide.Cloud,
    Code: Lucide.Code,
    Coffee: Lucide.Coffee,
    Compass: Lucide.Compass,
    Copy: Lucide.Copy,
    CreditCard: Lucide.CreditCard,
    Crown: Lucide.Crown,
    CupSoda: Lucide.CupSoda,
    Currency: Lucide.Currency,
    Database: Lucide.Database,
    Diamond: Lucide.Diamond,
    DollarSign: Lucide.DollarSign,
    Download: Lucide.Download,
    Droplet: Lucide.Droplet,
    Dumbbell: Lucide.Dumbbell,
    Edit: Lucide.Edit,
    ExternalLink: Lucide.ExternalLink,
    Eye: Lucide.Eye,
    Facebook: Lucide.Facebook,
    File: Lucide.File,
    Filter: Lucide.Filter,
    Flag: Lucide.Flag,
    Folder: Lucide.Folder,
    Gift: Lucide.Gift,
    Github: Lucide.Github,
    GlassWater: Lucide.GlassWater,
    Globe: Lucide.Globe,
    Grid: Lucide.Grid,
    Heart: Lucide.Heart,
    HelpCircle: Lucide.HelpCircle,
    Home: Lucide.Home,
    Image: Lucide.Image,
    Inbox: Lucide.Inbox,
    Instagram: Lucide.Instagram,
    Key: Lucide.Key,
    Laptop: Lucide.Laptop,
    Layout: Lucide.Layout,
    LifeBuoy: Lucide.LifeBuoy,
    Lightbulb: Lucide.Lightbulb,
    Linkedin: Lucide.Linkedin,
    Lock: Lucide.Lock,
    LogIn: Lucide.LogIn,
    LogOut: Lucide.LogOut,
    Mail: Lucide.Mail,
    Map: Lucide.Map,
    MapPin: Lucide.MapPin,
    Maximize: Lucide.Maximize,
    Medal: Lucide.Medal,
    Menu: Lucide.Menu,
    MessageCircle: Lucide.MessageCircle,
    Mic: Lucide.Mic,
    Minimize: Lucide.Minimize,
    Monitor: Lucide.Monitor,
    Moon: Lucide.Moon,
    MoreHorizontal: Lucide.MoreHorizontal,
    MoreVertical: Lucide.MoreVertical,
    Move: Lucide.Move,
    Music: Lucide.Music,
    Package: Lucide.Package,
    Palette: Lucide.Palette,
    Paperclip: Lucide.Paperclip,
    ParkingCircle: Lucide.ParkingCircle,
    Pen: Lucide.Pen,
    Phone: Lucide.Phone,
    PieChart: Lucide.PieChart,
    Pizza: Lucide.Pizza,
    Plane: Lucide.Plane,
    Play: Lucide.Play,
    Plus: Lucide.Plus,
    Pocket: Lucide.Pocket,
    Printer: Lucide.Printer,
    QrCode: Lucide.QrCode,
    RefreshCcw: Lucide.RefreshCcw,
    Repeat: Lucide.Repeat,
    Rocket: Lucide.Rocket,
    Save: Lucide.Save,
    Scissors: Lucide.Scissors,
    ScreenShare: Lucide.ScreenShare,
    Search: Lucide.Search,
    Send: Lucide.Send,
    Settings: Lucide.Settings,
    Share: Lucide.Share,
    Shield: Lucide.Shield,
    ShoppingBag: Lucide.ShoppingBag,
    ShoppingCart: Lucide.ShoppingCart,
    Shuffle: Lucide.Shuffle,
    Smartphone: Lucide.Smartphone,
    Smile: Lucide.Smile,
    Speaker: Lucide.Speaker,
    Star: Lucide.Star,
    Sun: Lucide.Sun,
    Sunrise: Lucide.Sunrise,
    Sunset: Lucide.Sunset,
    Table: Lucide.Table,
    Tablet: Lucide.Tablet,
    Tag: Lucide.Tag,
    Target: Lucide.Target,
    Ticket: Lucide.Ticket,
    Train: Lucide.Train,
    Trash: Lucide.Trash,
    TrendingUp: Lucide.TrendingUp,
    Truck: Lucide.Truck,
    Twitter: Lucide.Twitter,
    Type: Lucide.Type,
    Umbrella: Lucide.Umbrella,
    Unlock: Lucide.Unlock,
    Upload: Lucide.Upload,
    User: Lucide.User,
    Users: Lucide.Users,
    Video: Lucide.Video,
    Voicemail: Lucide.Voicemail,
    Volume2: Lucide.Volume2,
    Wallet: Lucide.Wallet,
    Watch: Lucide.Watch,
    Waves: Lucide.Waves,
    Wifi: Lucide.Wifi,
    Wind: Lucide.Wind,
    Youtube: Lucide.Youtube,
    Zap: Lucide.Zap,
    ZoomIn: Lucide.ZoomIn,
    ZoomOut: Lucide.ZoomOut,
  };

const getIconComponent = (iconName?: string): React.FC<React.SVGProps<SVGSVGElement>> => {
  if (!iconName) return Lucide.Package;
  return iconComponents[iconName] || Lucide.Package;
};

export default function ServicesPage() {
  const [services, setServices] = useState<WalkInService[]>(initialServices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<WalkInService | null>(null);
  const [currentIcon, setCurrentIcon] = useState('Package');

  const serviceCategories = useMemo(() => {
    return [...new Set(initialServices.map(s => s.category))];
  }, []);

  const openEditDialog = (service: WalkInService) => {
    setSelectedService(service);
    setCurrentIcon(service.icon);
    setIsEditDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setSelectedService(null);
    setCurrentIcon('Package');
    setIsAddDialogOpen(true);
  }

  const handleIconSelect = (iconName: string) => {
    setCurrentIcon(iconName);
    setIsIconPickerOpen(false);
  };

  const handleAddService = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newService: WalkInService = {
      id: `walkin-${services.length + 1}`,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      price: Number(formData.get("price")),
      icon: currentIcon,
      color: 'rgba(107, 114, 128, 0.8)', // Default color
    };
    setServices([...services, newService]);
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleEditService = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedService) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    
    const updatedService = {
      ...selectedService,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      price: Number(formData.get("price")),
      icon: currentIcon,
    };

    setServices(services.map(s => s.id === selectedService.id ? updatedService : s));
    setIsEditDialogOpen(false);
    setSelectedService(null);
  };
  
  const IconPicker = () => (
    <Dialog open={isIconPickerOpen} onOpenChange={setIsIconPickerOpen}>
        <DialogContent className="max-w-3xl">
            <DialogHeader>
                <DialogTitle>Select an Icon</DialogTitle>
                <DialogDescription>
                    Choose an icon for the service.
                </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-96">
                 <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 p-4">
                    {Object.keys(iconComponents).map(iconName => {
                        const Icon = getIconComponent(iconName);
                        return (
                            <Button
                                key={iconName}
                                variant="outline"
                                className={cn(
                                    "flex h-16 w-16 items-center justify-center rounded-lg",
                                    currentIcon === iconName && "ring-2 ring-primary"
                                )}
                                onClick={() => handleIconSelect(iconName)}
                            >
                                <Icon className="h-8 w-8" />
                            </Button>
                        )
                    })}
                </div>
            </ScrollArea>
        </DialogContent>
    </Dialog>
  )

  const ServiceForm = ({ service }: { service?: WalkInService | null }) => {
    const CurrentIcon = getIconComponent(currentIcon);
    return (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label>Icon</Label>
                <Button type="button" variant="outline" className="w-full h-24 flex-col gap-2" onClick={() => setIsIconPickerOpen(true)}>
                    <CurrentIcon className="w-10 h-10 text-primary" />
                    <span>{currentIcon}</span>
                </Button>
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input id="name" name="name" placeholder="e.g., Yoga Class Pass" defaultValue={service?.name} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                 <Select name="category" defaultValue={service?.category} required>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {serviceCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="price">Price (KES)</Label>
                <Input id="price" name="price" type="number" max="150000" placeholder="800" defaultValue={service?.price} required />
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Walk-in Services">
        <Button onClick={openAddDialog}>
          <PlusCircle className="mr-2" />
          Add Service
        </Button>
      </PageHeader>

      <IconPicker />

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead>Price (KES)</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map(service => {
                const Icon = getIconComponent(service.icon);
                return (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: service.color.replace('0.8)', '1)') }}
                        >
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span>{service.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{service.category}</TableCell>
                    <TableCell>KES {service.price.toLocaleString()}</TableCell>
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
                          <DropdownMenuItem onClick={() => openEditDialog(service)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Service Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Define a new walk-in service for your POS system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddService}>
            <ServiceForm />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Add Service</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Update the details for {selectedService?.name}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditService}>
            <ServiceForm service={selectedService} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
