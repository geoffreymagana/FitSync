
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { members, trainers } from "@/lib/data";
import { Send, ChevronLeft, Paperclip } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const initialMessages = [
    { id: 1, sender: 'Juma Kalama', text: 'Hey, just checking in on your progress. How was the last workout?', time: '10:30 AM', sent: true, avatar: 'https://picsum.photos/seed/trainer1/100/100' },
    { id: 2, sender: 'Wanjiku Mwangi', text: 'It was great, thanks for asking! Feeling stronger already.', time: '10:32 AM', sent: false, avatar: 'https://picsum.photos/seed/member1/100/100' },
    { id: 3, sender: 'Juma Kalama', text: 'Awesome to hear! Keep up the great work. Let me know if you have any questions about the new routine.', time: '10:33 AM', sent: true, avatar: 'https://picsum.photos/seed/trainer1/100/100' },
];

export default function InstructorMessagePage() {
    const params = useParams();
    const { toast } = useToast();
    const memberId = params.memberId as string;
    
    const member = members.find(m => m.id === memberId);
    const instructor = trainers.find(t => t.name === 'Juma Kalama');
    
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");

    if (!member || !instructor) {
        return <div>Client not found.</div>
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const sentMessage = {
            id: messages.length + 1,
            sender: instructor.name,
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sent: true,
            avatar: instructor.avatarUrl
        };

        setMessages(prev => [...prev, sentMessage]);
        setNewMessage("");

        // Simulate a reply
        setTimeout(() => {
            const replyMessage = {
                id: messages.length + 2,
                sender: member.name,
                text: "Thanks for the update!",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sent: false,
                avatar: member.avatarUrl
            };
            setMessages(prev => [...prev, replyMessage]);
        }, 1500);
    };

    const handleAttachment = () => {
        toast({
            title: "Feature not available",
            description: "File attachments are not yet implemented in this prototype.",
        });
    };

    return (
        <div className="space-y-8">
            <PageHeader title="Messages">
                <Button variant="outline" asChild>
                    <Link href="/instructor/clients">
                        <ChevronLeft className="mr-2" />
                        Back to Clients
                    </Link>
                </Button>
            </PageHeader>
            
            <Card className="flex-grow flex flex-col">
                <CardHeader className="border-b py-3">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person" />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-grow flex flex-col h-[60vh]">
                    <div className="flex-grow p-4 space-y-4 overflow-y-auto" data-custom-scrollbar>
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex items-end gap-2 ${msg.sent ? 'justify-end' : ''}`}>
                                {!msg.sent && <Avatar className="w-8 h-8"><AvatarImage src={msg.avatar} data-ai-hint="person" /></Avatar>}
                                <div className={`max-w-[75%] p-3 rounded-lg ${msg.sent ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className="text-xs text-right mt-1 opacity-75">{msg.time}</p>
                                </div>
                                {msg.sent && <Avatar className="w-8 h-8"><AvatarImage src={msg.avatar} /></Avatar>}
                            </div>
                        ))}
                    </div>
                    
                    <form onSubmit={handleSendMessage} className="p-4 border-t flex items-center gap-2 pt-2">
                        <Button type="button" variant="ghost" size="icon" onClick={handleAttachment}>
                            <Paperclip className="w-5 h-5" />
                            <span className="sr-only">Attach file</span>
                        </Button>
                        <Input 
                            placeholder={`Message ${member.name}...`} 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button type="submit" size="icon">
                            <Send className="w-4 h-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
