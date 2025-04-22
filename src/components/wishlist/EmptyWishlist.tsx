
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Plus } from "lucide-react";

interface EmptyWishlistProps {
  onAddDomain: () => void;
}

const EmptyWishlist: React.FC<EmptyWishlistProps> = ({ onAddDomain }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Heart className="h-12 w-12 text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium">Your wishlist is empty</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">
        Add domains to be notified when they become available
      </p>
      <Button onClick={onAddDomain}>
        <Plus className="mr-2 h-4 w-4" />
        Add Your First Domain
      </Button>
    </div>
  );
};

export default EmptyWishlist;
