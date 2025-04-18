import React from 'react';
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
  Mail,
  Heart,
  BarChart3,
  FileSearch,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme } = useTheme();
  const [domainToolsOpen, setDomainToolsOpen] = React.useState(true);
  const [otherToolsOpen, setOtherToolsOpen] = React.useState(true);
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const mainNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/domains', label: 'Domains Portfolio', icon: <Globe size={20} /> },
    { path: '/expired', label: 'Expired Domains', icon: <AlertOctagon size={20} /> },
    { path: '/sales', label: 'Domains Sales', icon: <DollarSign size={20} /> },
    { path: '/features/wishlist', label: 'Wishlist', icon: <Heart size={20} /> },
    { path: '/features/stats', label: 'Statistics', icon: <BarChart3 size={20} /> },
  ];

  const domainToolsItems = [
    { path: '/check-availability', label: 'Check Domains', icon: <Search size={20} /> },
    { path: '/features/keyword-search', label: 'Keyword Search', icon: <Search size={20} /> },
    { path: '/features/email-verification', label: 'Email Verification', icon: <Mail size={20} /> },
    { path: '/features/domain-appraisal', label: 'Domain Appraisal', icon: <DollarSign size={20} /> },
    { path: '/features/website-scraper', label: 'Website Scraper', icon: <FileSearch size={20} /> },
  ];

  const otherToolsItems = [
    { path: '/todo', label: 'To-Do List', icon: <ListTodo size={20} /> },
    { path: '/password-generator', label: 'Password Generator', icon: <KeyRound size={20} /> },
  ];

  const isAdmin = user?.email === 'admin@dms.com';
  const logoColor = theme === 'dark' ? 'text-blue-300' : 'text-blue-600';

  const renderNavItem = (item: { path: string, label: string, icon: React.ReactNode }) => (
    <Link
      key={item.path}
      to={item.path}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActiveRoute(item.path)
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        collapsed && "justify-center"
      )}
    >
      <span className="flex-shrink-0">{item.icon}</span>
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );

  return (
    <div className={cn(
      "h-full flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-16" : "w-[240px]"
    )}>
      <div className="p-4 h-[65px] flex items-center justify-between border-b border-sidebar-border shrink-0">
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

      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {mainNavItems.map(renderNavItem)}

          <div className="pt-4">
            <button
              onClick={() => setDomainToolsOpen(!domainToolsOpen)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center"
              )}
            >
              <Globe size={20} />
              {!collapsed && (
                <>
                  <span className="flex-1">Domain Tools</span>
                  {domainToolsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </>
              )}
            </button>
            
            {domainToolsOpen && (
              <div className="mt-1 ml-2">
                {domainToolsItems.map(renderNavItem)}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setOtherToolsOpen(!otherToolsOpen)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center"
              )}
            >
              <KeyRound size={20} />
              {!collapsed && (
                <>
                  <span className="flex-1">Other Tools</span>
                  {otherToolsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </>
              )}
            </button>
            
            {otherToolsOpen && (
              <div className="mt-1 ml-2">
                {otherToolsItems.map(renderNavItem)}
              </div>
            )}
          </div>

          {isAdmin && renderNavItem({
            path: "/admin",
            label: "Admin",
            icon: <Shield size={20} />
          })}

          {renderNavItem({
            path: "/settings",
            label: "Settings",
            icon: <Settings size={20} />
          })}
        </nav>
      </div>

      <div className="p-2 border-t border-sidebar-border shrink-0">
        <button
          onClick={() => logout()}
          className={cn(
            "flex w-full items-center gap-3 px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
