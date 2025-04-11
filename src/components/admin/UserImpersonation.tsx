
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { UserRoundIcon, Shield } from 'lucide-react';
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data for users
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "User", lastLogin: "2024-04-01 14:22" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "User", lastLogin: "2024-03-25 09:15" },
  { id: "4", name: "Sarah Johnson", email: "sarah@example.com", role: "User", lastLogin: "2024-04-02 11:45" }
];

const UserImpersonation: React.FC = () => {
  const { impersonateUser, user } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<(typeof mockUsers)[0] | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const filteredUsers = mockUsers.filter(u => 
    u.email !== "demo@example.com" && 
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleImpersonate = () => {
    if (!selectedUser) return;

    // Close the dialog
    setConfirmDialogOpen(false);

    // Create user object for impersonation
    const userToImpersonate = {
      id: selectedUser.id,
      username: selectedUser.name,
      email: selectedUser.email
    };

    // Start impersonation
    impersonateUser(userToImpersonate);

    // Notify the admin
    toast({
      title: "Impersonation Started",
      description: `You are now impersonating ${selectedUser.name}`,
    });

    addNotification({
      title: "User Impersonation",
      message: `Admin started impersonating ${selectedUser.name}`,
      type: "warning"
    });
  };

  return (
    <>
      <div className="space-y-4">
        <Alert className="bg-amber-50 border-amber-200">
          <Shield className="h-4 w-4 text-amber-600" />
          <AlertTitle>User Impersonation</AlertTitle>
          <AlertDescription>
            This feature allows you to temporarily log in as another user to troubleshoot issues. 
            All actions will be logged for security purposes.
          </AlertDescription>
        </Alert>

        <div className="relative">
          <Input
            placeholder="Search for user by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setConfirmDialogOpen(true);
                      }}
                    >
                      <UserRoundIcon className="h-4 w-4 mr-2" />
                      Impersonate
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Impersonation</DialogTitle>
            <DialogDescription>
              You are about to impersonate {selectedUser?.name}. All your actions will be logged.
              This is for troubleshooting purposes only.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              User: <span className="font-medium text-foreground">{selectedUser?.name}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Email: <span className="font-medium text-foreground">{selectedUser?.email}</span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleImpersonate}>
              Start Impersonation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserImpersonation;
