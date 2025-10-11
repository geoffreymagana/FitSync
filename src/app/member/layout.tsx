
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Dumbbell, QrCode, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/member", icon: Home, label: "Home" },
  { href: "/member/classes", icon: Dumbbell, label: "Classes" },
  { href: "/member/check-in", icon: QrCode, label: "Check-in" },
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
