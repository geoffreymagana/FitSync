
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, QrCode, UserCircle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Notifications } from "@/components/notifications";

const navItems = [
  { href: "/member", icon: Home, label: "Home" },
  { href: "/member/classes", icon: Dumbbell, label: "Classes" },
  { href: "/member/check-in", icon: QrCode, label: "Check-in" },
  { href: "/member/messages", icon: MessageSquare, label: "Messages" },
  { href: "/member/profile", icon: UserCircle, label: "Profile" },
];

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-end border-b bg-background/80 px-4 backdrop-blur-sm">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Open notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <Notifications role="member" />
          </PopoverContent>
        </Popover>
      </header>
      <main className="pb-20">{children}</main>
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-background">
        <nav className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full text-muted-foreground transition-colors",
                  isActive && "text-primary"
                )}
              >
                <item.icon className="h-6 w-6 mb-1" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </footer>
    </div>
  );
}
