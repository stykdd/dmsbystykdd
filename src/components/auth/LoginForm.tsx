
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface LoginFormProps {
  defaultUsername?: string;
  defaultPassword?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  defaultUsername = 'admin',
  defaultPassword = 'admin'
}) => {
  const navigate = useNavigate();
  const { login, error: authError, isLoading } = useAuth();
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState(defaultUsername);
  const [password, setPassword] = useState(defaultPassword);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    try {
      console.log("Submitting login form with:", identifier, "Password length:", password.length);
      const result = await login(identifier, password);
      if (result) {
        navigate('/dashboard');
        toast({
          title: "Success",
          description: "You have successfully logged in.",
        });
      }
    } catch (err: any) {
      setLoginError(err.message || "Failed to login. Please check your credentials.");
      console.error("Login error:", err);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {authError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      {loginError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="identifier">Username or Email</Label>
          <Input
            id="identifier"
            name="identifier"
            type="text"
            autoComplete="username email"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter your username or email"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="mt-1"
          />
        </div>
      </div>

      <div className="mt-1 text-sm text-gray-500">
        <p>Default admin credentials are pre-filled for demo purposes</p>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};

export default LoginForm;
