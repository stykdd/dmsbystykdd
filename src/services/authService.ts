
// Mock user database services
const USERS_STORAGE_KEY = 'dms_users';

export interface StoredUser {
  id: string;
  username: string;
  email: string;
  password: string;
  provider?: string;
  isImpersonating?: boolean;
  originalUser?: any;
}

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
    provider: 'email'
  };
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([adminUser]));
  return [adminUser];
};

export const ensureUsers = (): StoredUser[] => {
  let users = getStoredUsers();
  
  // Make sure admin user exists with correct credentials
  const adminExists = users.some(u => 
    (u.username === 'admin' && u.password === 'admin') || 
    (u.email === 'admin@dms.com' && u.password === 'admin')
  );
  
  if (!adminExists) {
    const adminUser: StoredUser = {
      id: 'admin_1',
      username: 'admin',
      email: 'admin@dms.com',
      password: 'admin',
      provider: 'email'
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
      provider: 'email'
    };
    
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([adminUser]));
    users = [adminUser];
  }
  
  return users;
};

export const saveUser = (user: StoredUser) => {
  const users = getStoredUsers();
  const existingUserIndex = users.findIndex(u => u.email === user.email || u.username === user.username);
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const findUserByCredentials = (emailOrUsername: string, password: string): StoredUser | undefined => {
  const users = getStoredUsers();
  console.log("Finding user with credentials:", emailOrUsername, "Password length:", password.length);
  console.log("Available users:", users);
  
  const foundUser = users.find(u => 
    (u.email === emailOrUsername || u.username === emailOrUsername) && 
    u.password === password
  );
  
  console.log("Found user:", foundUser);
  return foundUser;
};
