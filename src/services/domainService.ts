import { v4 as uuidv4 } from 'uuid';
import { 
  Domain, 
  DomainStatus, 
  DomainFilterOptions, 
  DomainStats,
  BulkCheckResult,
  SoldDomain,
  Currency
} from '../types/domain';

// Import services
import { getDomainStore, setDomainStore, getSoldDomainsStore, setSoldDomainsStore } from './domain/mockData';
import { 
  calculateDaysUntilExpiration, 
  determineDomainStatus, 
  updateDomainStatus 
} from './domain/utils';
import { 
  fetchWhoisData,
  refreshWhoisData as refreshWhois
} from './domain/whoisService';
import { 
  applyDomainFilters, 
  applyDomainSorting 
} from './domain/domainFilters';
import { 
  checkDomainAvailability,
  bulkCheckAvailability as bulkCheck
} from './domain/availabilityService';
import { getDomainStats as getStats } from './domain/statsService';

// Re-export for compatibility
export { 
  checkDomainAvailability, 
  fetchWhoisData 
};

// Export the bulk check as is
export const bulkCheckAvailability = bulkCheck;

// CRUD operations
export const getDomains = (filters?: DomainFilterOptions): Domain[] => {
  // Get domains with updated statuses
  const domains = getDomainStore().map(updateDomainStatus);
  
  // First filter domains
  let filteredDomains = applyDomainFilters(domains, filters);
  
  // Then sort domains if needed
  if (filters?.sortBy) {
    filteredDomains = applyDomainSorting(
      filteredDomains, 
      filters.sortBy, 
      filters.sortOrder || 'asc'
    );
  }
  
  return filteredDomains;
};

export const getDomainById = (id: string): Domain | undefined => {
  const domain = getDomainStore().find(d => d.id === id);
  if (!domain) return undefined;
  return updateDomainStatus(domain);
};

export const addDomain = async (domainData: Omit<Domain, 'id' | 'createdAt' | 'updatedAt' | 'daysUntilExpiration'>): Promise<Domain> => {
  // If registration and expiration dates are not provided or empty, fetch them from WHOIS
  let registrationDate = domainData.registrationDate;
  let expirationDate = domainData.expirationDate;
  let whoisData = domainData.whoisData || {};
  
  console.log("Adding domain with initial data:", { name: domainData.name, regDate: registrationDate, expDate: expirationDate });
  
  try {
    // Fetch WHOIS data if registration or expiration dates are empty
    if (!registrationDate || !expirationDate || registrationDate === '' || expirationDate === '') {
      console.log(`Fetching WHOIS data for ${domainData.name}`);
      const whoisDates = await fetchWhoisData(domainData.name);
      
      // Use fetched dates if not provided or empty
      registrationDate = (!registrationDate || registrationDate === '') ? whoisDates.registrationDate : registrationDate;
      expirationDate = (!expirationDate || expirationDate === '') ? whoisDates.expirationDate : expirationDate;
      
      console.log(`WHOIS data applied: reg=${registrationDate}, exp=${expirationDate}`);
      
      // Update WHOIS data
      whoisData = {
        ...whoisData,
        lastRefreshed: new Date().toISOString(),
        expirationDate: expirationDate,
        // Add some mock registrar data for demonstration
        registrar: ['GoDaddy', 'Namecheap', 'Cloudflare', 'Hover', 'NameSilo'][Math.floor(Math.random() * 5)]
      };
    }
  } catch (error) {
    console.error('Error fetching WHOIS data:', error);
    // If WHOIS fetch fails, use default dates
    if (!registrationDate || registrationDate === '') {
      const today = new Date();
      registrationDate = today.toISOString().split('T')[0];
    }
    
    if (!expirationDate || expirationDate === '') {
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      expirationDate = oneYearLater.toISOString().split('T')[0];
    }
  }
  
  const daysUntil = calculateDaysUntilExpiration(expirationDate);
  const status = determineDomainStatus(daysUntil);
  
  const newDomain: Domain = {
    id: uuidv4(),
    ...domainData,
    registrationDate,
    expirationDate,
    status,
    whoisData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    daysUntilExpiration: daysUntil,
    price: domainData.price || 0,
    currency: domainData.currency || 'USD'
  };
  
  console.log("Final domain being added:", { 
    name: newDomain.name, 
    regDate: newDomain.registrationDate, 
    expDate: newDomain.expirationDate,
    daysUntil: newDomain.daysUntilExpiration
  });
  
  const domains = getDomainStore();
  setDomainStore([...domains, newDomain]);
  
  return newDomain;
};

export const updateDomain = (id: string, domainData: Partial<Omit<Domain, 'id' | 'createdAt' | 'updatedAt' | 'daysUntilExpiration'>>): Domain => {
  const domains = getDomainStore();
  const index = domains.findIndex(d => d.id === id);
  
  if (index === -1) {
    throw new Error(`Domain with ID ${id} not found`);
  }
  
  const updatedDomain = {
    ...domains[index],
    ...domainData,
    updatedAt: new Date().toISOString()
  };
  
  // Recalculate days until expiration and status if expiration date changes
  if (domainData.expirationDate) {
    const daysUntil = calculateDaysUntilExpiration(domainData.expirationDate);
    updatedDomain.daysUntilExpiration = daysUntil;
    
    // Only update status if it's not a manual override
    if (!domainData.status && updatedDomain.status !== 'trash') {
      updatedDomain.status = determineDomainStatus(daysUntil);
    }
  }
  
  // Update the domains array
  const updatedDomains = [...domains];
  updatedDomains[index] = updatedDomain;
  setDomainStore(updatedDomains);
  
  return getDomainById(id) as Domain;
};

export const deleteDomain = (id: string): void => {
  const domains = getDomainStore();
  const index = domains.findIndex(d => d.id === id);
  
  if (index === -1) {
    throw new Error(`Domain with ID ${id} not found`);
  }
  
  // Soft delete - move to trash
  const updatedDomains = [...domains];
  updatedDomains[index] = {
    ...domains[index],
    status: 'trash',
    updatedAt: new Date().toISOString()
  };
  
  setDomainStore(updatedDomains);
};

export const permanentlyDeleteDomain = (id: string): void => {
  const domains = getDomainStore();
  const index = domains.findIndex(d => d.id === id);
  
  if (index === -1) {
    throw new Error(`Domain with ID ${id} not found`);
  }
  
  // Check if domain is in trash
  if (domains[index].status !== 'trash') {
    throw new Error(`Domain must be in trash before permanent deletion`);
  }
  
  // Hard delete
  const updatedDomains = [...domains];
  updatedDomains.splice(index, 1);
  setDomainStore(updatedDomains);
};

export const restoreDomain = (id: string): Domain => {
  const domains = getDomainStore();
  const index = domains.findIndex(d => d.id === id);
  
  if (index === -1) {
    throw new Error(`Domain with ID ${id} not found`);
  }
  
  // Check if domain is in trash
  if (domains[index].status !== 'trash') {
    throw new Error(`Only domains in trash can be restored`);
  }
  
  // Calculate new status
  const daysUntil = calculateDaysUntilExpiration(domains[index].expirationDate);
  const status = determineDomainStatus(daysUntil);
  
  // Update domain
  const updatedDomains = [...domains];
  updatedDomains[index] = {
    ...domains[index],
    status,
    updatedAt: new Date().toISOString()
  };
  
  setDomainStore(updatedDomains);
  
  return getDomainById(id) as Domain;
};

export const getDomainStats = (): DomainStats => {
  return getStats();
};

export const refreshWhoisData = async (id: string): Promise<Domain> => {
  const domain = getDomainById(id);
  
  if (!domain) {
    throw new Error(`Domain with ID ${id} not found`);
  }
  
  // Fetch fresh WHOIS data
  const whoisData = await refreshWhois(domain);
  
  // Update the domain with refreshed data
  const updatedDomain = {
    ...domain,
    registrationDate: whoisData.creationDate,
    expirationDate: whoisData.registryExpiryDate,
    whoisData: {
      ...(domain.whoisData || {}),
      lastRefreshed: new Date().toISOString(),
      registrar: domain.whoisData?.registrar || 'GoDaddy',
      expirationDate: whoisData.registryExpiryDate,
      registrantName: domain.whoisData?.registrantName || 'Domain Owner',
      registrantEmail: domain.whoisData?.registrantEmail || 'owner@example.com'
    },
    updatedAt: new Date().toISOString()
  };
  
  // Recalculate days until expiration
  const daysUntil = calculateDaysUntilExpiration(updatedDomain.expirationDate);
  updatedDomain.daysUntilExpiration = daysUntil;
  
  // Update status based on new expiration date if not in trash
  if (updatedDomain.status !== 'trash') {
    updatedDomain.status = determineDomainStatus(daysUntil);
  }
  
  console.log(`Updated WHOIS data: reg=${updatedDomain.registrationDate}, exp=${updatedDomain.expirationDate}, days=${daysUntil}`);
  
  updateDomain(id, updatedDomain);
  
  return getDomainById(id) as Domain;
};

export const getSoldDomains = (): SoldDomain[] => {
  return getSoldDomainsStore();
};

export const markDomainAsSold = (
  id: string, 
  saleData: { 
    salePrice: number, 
    saleDate: string, 
    purchasePrice: number, 
    buyer?: string, 
    saleNotes?: string 
  }
): SoldDomain => {
  const domain = getDomainById(id);
  
  if (!domain) {
    throw new Error(`Domain with ID ${id} not found`);
  }
  
  if (domain.status === 'trash') {
    throw new Error(`Cannot mark a domain in trash as sold`);
  }
  
  // Calculate ROI
  const roi = ((saleData.salePrice - saleData.purchasePrice) / saleData.purchasePrice) * 100;
  
  // Create sold domain record - preserve the original currency
  const soldDomain: SoldDomain = {
    ...domain,
    status: 'sold',
    saleDate: saleData.saleDate,
    salePrice: saleData.salePrice,
    purchasePrice: saleData.purchasePrice,
    roi,
    buyer: saleData.buyer,
    saleNotes: saleData.saleNotes,
    updatedAt: new Date().toISOString(),
    // Make sure to preserve the currency
    currency: domain.currency || 'USD'
  };
  
  // Add to sold domains
  const soldDomains = getSoldDomainsStore();
  setSoldDomainsStore([...soldDomains, soldDomain]);
  
  // Remove from active domains
  deleteDomain(id);
  
  return soldDomain;
};
