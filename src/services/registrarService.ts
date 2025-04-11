
import { v4 as uuidv4 } from 'uuid';
import { Registrar, RegistrarAccount } from '../types/domain';

// Mock data for registrars
let registrars: Registrar[] = [
  {
    id: 'reg-1',
    name: 'GoDaddy',
    website: 'https://www.godaddy.com',
    description: 'Popular domain registrar with affordable prices',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reg-2',
    name: 'Namecheap',
    website: 'https://www.namecheap.com',
    description: 'Budget-friendly registrar with good customer service',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reg-3',
    name: 'Google Domains',
    website: 'https://domains.google',
    description: 'Straightforward domain registration from Google',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock data for registrar accounts
let registrarAccounts: RegistrarAccount[] = [
  {
    id: 'acc-1',
    name: 'My GoDaddy Account',
    registrarId: 'reg-1',
    username: 'user@example.com',
    password: 'password123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc-2',
    name: 'Work Namecheap Account',
    registrarId: 'reg-2',
    username: 'work@example.com',
    apiKey: 'abc123def456',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Registrar CRUD operations
export const getRegistrars = (): Registrar[] => {
  return [...registrars];
};

export const getRegistrarById = (id: string): Registrar | undefined => {
  return registrars.find(registrar => registrar.id === id);
};

export const addRegistrar = (data: Omit<Registrar, 'id' | 'createdAt' | 'updatedAt'>): Registrar => {
  const newRegistrar: Registrar = {
    id: `reg-${uuidv4()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  registrars.push(newRegistrar);
  return newRegistrar;
};

export const updateRegistrar = (id: string, data: Partial<Omit<Registrar, 'id' | 'createdAt' | 'updatedAt'>>): Registrar => {
  const index = registrars.findIndex(registrar => registrar.id === id);
  
  if (index === -1) {
    throw new Error(`Registrar with ID ${id} not found`);
  }
  
  const updatedRegistrar = {
    ...registrars[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  registrars[index] = updatedRegistrar;
  return updatedRegistrar;
};

export const deleteRegistrar = (id: string): void => {
  const index = registrars.findIndex(registrar => registrar.id === id);
  
  if (index === -1) {
    throw new Error(`Registrar with ID ${id} not found`);
  }
  
  // Delete the registrar
  registrars.splice(index, 1);
  
  // Also delete all associated accounts
  registrarAccounts = registrarAccounts.filter(account => account.registrarId !== id);
};

// Registrar Account CRUD operations
export const getRegistrarAccounts = (registrarId?: string): RegistrarAccount[] => {
  if (registrarId) {
    return registrarAccounts.filter(account => account.registrarId === registrarId);
  }
  return [...registrarAccounts];
};

export const getRegistrarAccountById = (id: string): RegistrarAccount | undefined => {
  return registrarAccounts.find(account => account.id === id);
};

export const addRegistrarAccount = (data: Omit<RegistrarAccount, 'id' | 'createdAt' | 'updatedAt'>): RegistrarAccount => {
  const newAccount: RegistrarAccount = {
    id: `acc-${uuidv4()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  registrarAccounts.push(newAccount);
  return newAccount;
};

export const updateRegistrarAccount = (id: string, data: Partial<Omit<RegistrarAccount, 'id' | 'createdAt' | 'updatedAt'>>): RegistrarAccount => {
  const index = registrarAccounts.findIndex(account => account.id === id);
  
  if (index === -1) {
    throw new Error(`Registrar account with ID ${id} not found`);
  }
  
  const updatedAccount = {
    ...registrarAccounts[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  registrarAccounts[index] = updatedAccount;
  return updatedAccount;
};

export const deleteRegistrarAccount = (id: string): void => {
  const index = registrarAccounts.findIndex(account => account.id === id);
  
  if (index === -1) {
    throw new Error(`Registrar account with ID ${id} not found`);
  }
  
  registrarAccounts.splice(index, 1);
};
