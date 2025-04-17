
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';
import { 
  getStoredUsers, 
  saveUser, 
  ensureUsers,
  findUserByCredentials,
  findUserById,
  addNewUser,
  updateUser,
  StoredUser,
  getAppSettings,
  updateAppSettings
} from '../services/authService';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => false,
  register: async () => {},
  logout: () => {},
  error: null,
  connectToUserAccount: () => {},
  disconnectFromUserAccount: () => {},
  toggleSignupStatus: () => {},
  users: [],
  addUser: async () => ({ id: '', username: '', email: '', role: '', status: 'Active', createdAt: '' }),
  updateUserStatus: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState(getAppSettings());

  // Load all users and settings on component mount
  useEffect(() => {
    // First ensure our admin user exists
    const storedUsers = ensureUsers();
    
    // Map stored users to User type (without passwords)
    const mappedUsers = storedUsers.map(({ password, ...rest }) => rest);
    setUsers(mappedUsers);
    
    // Check for logged in user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem('user');
      }
    }
    
    // Load app settings
    setSettings(getAppSettings());
    
    setIsLoading(false);
  }, []);

  const login = async (identifierInput: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Login attempt with:", identifierInput, "Password length:", password.length);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find user by credentials
      const user = findUserByCredentials(identifierInput, password);
      
      if (!user) {
        console.log("No user found with these credentials");
        throw new Error("Invalid login credentials");
      }
      
      console.log("User found, logging in:", user);
      
      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = user;
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Refresh user list after login
      const updatedUsers = ensureUsers();
      setUsers(updatedUsers.map(({ password, ...rest }) => rest));
      
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'An error occurred during login');
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if signup is allowed
      const currentSettings = getAppSettings();
      if (!currentSettings.allowSignup && user?.role !== 'Admin') {
        throw new Error("User registration is currently disabled");
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = getStoredUsers();
      const existingUser = users.find(u => u.email === email || u.username === username);
      
      if (existingUser) {
        throw new Error(`A user with this ${existingUser.email === email ? 'email' : 'username'} already exists`);
      }
      
      const newUser: StoredUser = {
        id: `user_${Date.now()}`,
        username,
        email,
        password,
        provider: 'email',
        role: 'User',
        status: 'Active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      saveUser(newUser);
      
      // If no user is logged in (public registration), log in the new user
      if (!user) {
        // Remove password from user object before storing
        const { password: _, ...userWithoutPassword } = newUser;
        
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      }
      
      // Refresh user list
      const updatedUsers = getStoredUsers();
      setUsers(updatedUsers.map(({ password, ...rest }) => rest));
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const connectToUserAccount = (userData: User) => {
    // Save the original admin user for returning later
    const adminUser = user;
    
    // Get full user data from stored users (with all fields)
    const targetUser = findUserById(userData.id);
    
    if (targetUser) {
      // Store the original user connection
      const { password: _, ...userToConnect } = targetUser;
      
      const connectedUser = {
        ...userToConnect,
        isImpersonating: true,
        connectedBy: adminUser
      };
      
      // Set the current user to the connected user
      setUser(connectedUser);
      localStorage.setItem('user', JSON.stringify(connectedUser));
    }
  };

  const disconnectFromUserAccount = () => {
    if (user?.connectedBy) {
      // Restore the original admin user
      setUser(user.connectedBy);
      localStorage.setItem('user', JSON.stringify(user.connectedBy));
    }
  };

  const toggleSignupStatus = (enabled: boolean) => {
    const updatedSettings = updateAppSettings({ allowSignup: enabled });
    setSettings(updatedSettings);
  };

  const addUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const newUserData = {
      ...userData,
      password: 'defaultpassword',
      createdAt: new Date().toISOString()
    };
    
    const newUser = addNewUser(newUserData);
    
    // Refresh users list
    const updatedUsers = getStoredUsers();
    const mappedUsers = updatedUsers.map(({ password, ...rest }) => rest);
    setUsers(mappedUsers);
    
    const { password: _, ...newUserWithoutPassword } = newUser;
    return newUserWithoutPassword;
  };

  const updateUserStatus = (userId: string, status: 'Active' | 'Inactive') => {
    const updatedUser = updateUser(userId, { status });
    
    if (updatedUser) {
      // Refresh users list
      const updatedUsers = getStoredUsers();
      const mappedUsers = updatedUsers.map(({ password, ...rest }) => rest);
      setUsers(mappedUsers);
      
      // If the updated user is the current user, update the user state
      if (user?.id === userId) {
        const { password: _, ...updatedUserWithoutPassword } = updatedUser;
        setUser(updatedUserWithoutPassword);
        localStorage.setItem('user', JSON.stringify(updatedUserWithoutPassword));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        error,
        connectToUserAccount,
        disconnectFromUserAccount,
        toggleSignupStatus,
        users,
        addUser,
        updateUserStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
