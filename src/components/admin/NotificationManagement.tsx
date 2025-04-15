
import React, { useState } from 'react';
import { Bell, Search, Send, User, Users, X, Info, AlertTriangle, AlertCircle, Check, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNotifications, NotificationRecipient } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NotificationManagement: React.FC = () => {
  const { addNotification, getAllNotifications, getRecipientStats } = useNotifications();
  const { users } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "warning" | "error">("info");
  const [isGlobal, setIsGlobal] = useState(true);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filter notifications based on search
  const allNotifications = getAllNotifications();
  const filteredNotifications = allNotifications.filter(notification => 
    notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendNotification = () => {
    if (!title || !message) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and message for the notification",
        variant: "destructive",
      });
      return;
    }

    const recipientIds = isGlobal ? [] : selectedRecipients;
    
    addNotification({
      title,
      message,
      type,
      recipientIds,
    });
    
    toast({
      title: "Notification Sent",
      description: isGlobal 
        ? "Your notification has been sent to all users" 
        : `Your notification has been sent to ${selectedRecipients.length} user(s)`,
    });
    
    // Reset form
    setTitle("");
    setMessage("");
    setType("info");
    setIsGlobal(true);
    setSelectedRecipients([]);
  };

  const toggleRecipient = (userId: string) => {
    if (selectedRecipients.includes(userId)) {
      setSelectedRecipients(selectedRecipients.filter(id => id !== userId));
    } else {
      setSelectedRecipients([...selectedRecipients, userId]);
    }
  };

  const selectAllRecipients = () => {
    setSelectedRecipients(users.map(user => user.id));
  };

  const clearAllRecipients = () => {
    setSelectedRecipients([]);
  };

  const getTypeIcon = (notificationType: string) => {
    switch (notificationType) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const viewNotificationDetails = (notification: any) => {
    setSelectedNotification(notification);
    setIsDetailsOpen(true);
  };

  const getReadStatus = (recipients: NotificationRecipient[]) => {
    const total = recipients.length;
    const read = recipients.filter(r => r.read).length;
    return { total, read, unread: total - read };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <Tabs defaultValue="new">
        <TabsList className="mb-4">
          <TabsTrigger value="new">New Notification</TabsTrigger>
          <TabsTrigger value="history">Notification History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Send New Notification
              </CardTitle>
              <CardDescription>
                Create and send notifications to users of the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="font-medium text-sm">Notification Type</div>
                <Select 
                  value={type} 
                  onValueChange={(value: "info" | "warning" | "error") => setType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info" className="flex items-center">
                      <span className="flex items-center">
                        <Info className="h-4 w-4 text-blue-500 mr-2" />
                        Information
                      </span>
                    </SelectItem>
                    <SelectItem value="warning">
                      <span className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                        Warning
                      </span>
                    </SelectItem>
                    <SelectItem value="error">
                      <span className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                        Error
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium text-sm">Notification Title</div>
                <Input 
                  placeholder="Enter notification title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="font-medium text-sm">Message</div>
                <Textarea 
                  placeholder="Enter notification message" 
                  className="min-h-[100px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">Recipients</div>
                  <div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs"
                      onClick={() => setIsGlobal(!isGlobal)}
                    >
                      {isGlobal ? 'Select specific users' : 'Send to all users'}
                    </Button>
                  </div>
                </div>
                
                {isGlobal ? (
                  <div className="bg-muted/50 p-4 rounded-md flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>This notification will be sent to all users ({users.length})</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={selectAllRecipients}
                        className="h-8 text-xs"
                      >
                        Select All
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearAllRecipients}
                        className="h-8 text-xs"
                      >
                        Clear All
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
                      {users.map(user => (
                        <div 
                          key={user.id} 
                          className={`flex items-center gap-2 p-2 rounded-md ${
                            selectedRecipients.includes(user.id) ? 'bg-muted' : ''
                          }`}
                          onClick={() => toggleRecipient(user.id)}
                        >
                          <input 
                            type="checkbox" 
                            checked={selectedRecipients.includes(user.id)}
                            onChange={() => {}} // Handled by div click
                            className="h-4 w-4"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{user.username}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                          <Badge variant="outline" className="capitalize text-xs">
                            {user.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {selectedRecipients.length} recipient(s) selected
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" onClick={() => {
                setTitle("");
                setMessage("");
                setType("info");
                setIsGlobal(true);
                setSelectedRecipients([]);
              }}>
                Clear Form
              </Button>
              <Button onClick={handleSendNotification}>
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification History
              </CardTitle>
              <CardDescription>
                View and track all notifications sent in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Read Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map(notification => {
                      const readStats = getReadStatus(notification.recipients);
                      return (
                        <TableRow key={notification.id}>
                          <TableCell>
                            {getTypeIcon(notification.type)}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {notification.message}
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDate(notification.date)}
                          </TableCell>
                          <TableCell>
                            {notification.global ? (
                              <Badge variant="outline" className="bg-blue-50">
                                <Users className="h-3 w-3 mr-1" />
                                All Users
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                <User className="h-3 w-3 mr-1" />
                                {notification.recipients.length} Users
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Check className="h-3 w-3 text-green-500" />
                              <span className="text-xs">{readStats.read}/{readStats.total} read</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => viewNotificationDetails(notification)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No notifications found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Notification Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedNotification && getTypeIcon(selectedNotification.type)}
              <span>Notification Details</span>
            </DialogTitle>
            <DialogDescription>
              Detailed tracking information for this notification
            </DialogDescription>
          </DialogHeader>
          
          {selectedNotification && (
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedNotification.title}</h3>
                  <p className="text-muted-foreground mt-1">{selectedNotification.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Sent</p>
                    <p className="text-sm">{formatDate(selectedNotification.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(selectedNotification.type)}
                      <p className="text-sm capitalize">{selectedNotification.type}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Recipient Status</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Read Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedNotification.recipients.map((recipient: NotificationRecipient) => {
                        const user = users.find(u => u.id === recipient.userId);
                        return (
                          <TableRow key={recipient.userId}>
                            <TableCell>
                              <div className="font-medium">{user?.username || 'Unknown User'}</div>
                              <div className="text-xs text-muted-foreground">{user?.email}</div>
                            </TableCell>
                            <TableCell>
                              {recipient.read ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700">
                                  <Check className="h-3 w-3 mr-1" />
                                  Read
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Unread
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {recipient.readAt ? formatDate(recipient.readAt) : '-'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationManagement;
