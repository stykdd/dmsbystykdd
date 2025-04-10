
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  KeyRound
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
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home size={20} /> },
    { path: '/domains', label: 'Domains', icon: <Globe size={20} /> },
    { path: '/expired', label: 'Expired Domains', icon: <AlertOctagon size={20} /> },
    { path: '/check-availability', label: 'Check Domains', icon: <Search size={20} /> },
    { path: '/sales', label: 'Domains Sales', icon: <DollarSign size={20} /> },
    { path: '/todo', label: 'To-Do List', icon: <ListTodo size={20} /> },
    { path: '/password-generator', label: 'Password Generator', icon: <KeyRound size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  // Show admin link for admin users
  const isAdmin = user?.email === 'admin@dms.com';

  return (
    <div className={cn(
      "h-full flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
      collapsed ? "w-16" : "w-[240px]"
    )}>
      <div className="p-4 h-[65px] flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-xl font-bold text-blue-600">
            DMS by stykdd
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
      <div className="flex-1 py-6 flex flex-col justify-between">
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
