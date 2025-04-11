
import { initializeEmailNotifier } from "@/services/emailNotifier";

// Function to initialize various application services
export const initializeApp = (): void => {
  // Initialize email notification system
  initializeEmailNotifier();
  
  // Log initialization
  console.log('[APP] Application services initialized');
};
