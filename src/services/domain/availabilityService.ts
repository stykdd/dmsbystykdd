
import { BulkCheckResult } from '../../types/domain';
import { getDomainStore } from './mockData';

/**
 * Checks availability of a single domain
 */
export const checkDomainAvailability = async (domainName: string): Promise<boolean> => {
  // Simulate API call to check domain availability
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check if the domain exists in our database (in a real app, this would be a WHOIS lookup)
  const domains = getDomainStore();
  const existingDomain = domains.find(d => d.name.toLowerCase() === domainName.toLowerCase());
  
  // For demo purposes, some domains are always available
  const alwaysAvailable = ['available.com', 'newdomain.org', 'available.net', 'free.io'];
  const alwaysUnavailable = ['example.com', 'google.com', 'microsoft.com', 'apple.com', 'amazon.com'];
  
  if (alwaysAvailable.includes(domainName.toLowerCase())) {
    return true;
  } else if (alwaysUnavailable.includes(domainName.toLowerCase()) || existingDomain) {
    return false;
  } else {
    // Randomly determine availability for demonstration purposes
    return Math.random() > 0.5;
  }
};

/**
 * Performs bulk availability check for multiple domains
 */
export const bulkCheckAvailability = async (domainNames: string[]): Promise<BulkCheckResult[]> => {
  // Simulate delay for API request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Process each domain
  const results: BulkCheckResult[] = [];
  
  for (const domain of domainNames) {
    try {
      // Skip empty domains
      if (!domain.trim()) continue;
      
      // Check format validity (basic check)
      if (!domain.includes('.')) {
        results.push({
          domain,
          available: false,
          error: 'Invalid domain format'
        });
        continue;
      }
      
      // Get availability
      const available = await checkDomainAvailability(domain);
      results.push({ domain, available });
    } catch (error) {
      results.push({
        domain,
        available: false,
        error: 'Error checking availability'
      });
    }
  }
  
  return results;
};
