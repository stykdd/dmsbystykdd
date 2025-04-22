
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { WishlistDomain } from '@/types/wishlist';

interface StatisticsCardProps {
  wishlist: WishlistDomain[];
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ wishlist }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Total domains</span>
          <Badge variant="outline" className="font-mono">{wishlist.length}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Available domains</span>
          <Badge
            variant="outline"
            className="font-mono bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          >
            {wishlist.filter(item => item.availability?.status === 'available').length}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Unavailable domains</span>
          <Badge
            variant="outline"
            className="font-mono bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          >
            {wishlist.filter(item => item.availability?.status === 'unavailable').length}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Pending check</span>
          <Badge
            variant="outline"
            className="font-mono bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
          >
            {wishlist.filter(item => item.availability?.status === 'pending').length}
          </Badge>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="text-sm">Notifications enabled</span>
          <Badge variant="outline" className="font-mono">
            {wishlist.filter(item => item.notificationsEnabled).length}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
