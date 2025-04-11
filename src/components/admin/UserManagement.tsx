import React, { useState, useEffect } from 'react';
import { Eye, UserCog, Trash2, Search, Mail, Calendar, Activity, Lock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Mock data for users
const mockUsers = [
  { 
    id: "1", 
    name: "John Doe", 
    email: "john@example.com", 
    role: "User", 
    status: "Active", 
    lastLogin: "2024-04-01 14:22",
    createdAt: "2023-11-15",
    permissions: ["view_domains", "edit_own_domains"],
    domains: 12,
    recentActivity: [
      { action: "Login", date: "2024-04-01 14:22" },
      { action: "Updated domain example.com", date: "2024-04-01 12:34" },
      { action: "Added new domain testdomain.org", date: "2024-03-28 09:15" }
    ],
    accountType: "Standard",
    twoFactorEnabled: true
  },
  { 
    id: "2", 
    name: "Jane Smith", 
    email: "jane@example.com", 
    role: "User", 
    status: "Inactive", 
    lastLogin: "2024-03-25 09:15",
    createdAt: "2023-12-05",
    permissions: ["view_domains"],
    domains: 5,
    recentActivity: [
      { action: "Login", date: "2024-03-25 09:15" },
      { action: "Viewed domain list", date: "2024-03-25 09:20" }
    ],
    accountType: "Basic",
    twoFactorEnabled: false
  },
  { 
    id: "3", 
    name: "Admin User", 
    email: "demo@example.com", 
    role: "Admin", 
    status: "Active", 
    lastLogin: "2024-04-04 16:30",
    createdAt: "2023-10-01",
    permissions: ["manage_users", "manage_domains", "manage_system"],
    domains: 45,
    recentActivity: [
      { action: "Login", date: "2024-04-04 16:30" },
      { action: "Updated user permissions", date: "2024-04-04 16:45" },
      { action: "Modified system settings", date: "2024-04-03 11:20" }
    ],
    accountType: "Enterprise",
    twoFactorEnabled: true
  },
  { 
    id: "4", 
    name: "Sarah Johnson", 
    email: "sarah@example.com", 
    role: "User", 
    status: "Active", 
    lastLogin: "2024-04-02 11:45",
    createdAt: "2024-01-10",
    permissions: ["view_domains", "edit_own_domains"],
    domains: 8,
    recentActivity: [
      { action: "Login", date: "2024-04-02 11:45" },
      { action: "Added new domain sarahdomain.net", date: "2024-04-02 12:00" }
    ],
    accountType: "Standard",
    twoFactorEnabled: false
  }
];

// Mock roles
const mockRoles = [
  { id: "1", name: "Admin", permissions: ["manage_users", "manage_domains", "manage_system"] },
  { id: "2", name: "User", permissions: ["view_domains", "edit_own_domains"] },
  { id: "3", name: "Editor", permissions: ["view_domains", "edit_domains"] },
  { id: "4", name: "Viewer", permissions: ["view_domains"] }
];

interface UserManagementProps {
  onRoleChange: (roles: typeof mockRoles) => void;
}

// Edit profile form schema
const editProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.string().min(1, { message: "Please select a role." }),
  status: z.string().min(1, { message: "Please select a status." }),
  accountType: z.string().min(1, { message: "Please select an account type." }),
  twoFactorEnabled: z.boolean().optional(),
});

// Password change form schema
const passwordChangeSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Please confirm the password." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const UserManagement: React.FC<UserManagementProps> = ({ onRoleChange }) => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [users, setUsers] = useState(mockUsers);
  const [roles, setRoles] = useState(mockRoles);
  const [filteredUsers, setFilteredUsers] = useState<typeof mockUsers>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<(typeof mockUsers)[0] | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Edit profile form
  const editProfileForm = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      status: "",
      accountType: "",
      twoFactorEnabled: false,
    },
  });

  // Password change form
  const passwordChangeForm = useForm<z.infer<typeof passwordChangeSchema>>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = users.filter(
        user => 
          user.name.toLowerCase().includes(lowercaseQuery) || 
          user.email.toLowerCase().includes(lowercaseQuery) ||
          user.role.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  useEffect(() => {
    onRoleChange(roles);
  }, [roles, onRoleChange]);

  // Reset form values when selected user changes
  useEffect(() => {
    if (selectedUser && isEditProfileOpen) {
      editProfileForm.reset({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        status: selectedUser.status,
        accountType: selectedUser.accountType,
        twoFactorEnabled: selectedUser.twoFactorEnabled,
      });
    }
  }, [selectedUser, isEditProfileOpen, editProfileForm]);

  const handleDeleteUser = (userId: string, userName: string) => {
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "User Deleted",
      description: `${userName} has been removed from the system.`,
      variant: "destructive",
    });
    
    addNotification({
      title: "User Deleted",
      message: `${userName} has been removed from the system`,
      type: "info"
    });
  };
  
  const handleResetUserPassword = (userId: string, userName: string) => {
    toast({
      title: "Password Reset",
      description: `Password reset for ${userName}. A reset link has been sent.`,
    });
    
    addNotification({
      title: "Password Reset",
      message: `Password reset for ${userName}. A reset link has been sent.`,
      type: "info"
    });
  };
  
  const handleViewUserDetails = (userId: string) => {
    const user = users.find(user => user.id === userId);
    if (user) {
      setSelectedUser(user);
      setUserDetailsOpen(true);
    }
  };

  const handleEditProfile = () => {
    if (selectedUser) {
      setIsEditProfileOpen(true);
    }
  };

  const handleChangePassword = () => {
    if (selectedUser) {
      setIsChangePasswordOpen(true);
      passwordChangeForm.reset({
        password: "",
        confirmPassword: "",
      });
    }
  };

  const onEditProfileSubmit = (data: z.infer<typeof editProfileSchema>) => {
    if (selectedUser) {
      // Update user data
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...user, ...data } : user
      );
      
      setUsers(updatedUsers);
      setSelectedUser({ ...selectedUser, ...data });
      
      toast({
        title: "Profile Updated",
        description: `${data.name}'s profile has been updated successfully.`,
      });
      
      addNotification({
        title: "Profile Updated",
        message: `${data.name}'s profile has been updated successfully.`,
        type: "info"
      });
      
      setIsEditProfileOpen(false);
    }
  };

  const onPasswordChangeSubmit = (data: z.infer<typeof passwordChangeSchema>) => {
    if (selectedUser) {
      // In a real app, this would update the user's password in the database
      toast({
        title: "Password Changed",
        description: `Password for ${selectedUser.name} has been manually changed.`,
      });
      
      addNotification({
        title: "Password Changed",
        message: `Password for ${selectedUser.name} has been manually changed.`,
        type: "info"
      });
      
      setIsChangePasswordOpen(false);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedUserIds.length === 0) {
      toast({
        title: "No Users Selected",
        description: "Please select users to perform this action.",
        variant: "destructive",
      });
      return;
    }

    switch (action) {
      case "delete":
        setUsers(users.filter(user => !selectedUserIds.includes(user.id)));
        toast({
          title: "Users Deleted",
          description: `${selectedUserIds.length} users have been removed.`,
          variant: "destructive",
        });
        addNotification({
          title: "Bulk User Deletion",
          message: `${selectedUserIds.length} users have been removed`,
          type: "warning"
        });
        break;
      case "activate":
        setUsers(users.map(user => 
          selectedUserIds.includes(user.id) ? { ...user, status: "Active" } : user
        ));
        toast({
          title: "Users Activated",
          description: `${selectedUserIds.length} users have been activated.`,
        });
        addNotification({
          title: "Users Activated",
          message: `${selectedUserIds.length} users have been activated`,
          type: "info"
        });
        break;
      case "deactivate":
        setUsers(users.map(user => 
          selectedUserIds.includes(user.id) ? { ...user, status: "Inactive" } : user
        ));
        toast({
          title: "Users Deactivated",
          description: `${selectedUserIds.length} users have been deactivated.`,
        });
        addNotification({
          title: "Users Deactivated",
          message: `${selectedUserIds.length} users have been deactivated`,
          type: "info"
        });
        break;
      case "changeRole":
        if (!selectedRoleId) {
          toast({
            title: "No Role Selected",
            description: "Please select a role to assign.",
            variant: "destructive",
          });
          return;
        }
        const selectedRole = roles.find(role => role.id === selectedRoleId);
        if (selectedRole) {
          setUsers(users.map(user => 
            selectedUserIds.includes(user.id) ? { ...user, role: selectedRole.name } : user
          ));
          toast({
            title: "Role Updated",
            description: `${selectedUserIds.length} users updated to ${selectedRole.name} role.`,
          });
          addNotification({
            title: "Roles Updated",
            message: `${selectedUserIds.length} users updated to ${selectedRole.name} role`,
            type: "info"
          });
        }
        break;
    }
    
    setSelectedUserIds([]);
    setIsAllSelected(false);
    setRoleDialogOpen(false);
  };

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(user => user.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  const toggleUserSelection = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
      setIsAllSelected(false);
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
      if (selectedUserIds.length + 1 === filteredUsers.length) {
        setIsAllSelected(true);
      }
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={selectedUserIds.length === 0}>
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleBulkAction("activate")}>
                Activate Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction("deactivate")}>
                Deactivate Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleDialogOpen(true)}>
                Change Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleBulkAction("delete")}>
                Delete Users
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Select a role to assign to the selected users.
            </DialogDescription>
          </DialogHeader>
          <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleBulkAction("changeRole")}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* User Details Dialog */}
      <Dialog open={userDetailsOpen} onOpenChange={setUserDetailsOpen}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  User Profile: {selectedUser.name}
                  <Badge variant={selectedUser.status === "Active" ? "default" : "secondary"}>
                    {selectedUser.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Detailed information about this user account
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Account Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Email:</span>
                      <span className="text-sm">{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Member since:</span>
                      <span className="text-sm">{selectedUser.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Last login:</span>
                      <span className="text-sm">{selectedUser.lastLogin}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mt-4 mb-2">Role & Permissions</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Role:</span>
                      <Badge>{selectedUser.role}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Account type:</span>
                      <Badge variant="outline">{selectedUser.accountType}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedUser.permissions.map((permission, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">2FA Enabled:</span>
                      <span>{selectedUser.twoFactorEnabled ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Domain Usage</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Total domains:</span>
                      <span>{selectedUser.domains}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mt-4 mb-2">Recent Activity</h3>
                  <div className="border rounded-md p-2 bg-muted/30 max-h-[200px] overflow-y-auto">
                    {selectedUser.recentActivity.map((activity, i) => (
                      <div key={i} className="mb-2 last:mb-0">
                        <div className="text-sm">{activity.action}</div>
                        <div className="text-xs text-muted-foreground">{activity.date}</div>
                        {i < selectedUser.recentActivity.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex items-center justify-between sm:justify-between flex-row mt-2">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleChangePassword}
                  >
                    <Lock className="h-4 w-4 mr-1" />
                    Change Password
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                </div>
                <Button onClick={() => setUserDetailsOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Make changes to the user profile information.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editProfileForm}>
            <form onSubmit={editProfileForm.handleSubmit(onEditProfileSubmit)} className="space-y-4">
              <FormField
                control={editProfileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editProfileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editProfileForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editProfileForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editProfileForm.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editProfileForm.control}
                name="twoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Two-Factor Authentication</FormLabel>
                      <FormDescription>
                        Enable or disable two-factor authentication for this user.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...passwordChangeForm}>
            <form onSubmit={passwordChangeForm.handleSubmit(onPasswordChangeSubmit)} className="space-y-4">
              <FormField
                control={passwordChangeForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 8 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordChangeForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Password</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={isAllSelected}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedUserIds.includes(user.id)}
                    onCheckedChange={() => toggleUserSelection(user.id)}
                  />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleViewUserDetails(user.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleChangePassword()}
                    title="Change password"
                  >
                    <Lock className="h-4 w-4" />
                  </Button>
                  {user.email !== "demo@example.com" && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDeleteUser(user.id, user.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default UserManagement;
