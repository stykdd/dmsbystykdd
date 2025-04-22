
import { useState, useEffect } from 'react';
import { WishlistDomain, DomainCheckResult } from '@/types/wishlist';
import { bulkCheckAvailability } from '@/services/domain/availabilityService';
import { fetchWhoisData } from '@/services/domain/whoisService';

export const useWishlistDomains = () => {
  const [wishlist, setWishlist] = useState<WishlistDomain[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Load initial demo data
  useEffect(() => {
    const demoWishlist: WishlistDomain[] = [
      {
        id: "1",
        domain: "techinnovation.com",
        dateAdded: "2023-11-15T14:22:10Z",
        notificationsEnabled: true,
        category: "Technology",
        note: "Perfect for a tech startup",
        availability: {
          status: 'pending',
          lastChecked: "",
          expiryDate: null,
        }
      },
      {
        id: "2",
        domain: "healthrevolution.org",
        dateAdded: "2023-10-28T08:15:32Z",
        notificationsEnabled: true,
        category: "Health",
        availability: {
          status: 'pending',
          lastChecked: "",
          expiryDate: null,
        }
      },
      {
        id: "3",
        domain: "investsmart.finance",
        dateAdded: "2023-12-02T11:34:05Z",
        notificationsEnabled: false,
        category: "Finance",
        note: "Great domain for financial services",
        availability: {
          status: 'pending',
          lastChecked: "",
          expiryDate: null,
        }
      },
      {
        id: "4",
        domain: "educonnect.online",
        dateAdded: "2023-11-10T15:48:22Z",
        notificationsEnabled: true,
        category: "Education",
        availability: {
          status: 'pending',
          lastChecked: "",
          expiryDate: null,
        }
      }
    ];

    setWishlist(demoWishlist);
  }, []);

  // Check domain availability whenever wishlist changes
  useEffect(() => {
    const checkAll = async () => {
      setIsChecking(true);
      const unresolved = wishlist.filter(w => w.availability?.status === 'pending' || !w.availability);
      if (unresolved.length === 0) {
        setIsChecking(false);
        return;
      }

      // Mark domains as pending while checking
      setWishlist(oldList =>
        oldList.map(w => unresolved.find(u => u.id === w.id) ?
          { ...w, availability: { ...w.availability, status: 'pending', lastChecked: new Date().toISOString() } }
          : w
        )
      );
      
      try {
        const checkResults = await bulkCheckAvailability(wishlist.map(w => w.domain));
        const updateAvailability = async (result: DomainCheckResult) => {
          if (result.available) {
            return {
              status: 'available' as const,
              lastChecked: new Date().toISOString(),
              expiryDate: null,
            };
          } else if (result.error) {
            return {
              status: 'pending' as const,
              lastChecked: new Date().toISOString(),
              expiryDate: null,
            };
          } else {
            try {
              const whois = await fetchWhoisData(result.domain);
              const expiry =
                whois.registryExpiryDate ||
                whois.expirationDate ||
                whois.expiresOn ||
                null;
              return {
                status: 'unavailable' as const,
                lastChecked: new Date().toISOString(),
                expiryDate: expiry,
              };
            } catch {
              return {
                status: 'unavailable' as const,
                lastChecked: new Date().toISOString(),
                expiryDate: null,
              };
            }
          }
        };

        const newAvailabilityArray = await Promise.all(
          checkResults.map(updateAvailability)
        );

        setWishlist(oldList =>
          oldList.map((w, i) => ({
            ...w,
            availability: newAvailabilityArray[i],
          }))
        );
      } finally {
        setIsChecking(false);
      }
    };
    
    if (wishlist.some(w => w.availability?.status === 'pending' || !w.availability)) {
      checkAll();
    }
  }, [wishlist.length]);

  const handleManualCheck = async () => {
    setIsChecking(true);
    setWishlist(oldList =>
      oldList.map(w => ({
        ...w,
        availability: {
          ...w.availability,
          status: 'pending',
          lastChecked: new Date().toISOString(),
        }
      }))
    );
    
    const checkResults = await bulkCheckAvailability(wishlist.map(w => w.domain));
    const newAvailabilityArray = await Promise.all(
      checkResults.map(async (result) => {
        if (result.available) {
          return {
            status: 'available' as const,
            lastChecked: new Date().toISOString(),
            expiryDate: null,
          };
        } else if (result.error) {
          return {
            status: 'pending' as const,
            lastChecked: new Date().toISOString(),
            expiryDate: null,
          };
        } else {
          try {
            const whois = await fetchWhoisData(result.domain);
            const expiry =
              whois.registryExpiryDate ||
              whois.expirationDate ||
              whois.expiresOn ||
              null;
            return {
              status: 'unavailable' as const,
              lastChecked: new Date().toISOString(),
              expiryDate: expiry,
            };
          } catch {
            return {
              status: 'unavailable' as const,
              lastChecked: new Date().toISOString(),
              expiryDate: null,
            };
          }
        }
      })
    );
    
    setWishlist(oldList =>
      oldList.map((w, i) => ({
        ...w,
        availability: newAvailabilityArray[i],
      }))
    );
    setIsChecking(false);
  };

  const addDomain = (domain: string, category: string, note?: string) => {
    const newItem: WishlistDomain = {
      id: Date.now().toString(),
      domain,
      dateAdded: new Date().toISOString(),
      notificationsEnabled: true,
      category: category || "Uncategorized",
      note: note || undefined,
      availability: {
        status: 'pending',
        lastChecked: "",
        expiryDate: null,
      }
    };

    setWishlist(prev => [newItem, ...prev]);
  };

  const updateDomain = (id: string, domain: string, category: string, note?: string) => {
    setWishlist(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, domain, category, note }
          : item
      )
    );
  };

  const toggleNotification = (id: string) => {
    setWishlist(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, notificationsEnabled: !item.notificationsEnabled }
          : item
      )
    );
  };

  const deleteSelected = () => {
    if (selectedDomains.size === 0) return;

    setWishlist(prev =>
      prev.filter(item => !selectedDomains.has(item.id))
    );

    setSelectedDomains(new Set());
  };

  const toggleSelectDomain = (id: string) => {
    const newSelected = new Set(selectedDomains);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDomains(newSelected);
  };

  const filteredWishlist = wishlist.filter(item =>
    filterCategory === "all" || item.category === filterCategory
  );

  const sortedWishlist = [...filteredWishlist].sort((a, b) => {
    const dateA = new Date(a.dateAdded).getTime();
    const dateB = new Date(b.dateAdded).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const selectAllDomains = () => {
    if (selectedDomains.size === filteredWishlist.length) {
      setSelectedDomains(new Set());
    } else {
      setSelectedDomains(new Set(filteredWishlist.map(item => item.id)));
    }
  };

  return {
    wishlist,
    filteredWishlist,
    sortedWishlist,
    isChecking,
    selectedDomains,
    filterCategory,
    sortOrder,
    setFilterCategory,
    setSortOrder,
    addDomain,
    updateDomain,
    toggleNotification,
    deleteSelected,
    toggleSelectDomain,
    selectAllDomains,
    handleManualCheck
  };
};
