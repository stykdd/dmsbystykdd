
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
    return JSON.parse(usersJson);
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
  const users = getStoredUsers();
  return users;
};

export const saveUser = (user: StoredUser) => {
  const users = getStoredUsers();
  const existingUserIndex = users.findIndex(u => u.email === user.email);
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const findUserByCredentials = (email: string, password: string): StoredUser | undefined => {
  const users = getStoredUsers();
  return users.find(u => u.email === email && u.password === password);
};
