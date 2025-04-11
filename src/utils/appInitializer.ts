
import { initializeEmailNotifier } from "@/services/emailNotifier";
import { initializeCategories } from "@/services/categoryService";

// Function to initialize various application services
export const initializeApp = (): void => {
  // Initialize email notification system
  initializeEmailNotifier();
  
  // Initialize categories
  initializeCategories();
  
  // Log initialization
  console.log('[APP] Application services initialized');
};
