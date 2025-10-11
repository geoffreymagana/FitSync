
import { AppSidebar } from '@/components/app-sidebar';
import { Notifications } from '@/components/notifications';
import { Button } from '@/components/ui/button';
import { Bell, Menu } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

export default function InstructorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="flex min-h-screen">
        <div className="hidden lg:block w-[18rem]">
            <AppSidebar role="instructor" />
        </div>
        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:justify-end">
             <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[18rem] p-0 flex flex-col">
                 <SheetHeader className="sr-only">
                    <SheetTitle>Instructor Menu</SheetTitle>
                    <SheetDescription>Navigation links for the instructor dashboard.</SheetDescription>
                  </SheetHeader>
                 <AppSidebar role="instructor" />
              </SheetContent>
            </Sheet>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Open notifications</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <Notifications role="instructor" />
              </PopoverContent>
            </Popover>
          </header>
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-8">{children}</div>
          </main>
        </div>
      </div>
  );
}
