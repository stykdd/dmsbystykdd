
export interface User {
  id: string;
  username: string;
  email: string;
  provider?: string;
  isImpersonating?: boolean;
  originalUser?: User;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifierInput: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  impersonateUser: (userData: User) => void;
  stopImpersonating: () => void;
}
