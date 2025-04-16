import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Globe, ShieldX, User, UserRound, UserCog, UserCheck } from 'lucide-react';
import { getAppSettings } from '../services/authService';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const AVATAR_OPTIONS = [
  { icon: User, label: 'Default User' },
  { icon: UserRound, label: 'Round User' },
  { icon: UserCog, label: 'User Settings' },
  { icon: UserCheck, label: 'User Check' }
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, error, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [signupEnabled, setSignupEnabled] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('User');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    const settings = getAppSettings();
    setSignupEnabled(settings.allowSignup);
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match');
      return;
    }
    
    try {
      await register(username, email, password, selectedAvatar);
      navigate('/dashboard');
      toast({
        title: "Success",
        description: "You have successfully registered!",
      });
    } catch (err: any) {
      // Error is already handled in the auth context
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <Globe size={32} />
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">DMS</h1>
          <p className="mt-2 text-gray-600">
            Create your account
          </p>
        </div>

        {!signupEnabled ? (
          <Alert variant="destructive">
            <ShieldX className="h-4 w-4" />
            <AlertTitle>Registration Disabled</AlertTitle>
            <AlertDescription>
              New user registration is currently disabled by the administrator.
              <div className="mt-2">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/login')}
                >
                  Return to Login
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {passwordError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label>Choose Avatar</Label>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  {AVATAR_OPTIONS.map(({ icon: Icon, label }) => (
                    <Button
                      key={label}
                      type="button"
                      variant={selectedAvatar === label ? "default" : "outline"}
                      className="p-4 aspect-square"
                      onClick={() => setSelectedAvatar(label)}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Avatar className="h-12 w-12 bg-primary/10">
                          <AvatarFallback>
                            <Icon className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-center">{label}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </div>

            <div className="text-center text-sm">
              <p className="text-gray-600">
                Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800">Sign in</Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
