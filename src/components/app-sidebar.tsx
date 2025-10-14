
'use client';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  Calendar,
  CreditCard,
  PieChart,
  LogOut,
  Settings,
  UserCheck,
  MapPin,
  Award,
  Briefcase,
  UserCog,
  Bell,
  Receipt,
  ShoppingBag,
  Warehouse,
  UserRound,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "./ui/separator";

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
};

const adminNavItems: NavItem[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/members", icon: Users, label: "Members" },
  { href: "/admin/trainers", icon: Dumbbell, label: "Trainers" },
  { href: "/admin/staff", icon: Briefcase, label: "Staff" },
  { href: "/admin/schedule", icon: Calendar, label: "Schedule" },
  { href: "/admin/payments", icon: CreditCard, label: "Payments" },
  { href: "/admin/plans", icon: Award, label: "Plans" },
  { href: "/admin/services", icon: ShoppingBag, label: "Services" },
  { href: "/admin/inventory", icon: Warehouse, label: "Inventory" },
  { href: "/admin/transactions", icon: Receipt, label: "Walk-in Sales" },
  { href: "/admin/accounts", icon: UserCog, label: "Accounts" },
  { href: "/admin/analytics", icon: PieChart, label: "Analytics" },
  { href: "/admin/locations", icon: MapPin, label: "Locations" },
];

const instructorNavItems: NavItem[] = [
    { href: "/instructor", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/instructor/schedule", icon: Calendar, label: "My Schedule" },
    { href: "/instructor/clients", icon: Users, label: "My Clients" },
];

const receptionNavItems: NavItem[] = [
  { href: "/reception", icon: UserCheck, label: "Check-In" },
  { href: "/reception/walk-in", icon: UserRound, label: "Walk-in" },
  { href: "/reception/transactions", icon: Receipt, label: "Transactions" },
];

type AppSidebarProps = {
  role: 'admin' | 'instructor' | 'reception';
};

export function AppSidebar({ role }: AppSidebarProps) {
  const pathname = usePathname();

  let navItems: NavItem[];
  let userName = 'User';
  let userEmail = 'user@fitsync.com';
  let userAvatar = 'https://picsum.photos/seed/user/100/100'
  let settingsHref = '/';

  switch (role) {
    case 'admin':
      navItems = adminNavItems;
      userName = 'Maina Kamau';
      userEmail = 'admin@fitsync.com';
      settingsHref = '/admin/settings';
      break;
    case 'instructor':
      navItems = instructorNavItems;
      userName = 'Juma Kalama';
      userEmail = 'instructor@fitsync.com';
      userAvatar = 'https://picsum.photos/seed/trainer1/100/100'
      settingsHref = '/instructor/settings';
      break;
    case 'reception':
      navItems = receptionNavItems;
      userName = 'Amina Sharif';
      userEmail = 'reception@fitsync.com'
      settingsHref = '/reception/settings';
      break;
  }

  return (
    <aside className="sticky top-0 h-screen flex flex-col bg-card text-card-foreground border-r w-full">
      <div className="flex h-16 items-center gap-3 px-3">
        <Logo className="w-8 h-8 text-primary" />
        <span className="font-headline text-lg font-semibold">FitSync</span>
      </div>
      <div className="flex-1 overflow-y-auto" data-sidebar-content>
        <ul className="flex w-full min-w-0 flex-col gap-1 px-3">
          {navItems.map((item) => (
            <li key={item.href} className="group/menu-item relative">
              <Link href={item.href}
                className={`flex w-full items-center gap-3 overflow-hidden rounded-md p-3 text-left text-sm outline-none ring-sidebar-ring transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 active:bg-accent active:text-accent-foreground
                ${pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin') ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-medium' : ''}`}
              >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div className="p-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="w-full justify-start h-auto p-3">
              <div className="flex w-full items-center gap-2 overflow-hidden text-left text-sm">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userAvatar} data-ai-hint="person smiling" />
                  <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                  <span className="font-semibold">{userName}</span>
                  <span className="text-xs text-muted-foreground">{userEmail}</span>
                </div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 mb-2" side="top" align="start">
            <div className="flex flex-col space-y-1">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href={settingsHref}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Link>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </aside>
  );
}
