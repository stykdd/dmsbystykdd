
import { Domain, SoldDomain } from '../../types/domain';
import { updateDomainStatus } from './utils';

// Local storage keys
const DOMAINS_STORAGE_KEY = 'domains_data';
const SOLD_DOMAINS_STORAGE_KEY = 'sold_domains_data';

// Initial mock domain data
const initialDomains: Domain[] = [
  {
    id: 'd1',
    name: 'example.com',
    registrationDate: '2023-01-15',
    expirationDate: '2025-01-15',
    status: 'active',
    registrarAccountId: 'acc-1',
    categoryIds: ['cat-1', 'cat-2'],
    createdAt: '2023-01-15T12:00:00Z',
    updatedAt: '2023-01-15T12:00:00Z',
    daysUntilExpiration: 280
  },
  {
    id: 'd2',
    name: 'mydomain.org',
    registrationDate: '2023-02-20',
    expirationDate: '2024-04-30',
    status: 'expiring',
    registrarAccountId: 'acc-2',
    categoryIds: ['cat-3'],
    createdAt: '2023-02-20T12:00:00Z',
    updatedAt: '2023-02-20T12:00:00Z',
    daysUntilExpiration: 25
  },
  {
    id: 'd3',
    name: 'testsite.net',
    registrationDate: '2022-05-10',
    expirationDate: '2024-03-15',
    status: 'expired',
    registrarAccountId: 'acc-1',
    createdAt: '2022-05-10T12:00:00Z',
    updatedAt: '2022-05-10T12:00:00Z',
    daysUntilExpiration: -20
  },
  {
    id: 'd4',
    name: 'oldsite.io',
    registrationDate: '2021-11-05',
    expirationDate: '2023-11-05',
    status: 'trash',
    registrarAccountId: 'acc-2',
    categoryIds: ['cat-4'],
    createdAt: '2021-11-05T12:00:00Z',
    updatedAt: '2024-03-01T12:00:00Z',
    daysUntilExpiration: -150
  }
];

// Initial mock sold domains data
const initialSoldDomains: SoldDomain[] = [
  {
    id: 'sold-1',
    name: 'premiumdomain.com',
    registrationDate: '2022-01-10',
    expirationDate: '2023-01-10',
    status: 'sold',
    registrarAccountId: 'acc-1',
    categoryIds: ['cat-1'],
    createdAt: '2022-01-10T12:00:00Z',
    updatedAt: '2023-06-15T09:30:00Z',
    daysUntilExpiration: 0,
    saleDate: '2023-06-15',
    salePrice: 4500,
    purchasePrice: 1200,
    roi: 275,
    buyer: 'Tech Startup Inc.'
  },
  {
    id: 'sold-2',
    name: 'shortdomain.io',
    registrationDate: '2022-03-22',
    expirationDate: '2023-03-22',
    status: 'sold',
    registrarAccountId: 'acc-2',
    createdAt: '2022-03-22T14:15:00Z',
    updatedAt: '2023-09-04T11:20:00Z',
    daysUntilExpiration: 0,
    saleDate: '2023-09-04',
    salePrice: 2800,
    purchasePrice: 900,
    roi: 211.11,
    buyer: 'Digital Agency LLC'
  },
  {
    id: 'sold-3',
    name: 'brandable-name.com',
    registrationDate: '2021-11-05',
    expirationDate: '2022-11-05',
    status: 'sold',
    registrarAccountId: 'acc-1',
    categoryIds: ['cat-3'],
    createdAt: '2021-11-05T10:00:00Z',
    updatedAt: '2023-04-18T16:45:00Z',
    daysUntilExpiration: 0,
    saleDate: '2023-04-18',
    salePrice: 3200,
    purchasePrice: 1500,
    roi: 113.33,
    buyer: 'E-commerce Store'
  },
  {
    id: 'sold-4',
    name: 'keyword-exact.org',
    registrationDate: '2022-06-12',
    expirationDate: '2023-06-12',
    status: 'sold',
    registrarAccountId: 'acc-2',
    categoryIds: ['cat-2'],
    createdAt: '2022-06-12T08:30:00Z',
    updatedAt: '2024-01-20T13:15:00Z',
    daysUntilExpiration: 0,
    saleDate: '2024-01-20',
    salePrice: 1800,
    purchasePrice: 650,
    roi: 176.92,
    buyer: 'Marketing Agency'
  },
  {
    id: 'sold-5',
    name: 'premium-industry.net',
    registrationDate: '2022-09-30',
    expirationDate: '2023-09-30',
    status: 'sold',
    registrarAccountId: 'acc-1',
    createdAt: '2022-09-30T09:45:00Z',
    updatedAt: '2024-02-28T10:10:00Z',
    daysUntilExpiration: 0,
    saleDate: '2024-02-28',
    salePrice: 5200,
    purchasePrice: 2300,
    roi: 126.09,
    buyer: 'Industry Solutions Ltd.'
  }
];

// Initialize or load from localStorage
const initializeData = () => {
  // Check if data exists in localStorage first
  const storedDomains = localStorage.getItem(DOMAINS_STORAGE_KEY);
  const storedSoldDomains = localStorage.getItem(SOLD_DOMAINS_STORAGE_KEY);
  
  // If data exists in localStorage, use it; otherwise use initial data
  let domains = storedDomains ? 
    JSON.parse(storedDomains).map(updateDomainStatus) : 
    initialDomains.map(updateDomainStatus);
  
  let soldDomains = storedSoldDomains ? 
    JSON.parse(storedSoldDomains) : 
    initialSoldDomains;
  
  // Save to localStorage if it wasn't there before
  if (!storedDomains) {
    localStorage.setItem(DOMAINS_STORAGE_KEY, JSON.stringify(domains));
  }
  
  if (!storedSoldDomains) {
    localStorage.setItem(SOLD_DOMAINS_STORAGE_KEY, JSON.stringify(soldDomains));
  }
  
  return { domains, soldDomains };
};

// Initialize the domain stores
const { domains, soldDomains } = initializeData();

// Export the domains and a setter to modify them
export const getDomainStore = () => {
  // Always get fresh data from localStorage
  const storedData = localStorage.getItem(DOMAINS_STORAGE_KEY);
  return storedData ? JSON.parse(storedData).map(updateDomainStatus) : [];
};

export const setDomainStore = (newDomains: Domain[]) => {
  // Update localStorage when data changes
  localStorage.setItem(DOMAINS_STORAGE_KEY, JSON.stringify(newDomains));
};

// Export sold domains
export const getSoldDomainsStore = () => {
  // Always get fresh data from localStorage
  const storedData = localStorage.getItem(SOLD_DOMAINS_STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

export const setSoldDomainsStore = (newSoldDomains: SoldDomain[]) => {
  // Update localStorage when data changes
  localStorage.setItem(SOLD_DOMAINS_STORAGE_KEY, JSON.stringify(newSoldDomains));
};

// Reset to initial data (for testing/development)
export const resetToInitialData = () => {
  localStorage.setItem(DOMAINS_STORAGE_KEY, JSON.stringify(initialDomains));
  localStorage.setItem(SOLD_DOMAINS_STORAGE_KEY, JSON.stringify(initialSoldDomains));
};
