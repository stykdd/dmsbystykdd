
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { NotificationBell } from '@/contexts/NotificationContext';
import { UserRound, Heart, Search, Bell } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import Footer from './Footer';
import { initializeApp } from '@/utils/appInitializer';
import { useTheme } from '@/contexts/ThemeContext';

const Layout: React.FC = () => {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  // Initialize app services
  useEffect(() => {
    if (isAuthenticated) {
      initializeApp();
    }
  }, [isAuthenticated]);
  
  // Handle auth redirect
  useEffect(() => {
    const handleAuthRedirect = async () => {
      // Check if we have a hash with access_token (from OAuth redirect)
      if (location.hash && location.hash.includes('access_token')) {
        try {
          // First, parse the hash to extract the access token
          const hashParams = new URLSearchParams(location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          
          if (accessToken) {
            // Set the session with the token
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
              console.error("Error processing auth redirect:", error);
              toast({
                title: "Authentication error",
                description: error.message,
                variant: "destructive"
              });
            } else if (data.session) {
              // Clean URL by removing the hash
              window.history.replaceState({}, document.title, window.location.pathname);
              navigate('/', { replace: true });
              toast({
                title: "Signed in successfully",
                description: "Welcome back!",
              });
            }
          }
        } catch (err) {
          console.error("Error during auth redirect handling:", err);
        }
      }
    };
    
    handleAuthRedirect();
  }, [location, navigate, toast]);
  
  // Force dark theme to match the design
  useEffect(() => {
    if (theme !== 'dark') {
      setTheme('dark');
    }
  }, [theme, setTheme]);
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  // Redirect to login only if accessing protected routes
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };
  
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background dark">
      <div className="flex-1 flex">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          setCollapsed={setSidebarCollapsed} 
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 flex flex-col">
            <div className="sticky top-0 z-10 flex justify-end items-center px-6 py-3 h-[65px] bg-background border-b border-border">
              <div className="mr-auto">
                <div className="relative w-64">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-full bg-muted/50 rounded-md border-0 focus:ring-2 focus:ring-primary/20 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Bell className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Notifications</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                        onClick={() => window.open('https://donate.stykdd.com', '_blank')}
                      >
                        <Heart className="h-4 w-4 text-red-500" fill="#ea384c" />
                        <span className="text-sm font-medium">Support Us</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Support Us</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <DropdownMenu>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="relative rounded-full bg-muted/50 text-foreground">
                            <UserRound className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent>Profile</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    {user && (
                      <DropdownMenuItem disabled className="text-sm text-muted-foreground">
                        {user.email}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="px-6 py-4 flex-1 overflow-y-auto w-full max-h-[calc(100vh-130px)]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
