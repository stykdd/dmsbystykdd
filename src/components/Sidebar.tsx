
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Home, 
  Globe, 
  Search, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  AlertOctagon,
  DollarSign,
  ListTodo,
  KeyRound,
  BarChart3,
  Mail,
  Heart,
  ExternalLink,
  FileSearch,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme } = useTheme();
  const [featuresOpen, setFeaturesOpen] = useState(false);
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  // Check if any feature route is active
  const isAnyFeatureActive = () => {
    const featureRoutes = featureItems.map(item => item.path);
    return featureRoutes.some(route => location.pathname === route);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/domains', label: 'Domains Portfolio', icon: <Globe size={20} /> },
    { path: '/expired', label: 'Expired Domains', icon: <AlertOctagon size={20} /> },
    { path: '/sales', label: 'Domains Sales', icon: <DollarSign size={20} /> },
    { path: '/check-availability', label: 'Check Domains', icon: <Search size={20} /> },
  ];

  // Feature section items
  const featureItems = [
    { path: '/todo', label: 'To-Do List', icon: <ListTodo size={20} /> },
    { path: '/password-generator', label: 'Password Generator', icon: <KeyRound size={20} /> },
    { path: '/features/keyword-search', label: 'Keyword Search', icon: <Search size={20} /> },
    { path: '/features/email-verification', label: 'Email Verification', icon: <Mail size={20} /> },
    { path: '/features/domain-appraisal', label: 'Domain Appraisal', icon: <DollarSign size={20} /> },
    { path: '/features/website-scraper', label: 'Website Scraper', icon: <FileSearch size={20} /> },
    { path: '/features/wishlist', label: 'Wishlist', icon: <Heart size={20} /> },
    { path: '/features/stats', label: 'Statistics', icon: <BarChart3 size={20} /> },
  ];

  // Show admin link for admin users
  const isAdmin = user?.email === 'admin@dms.com';

  // Dynamic color based on theme
  const logoColor = theme === 'dark' ? 'text-blue-300' : 'text-blue-600';

  // Set features open if any feature route is active
  React.useEffect(() => {
    if (isAnyFeatureActive() && !featuresOpen) {
      setFeaturesOpen(true);
    }
  }, [location.pathname]);

  return (
    <div className={cn(
      "h-full flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-16" : "w-[240px]"
    )}>
      <div className="p-4 h-[65px] flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <span className={`text-xl font-bold ${logoColor}`}>
            DMS
          </span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      <div className="flex-1 py-6 flex flex-col justify-between overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors",
                isActiveRoute(item.path)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center"
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}

          {/* Features Dropdown Section */}
          <div className="pt-4 pb-2">
            <Collapsible
              open={featuresOpen}
              onOpenChange={setFeaturesOpen}
              className={cn(
                "rounded-md",
                isAnyFeatureActive() && !collapsed ? "bg-sidebar-accent/20" : ""
              )}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center px-3 py-2 rounded-md transition-colors",
                    isAnyFeatureActive()
                      ? "text-sidebar-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    collapsed && "justify-center"
                  )}
                >
                  <ExternalLink size={20} />
                  {!collapsed && (
                    <>
                      <span className="ml-3 flex-1">Features</span>
                      {featuresOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </>
                  )}
                </button>
              </CollapsibleTrigger>
              
              {!collapsed && (
                <CollapsibleContent className="pt-1 pb-2">
                  <div className="pl-2 space-y-1">
                    {featureItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center px-3 py-2 rounded-md transition-colors",
                          isActiveRoute(item.path)
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="ml-3">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              )}
            </Collapsible>
          </div>

          {/* When collapsed, show feature icons directly */}
          {collapsed && (
            <div className="space-y-1 pt-1">
              {featureItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md transition-colors justify-center",
                    isActiveRoute(item.path)
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                </Link>
              ))}
            </div>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors",
                isActiveRoute("/admin")
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center"
              )}
            >
              <span className="flex-shrink-0"><Shield size={20} /></span>
              {!collapsed && <span className="ml-3">Admin</span>}
            </Link>
          )}

          <Link
            to="/settings"
            className={cn(
              "flex items-center px-3 py-2 rounded-md transition-colors",
              isActiveRoute("/settings")
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center"
            )}
          >
            <span className="flex-shrink-0"><Settings size={20} /></span>
            {!collapsed && <span className="ml-3">Settings</span>}
          </Link>
        </nav>
        <div className="px-2 mt-6">
          <button
            onClick={() => logout()}
            className={cn(
              "flex w-full items-center px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors",
              collapsed && "justify-center"
            )}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
