
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { EmailConfig, saveEmailConfig, getEmailConfig, sendTestEmail } from '@/services/emailService';

const EmailSettings = () => {
  const [smtpHost, setSmtpHost] = useState<string>('');
  const [smtpPort, setSmtpPort] = useState<number>(587);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fromEmail, setFromEmail] = useState<string>('');
  const [testEmail, setTestEmail] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  
  const { toast } = useToast();
  
  // Load existing configuration on component mount
  useEffect(() => {
    const config = getEmailConfig();
    if (config) {
      setSmtpHost(config.smtpHost);
      setSmtpPort(config.smtpPort);
      setUsername(config.username);
      setPassword(config.password);
      setFromEmail(config.fromEmail);
      setTestEmail(config.fromEmail); // Default test email to the from email
    }
  }, []);
  
  // Handle saving the email configuration
  const handleSaveConfig = async () => {
    // Validate required fields
    if (!smtpHost || !smtpPort || !username || !password || !fromEmail) {
      toast({
        title: "Missing required fields",
        description: "Please complete all fields before saving.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      const emailConfig: EmailConfig = {
        smtpHost,
        smtpPort,
        username,
        password,
        fromEmail
      };
      
      saveEmailConfig(emailConfig);
      
      toast({
        title: "Settings saved",
        description: "Your email settings have been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your email settings.",
        variant: "destructive"
      });
      console.error('Error saving email config:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle sending a test email
  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Missing email address",
        description: "Please enter an email address for the test.",
        variant: "destructive"
      });
      return;
    }
    
    if (!smtpHost || !smtpPort || !username || !password || !fromEmail) {
      toast({
        title: "Incomplete configuration",
        description: "Please complete and save the email configuration first.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsTesting(true);
      
      const emailConfig: EmailConfig = {
        smtpHost,
        smtpPort,
        username,
        password,
        fromEmail
      };
      
      // Save the config first to ensure we're using the latest settings
      saveEmailConfig(emailConfig);
      
      const result = await sendTestEmail(testEmail);
      
      toast({
        title: result.success ? "Test email sent" : "Failed to send test email",
        description: result.message
      });
    } catch (error) {
      toast({
        title: "Error sending test email",
        description: "There was a problem sending the test email.",
        variant: "destructive"
      });
      console.error('Error sending test email:', error);
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Configuration</CardTitle>
        <CardDescription>
          Configure the SMTP settings for sending domain expiry notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input 
              id="smtpHost" 
              placeholder="e.g. mail.yourdomain.com" 
              value={smtpHost}
              onChange={(e) => setSmtpHost(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input 
              id="smtpPort" 
              type="number" 
              placeholder="e.g. 587" 
              value={smtpPort}
              onChange={(e) => setSmtpPort(parseInt(e.target.value) || 587)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            placeholder="e.g. notifications@yourdomain.com" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="Your email account password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fromEmail">From Email</Label>
          <Input 
            id="fromEmail" 
            placeholder="e.g. notifications@yourdomain.com" 
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex-col space-y-4">
        <div className="w-full flex justify-end">
          <Button onClick={handleSaveConfig} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Configuration"}
          </Button>
        </div>
        
        <div className="border-t pt-4 w-full">
          <h4 className="font-medium mb-2">Send Test Email</h4>
          <div className="flex space-x-2">
            <Input 
              placeholder="Email address" 
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleSendTestEmail} 
              disabled={isTesting || !testEmail}
            >
              {isTesting ? "Sending..." : "Send Test"}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EmailSettings;
