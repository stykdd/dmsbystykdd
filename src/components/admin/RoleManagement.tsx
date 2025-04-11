
import React, { useState } from 'react';
import { UserCog, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

// Mock roles
const mockRoles = [
  { id: "1", name: "Admin", permissions: ["manage_users", "manage_domains", "manage_system"] },
  { id: "2", name: "User", permissions: ["view_domains", "edit_own_domains"] },
  { id: "3", name: "Editor", permissions: ["view_domains", "edit_domains"] },
  { id: "4", name: "Viewer", permissions: ["view_domains"] }
];

// Mock users for counting
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "User", status: "Active", lastLogin: "2024-04-01 14:22" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "User", status: "Inactive", lastLogin: "2024-03-25 09:15" },
  { id: "3", name: "Admin User", email: "demo@example.com", role: "Admin", status: "Active", lastLogin: "2024-04-04 16:30" },
  { id: "4", name: "Sarah Johnson", email: "sarah@example.com", role: "User", status: "Active", lastLogin: "2024-04-02 11:45" }
];

interface RoleManagementProps {
  roles: typeof mockRoles;
  onRolesChange: (roles: typeof mockRoles) => void;
}

const RoleManagement: React.FC<RoleManagementProps> = ({ roles, onRolesChange }) => {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  const handleRoleManagement = (action: string, roleId?: string) => {
    switch(action) {
      case "edit":
        if (roleId) {
          setEditingRoleId(roleId);
        }
        break;
      case "delete":
        if (roleId) {
          const updatedRoles = roles.filter(role => role.id !== roleId);
          onRolesChange(updatedRoles);
          toast({
            title: "Role Deleted",
            description: "The role has been removed from the system.",
            variant: "destructive",
          });
          addNotification({
            title: "Role Deleted",
            message: "A role has been removed from the system",
            type: "warning"
          });
        }
        break;
      case "create":
        const newId = (roles.length + 1).toString();
        const updatedRoles = [...roles, { 
          id: newId, 
          name: "New Role", 
          permissions: [] 
        }];
        onRolesChange(updatedRoles);
        setEditingRoleId(newId);
        addNotification({
          title: "New Role Created",
          message: "A new role has been created in the system",
          type: "info"
        });
        break;
      case "save":
        setEditingRoleId(null);
        toast({
          title: "Role Saved",
          description: "The role changes have been saved.",
        });
        break;
      case "cancel":
        setEditingRoleId(null);
        break;
    }
  };

  const handleRoleUpdate = (roleId: string, field: string, value: any) => {
    const updatedRoles = roles.map(role => {
      if (role.id === roleId) {
        if (field === 'name') {
          return { ...role, name: value };
        } else if (field === 'permission') {
          const permName = value.name;
          const isChecked = value.checked;
          
          if (isChecked) {
            return { ...role, permissions: [...role.permissions, permName] };
          } else {
            return { ...role, permissions: role.permissions.filter(p => p !== permName) };
          }
        }
      }
      return role;
    });
    
    onRolesChange(updatedRoles);
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => handleRoleManagement("create")}>
          Add New Role
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Role Name</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>
                {editingRoleId === role.id ? (
                  <Input 
                    value={role.name} 
                    onChange={(e) => handleRoleUpdate(role.id, 'name', e.target.value)}
                  />
                ) : (
                  <div className="font-medium">{role.name}</div>
                )}
              </TableCell>
              <TableCell>
                {editingRoleId === role.id ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`manage_users_${role.id}`}
                        checked={role.permissions.includes('manage_users')}
                        onCheckedChange={(checked) => {
                          handleRoleUpdate(role.id, 'permission', {
                            name: 'manage_users',
                            checked
                          });
                        }}
                      />
                      <label htmlFor={`manage_users_${role.id}`}>Manage Users</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`manage_domains_${role.id}`}
                        checked={role.permissions.includes('manage_domains')}
                        onCheckedChange={(checked) => {
                          handleRoleUpdate(role.id, 'permission', {
                            name: 'manage_domains',
                            checked
                          });
                        }}
                      />
                      <label htmlFor={`manage_domains_${role.id}`}>Manage Domains</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`manage_system_${role.id}`}
                        checked={role.permissions.includes('manage_system')}
                        onCheckedChange={(checked) => {
                          handleRoleUpdate(role.id, 'permission', {
                            name: 'manage_system',
                            checked
                          });
                        }}
                      />
                      <label htmlFor={`manage_system_${role.id}`}>Manage System</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`view_domains_${role.id}`}
                        checked={role.permissions.includes('view_domains')}
                        onCheckedChange={(checked) => {
                          handleRoleUpdate(role.id, 'permission', {
                            name: 'view_domains',
                            checked
                          });
                        }}
                      />
                      <label htmlFor={`view_domains_${role.id}`}>View Domains</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`edit_domains_${role.id}`}
                        checked={role.permissions.includes('edit_domains')}
                        onCheckedChange={(checked) => {
                          handleRoleUpdate(role.id, 'permission', {
                            name: 'edit_domains',
                            checked
                          });
                        }}
                      />
                      <label htmlFor={`edit_domains_${role.id}`}>Edit Domains</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`edit_own_domains_${role.id}`}
                        checked={role.permissions.includes('edit_own_domains')}
                        onCheckedChange={(checked) => {
                          handleRoleUpdate(role.id, 'permission', {
                            name: 'edit_own_domains',
                            checked
                          });
                        }}
                      />
                      <label htmlFor={`edit_own_domains_${role.id}`}>Edit Own Domains</label>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map(permission => (
                      <Badge key={permission} variant="outline">
                        {permission.replace('_', ' ')}
                      </Badge>
                    ))}
                    {role.permissions.length === 0 && (
                      <span className="text-muted-foreground text-sm">No permissions</span>
                    )}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {mockUsers.filter(user => user.role === role.name).length}
              </TableCell>
              <TableCell>
                {editingRoleId === role.id ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRoleManagement("save")}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRoleManagement("cancel")}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleRoleManagement("edit", role.id)}
                    >
                      <UserCog className="h-4 w-4" />
                    </Button>
                    {role.name !== 'Admin' && role.name !== 'User' && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleRoleManagement("delete", role.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default RoleManagement;
