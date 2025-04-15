
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, Link2Off, Shield, UserCheck, UserCog, UserRound } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";

const UserConnection: React.FC = () => {
  const { user, users, connectToUserAccount, disconnectFromUserAccount } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter users based on search query and exclude admin/current user
  const filteredUsers = users.filter(u => 
    (u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
     u.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    u.id !== user?.id &&
    u.role !== 'Admin'
  );

  const handleConnectToUser = (userData: typeof users[0]) => {
    connectToUserAccount(userData);
    
    toast({
      title: "Connected to User Account",
      description: `You are now connected to ${userData.username}'s account`,
    });
    
    addNotification({
      title: "Admin Connected to Account",
      message: `Admin has connected to ${userData.username}'s account`,
      type: "info",
      recipientIds: [userData.id]
    });
  };

  const handleDisconnect = () => {
    disconnectFromUserAccount();
    
    toast({
      title: "Disconnected",
      description: "You have returned to your admin account",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5 text-primary" />
          User Account Connection
        </CardTitle>
        <CardDescription>
          Connect to user accounts to provide support and troubleshoot issues
        </CardDescription>
      </CardHeader>
      
      {user?.connectedBy ? (
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <h3 className="font-medium flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-amber-600" />
              <span>Connected to User Account</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              You are currently connected to this account as an administrator.
              Any actions you take will be logged with your admin identity.
            </p>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="border-amber-300 text-amber-700" 
                onClick={handleDisconnect}
              >
                <Link2Off className="h-4 w-4 mr-2" />
                Disconnect from Account
              </Button>
            </div>
          </div>
        </CardContent>
      ) : (
        <>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(userData => (
                    <TableRow key={userData.id}>
                      <TableCell>
                        <div className="font-medium">{userData.username}</div>
                        <div className="text-sm text-muted-foreground">{userData.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {userData.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={userData.status === 'Active' ? 'default' : 'secondary'}
                          className={userData.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800'}
                        >
                          {userData.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {userData.lastLogin ? new Date(userData.lastLogin).toLocaleString() : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleConnectToUser(userData)}
                        >
                          <Link className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {searchQuery ? 'No users found matching your search' : 'No users available to connect to'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
              Connecting to a user account allows you to see the application as they see it, which is different from impersonation. 
              User connections are tracked and notified to the user.
            </p>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default UserConnection;
