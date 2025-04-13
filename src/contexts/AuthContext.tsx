
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types/auth';
import { 
  getStoredUsers, 
  saveUser, 
  ensureUsers,
  findUserByCredentials,
  StoredUser
} from '../services/authService';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => false,
  register: async () => {},
  logout: () => {},
  error: null,
  impersonateUser: () => {},
  stopImpersonating: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for stored user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
    
    // Ensure user database is initialized
    ensureUsers();
  }, []);

  const login = async (identifierInput: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find user by credentials
      const user = findUserByCredentials(identifierInput, password);
      
      if (!user) {
        throw new Error("Invalid login credentials");
      }
      
      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = user;
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      setIsLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = getStoredUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
      
      const newUser: StoredUser = {
        id: `user_${Date.now()}`,
        username,
        email,
        password,
        provider: 'email'
      };
      
      saveUser(newUser);
      
      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = newUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
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

  const impersonateUser = (userData: User) => {
    // Store the original user for returning later
    const originalUser = user;
    
    // Create the impersonated user with a flag
    const impersonatedUser = {
      ...userData,
      isImpersonating: true,
      originalUser: originalUser
    };
    
    // Set the current user to the impersonated user
    setUser(impersonatedUser);
  };

  const stopImpersonating = () => {
    if (user?.isImpersonating && user.originalUser) {
      // Restore the original user
      setUser(user.originalUser);
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
        impersonateUser,
        stopImpersonating
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
