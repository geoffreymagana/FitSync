"use client";

import { notifications } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export function Notifications() {
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            {unreadNotifications.length > 0 && (
                <span className="text-sm text-primary">{unreadNotifications.length} unread</span>
            )}
        </div>
        
        {notifications.length > 0 ? (
            <div className="space-y-4">
                {notifications.map(notification => (
                    <div key={notification.id} className="flex items-start space-x-3">
                         {!notification.read && <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                        </div>
                    </div>
                ))}
                <Button variant="outline" className="w-full mt-4">Mark all as read</Button>
            </div>
        ) : (
            <div className="text-center text-muted-foreground py-8">
                <p>No new notifications</p>
            </div>
        )}
    </div>
  )
}
