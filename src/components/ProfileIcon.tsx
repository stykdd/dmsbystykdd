
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserIcon, 
  UserRound, 
  UserCog, 
  UserCheck,
  Crown,
  Cat,
  Dog,
  Bird,
  Ghost,
  Skull,
  Smile,
  Frown,
  Meh
} from 'lucide-react';

const ProfileIcon: React.FC = () => {
  const { user } = useAuth();
  const avatarName = user?.avatar || 'Default User';

  // Map avatar names to their respective icons
  const getAvatarIcon = () => {
    switch (avatarName) {
      case 'Round User':
        return <UserRound className="h-4 w-4" />;
      case 'Tech User':
        return <UserCog className="h-4 w-4" />;
      case 'Verified User':
        return <UserCheck className="h-4 w-4" />;
      case 'Royal':
        return <Crown className="h-4 w-4" />;
      case 'Cat':
        return <Cat className="h-4 w-4" />;
      case 'Dog':
        return <Dog className="h-4 w-4" />;
      case 'Bird':
        return <Bird className="h-4 w-4" />;
      case 'Ghost':
        return <Ghost className="h-4 w-4" />;
      case 'Skull':
        return <Skull className="h-4 w-4" />;
      case 'Happy':
        return <Smile className="h-4 w-4" />;
      case 'Sad':
        return <Frown className="h-4 w-4" />;
      case 'Neutral':
        return <Meh className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  return getAvatarIcon();
};

export default ProfileIcon;
