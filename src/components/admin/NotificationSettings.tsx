
import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { initializeEmailNotifier } from '@/services/emailNotifier';

const emailFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(1, { message: "Email is required." }),
});

const NotificationSettings: React.FC = () => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notificationDays, setNotificationDays] = useState<string[]>(['30']);
  const [notificationEmail, setNotificationEmail] = useState('');
  
  // Email form
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: '',
    },
  });
  
  useEffect(() => {
    // Load saved preferences from localStorage
    const savedEmail = localStorage.getItem('notificationEmail');
    const savedDays = localStorage.getItem('notificationDays');
    const savedEnabled = localStorage.getItem('emailNotificationsEnabled');
    
    if (savedEmail) {
      setNotificationEmail(savedEmail);
      emailForm.setValue('email', savedEmail);
    } else {
      // Default email
      setNotificationEmail('user@example.com');
      emailForm.setValue('email', 'user@example.com');
    }
    
    if (savedDays) {
      setNotificationDays(JSON.parse(savedDays));
    }
    
    if (savedEnabled) {
      setEmailNotifications(savedEnabled === 'true');
    }
  }, [emailForm]);
  
  // Notification days handlers
  const handleNotificationDaysChange = (day: string, checked: boolean) => {
    if (checked) {
      setNotificationDays(prev => [...prev, day]);
    } else {
      setNotificationDays(prev => prev.filter(d => d !== day));
    }
  };
  
  // General settings handlers
  const handleSaveGeneralSettings = () => {
    if (emailNotifications && !notificationEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address for notifications.",
        variant: "destructive",
      });
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('emailNotificationsEnabled', emailNotifications.toString());
    localStorage.setItem('notificationEmail', notificationEmail);
    localStorage.setItem('notificationDays', JSON.stringify(notificationDays));
    
    // Initialize email notifier with new settings
    initializeEmailNotifier();
    
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  };
  
  const onEmailSubmit = (values: z.infer<typeof emailFormSchema>) => {
    setNotificationEmail(values.email);
    localStorage.setItem('notificationEmail', values.email);
    
    toast({
      title: "Email Updated",
      description: "Your notification email has been updated.",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications Settings</CardTitle>
        <CardDescription>
          Configure your notification preferences.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="emailNotifications">Email Notifications</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="emailNotifications" 
                checked={emailNotifications}
                onCheckedChange={(checked) => setEmailNotifications(checked as boolean)}
              />
              <Label htmlFor="emailNotifications">
                Receive notifications about domain expirations
              </Label>
            </div>
          </div>
          
          {emailNotifications && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notification Email</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <div className="flex">
                            <div className="relative flex-1">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Enter email address"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <Button type="submit" variant="outline" size="sm">Update</Button>
                      </div>
                      <FormDescription>
                        Where to send domain expiration notifications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          )}
          
          <div className="space-y-3">
            <Label>Expiration Notification Time</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notify7days" 
                  checked={notificationDays.includes('7')}
                  onCheckedChange={(checked) => 
                    handleNotificationDaysChange('7', checked as boolean)
                  }
                />
                <Label htmlFor="notify7days" className="font-normal">
                  7 days before expiration
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notify14days" 
                  checked={notificationDays.includes('14')}
                  onCheckedChange={(checked) => 
                    handleNotificationDaysChange('14', checked as boolean)
                  }
                />
                <Label htmlFor="notify14days" className="font-normal">
                  14 days before expiration
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notify30days" 
                  checked={notificationDays.includes('30')}
                  onCheckedChange={(checked) => 
                    handleNotificationDaysChange('30', checked as boolean)
                  }
                />
                <Label htmlFor="notify30days" className="font-normal">
                  30 days before expiration
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notify60days" 
                  checked={notificationDays.includes('60')}
                  onCheckedChange={(checked) => 
                    handleNotificationDaysChange('60', checked as boolean)
                  }
                />
                <Label htmlFor="notify60days" className="font-normal">
                  60 days before expiration
                </Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveGeneralSettings}>Save Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationSettings;
