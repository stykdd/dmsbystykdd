
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";

type NotificationType = 'info' | 'warning' | 'error';

export interface NotificationRecipient {
  userId: string;
  read: boolean;
  readAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: NotificationType;
  global: boolean;
  recipients: NotificationRecipient[];
  createdBy: string;
}

interface NotificationContextType {
  notifications: Notification[];
  userNotifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'recipients' | 'createdBy'> & { recipientIds?: string[] }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getAllNotifications: () => Notification[];
  getNotificationStats: () => { total: number, read: number, unread: number };
  getRecipientStats: (notificationId: string) => { total: number, read: number, unread: number };
}

// Storage key for notifications
const NOTIFICATIONS_STORAGE_KEY = 'dms_notifications';

// Get stored notifications
const getStoredNotifications = (): Notification[] => {
  const notificationsJson = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  if (notificationsJson) {
    try {
      return JSON.parse(notificationsJson);
    } catch (e) {
      console.error("Error parsing stored notifications:", e);
    }
  }
  return [];
};

// Save notifications to storage
const saveNotifications = (notifications: Notification[]) => {
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, users } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(getStoredNotifications());
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  // Filter notifications for the current user
  const userNotifications = notifications.filter(notification => 
    notification.global || notification.recipients.some(r => r.userId === user?.id)
  );

  useEffect(() => {
    // Update unread count whenever notifications or user changes
    if (user) {
      const count = userNotifications.filter(notification => {
        const recipient = notification.recipients.find(r => r.userId === user.id);
        return recipient ? !recipient.read : !notification.global;
      }).length;
      
      setUnreadCount(count);
    } else {
      setUnreadCount(0);
    }
  }, [notifications, user, userNotifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'recipients' | 'createdBy'> & { recipientIds?: string[] }) => {
    if (!user) return;

    const isGlobal = !notification.recipientIds || notification.recipientIds.length === 0;
    
    // Create recipients list
    let recipients: NotificationRecipient[] = [];
    
    if (isGlobal) {
      // For global notifications, add all users as recipients
      recipients = users.map(u => ({
        userId: u.id,
        read: false
      }));
    } else if (notification.recipientIds) {
      // For targeted notifications, add only specified recipients
      recipients = notification.recipientIds.map(userId => ({
        userId,
        read: false
      }));
    }

    const newNotification: Notification = {
      id: Date.now().toString(),
      title: notification.title,
      message: notification.message,
      date: new Date().toISOString(),
      type: notification.type,
      global: isGlobal,
      recipients,
      createdBy: user.id
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
    
    // Show toast for new notification if it's for the current user
    if (isGlobal || notification.recipientIds?.includes(user.id)) {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'error' ? 'destructive' : 'default',
      });
    }
  };

  const markAsRead = (id: string) => {
    if (!user) return;

    const updatedNotifications = notifications.map(notification => {
      if (notification.id === id) {
        const updatedRecipients = notification.recipients.map(recipient => {
          if (recipient.userId === user.id) {
            return { ...recipient, read: true, readAt: new Date().toISOString() };
          }
          return recipient;
        });
        return { ...notification, recipients: updatedRecipients };
      }
      return notification;
    });

    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    if (!user) return;

    const updatedNotifications = notifications.map(notification => {
      const updatedRecipients = notification.recipients.map(recipient => {
        if (recipient.userId === user.id) {
          return { ...recipient, read: true, readAt: new Date().toISOString() };
        }
        return recipient;
      });
      return { ...notification, recipients: updatedRecipients };
    });

    setNotifications(updatedNotifications);
    saveNotifications(updatedNotifications);

    toast({
      title: "All notifications marked as read",
      description: `${unreadCount} notifications marked as read`,
    });
  };

  const getAllNotifications = () => {
    return notifications;
  };

  const getNotificationStats = () => {
    if (!user) return { total: 0, read: 0, unread: 0 };
    
    const total = userNotifications.length;
    const unread = unreadCount;
    const read = total - unread;
    
    return { total, read, unread };
  };

  const getRecipientStats = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    
    if (!notification) {
      return { total: 0, read: 0, unread: 0 };
    }
    
    const total = notification.recipients.length;
    const read = notification.recipients.filter(r => r.read).length;
    const unread = total - read;
    
    return { total, read, unread };
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        userNotifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        getAllNotifications,
        getNotificationStats,
        getRecipientStats
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Notification Bell component to be used across the app
export const NotificationBell: React.FC = () => {
  const { userNotifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { user } = useAuth();

  const getNotificationIcon = (type: NotificationType) => {
    switch(type) {
      case "warning":
        return <div className="h-4 w-4 text-yellow-500">⚠️</div>;
      case "error":
        return <div className="h-4 w-4 text-red-500">⛔</div>;
      case "info":
      default:
        return <div className="h-4 w-4 text-blue-500">ℹ️</div>;
    }
  };

  // Check if notification is unread for current user
  const isUnread = (notification: Notification) => {
    if (!user) return false;
    const recipient = notification.recipients.find(r => r.userId === user.id);
    return recipient ? !recipient.read : !notification.global;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all read
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userNotifications.length > 0 ? (
          userNotifications.map(notification => (
            <DropdownMenuItem key={notification.id} onSelect={() => markAsRead(notification.id)}>
              <div className={`flex items-start gap-2 py-1 ${isUnread(notification) ? 'font-medium' : ''}`}>
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <div className="text-sm font-medium">{notification.title}</div>
                  <div className="text-xs text-gray-500">{notification.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(notification.date).toLocaleString()}</div>
                </div>
                {isUnread(notification) && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                )}
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="px-2 py-4 text-center text-sm text-gray-500">
            No notifications
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
