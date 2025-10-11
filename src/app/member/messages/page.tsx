
"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { members, trainers } from "@/lib/data";
import { Send, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const initialMessages = [
    { id: 1, sender: 'Juma Kalama', text: 'Hey Ken, just checking in on your progress. How was the last workout?', time: '10:30 AM', sent: true, avatar: 'https://picsum.photos/seed/trainer1/100/100' },
    { id: 2, sender: 'Wanjiku Mwangi', text: 'It was great, thanks for asking! Feeling stronger already.', time: '10:32 AM', sent: false, avatar: 'https://picsum.photos/seed/member-ken/100/100' },
    { id: 3, sender: 'Juma Kalama', text: 'Awesome to hear! Keep up the great work. Let me know if you have any questions about the new routine.', time: '10:33 AM', sent: true, avatar: 'https://picsum.photos/seed/trainer1/100/100' },
];

export default function MemberMessagesPage() {
    const { toast } = useToast();
    const trainer = trainers.find(t => t.name === 'Juma Kalama');
    const member = members.find(m => m.name === 'Wanjiku Mwangi');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!trainer || !member) {
        return (
            <div className="p-4 md:p-6">
                 <PageHeader title="Messages" />
                 <div className="flex items-center justify-center h-[50vh]">
                    <p className="text-muted-foreground">Could not load chat.</p>
                 </div>
            </div>
        );
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const sentMessage = {
            id: messages.length + 1,
            sender: member.name,
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sent: false,
            avatar: member.avatarUrl
        };

        setMessages(prev => [...prev, sentMessage]);
        setNewMessage("");

        // Simulate a reply from the trainer
        setTimeout(() => {
            const replyMessage = {
                id: messages.length + 2,
                sender: trainer.name,
                text: "Got it, I'll take a look!",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sent: true,
                avatar: trainer.avatarUrl
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
        <div className="p-4 md:p-6 h-[calc(100vh-8rem)] flex flex-col">
            <PageHeader title="Messages" />
            
            <div className="flex items-center gap-4 py-2 border-b">
                <Avatar>
                    <AvatarImage src={trainer?.avatarUrl} alt={trainer?.name} data-ai-hint="person" />
                    <AvatarFallback>{trainer?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{trainer?.name}</p>
                    <p className="text-sm text-muted-foreground">{trainer?.specialization}</p>
                </div>
            </div>

            <div className="flex-grow p-4 space-y-4 overflow-y-auto" data-custom-scrollbar>
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${!msg.sent ? 'justify-end' : 'justify-start'}`}>
                        {msg.sent && <Avatar className="w-8 h-8"><AvatarImage src={msg.avatar} /></Avatar>}
                        <div className={`max-w-[75%] p-3 rounded-lg ${!msg.sent ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-xs text-right mt-1 opacity-75">{msg.time}</p>
                        </div>
                        {!msg.sent && <Avatar className="w-8 h-8"><AvatarImage src={msg.avatar} data-ai-hint="person smiling" /></Avatar>}
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="py-2 border-t flex items-center gap-2 bg-background pb-1">
                <Button type="button" variant="ghost" size="icon" onClick={handleAttachment}>
                    <Paperclip className="w-5 h-5" />
                    <span className="sr-only">Attach file</span>
                </Button>
                <Input 
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="h-12"
                />
                <Button type="submit" size="icon" className="h-12 w-12">
                    <Send className="w-5 h-5" />
                    <span className="sr-only">Send</span>
                </Button>
            </form>
        </div>
    );
}
