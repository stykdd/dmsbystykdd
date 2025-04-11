
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
import { CheckCircle, XCircle, Star, Trash2, StarOff } from 'lucide-react';
import { getHistory, toggleFavorite, clearHistory, removeFromHistory, DomainCheckHistoryItem } from '../services/historyService';
import { formatDateWithTime } from '@/lib/date-utils';

const HistoryPage: React.FC = () => {
  const { toast } = useToast();
  const [historyItems, setHistoryItems] = useState<DomainCheckHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load history on page load
  useEffect(() => {
    loadHistory();
  }, []);
  
  const loadHistory = () => {
    const history = getHistory();
    setHistoryItems(history);
  };
  
  const handleToggleFavorite = (id: string) => {
    try {
      toggleFavorite(id);
      loadHistory();
      toast({
        title: "Success",
        description: "Favorite status updated.",
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
      loadHistory();
      toast({
        title: "Success",
        description: "Item removed from history.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from history.",
        variant: "destructive",
      });
    }
  };
  
  const handleClearHistory = () => {
    try {
      clearHistory();
      loadHistory();
      toast({
        title: "Success",
        description: "History cleared successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear history.",
        variant: "destructive",
      });
    }
  };
  
  // Filter history items based on search term
  const filteredItems = historyItems.filter(item => 
    item.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Domain Check History</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/favorites">
              <Star className="mr-2 h-4 w-4" />
              Favorites
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Search History</CardTitle>
              <CardDescription>
                View and manage your domain search history
              </CardDescription>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleClearHistory}
              disabled={historyItems.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex">
              <Input
                placeholder="Search domains..."
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
                              title={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                              {item.isFavorite ? (
                                <StarOff className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <Star className="h-4 w-4" />
                              )}
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
                {historyItems.length === 0 ? (
                  "No domain check history found. Try checking some domains first."
                ) : (
                  "No matching domains found in your history."
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;
