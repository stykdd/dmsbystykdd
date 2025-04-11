export type DomainStatus = 'active' | 'expiring' | 'expired' | 'pending' | 'trash' | 'sold';
export type Currency = 'USD' | 'EUR' | 'MAD';

export interface Domain {
  id: string;
  name: string;
  categoryId?: string;
  registrarId?: string;
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
  sortBy?: 'name' | 'registrationDate' | 'expirationDate' | 'daysUntilExpiration' | 'price';
  sortOrder?: 'asc' | 'desc';
}

export interface DomainStats {
  totalDomains: number;
  activeDomains: number;
  expiringSoon: number;
  expiredDomains: number;
  domainsInTrash: number;
}

export interface BulkCheckResult {
  domain: string;
  available: boolean;
}

// Extend the SoldDomain interface to include marketplace
export interface SoldDomain extends Domain {
  saleDate: string;
  salePrice: number;
  purchasePrice: number;
  roi: number;
  buyer?: string;
  saleNotes?: string;
  marketplace?: string; // Add marketplace property
}
