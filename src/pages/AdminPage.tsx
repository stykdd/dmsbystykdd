
import React, { useState } from 'react';
import { Shield, Users, Bell, Link, UserPlus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getDomains } from "@/services/domainService";
import { useNotifications } from "@/contexts/NotificationContext";
import UserManagement from "@/components/admin/UserManagement";
import UserDomains from "@/components/admin/UserDomains";
import SystemLogs from "@/components/admin/SystemLogs";
import RoleManagement from "@/components/admin/RoleManagement";
import UserActivityCharts from "@/components/admin/UserActivityCharts";
import StatsCards from "@/components/admin/StatsCards";
import ImpersonationBanner from "@/components/admin/ImpersonationBanner";
import DataManager from "@/components/admin/DataManager";
import UserSignupManager from "@/components/admin/UserSignupManager";
import UserConnection from "@/components/admin/UserConnection";
import NotificationManagement from "@/components/admin/NotificationManagement";
import { useAuth } from "@/contexts/AuthContext";

// Mock roles initial state
const initialRoles = [
  { id: "1", name: "Admin", permissions: ["manage_users", "manage_domains", "manage_system"] },
  { id: "2", name: "User", permissions: ["view_domains", "edit_own_domains"] },
  { id: "3", name: "Editor", permissions: ["view_domains", "edit_domains"] },
  { id: "4", name: "Viewer", permissions: ["view_domains"] }
];

const AdminPage: React.FC = () => {
  const { addNotification } = useNotifications();
  const { users } = useAuth();
  const [roles, setRoles] = useState(initialRoles);
  const domains = getDomains();
  
  const handleRoleChange = (updatedRoles: typeof initialRoles) => {
    setRoles(updatedRoles);
  };

  return (
    <div className="space-y-6">
      <ImpersonationBanner />
      
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      
      <StatsCards 
        userCount={users.length}
        domainCount={domains.length}
        activeUsers={users.filter(u => u.status === 'Active').length}
        systemEvents={5}
      />
      
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="domains">User Domains</TabsTrigger>
          <TabsTrigger value="system">System Logs</TabsTrigger>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
          <TabsTrigger value="connect">User Connection</TabsTrigger>
          <TabsTrigger value="signup">Signup Settings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage users and their access to the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement onRoleChange={handleRoleChange} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="domains">
          <Card>
            <CardHeader>
              <CardTitle>User Domain Distribution</CardTitle>
              <CardDescription>
                Domains managed by each user in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserDomains />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Activity</CardTitle>
              <CardDescription>
                Recent system events and user actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SystemLogs />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>
                Manage user roles and permissions in the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoleManagement roles={roles} onRolesChange={handleRoleChange} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="connect">
          <UserConnection />
        </TabsContent>
        
        <TabsContent value="signup">
          <UserSignupManager />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationManagement />
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Import and export system data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* User Activity Analytics below the tabs */}
      <UserActivityCharts />
    </div>
  );
};

export default AdminPage;
