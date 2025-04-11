
import { DomainStats } from '../../types/domain';
import { getDomains } from '../domainService';
import { getSoldDomainsStore } from './mockData';

/**
 * Gets aggregated domain statistics
 */
export const getDomainStats = (): DomainStats => {
  const domains = getDomains();
  const soldDomains = getSoldDomainsStore();
  
  // Calculate total revenue from sold domains
  const totalRevenue = soldDomains.reduce((sum, domain) => sum + domain.salePrice, 0);
  
  const activeDomains = domains.filter(d => d.status === 'active');
  return {
    total: activeDomains.length, // Only count active domains
    active: activeDomains.length,
    expiring: domains.filter(d => d.status === 'expiring').length,
    expired: domains.filter(d => d.status === 'expired').length,
    trash: domains.filter(d => d.status === 'trash').length,
    totalSold: soldDomains.length,
    totalRevenue: totalRevenue
  };
};
