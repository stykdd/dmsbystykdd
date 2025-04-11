
// Core utility functions for domain operations
import { Domain, DomainStatus } from '../../types/domain';

/**
 * Calculates the number of days until a domain expires from the current date
 */
export const calculateDaysUntilExpiration = (expirationDate: string): number => {
  const expiration = new Date(expirationDate);
  const today = new Date();
  
  // Reset time to compare just the dates
  expiration.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Calculate difference in milliseconds and convert to days
  const diffTime = expiration.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Determines domain status based on expiration days
 */
export const determineDomainStatus = (daysUntilExpiration: number): DomainStatus => {
  if (daysUntilExpiration < 0) {
    return 'expired';
  } else if (daysUntilExpiration <= 30) {
    return 'expiring';
  } else {
    return 'active';
  }
};

/**
 * Updates domain expiration status
 */
export const updateDomainStatus = (domain: Domain): Domain => {
  const daysUntil = calculateDaysUntilExpiration(domain.expirationDate);
  // Only update status if it's not already in trash
  const status = domain.status === 'trash' ? 'trash' : determineDomainStatus(daysUntil);
  
  return {
    ...domain,
    daysUntilExpiration: daysUntil,
    status
  };
};
