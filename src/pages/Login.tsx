
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import { ensureUsers } from '../services/authService';
import { getAppSettings } from '../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [notInstalled, setNotInstalled] = useState(false);
  const [signupEnabled, setSignupEnabled] = useState(false);

  useEffect(() => {
    // Ensure admin user exists
    ensureUsers();
    
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    // Check if the app is installed
    const isInstalled = localStorage.getItem('dms_installed');
    setNotInstalled(isInstalled !== 'true');

    // Redirect to installation page if not installed
    if (isInstalled !== 'true') {
      navigate('/install');
    }
    
    // Check if signup is allowed
    const settings = getAppSettings();
    setSignupEnabled(settings.allowSignup);
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-blue-600 text-white p-3 rounded-full">
              <Globe size={32} />
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">DMS by stykdd</h1>
          <p className="mt-2 text-gray-600">
            Manage your domains efficiently
          </p>
        </div>

        {notInstalled && (
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Installation Required</AlertTitle>
            <AlertDescription>
              The application needs to be installed first.
              <Button 
                variant="link" 
                onClick={() => navigate('/install')}
                className="p-0 h-auto font-normal"
              >
                Go to Installation
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <LoginForm />
        
        {signupEnabled && (
          <div className="text-center text-sm mt-4">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800">
                Create an account
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
