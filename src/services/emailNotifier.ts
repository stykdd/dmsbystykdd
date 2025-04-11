
import { Domain } from '@/types/domain';
import { getDomains } from './domainService';
import { checkAndSendExpiryNotifications } from './emailService';

// Function to check domains and send notifications if needed
export const checkDomainsForExpiry = async (): Promise<void> => {
  try {
    const domains = getDomains();
    await checkAndSendExpiryNotifications(domains);
  } catch (error) {
    console.error('[EMAIL NOTIFIER] Error checking domains for expiry:', error);
  }
};

// This function would be called when the app starts up
// or on a regular interval in a real production app
export const initializeEmailNotifier = (): void => {
  // Store notification preferences in localStorage when this is called
  const emailNotificationsEnabled = localStorage.getItem('emailNotificationsEnabled');
  
  if (emailNotificationsEnabled === 'true') {
    console.log('[EMAIL NOTIFIER] Email notifications are enabled, checking domains...');
    checkDomainsForExpiry();
  } else {
    console.log('[EMAIL NOTIFIER] Email notifications are disabled');
  }
  
  // In a real app, you would set up a scheduler here
  // For demo purposes, we'll just check once on initialization
};
