import { Domain, DomainFilterOptions, DomainStatus, WhoisData, SoldDomain } from '../types/domain';
import { mockDomains } from '../mock-data/domains';
import { mockSoldDomains } from '../mock-data/soldDomains';

const DOMAINS_KEY = 'domains';
const SOLD_DOMAINS_KEY = 'soldDomains';

// Helper function to simulate an API call delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize domains in local storage if they don't exist
const initializeDomains = () => {
  if (!localStorage.getItem(DOMAINS_KEY)) {
    localStorage.setItem(DOMAINS_KEY, JSON.stringify(mockDomains));
  }
};

const initializeSoldDomains = () => {
  if (!localStorage.getItem(SOLD_DOMAINS_KEY)) {
    localStorage.setItem(SOLD_DOMAINS_KEY, JSON.stringify(mockSoldDomains));
  }
};

initializeDomains();
initializeSoldDomains();

// Generic function to get items from local storage
const getItemsFromLocalStorage = <T>(key: string): T[] => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : [];
};

// Generic function to set items in local storage
const setItemsInLocalStorage = <T>(key: string, items: T[]): void => {
    localStorage.setItem(key, JSON.stringify(items));
};

// Get domains from local storage
const getDomainsStore = (): Domain[] => {
  return getItemsFromLocalStorage<Domain>(DOMAINS_KEY);
};

// Save domains to local storage
const saveDomainsStore = (domains: Domain[]): void => {
    setItemsInLocalStorage<Domain>(DOMAINS_KEY, domains);
};

// Get sold domains from local storage
const getSoldDomainsStore = (): SoldDomain[] => {
  return getItemsFromLocalStorage<SoldDomain>(SOLD_DOMAINS_KEY);
};

// Save sold domains to local storage
const saveSoldDomainsStore = (soldDomains: SoldDomain[]): void => {
    setItemsInLocalStorage<SoldDomain>(SOLD_DOMAINS_KEY, soldDomains);
};

// Function to calculate days until expiration
const calculateDaysUntilExpiration = (expirationDate: string): number => {
  const now = new Date();
  const expiration = new Date(expirationDate);
  const diff = expiration.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 3600 * 24));
};

// Function to get all domains with optional filters
export const getDomains = (options: DomainFilterOptions = {}): Domain[] => {
  initializeDomains();
  let domains = getDomainsStore();

  if (options.excludeTrash) {
    domains = domains.filter(domain => domain.status !== 'trash');
  }

  if (options.status && options.status !== 'any') {
    domains = domains.filter(domain => domain.status === options.status);
  }

  if (options.categoryId) {
    domains = domains.filter(domain => domain.categoryId === options.categoryId || domain.categoryIds?.includes(options.categoryId || ''));
  }

  if (options.registrarId) {
    domains = domains.filter(domain => domain.registrarId === options.registrarId);
  }

  if (options.registrarAccountId) {
    domains = domains.filter(domain => domain.registrarAccountId === options.registrarAccountId);
  }

  if (options.search) {
    const searchTerm = options.search.toLowerCase();
    domains = domains.filter(domain =>
      domain.name.toLowerCase().includes(searchTerm) ||
      domain.notes?.toLowerCase().includes(searchTerm) ||
      domain.whoisData?.registrantName?.toLowerCase().includes(searchTerm) ||
      domain.whoisData?.registrantEmail?.toLowerCase().includes(searchTerm) ||
      domain.categoryIds?.some(categoryId => categoryId.toLowerCase().includes(searchTerm)) === true
    );
  }

  // Calculate and update daysUntilExpiration for each domain
  domains = domains.map(domain => ({
    ...domain,
    daysUntilExpiration: calculateDaysUntilExpiration(domain.expirationDate)
  }));

  // Apply sorting
  if (options.sortBy) {
    const sortBy = options.sortBy;
    const sortOrder = options.sortOrder === 'desc' ? -1 : 1;

    if (options.customSort) {
      domains.sort((a, b) => options.customSort!(a, b) * sortOrder);
    } else {
      domains.sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];

        if (valueA === undefined || valueB === undefined) {
          return 0;
        }

        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return valueA.localeCompare(valueB) * sortOrder;
        } else if (typeof valueA === 'number' && typeof valueB === 'number') {
          return (valueA - valueB) * sortOrder;
        } else {
          return 0;
        }
      });
    }
  }

  return domains;
};

// Function to get a single domain by ID
export const getDomainById = (id: string): Domain | undefined => {
  initializeDomains();
  const domains = getDomainsStore();
  return domains.find(domain => domain.id === id);
};

// Function to add a new domain
export const addDomain = (domain: Domain): void => {
  initializeDomains();
  const domains = getDomainsStore();
  saveDomainsStore([...domains, domain]);
};

// Function to update an existing domain
export const updateDomain = (id: string, data: Partial<Domain>): void => {
  initializeDomains();
  const domains = getDomainsStore();
  const updatedDomains = domains.map(domain =>
    domain.id === id ? { ...domain, ...data } : domain
  );
  saveDomainsStore(updatedDomains);
};

// Function to delete a domain (move to trash)
export const deleteDomain = (id: string): void => {
  updateDomain(id, { status: 'trash' });
};

// Function to restore a domain from trash
export const restoreDomain = (id: string): void => {
  updateDomain(id, { status: 'active' });
};

// Function to permanently delete a domain
export const permanentlyDeleteDomain = (id: string): void => {
  initializeDomains();
  let domains = getDomainsStore();
  domains = domains.filter(domain => domain.id !== id);
  saveDomainsStore(domains);
};

// Function to generate mock WHOIS data
const generateMockWhoisData = (domainName: string): WhoisData => {
  const now = new Date();
  return {
    domainName: domainName,
    registrar: 'Mock Registrar',
    registrantName: 'Mock Registrant',
    registrantEmail: 'registrant@example.com',
    creationDate: now.toISOString(),
    expirationDate: new Date(now.setDate(now.getDate() + 365)).toISOString(),
    lastRefreshed: now.toISOString(),
  };
};

// Function to refresh WHOIS data for a domain
export const refreshWhoisData = async (id: string): Promise<void> => {
  await sleep(1500); // Simulate API delay
  const domain = getDomainById(id);
  if (domain) {
    const mockWhoisData = generateMockWhoisData(domain.name);
    updateDomain(id, { whoisData: mockWhoisData });
  } else {
    throw new Error(`Domain with ID ${id} not found`);
  }
};

// Function to mark a domain as sold
export const markDomainAsSold = (id: string, saleDetails: Omit<SoldDomain, 'id' | 'name' | 'categoryId' | 'categoryIds' | 'registrarId' | 'registrarAccountId' | 'registrationDate' | 'expirationDate' | 'status' | 'notes' | 'whoisData' | 'createdAt' | 'updatedAt' | 'daysUntilExpiration' | 'autoRenew' | 'tld'>): void => {
  initializeDomains();
  initializeSoldDomains();

  const domain = getDomainById(id);
  if (!domain) {
    throw new Error(`Domain with ID ${id} not found`);
  }

  // Basic ROI calculation
  const roi = ((saleDetails.salePrice - saleDetails.purchasePrice) / saleDetails.purchasePrice) * 100;

  const soldDomain: SoldDomain = {
    ...domain,
    status: 'sold',
    saleDate: saleDetails.saleDate,
    salePrice: saleDetails.salePrice,
    purchasePrice: saleDetails.purchasePrice,
    roi: roi,
    buyer: saleDetails.buyer,
    marketplace: saleDetails.marketplace,
    saleNotes: saleDetails.saleNotes,
  };

  // Remove from domains and add to sold domains
  let domains = getDomainsStore();
  domains = domains.filter(domain => domain.id !== id);
  saveDomainsStore(domains);

  let soldDomains = getSoldDomainsStore();
  soldDomains.push(soldDomain);
  saveSoldDomainsStore(soldDomains);
};

// Function to update sold domain details
export const updateSoldDomain = (id: string, data: Partial<SoldDomain>): Promise<SoldDomain> => {
  const soldDomains = getSoldDomainsStore();
  const index = soldDomains.findIndex(domain => domain.id === id);
  
  if (index === -1) {
    return Promise.reject(new Error(`Domain with ID ${id} not found`));
  }
  
  const updatedDomain = { ...soldDomains[index], ...data };
  soldDomains[index] = updatedDomain;
  localStorage.setItem('soldDomains', JSON.stringify(soldDomains));
  
  return Promise.resolve(updatedDomain);
};

// Function to get sold domains
export const getSoldDomains = (): SoldDomain[] => {
  initializeSoldDomains();
  return getSoldDomainsStore();
};

// Function to delete a sold domain (permanently)
export const deleteSoldDomain = (id: string): void => {
  initializeSoldDomains();
  let soldDomains = getSoldDomainsStore();
  soldDomains = soldDomains.filter(domain => domain.id !== id);
  saveSoldDomainsStore(soldDomains);
};

// Function to get domain statistics
export const getDomainStats = (): any => {
  initializeDomains();
  const domains = getDomainsStore();

  const total = domains.length;
  const active = domains.filter(domain => domain.status === 'active').length;
  const expiring = domains.filter(domain => domain.status === 'expiring').length;
  const expired = domains.filter(domain => domain.status === 'expired').length;
  const trash = domains.filter(domain => domain.status === 'trash').length;

  const soldDomains = getSoldDomains();
  const totalSold = soldDomains.length;
  const totalRevenue = soldDomains.reduce((sum, domain) => sum + (domain.salePrice || 0), 0);

  return {
    total,
    active,
    expiring,
    expired,
    trash,
    totalSold,
    totalRevenue
  };
};

// Function to check domain availability
export const checkDomainAvailability = async (domainName: string): Promise<boolean> => {
  await sleep(500); // Simulate API delay
  // Basic validation to prevent abuse
  if (!domainName || domainName.length > 253 || !/^[a-z0-9-.]+$/.test(domainName)) {
    throw new Error('Invalid domain name');
  }

  const domains = getDomainsStore();
  const isAvailable = !domains.some(domain => domain.name === domainName);
  return isAvailable;
};

// Function to perform bulk domain availability check
export const bulkCheckAvailability = async (domainNames: string[]): Promise<{ domain: string; available: boolean; error?: string }[]> => {
  await sleep(500); // Simulate API delay
  return Promise.all(domainNames.map(async (domainName) => {
    try {
      const available = await checkDomainAvailability(domainName);
      return { domain: domainName, available };
    } catch (error: any) {
      return { domain: domainName, available: false, error: error.message };
    }
  }));
};

// Function to fetch WHOIS data (mock implementation)
export const fetchWhoisData = async (domainName: string): Promise<WhoisData> => {
  await sleep(1000); // Simulate API delay
  // Simulate API response based on domain name
  if (domainName.includes('unavailable')) {
    throw new Error('WHOIS data not found for this domain.');
  }
  return generateMockWhoisData(domainName);
};
