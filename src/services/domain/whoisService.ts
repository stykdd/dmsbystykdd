
/**
 * WHOIS data fetching and processing
 */

/**
 * Fetches WHOIS data for a domain
 */
export const fetchWhoisData = async (domainName: string): Promise<any> => {
  // Simulate API call to fetch WHOIS data
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Domain-specific WHOIS data for common domains
  const domainLower = domainName.toLowerCase();
  
  // Generate a more complete WHOIS record
  const baseWhoisData = {
    domainName: domainName.toUpperCase(),
    registryDomainId: `${Math.floor(Math.random() * 10000000000)}_DOMAIN_COM-VRSN`,
    registrarWhoisServer: "whois.namecheap.com",
    registrarUrl: "http://www.namecheap.com",
    updatedDate: "2024-12-21T01:26:49Z",
    creationDate: "2023-12-20T19:59:44Z",
    registryExpiryDate: "2025-12-20T19:59:44Z",
    registrar: "NameCheap, Inc.",
    registrarIanaId: "1068",
    registrarAbuseContactEmail: "abuse@namecheap.com",
    registrarAbuseContactPhone: "+1.6613102107",
    domainStatus: "clientTransferProhibited https://icann.org/epp#clientTransferProhibited",
    nameServer1: "DNS1.NAMECHEAPHOSTING.COM",
    nameServer2: "DNS2.NAMECHEAPHOSTING.COM",
    dnssec: "unsigned",
    urlOfIcannWhoisInaccuracyComplaintForm: "https://www.icann.org/wicf/"
  };
  
  // Domain-specific data for known domains
  const knownDomains: {[key: string]: any} = {
    'stykdd.com': { 
      creationDate: "2023-12-20T19:59:44Z", 
      registryExpiryDate: "2025-12-20T19:59:44Z", 
      domainName: "STYKDD.COM",
      updatedDate: "2024-12-21T01:26:49Z"
    },
    'example.com': { 
      creationDate: "1992-01-15T00:00:00Z", 
      registryExpiryDate: "2026-01-15T00:00:00Z",
      domainName: "EXAMPLE.COM",
      updatedDate: "2023-01-15T12:34:56Z"
    },
    'google.com': { 
      creationDate: "1997-09-15T00:00:00Z", 
      registryExpiryDate: "2028-09-14T00:00:00Z",
      domainName: "GOOGLE.COM",
      nameServer1: "NS1.GOOGLE.COM",
      nameServer2: "NS2.GOOGLE.COM",
      registrar: "MarkMonitor Inc."
    },
    'amazon.com': { 
      creationDate: "1994-11-01T00:00:00Z", 
      registryExpiryDate: "2028-10-31T00:00:00Z",
      domainName: "AMAZON.COM",
      nameServer1: "NS1.AMAZON.COM",
      nameServer2: "NS2.AMAZON.COM",
      registrar: "MarkMonitor Inc."
    }
  };
  
  // If we have predefined data for this domain, merge it with the base data
  if (knownDomains[domainLower]) {
    console.log("WHOIS data fetched for", domainName, ":", knownDomains[domainLower]);
    return { ...baseWhoisData, ...knownDomains[domainLower] };
  }
  
  // For other domains, create a consistent record with the base data
  const today = new Date();
  
  // For registration date, use a date between 1-3 years ago
  const yearsAgo = Math.floor(Math.random() * 3) + 1;
  const registrationDate = new Date(today);
  registrationDate.setFullYear(today.getFullYear() - yearsAgo);
  
  // Generate an expiration date that's exactly 2 years from today
  const expirationDate = new Date(today);
  expirationDate.setFullYear(today.getFullYear() + 2);
  
  // Format dates in WHOIS format
  const creationDateStr = registrationDate.toISOString().replace(/\.\d{3}/, '');
  const expiryDateStr = expirationDate.toISOString().replace(/\.\d{3}/, '');
  
  const randomWhoisData = {
    ...baseWhoisData,
    domainName: domainName.toUpperCase(),
    creationDate: creationDateStr,
    registryExpiryDate: expiryDateStr
  };
  
  console.log("WHOIS data fetched for", domainName, ":", randomWhoisData);
  
  return randomWhoisData;
};

/**
 * Refreshes WHOIS data for a domain
 */
export const refreshWhoisData = async (domain: any): Promise<any> => {
  // Fetch fresh WHOIS data
  console.log(`Refreshing WHOIS data for ${domain.name}`);
  return await fetchWhoisData(domain.name);
};
