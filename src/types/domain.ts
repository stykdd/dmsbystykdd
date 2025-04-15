export type DomainStatus = 'active' | 'expiring' | 'expired' | 'trash' | 'sold';
export type Currency = 'USD' | 'EUR' | 'MAD';

export interface Domain {
  id: string;
  name: string;
  registrationDate: string;
  expirationDate: string;
  status: DomainStatus;
  registrarAccountId?: string;
  categoryIds?: string[];
  createdAt: string;
  updatedAt: string;
  daysUntilExpiration: number;
  price?: number;
  currency?: Currency;
  whoisData?: {
    registrar?: string;
    lastRefreshed?: string;
    expirationDate?: string;
    registrantName?: string;
    registrantEmail?: string;
  };
}

export interface SoldDomain extends Domain {
  id: string;
  name: string;
  saleDate: string;
  salePrice: number;
  purchasePrice: number;
  roi: number;
  buyer?: string;
  saleNotes?: string;
  marketplace?: string;
}

export interface Registrar {
  id: string;
  name: string;
  website?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrarAccount {
  id: string;
  name: string;
  registrarId: string;
  username: string;
  password?: string;
  apiKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DomainCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface DomainFilterOptions {
  search?: string;
  status?: DomainStatus;
  registrarAccountId?: string;
  registrarId?: string; 
  categoryId?: string;
  sortBy?: keyof Domain;
  sortOrder?: 'asc' | 'desc';
  excludeTrash?: boolean;
}

export interface DomainStats {
  total: number;
  active: number;
  expiring: number;
  expired: number;
  trash: number;
  totalSold?: number;
  totalRevenue?: number;
}

export interface BulkCheckResult {
  domain: string;
  available: boolean;
  error?: string;
}
