
// Defining the interface for wishlist domains
export interface WishlistDomain {
  id: string;
  domain: string;
  dateAdded: string;
  notificationsEnabled: boolean;
  category: string;
  note?: string;
  availability?: {
    status: 'available' | 'unavailable' | 'pending';
    lastChecked: string;
    expiryDate?: string | null;
  };
}

// Define the type for domain checking results
export interface DomainCheckResult {
  domain: string;
  available: boolean;
  error?: string;
}
