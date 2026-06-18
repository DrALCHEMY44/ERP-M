
"use client"

import * as React from "react"
import { Bell, Info, AlertTriangle, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFirestore } from "@/hooks/use-firestore"
import { AppNotification } from "@/lib/types"
import { MOCK_USER } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { 
  Popover as PopoverPrimitive, 
  PopoverContent as PopoverContentPrimitive, 
  PopoverTrigger as PopoverTriggerPrimitive 
} from "@/components/ui/popover"

export function NotificationCenter() {
  const { data: allNotifications, loading, updateRecord } = useFirestore<AppNotification>('notifications');
  
  const notifications = React.useMemo(() => {
    return allNotifications.filter(n => {
      const isForMe = !n.targetUserId || n.targetUserId === MOCK_USER.uid;
      const isForMyRole = !n.targetRoles || n.targetRoles.includes(MOCK_USER.role);
      return isForMe && isForMyRole;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [allNotifications]);

  const unreadCount = notifications.filter(n => !n.readBy.includes(MOCK_USER.uid)).length;

  const markAsRead = async (notification: AppNotification) => {
    if (notification.id && !notification.readBy.includes(MOCK_USER.uid)) {
      await updateRecord(notification.id, {
        readBy: [...notification.readBy, MOCK_USER.uid]
      });
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(n => !n.readBy.includes(MOCK_USER.uid));
    for (const n of unread) {
      if (n.id) {
        await updateRecord(n.id, {
          readBy: [...n.readBy, MOCK_USER.uid]
        });
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="size-4 text-amber-500" />;
      case 'error': return <AlertCircle className="size-4 text-destructive" />;
      case 'success': return <CheckCircle2 className="size-4 text-emerald-500" />;
      default: return <Info className="size-4 text-blue-500" />;
    }
  };

  return (
    <PopoverPrimitive>
      <PopoverTriggerPrimitive asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="size-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTriggerPrimitive>
      <PopoverContentPrimitive className="w-80 p-0 overflow-hidden" align="end">
        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-tight">Notifications</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Real-time SME Alerts</p>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[10px] font-bold uppercase h-7 px-2"
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[350px]">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-2 opacity-50">
              <Bell className="size-10 text-muted-foreground/30" />
              <p className="text-[10px] font-bold uppercase">No unread alerts</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={cn(
                    "p-4 border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer relative",
                    !n.readBy.includes(MOCK_USER.uid) && "bg-primary/5"
                  )}
                  onClick={() => markAsRead(n)}
                >
                  <div className="flex gap-3">
                    <div className="mt-1 shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <h4 className={cn(
                          "text-xs font-bold leading-none",
                          !n.readBy.includes(MOCK_USER.uid) ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {n.title}
                        </h4>
                        <span className="text-[8px] text-muted-foreground font-mono">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] leading-tight text-muted-foreground">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <Badge variant="outline" className="text-[8px] h-4 font-bold uppercase px-1">
                          {n.module}
                        </Badge>
                        {n.link && (
                          <Link href={n.link} className="text-[8px] font-bold text-primary uppercase hover:underline">
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                    {!n.readBy.includes(MOCK_USER.uid) && (
                      <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t bg-muted/10">
           <p className="text-center text-[8px] text-muted-foreground uppercase font-bold tracking-widest">
             End-to-End Encryption Enabled
           </p>
        </div>
      </PopoverContentPrimitive>
    </PopoverPrimitive>
  )
}
