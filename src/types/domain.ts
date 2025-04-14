
export type DomainStatus = 'active' | 'expiring' | 'expired' | 'pending' | 'trash' | 'sold';
export type Currency = 'USD' | 'EUR' | 'MAD';

export interface Domain {
  id: string;
  name: string;
  categoryId?: string;
  categoryIds?: string[];
  registrarId?: string;
  registrarAccountId?: string;
  registrationDate: string;
  expirationDate: string;
  status: DomainStatus;
  notes?: string;
  whoisData?: WhoisData;
  createdAt: string;
  updatedAt: string;
  daysUntilExpiration: number;
  autoRenew?: boolean;
  price?: number;
  currency?: Currency;
  marketplace?: string;
  tld?: string; // Add this to make sorting by TLD possible
}

export interface SoldDomain extends Domain {
  status: 'sold';
  saleDate: string;
  salePrice: number;
  purchasePrice: number;
  roi: number;
  buyer?: string;
  marketplace?: string;
  saleNotes?: string;
}

export interface DomainCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Registrar {
  id: string;
  name: string;
  website: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrarAccount {
  id: string;
  registrarId: string;
  name: string;
  username: string;
  password?: string;
  apiKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhoisData {
  domainName?: string;
  registrar?: string;
  registrantName?: string;
  registrantEmail?: string;
  creationDate?: string;
  expirationDate?: string;
  lastRefreshed?: string;
}

export interface DomainFilterOptions {
  status?: DomainStatus | 'any';
  categoryId?: string;
  searchTerm?: string;
  sortBy?: keyof Domain | 'tld';
  sortOrder?: 'asc' | 'desc';
  customSort?: (a: Domain, b: Domain) => number;
  excludeTrash?: boolean;
  search?: string; // Add this property
  registrarId?: string; // Add this property
  registrarAccountId?: string; // Add this property
}

export interface DomainStats {
  totalDomains: number;
  activeDomains: number;
  expiringSoon: number;
  expiredDomains: number;
  domainsInTrash: number;
  total?: number; // Add this property 
  expiring?: number; // Add this property
  expired?: number; // Add this property
  trash?: number; // Add this property
  totalSold?: number; // Add this property
  totalRevenue?: number; // Add this property
}

export interface BulkCheckResult {
  domain: string;
  available: boolean;
  error?: string; // Add this property
}
