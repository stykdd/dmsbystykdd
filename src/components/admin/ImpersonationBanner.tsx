
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ImpersonationBanner: React.FC = () => {
  const { user, disconnectFromUserAccount } = useAuth();

  if (!user?.isImpersonating) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white py-2 px-4 z-50 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-2">
        <ShieldAlert className="h-5 w-5" />
        <span className="font-medium">
          <span className="hidden sm:inline">You are currently impersonating </span>
          <UserRound className="h-4 w-4 inline sm:hidden mr-1" />
          <span className="font-bold">{user.username} ({user.email})</span>
        </span>
      </div>
      <Button
        variant="secondary"
        size="sm"
        onClick={disconnectFromUserAccount}
        className="text-amber-800 hover:text-amber-900 bg-white hover:bg-gray-100"
      >
        End impersonation
      </Button>
    </div>
  );
};

export default ImpersonationBanner;
