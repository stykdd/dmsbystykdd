
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Globe, Check, X, Settings, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const adminFormSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters." }),
  email: z.string()
    .email({ message: "Please enter a valid email address." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Installation: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState('welcome');
  const [installationComplete, setInstallationComplete] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installationError, setInstallationError] = useState<string | null>(null);
  const [systemChecks, setSystemChecks] = useState({
    localStorage: false,
    sessionStorage: false,
    jsEnabled: true,
  });

  const adminForm = useForm<z.infer<typeof adminFormSchema>>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      username: "admin",
      email: "admin@dms.com",
      password: "admin",
      confirmPassword: "admin",
    },
  });

  const [appSettings, setAppSettings] = useState({
    siteName: "DMS by stykdd",
    enableNotifications: true,
    storeDaysToExpiry: 30,
  });

  useEffect(() => {
    const isInstalled = localStorage.getItem('dms_installed');
    if (isInstalled === 'true') {
      navigate('/login');
    }

    checkSystemCompatibility();
  }, [navigate]);

  const checkSystemCompatibility = () => {
    let localStorageAvailable = false;
    try {
      localStorage.setItem('test', 'test');
      localStorageAvailable = localStorage.getItem('test') === 'test';
      localStorage.removeItem('test');
    } catch (e) {
      localStorageAvailable = false;
    }

    let sessionStorageAvailable = false;
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorageAvailable = sessionStorage.getItem('test') === 'test';
      sessionStorage.removeItem('test');
    } catch (e) {
      sessionStorageAvailable = false;
    }

    setSystemChecks({
      localStorage: localStorageAvailable,
      sessionStorage: sessionStorageAvailable,
      jsEnabled: true,
    });
  };

  const completeInstallation = async (adminData: z.infer<typeof adminFormSchema>) => {
    setIsInstalling(true);
    setInstallationError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const adminUser = {
        id: 'admin_1',
        username: adminData.username,
        email: adminData.email,
        password: adminData.password,
        provider: 'email'
      };
      
      localStorage.setItem('dms_users', JSON.stringify([adminUser]));
      localStorage.setItem('dms_app_settings', JSON.stringify(appSettings));
      localStorage.setItem('dms_installed', 'true');
      localStorage.setItem('dms_installed_date', new Date().toISOString());
      
      setInstallationComplete(true);
      
      toast({
        title: "Installation Complete",
        description: "Your application has been successfully set up!",
      });
    } catch (err: any) {
      console.error("Installation error:", err);
      setInstallationError(err.message || "An error occurred during installation.");
    } finally {
      setIsInstalling(false);
    }
  };

  const handleSubmitAdminForm = (data: z.infer<typeof adminFormSchema>) => {
    completeInstallation(data);
  };

  const handleAppSettingsChange = (setting: string, value: any) => {
    setAppSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const allChecksPass = systemChecks.localStorage && systemChecks.sessionStorage && systemChecks.jsEnabled;

  if (installationComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-500 text-white p-4 rounded-full">
              <Check size={48} />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Installation Complete!</h1>
          <p className="text-gray-600">
            Your Domain Management System has been successfully installed and configured.
          </p>
          <div className="space-y-4 pt-4">
            <Button 
              className="w-full" 
              onClick={() => navigate('/login')}
            >
              Go to Login Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <Globe size={32} />
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">DMS Installation Wizard</h1>
          <p className="mt-2 text-gray-600">
            Follow the steps below to set up your Domain Management System
          </p>
        </div>

        <Tabs value={currentStep} onValueChange={setCurrentStep}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="welcome" disabled={currentStep !== 'welcome'}>System Check</TabsTrigger>
            <TabsTrigger value="admin" disabled={!allChecksPass || (currentStep !== 'admin' && currentStep !== 'welcome')}>Admin Setup</TabsTrigger>
            <TabsTrigger value="settings" disabled={!allChecksPass || (currentStep !== 'settings' && currentStep !== 'admin')}>Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="welcome">
            <Card>
              <CardHeader>
                <CardTitle>System Compatibility Check</CardTitle>
                <CardDescription>
                  Checking if your system meets the requirements to run the application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Local Storage Support</span>
                    {systemChecks.localStorage ? (
                      <span className="text-green-500 flex items-center">
                        <Check className="mr-1" size={18} /> Available
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center">
                        <X className="mr-1" size={18} /> Not Available
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Session Storage Support</span>
                    {systemChecks.sessionStorage ? (
                      <span className="text-green-500 flex items-center">
                        <Check className="mr-1" size={18} /> Available
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center">
                        <X className="mr-1" size={18} /> Not Available
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>JavaScript Enabled</span>
                    {systemChecks.jsEnabled ? (
                      <span className="text-green-500 flex items-center">
                        <Check className="mr-1" size={18} /> Enabled
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center">
                        <X className="mr-1" size={18} /> Disabled
                      </span>
                    )}
                  </div>

                  {!allChecksPass && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertTitle>System Requirements Not Met</AlertTitle>
                      <AlertDescription>
                        Your browser does not meet the minimum requirements to run this application.
                        Please enable cookies and JavaScript, or try a different browser.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => setCurrentStep('admin')}
                  disabled={!allChecksPass}
                  className="w-full"
                >
                  Continue to Admin Setup
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Account Setup</CardTitle>
                <CardDescription>
                  Create the administrator account for your Domain Management System.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...adminForm}>
                  <form className="space-y-4">
                    <FormField
                      control={adminForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Administrator" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={adminForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="admin@yourdomain.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={adminForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admin Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            Password must be at least 8 characters with uppercase, lowercase, 
                            number, and special character.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={adminForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('welcome')}>
                  Back
                </Button>
                <Button
                  onClick={adminForm.handleSubmit(data => {
                    if (adminForm.formState.isValid) {
                      setCurrentStep('settings');
                    }
                  })}
                >
                  Continue
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Configure general settings for your Domain Management System.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input 
                      id="siteName"
                      value={appSettings.siteName}
                      onChange={(e) => handleAppSettingsChange('siteName', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="enableNotifications" 
                      checked={appSettings.enableNotifications}
                      onCheckedChange={(checked) => 
                        handleAppSettingsChange('enableNotifications', checked)
                      }
                    />
                    <label
                      htmlFor="enableNotifications"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Enable System Notifications
                    </label>
                  </div>
                  
                  <div>
                    <Label htmlFor="storeDaysToExpiry">Days to Store Domain Expiry Alerts</Label>
                    <Input 
                      id="storeDaysToExpiry"
                      type="number" 
                      value={appSettings.storeDaysToExpiry}
                      onChange={(e) => handleAppSettingsChange('storeDaysToExpiry', parseInt(e.target.value) || 30)}
                      className="mt-1"
                    />
                  </div>

                  {installationError && (
                    <Alert variant="destructive">
                      <AlertTitle>Installation Error</AlertTitle>
                      <AlertDescription>{installationError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('admin')}>
                  Back
                </Button>
                <Button 
                  onClick={adminForm.handleSubmit(handleSubmitAdminForm)}
                  disabled={isInstalling}
                >
                  {isInstalling ? 'Installing...' : 'Complete Installation'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Installation;
