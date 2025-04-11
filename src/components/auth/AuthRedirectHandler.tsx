
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';

const AuthRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const handleAuthRedirect = async () => {
      console.log('AuthRedirectHandler: checking for auth hash');
      
      if (location.hash && location.hash.includes('access_token')) {
        console.log('Auth hash detected:', location.hash);
        try {
          const { data } = await supabase.auth.getSession();
          console.log('Auth session data:', data);
          
          if (data.session) {
            console.log('Valid session found, redirecting to dashboard');
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
            navigate('/dashboard', { replace: true });
          }
        } catch (err) {
          console.error("Global auth redirect error:", err);
        }
      }
    };
    
    handleAuthRedirect();
  }, [location, navigate]);
  
  return null;
};

export default AuthRedirectHandler;
