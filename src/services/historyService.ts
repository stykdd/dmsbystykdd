
import { v4 as uuidv4 } from 'uuid';

export interface DomainCheckHistoryItem {
  id: string;
  domain: string;
  available: boolean;
  checkedAt: string;
  isFavorite: boolean;
  error?: string;
}

// Mock storage using localStorage
const HISTORY_STORAGE_KEY = 'domain-check-history';
const FAVORITES_STORAGE_KEY = 'domain-favorites';

// Initialize history from localStorage or start with empty array
const getStoredHistory = (): DomainCheckHistoryItem[] => {
  const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Get all history items
export const getHistory = (): DomainCheckHistoryItem[] => {
  return getStoredHistory();
};

// Add a domain check to history
export const addToHistory = (domainCheck: Omit<DomainCheckHistoryItem, 'id' | 'checkedAt' | 'isFavorite'>): DomainCheckHistoryItem => {
  const history = getStoredHistory();
  
  const newHistoryItem: DomainCheckHistoryItem = {
    id: uuidv4(),
    ...domainCheck,
    checkedAt: new Date().toISOString(),
    isFavorite: false
  };
  
  // Add to beginning of array (most recent first)
  const updatedHistory = [newHistoryItem, ...history];
  
  // Store back to localStorage
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  
  return newHistoryItem;
};

// Toggle favorite status
export const toggleFavorite = (id: string): DomainCheckHistoryItem => {
  const history = getStoredHistory();
  const itemIndex = history.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    throw new Error(`History item with ID ${id} not found`);
  }
  
  // Toggle the favorite status
  history[itemIndex].isFavorite = !history[itemIndex].isFavorite;
  
  // Update localStorage
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  
  return history[itemIndex];
};

// Get favorites only
export const getFavorites = (): DomainCheckHistoryItem[] => {
  const history = getStoredHistory();
  return history.filter(item => item.isFavorite);
};

// Clear history
export const clearHistory = (): void => {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
};

// Remove item from history
export const removeFromHistory = (id: string): void => {
  const history = getStoredHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
};
