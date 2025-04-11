
import { v4 as uuidv4 } from 'uuid';
import { DomainCategory } from '../types/domain';

// Local storage key
const CATEGORIES_STORAGE_KEY = 'domain_categories';

// Initial mock data
const initialCategories: DomainCategory[] = [
  {
    id: 'cat-1',
    name: 'Personal',
    description: 'Personal domains for private projects',
    color: '#3B82F6', // blue
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-2',
    name: 'Business',
    description: 'Domains for business websites and company projects',
    color: '#10B981', // green
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-3',
    name: 'Client',
    description: 'Domains managed for clients',
    color: '#6366F1', // indigo
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat-4',
    name: 'Experimental',
    description: 'Domains for testing and experimental projects',
    color: '#F59E0B', // amber
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Initialize or load data from localStorage
const initializeCategories = (): DomainCategory[] => {
  const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  
  if (storedCategories) {
    return JSON.parse(storedCategories);
  }
  
  // If no data in localStorage, use initial data and store it
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(initialCategories));
  return initialCategories;
};

// Get categories from localStorage
const getStoredCategories = (): DomainCategory[] => {
  const storedData = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

// Save categories to localStorage
const saveCategories = (categories: DomainCategory[]): void => {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
};

// Initialize categories
initializeCategories();

// CRUD operations
export const getCategories = (): DomainCategory[] => {
  return getStoredCategories();
};

export const getCategoryById = (id: string): DomainCategory | undefined => {
  const categories = getStoredCategories();
  return categories.find(category => category.id === id);
};

export const addCategory = (data: Omit<DomainCategory, 'id' | 'createdAt' | 'updatedAt'>): DomainCategory => {
  const categories = getStoredCategories();
  
  const newCategory: DomainCategory = {
    id: `cat-${uuidv4()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const updatedCategories = [...categories, newCategory];
  saveCategories(updatedCategories);
  
  return newCategory;
};

export const updateCategory = (id: string, data: Partial<Omit<DomainCategory, 'id' | 'createdAt' | 'updatedAt'>>): DomainCategory => {
  const categories = getStoredCategories();
  const index = categories.findIndex(category => category.id === id);
  
  if (index === -1) {
    throw new Error(`Category with ID ${id} not found`);
  }
  
  const updatedCategory = {
    ...categories[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  categories[index] = updatedCategory;
  saveCategories(categories);
  
  return updatedCategory;
};

export const deleteCategory = (id: string): void => {
  const categories = getStoredCategories();
  const updatedCategories = categories.filter(category => category.id !== id);
  
  if (categories.length === updatedCategories.length) {
    throw new Error(`Category with ID ${id} not found`);
  }
  
  saveCategories(updatedCategories);
};

// Reset to initial data (for development and testing)
export const resetCategoriesToDefault = (): void => {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(initialCategories));
};
