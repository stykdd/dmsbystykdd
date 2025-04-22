
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  BellOff,
  Pencil,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { WishlistDomain } from '@/types/wishlist';

interface WishlistTableProps {
  wishlist: WishlistDomain[];
  selectedDomains: Set<string>;
  toggleSelectDomain: (id: string) => void;
  selectAllDomains: () => void;
  openEditDialog: (domain: WishlistDomain) => void;
  toggleNotification: (id: string) => void;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: 'available' | 'unavailable' | 'pending') => string;
}

const StatusIcon = ({ status }: { status: 'available' | 'unavailable' | 'pending' }) => {
  switch (status) {
    case 'available':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'unavailable':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    default:
      return null;
  }
};

const WishlistTable: React.FC<WishlistTableProps> = ({
  wishlist,
  selectedDomains,
  toggleSelectDomain,
  selectAllDomains,
  openEditDialog,
  toggleNotification,
  formatDate,
  getStatusColor,
}) => {
  if (wishlist.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center px-2 py-1">
        <div className="w-6 mr-2">
          <Checkbox
            checked={selectedDomains.size === wishlist.length && wishlist.length > 0}
            onCheckedChange={selectAllDomains}
            aria-label="Select all"
          />
        </div>
        <div className="grid grid-cols-6 gap-4 w-full text-sm font-medium text-muted-foreground">
          <div className="col-span-1">Domain</div>
          <div className="col-span-1">Category</div>
          <div className="col-span-1">Date Added</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Notifications</div>
          <div className="col-span-1">Edit</div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        {wishlist.map(item => (
          <div
            key={item.id}
            className="flex items-center px-2 py-3 rounded-md hover:bg-muted/50 transition-colors"
          >
            <div className="w-6 mr-2">
              <Checkbox
                checked={selectedDomains.has(item.id)}
                onCheckedChange={() => toggleSelectDomain(item.id)}
                aria-label={`Select ${item.domain}`}
              />
            </div>
            <div className="grid grid-cols-6 gap-2 w-full items-center">
              <div className="col-span-1 font-medium truncate">
                {item.domain}
                {item.note && (
                  <span className="ml-2 text-xs text-muted-foreground italic">{item.note}</span>
                )}
              </div>
              <div className="col-span-1">
                <Badge variant="outline">{item.category}</Badge>
              </div>
              <div className="col-span-1 text-sm text-muted-foreground">
                {formatDate(item.dateAdded)}
              </div>
              <div className="col-span-1">
                {item.availability ? (
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-1.5">
                      <StatusIcon status={item.availability.status} />
                      <span className={`text-sm capitalize ${getStatusColor(item.availability.status)}`}>
                        {item.availability.status}
                      </span>
                    </div>
                    {item.availability.status === 'unavailable' && item.availability.expiryDate && (
                      <span className="text-xs text-muted-foreground mt-1">
                        Expiry:&nbsp;
                        {new Date(item.availability.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-sm">Unknown</span>
                )}
              </div>
              <div className="col-span-1 flex justify-between items-center">
                <Switch
                  checked={item.notificationsEnabled}
                  onCheckedChange={() => toggleNotification(item.id)}
                  aria-label="Toggle notifications"
                />
                {item.notificationsEnabled ? (
                  <Bell className="h-4 w-4 text-blue-500" />
                ) : (
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="col-span-1 flex items-center justify-end gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  aria-label="Edit domain"
                  onClick={() => openEditDialog(item)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistTable;
