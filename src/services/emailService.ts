
import { Domain } from '@/types/domain';

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  username: string;
  password: string;
  fromEmail: string;
}

// This function would typically be implemented on the server
// For client-side implementation, we'll simulate this using localStorage
export const saveEmailConfig = (config: EmailConfig): void => {
  localStorage.setItem('emailConfig', JSON.stringify(config));
};

export const getEmailConfig = (): EmailConfig | null => {
  const config = localStorage.getItem('emailConfig');
  return config ? JSON.parse(config) : null;
};

export const sendDomainExpiryEmail = async (
  domain: Domain,
  recipientEmail: string,
  daysLeft: number
): Promise<{ success: boolean; message: string }> => {
  const config = getEmailConfig();
  
  if (!config) {
    return { 
      success: false, 
      message: 'Email configuration not found. Please set up your email settings.' 
    };
  }
  
  // In a real implementation, this would use an SMTP library
  // Since we can't use server-side code, we'll simulate the email sending
  console.log(`[EMAIL SERVICE] Sending expiry notification for ${domain.name} to ${recipientEmail}`);
  console.log(`[EMAIL SERVICE] Domain expires in ${daysLeft} days`);
  
  // For demonstration purposes, we'll return success
  // In production, you would integrate with a third-party email API service
  // that allows client-side requests (with proper CORS and security)
  return {
    success: true,
    message: `Email notification about ${domain.name} expiring in ${daysLeft} days would be sent to ${recipientEmail}`
  };
};

// Helper function to send test email
export const sendTestEmail = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  const config = getEmailConfig();
  
  if (!config) {
    return { 
      success: false, 
      message: 'Email configuration not found. Please set up your email settings.' 
    };
  }
  
  console.log(`[EMAIL SERVICE] Sending test email to ${email}`);
  
  // Simulate email sending success
  return {
    success: true,
    message: `Test email sent to ${email}`
  };
};

// This would be called by a scheduler or on app startup
export const checkAndSendExpiryNotifications = async (domains: Domain[]): Promise<void> => {
  const config = getEmailConfig();
  const notificationEmail = localStorage.getItem('notificationEmail');
  const notificationDays = localStorage.getItem('notificationDays') 
    ? JSON.parse(localStorage.getItem('notificationDays') || '[]') 
    : [30, 14, 7];
  
  if (!config || !notificationEmail) {
    console.log('[EMAIL SERVICE] Email configuration or notification email not set');
    return;
  }
  
  const today = new Date();
  
  for (const domain of domains) {
    if (!domain.expirationDate) continue;
    
    const expiryDate = new Date(domain.expirationDate);
    const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (notificationDays.includes(daysLeft)) {
      await sendDomainExpiryEmail(domain, notificationEmail, daysLeft);
      console.log(`[EMAIL SERVICE] Notification sent for ${domain.name}, expiring in ${daysLeft} days`);
    }
  }
};
