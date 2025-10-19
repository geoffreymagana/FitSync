
import { Logo } from "@/components/logo";

export default function BillingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen bg-muted/30">
        <header className="p-6 flex items-center gap-2">
             <Logo className="w-8 h-8 text-primary" />
             <span className="font-semibold text-lg">FitSync</span>
        </header>
        <main className="flex justify-center items-start pt-16">
            {children}
        </main>
         <footer className="absolute bottom-4 w-full text-center text-sm text-muted-foreground space-x-4">
            <span>Powered by Paystack</span>
            <span>Terms</span>
            <span>Privacy</span>
        </footer>
    </div>
  );
}
