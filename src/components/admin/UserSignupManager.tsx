
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, Users, Shield } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

const UserSignupManager: React.FC = () => {
  const { toggleSignupStatus, users } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [signupEnabled, setSignupEnabled] = useState(() => {
    // Get settings from localStorage
    const settingsJson = localStorage.getItem('dms_settings');
    if (settingsJson) {
      try {
        const settings = JSON.parse(settingsJson);
        return settings.allowSignup || false;
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const handleToggleSignup = (enabled: boolean) => {
    setSignupEnabled(enabled);
    toggleSignupStatus(enabled);
    
    toast({
      title: enabled ? "Signup Enabled" : "Signup Disabled",
      description: enabled 
        ? "New users can now register accounts" 
        : "User registration has been disabled",
    });
    
    addNotification({
      title: "Signup Settings Changed",
      message: `User registration has been ${enabled ? 'enabled' : 'disabled'}`,
      type: "info"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          User Signup Settings
        </CardTitle>
        <CardDescription>
          Control whether new users can register for accounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium">Allow New User Registration</h3>
            <p className="text-sm text-muted-foreground">
              When enabled, new users can create accounts on the login page
            </p>
          </div>
          <Switch
            checked={signupEnabled}
            onCheckedChange={handleToggleSignup}
          />
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{users.length} total users in system</span>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">User Roles Summary:</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-50">
              <Shield className="h-3 w-3 mr-1" />
              {users.filter(u => u.role === 'Admin').length} Admins
            </Badge>
            <Badge variant="outline" className="bg-green-50">
              {users.filter(u => u.role === 'User').length} Users
            </Badge>
            <Badge variant="outline" className="bg-yellow-50">
              {users.filter(u => u.role !== 'Admin' && u.role !== 'User').length} Other Roles
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Note: Even when signup is disabled, you can still manually add users from the User Management panel.
        </p>
      </CardFooter>
    </Card>
  );
};

export default UserSignupManager;
