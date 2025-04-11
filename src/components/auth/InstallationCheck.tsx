
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const InstallationCheck: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    console.log('InstallationCheck triggered, path:', location.pathname);
    
    // Don't redirect if we're already on the installation page
    if (location.pathname === '/install') {
      console.log('Already on install page, skipping redirect');
      return;
    }

    // Check if the app has been installed
    const isInstalled = localStorage.getItem('dms_installed');
    console.log('Installation status:', isInstalled);
    
    // Redirect to installation page if not installed
    if (isInstalled !== 'true') {
      console.log('App not installed, redirecting to /install');
      navigate('/install');
    }
  }, [location, navigate]);
  
  return null;
};

export default InstallationCheck;
