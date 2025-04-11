
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Star, Trash2, StarOff, History } from 'lucide-react';
import { getFavorites, toggleFavorite, removeFromHistory, DomainCheckHistoryItem } from '../services/historyService';
import { formatDateWithTime } from '@/lib/date-utils';

const FavoritesPage: React.FC = () => {
  const { toast } = useToast();
  const [favoriteItems, setFavoriteItems] = useState<DomainCheckHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load favorites on page load
  useEffect(() => {
    loadFavorites();
  }, []);
  
  const loadFavorites = () => {
    const favorites = getFavorites();
    setFavoriteItems(favorites);
  };
  
  const handleToggleFavorite = (id: string) => {
    try {
      toggleFavorite(id);
      loadFavorites();
      toast({
        title: "Success",
        description: "Removed from favorites.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status.",
        variant: "destructive",
      });
    }
  };
  
  const handleRemoveItem = (id: string) => {
    try {
      removeFromHistory(id);
      loadFavorites();
      toast({
        title: "Success",
        description: "Item removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item.",
        variant: "destructive",
      });
    }
  };
  
  // Filter favorites based on search term
  const filteredItems = favoriteItems.filter(item => 
    item.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Favorite Domains</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/history">
              <History className="mr-2 h-4 w-4" />
              History
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/check-availability">
              Check Domains
            </a>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Favorite Domains</CardTitle>
          <CardDescription>
            Manage your favorite domain searches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex">
              <Input
                placeholder="Search favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            {filteredItems.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domain</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Checked At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.domain}</TableCell>
                        <TableCell>
                          {item.error ? (
                            <span className="text-yellow-600 flex items-center">
                              {item.error}
                            </span>
                          ) : item.available ? (
                            <span className="text-green-600 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Available
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center">
                              <XCircle className="h-4 w-4 mr-1" />
                              Registered
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDateWithTime(item.checkedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleToggleFavorite(item.id)}
                              title="Remove from favorites"
                            >
                              <StarOff className="h-4 w-4 text-yellow-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveItem(item.id)}
                              title="Remove from history"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {favoriteItems.length === 0 ? (
                  "No favorite domains yet. Star domains in your history to add them here."
                ) : (
                  "No matching domains found in your favorites."
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FavoritesPage;
