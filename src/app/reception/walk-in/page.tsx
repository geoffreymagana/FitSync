
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { walkInServices as initialWalkInServices, inventory } from "@/lib/data";
import { WalkInService, OrderItem, Transaction } from "@/lib/types";
import { useState, useMemo, useEffect, useContext } from "react";
import { CreditCard, Smartphone, Plus, Minus, X, CheckCircle, Mail, Banknote, Shirt } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import * as Lucide from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReceptionContext } from "@/context/reception-context";

const iconComponents: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    Ticket: Lucide.Ticket,
    Waves: Lucide.Waves,
    Dumbbell: Lucide.Dumbbell,
    Package: Lucide.Package,
    Zap: Lucide.Zap,
    CupSoda: Lucide.CupSoda,
    Shirt: Lucide.Shirt,
    Wind: Lucide.Wind,
    GlassWater: Lucide.GlassWater,
    Droplet: Lucide.Droplet,
  };

const getIconComponent = (iconName?: string): React.FC<React.SVGProps<SVGSVGElement>> => {
    if (!iconName) return Lucide.Package;
    return iconComponents[iconName] || Lucide.Package;
};

export default function WalkInPage() {
    const { selectedLocation } = useContext(ReceptionContext);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing-mpesa' | 'success' | 'failed'>('idle');
    const { toast } = useToast();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [lastCompletedTransaction, setLastCompletedTransaction] = useState<Transaction | null>(null);

    const posItems = useMemo(() => {
        const inventoryForPOS = inventory
            .filter(item => item.showInPOS)
            .map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                color: 'rgba(107, 114, 128, 0.8)', // default color for inventory items
                icon: 'Package', // default icon
                category: item.category,
            }));
        return [...initialWalkInServices, ...inventoryForPOS];
    }, []);

    useEffect(() => {
        const storedTransactions = localStorage.getItem('walkInTransactions');
        if (storedTransactions) {
            setTransactions(JSON.parse(storedTransactions));
        }
    }, []);

    useEffect(() => {
        if (transactions.length > 0) {
            localStorage.setItem('walkInTransactions', JSON.stringify(transactions));
        }
    }, [transactions]);


    const handleAddToOrder = (service: WalkInService) => {
        setOrderItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === service.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...service, quantity: 1 }];
        });
    };
    
    const handleUpdateQuantity = (serviceId: string, delta: number) => {
        setOrderItems(prevItems => {
            const updatedItems = prevItems.map(item => {
                if (item.id === serviceId) {
                    return { ...item, quantity: Math.max(0, item.quantity + delta) };
                }
                return item;
            });
            return updatedItems.filter(item => item.quantity > 0);
        });
    };

    const handleRemoveItem = (serviceId: string) => {
        setOrderItems(prevItems => prevItems.filter(item => item.id !== serviceId));
    };
    
    const total = useMemo(() => {
        return orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [orderItems]);
    
    const generateTransactionId = () => {
        if (!selectedLocation || orderItems.length === 0) return '';
        
        const locationPrefix = selectedLocation.name.split(' ')[1]?.slice(0, 3).toUpperCase() || 'DEF';
        
        const service = orderItems[0];
        const serviceParts = service.name.split(' ');
        const serviceAbbreviation = serviceParts.length > 1
            ? `${serviceParts[0][0]}${serviceParts[1][0]}`
            : service.name.slice(0, 2);

        return `${locationPrefix}-${serviceAbbreviation.toUpperCase()}-${Date.now().toString().slice(-6)}`;
    };

    const completeTransaction = (paymentMethod: 'M-Pesa' | 'Cash') => {
        const newTransaction: Transaction = {
            id: generateTransactionId(),
            items: orderItems,
            total,
            paymentMethod,
            customer: { phone: phoneNumber },
            timestamp: new Date().toISOString(),
        };
        setTransactions(prev => [newTransaction, ...prev]);
        setLastCompletedTransaction(newTransaction);
        setPaymentStatus('success');
    }

    const handleMpesaPayment = () => {
        if (orderItems.length === 0 || !phoneNumber) {
            return;
        }
        setPaymentStatus('processing-mpesa');
        setTimeout(() => {
            completeTransaction('M-Pesa');
        }, 3000);
    };

    const handleCashPayment = () => {
         if (orderItems.length === 0) {
            return;
        }
        completeTransaction('Cash');
    }

    const handleSendReceipt = () => {
        if (!email || !lastCompletedTransaction) return;
        
        // Update the transaction with the email
        setTransactions(prev => prev.map(t => 
            t.id === lastCompletedTransaction.id ? { ...t, customer: { ...t.customer, email } } : t
        ));

        toast({
            title: "Receipt Sent",
            description: `A receipt for transaction ${lastCompletedTransaction.id} has been sent to ${email}.`
        });
        handleNewOrder();
    };

    const handleNewOrder = () => {
        setOrderItems([]);
        setPhoneNumber('');
        setEmail('');
        setPaymentStatus('idle');
        setLastCompletedTransaction(null);
    }
    
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 10) {
            setPhoneNumber(value);
        }
    };
    
    const serviceCategories = useMemo(() => {
        return posItems.reduce((acc, service) => {
            const category = service.category || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(service);
            return acc;
        }, {} as Record<string, WalkInService[]>);
    }, [posItems]);

    return (
        <div className="h-screen bg-muted/20 lg:h-[calc(100vh-64px)]">
            <AlertDialog open={paymentStatus === 'success'} onOpenChange={() => paymentStatus === 'success' && handleNewOrder()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="flex justify-center">
                             <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <AlertDialogTitle className="text-center">Payment Successful</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            The payment of KES {lastCompletedTransaction?.total.toLocaleString()} was successful. The customer can now access the service(s).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="receipt-email">Send Receipt (Optional)</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    id="receipt-email" 
                                    type="email" 
                                    placeholder="customer@fitsync.com" 
                                    className="pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                         <Button onClick={handleSendReceipt} className="w-full" disabled={!email}>
                            Send Receipt
                        </Button>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleNewOrder}>Start New Order</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
                <div className="lg:col-span-2 p-4 md:p-6 overflow-y-auto">
                    {Object.entries(serviceCategories).map(([category, services]) => (
                        <div key={category} className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">{category}</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {services.map(service => {
                                    const Icon = getIconComponent(service.icon);
                                    return (
                                        <Card 
                                            key={service.id} 
                                            className="cursor-pointer hover:shadow-lg transition-all flex flex-col group border bg-card"
                                            onClick={() => handleAddToOrder(service)}
                                        >
                                            <CardContent className="p-4 flex flex-col items-center justify-center text-center flex-grow">
                                                <div 
                                                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                                                    style={{ backgroundColor: service.color.replace('0.8)', '1)') }}
                                                >
                                                    <Icon className="h-8 w-8 text-white" />
                                                </div>
                                                <p className="font-semibold text-sm sm:text-base flex-grow mb-1">{service.name}</p>
                                                <p className="text-base sm:text-lg font-bold text-muted-foreground">KES {service.price.toLocaleString()}</p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1 bg-background border-l h-full flex flex-col">
                    <div className="flex-grow flex flex-col">
                        <CardHeader>
                            <CardTitle>Order Details</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow overflow-y-auto">
                           {orderItems.length > 0 ? (
                                <div className="space-y-4">
                                    {orderItems.map(item => (
                                        <div key={item.id} className="flex items-center">
                                            <div className="flex-grow">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">KES {item.price.toLocaleString()}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, -1)}><Minus className="h-4 w-4" /></Button>
                                                <span>{item.quantity}</span>
                                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, 1)}><Plus className="h-4 w-4" /></Button>
                                            </div>
                                             <Button variant="ghost" size="icon" className="h-7 w-7 ml-2" onClick={() => handleRemoveItem(item.id)}><X className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-muted-foreground">Select services to start an order.</p>
                                </div>
                            )}
                        </CardContent>
                        {orderItems.length > 0 && (
                            <CardFooter className="flex-col !p-0 mt-auto">
                               <Separator />
                               <div className="p-6 w-full space-y-4">
                                     <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>KES {total.toLocaleString()}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Customer Phone Number (for M-Pesa)</Label>
                                        <div className="relative">
                                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input 
                                                id="phone" 
                                                type="tel" 
                                                placeholder="e.g. 0712345678" 
                                                className="pl-10"
                                                value={phoneNumber}
                                                onChange={handlePhoneChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                    <Button 
                                        className="w-full" 
                                        size="lg"
                                        onClick={handleCashPayment} 
                                        disabled={paymentStatus !== 'idle'}
                                        variant="outline"
                                    >
                                        <Banknote className="mr-2" />
                                        Cash
                                    </Button>
                                    <Button 
                                        className="w-full" 
                                        size="lg"
                                        onClick={handleMpesaPayment} 
                                        disabled={!phoneNumber || phoneNumber.length < 10 || paymentStatus !== 'idle'}
                                    >
                                        {paymentStatus === 'processing-mpesa' ? 'Processing...' : (
                                            <>
                                                <CreditCard className="mr-2" />
                                                M-Pesa
                                            </>
                                        )}
                                    </Button>
                                    </div>
                                    {paymentStatus === 'processing-mpesa' && (
                                        <p className="text-center text-sm text-muted-foreground pt-2">
                                            Push sent to {phoneNumber}. Ask customer to enter their PIN.
                                        </p>
                                    )}
                               </div>
                            </CardFooter>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
