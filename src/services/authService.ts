// Mock user database services
const USERS_STORAGE_KEY = 'dms_users';
const SETTINGS_STORAGE_KEY = 'dms_settings';

export interface StoredUser {
  id: string;
  username: string;
  email: string;
  password: string;
  provider?: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  createdAt: string;
  avatar?: string;
}

export interface AppSettings {
  allowSignup: boolean;
}

export const getAppSettings = (): AppSettings => {
  const settingsJson = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (settingsJson) {
    try {
      return JSON.parse(settingsJson);
    } catch (e) {
      console.error("Error parsing stored settings:", e);
    }
  }
  
  // Default settings
  const defaultSettings = {
    allowSignup: false
  };
  
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
  return defaultSettings;
};

export const updateAppSettings = (settings: Partial<AppSettings>): AppSettings => {
  const currentSettings = getAppSettings();
  const updatedSettings = { ...currentSettings, ...settings };
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
  return updatedSettings;
};

export const getStoredUsers = (): StoredUser[] => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  if (usersJson) {
    try {
      return JSON.parse(usersJson);
    } catch (e) {
      console.error("Error parsing stored users:", e);
      // If there's an error parsing, we'll reset to default below
    }
  }
  
  // Initialize with admin account using simplified credentials
  const adminUser: StoredUser = {
    id: 'admin_1',
    username: 'admin',
    email: 'admin@dms.com',
    password: 'admin',
    provider: 'email',
    role: 'Admin',
    status: 'Active',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([adminUser]));
  return [adminUser];
};

export const ensureUsers = (): StoredUser[] => {
  let users = getStoredUsers();
  
  // Make sure admin user exists with correct credentials
  const adminExists = users.some(u => 
    ((u.username === 'admin' && u.password === 'admin') || 
    (u.email === 'admin@dms.com' && u.password === 'admin')) &&
    u.role === 'Admin'
  );
  
  if (!adminExists) {
    const adminUser: StoredUser = {
      id: 'admin_1',
      username: 'admin',
      email: 'admin@dms.com',
      password: 'admin',
      provider: 'email',
      role: 'Admin',
      status: 'Active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    users.push(adminUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
  
  // Force clear and reinitialize users if there are issues
  try {
    const testParse = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
    if (!Array.isArray(testParse)) {
      throw new Error('Stored users is not an array');
    }
  } catch (e) {
    console.error("Error with stored users, reinitializing:", e);
    
    // Reinitialize with admin account
    const adminUser: StoredUser = {
      id: 'admin_1',
      username: 'admin',
      email: 'admin@dms.com',
      password: 'admin',
      provider: 'email',
      role: 'Admin',
      status: 'Active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([adminUser]));
    users = [adminUser];
  }
  
  return users;
};

export const saveUser = (user: StoredUser) => {
  const users = getStoredUsers();
  const existingUserIndex = users.findIndex(u => u.id === user.id);
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return user;
};

export const addNewUser = (userData: Omit<StoredUser, 'id'>): StoredUser => {
  const newUser: StoredUser = {
    ...userData,
    id: `user_${Date.now()}`,
  };
  
  const users = getStoredUsers();
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  return newUser;
};

export const updateUser = (userId: string, updates: Partial<StoredUser>): StoredUser | null => {
  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return null;
  
  users[userIndex] = { ...users[userIndex], ...updates };
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  return users[userIndex];
};

export const findUserByCredentials = (emailOrUsername: string, password: string): StoredUser | undefined => {
  const users = getStoredUsers();
  console.log("Finding user with credentials:", emailOrUsername, "Password length:", password.length);
  console.log("Available users:", users);
  
  const foundUser = users.find(u => 
    (u.email === emailOrUsername || u.username === emailOrUsername) && 
    u.password === password
  );
  
  if (foundUser) {
    // Update last login time
    foundUser.lastLogin = new Date().toISOString();
    saveUser(foundUser);
  }
  
  console.log("Found user:", foundUser);
  return foundUser;
};

export const findUserById = (userId: string): StoredUser | undefined => {
  const users = getStoredUsers();
  return users.find(u => u.id === userId);
};
