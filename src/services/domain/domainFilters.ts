
import { Domain, DomainFilterOptions } from '../../types/domain';

/**
 * Applies filters to domain list
 */
export const applyDomainFilters = (domains: Domain[], filters?: DomainFilterOptions): Domain[] => {
  if (!filters) {
    return domains;
  }
  
  let filteredDomains = [...domains];
  
  // Exclude trash domains if specified
  if (filters.excludeTrash) {
    filteredDomains = filteredDomains.filter(domain => domain.status !== 'trash');
  }
  
  // Apply search filter
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredDomains = filteredDomains.filter(domain => 
      domain.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply status filter
  if (filters.status) {
    filteredDomains = filteredDomains.filter(domain => 
      domain.status === filters.status
    );
  }
  
  // Apply registrar account filter
  if (filters.registrarAccountId) {
    filteredDomains = filteredDomains.filter(domain => 
      domain.registrarAccountId === filters.registrarAccountId
    );
  }
  
  // Apply registrar filter
  if (filters.registrarId) {
    // This would require a join with accounts in a real database
    // Here we're simulating by using the registrarAccounts imported from the service
    const { getRegistrarAccounts } = require('../registrarService');
    const accounts = getRegistrarAccounts();
    const accountsForRegistrar = accounts.filter(acc => acc.registrarId === filters.registrarId);
    const accountIds = accountsForRegistrar.map(acc => acc.id);
    
    filteredDomains = filteredDomains.filter(domain => 
      domain.registrarAccountId && accountIds.includes(domain.registrarAccountId)
    );
  }
  
  // Apply category filter
  if (filters.categoryId) {
    filteredDomains = filteredDomains.filter(domain => 
      domain.categoryIds && domain.categoryIds.includes(filters.categoryId)
    );
  }
  
  return filteredDomains;
};

/**
 * Sorts domains based on sort options
 */
export const applyDomainSorting = (domains: Domain[], sortBy?: keyof Domain, sortOrder: 'asc' | 'desc' = 'asc'): Domain[] => {
  if (!sortBy) {
    return domains;
  }
  
  return [...domains].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle special cases for sorting
    if (sortBy === 'name') {
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }
    }
    
    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
};
