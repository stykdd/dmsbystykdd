export interface User {
  id: string;
  username: string;
  email: string;
  provider?: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  createdAt: string;
  allowSignup?: boolean;
  avatar?: string; // Optional avatar field
  isImpersonating?: boolean;
  originalUser?: User;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifierInput: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, avatar?: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  connectToUserAccount: (userData: User) => void;
  disconnectFromUserAccount: () => void;
  toggleSignupStatus: (enabled: boolean) => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<User>;
  updateUserStatus: (userId: string, status: 'Active' | 'Inactive') => void;
}
