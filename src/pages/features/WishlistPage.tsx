import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Heart, 
  Plus, 
  Trash2, 
  Search, 
  Bell, 
  BellOff, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ArrowUpDown 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample domain categories for filtering
const DOMAIN_CATEGORIES = ["Technology", "Finance", "Health", "E-commerce", "Education", "Entertainment"];

// Interface for wishlist domain items
interface WishlistDomain {
  id: string;
  domain: string;
  dateAdded: string;
  notificationsEnabled: boolean;
  category: string;
  note?: string;
  availability?: {
    status: 'available' | 'unavailable' | 'pending';
    lastChecked: string;
  };
}

const WishlistPage: React.FC = () => {
  const [newDomain, setNewDomain] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<WishlistDomain[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);

  // Load initial demo data
  useEffect(() => {
    const demoWishlist: WishlistDomain[] = [
      {
        id: "1",
        domain: "techinnovation.com",
        dateAdded: "2023-11-15T14:22:10Z",
        notificationsEnabled: true,
        category: "Technology",
        note: "Perfect for a tech startup",
        availability: {
          status: 'unavailable',
          lastChecked: "2023-12-01T09:45:20Z"
        }
      },
      {
        id: "2",
        domain: "healthrevolution.org",
        dateAdded: "2023-10-28T08:15:32Z",
        notificationsEnabled: true,
        category: "Health",
        availability: {
          status: 'unavailable',
          lastChecked: "2023-12-01T09:45:20Z"
        }
      },
      {
        id: "3",
        domain: "investsmart.finance",
        dateAdded: "2023-12-02T11:34:05Z",
        notificationsEnabled: false,
        category: "Finance",
        note: "Great domain for financial services",
        availability: {
          status: 'available',
          lastChecked: "2023-12-05T16:20:10Z"
        }
      },
      {
        id: "4",
        domain: "educonnect.online",
        dateAdded: "2023-11-10T15:48:22Z",
        notificationsEnabled: true,
        category: "Education",
        availability: {
          status: 'pending',
          lastChecked: "2023-12-04T21:15:33Z"
        }
      }
    ];
    
    setWishlist(demoWishlist);
  }, []);

  const handleAddDomain = () => {
    if (!newDomain.trim()) {
      setError("Please enter a domain name");
      return;
    }

    // Simple domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(newDomain)) {
      setError("Please enter a valid domain name (e.g., example.com)");
      return;
    }

    // Check if domain already exists in wishlist
    if (wishlist.some(item => item.domain === newDomain)) {
      setError("This domain is already in your wishlist");
      return;
    }

    setError(null);

    // Add new domain to wishlist
    const newItem: WishlistDomain = {
      id: Date.now().toString(),
      domain: newDomain,
      dateAdded: new Date().toISOString(),
      notificationsEnabled: true,
      category: selectedCategory || "Uncategorized",
      note: note || undefined,
      availability: {
        status: 'pending',
        lastChecked: new Date().toISOString()
      }
    };

    setWishlist(prev => [newItem, ...prev]);
    
    // Reset form
    setNewDomain("");
    setSelectedCategory("");
    setNote("");
    setIsAddDialogOpen(false);
  };

  const toggleNotification = (id: string) => {
    setWishlist(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, notificationsEnabled: !item.notificationsEnabled } 
          : item
      )
    );
  };

  const handleDeleteSelected = () => {
    if (selectedDomains.size === 0) return;
    
    setWishlist(prev => 
      prev.filter(item => !selectedDomains.has(item.id))
    );
    
    setSelectedDomains(new Set());
  };

  const toggleSelectDomain = (id: string) => {
    const newSelected = new Set(selectedDomains);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDomains(newSelected);
  };

  const selectAllDomains = () => {
    if (selectedDomains.size === filteredWishlist.length) {
      // If all are selected, deselect all
      setSelectedDomains(new Set());
    } else {
      // Otherwise, select all
      setSelectedDomains(new Set(filteredWishlist.map(item => item.id)));
    }
  };

  // Filter wishlist based on category
  const filteredWishlist = wishlist.filter(item => 
    filterCategory === "all" || item.category === filterCategory
  );

  // Sort wishlist based on date
  const sortedWishlist = [...filteredWishlist].sort((a, b) => {
    const dateA = new Date(a.dateAdded).getTime();
    const dateB = new Date(b.dateAdded).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Status badge color
  const getStatusColor = (status: 'available' | 'unavailable' | 'pending') => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'unavailable': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return '';
    }
  };

  // Status icon
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Domain Wishlist</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Wishlist</DialogTitle>
              <DialogDescription>
                Add a domain to your wishlist to be notified when it becomes available.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="domain">Domain Name</Label>
                <Input
                  id="domain"
                  placeholder="example.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOMAIN_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Input
                  id="note"
                  placeholder="Add a note about this domain"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDomain}>
                Add to Wishlist
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Your Domain Wishlist</CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="h-8"
                  >
                    <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                    {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                  </Button>
                  
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {DOMAIN_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription>
                {sortedWishlist.length} {sortedWishlist.length === 1 ? 'domain' : 'domains'} in your wishlist
              </CardDescription>
            </CardHeader>
            
            {selectedDomains.size > 0 && (
              <div className="px-6 py-2 bg-muted flex items-center justify-between">
                <span className="text-sm">
                  {selectedDomains.size} {selectedDomains.size === 1 ? 'domain' : 'domains'} selected
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete Selected
                </Button>
              </div>
            )}
            
            <CardContent className="pt-4">
              {sortedWishlist.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center px-2 py-1">
                    <div className="w-6 mr-2">
                      <Checkbox 
                        checked={selectedDomains.size === filteredWishlist.length && filteredWishlist.length > 0} 
                        onCheckedChange={selectAllDomains}
                        aria-label="Select all"
                      />
                    </div>
                    <div className="grid grid-cols-12 gap-2 w-full text-sm font-medium text-muted-foreground">
                      <div className="col-span-4">Domain</div>
                      <div className="col-span-2">Category</div>
                      <div className="col-span-2">Date Added</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2">Notifications</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    {sortedWishlist.map(item => (
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
                        <div className="grid grid-cols-12 gap-2 w-full items-center">
                          <div className="col-span-4 font-medium truncate">{item.domain}</div>
                          <div className="col-span-2">
                            <Badge variant="outline">{item.category}</Badge>
                          </div>
                          <div className="col-span-2 text-sm text-muted-foreground">
                            {formatDate(item.dateAdded)}
                          </div>
                          <div className="col-span-2">
                            {item.availability ? (
                              <div className="flex items-center space-x-1.5">
                                <StatusIcon status={item.availability.status} />
                                <span className="text-sm capitalize">
                                  {item.availability.status}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm">Unknown</span>
                            )}
                          </div>
                          <div className="col-span-2 flex justify-between items-center">
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">Your wishlist is empty</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Add domains to be notified when they become available
                  </p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Domain
                  </Button>
                </div>
              )}
            </CardContent>
            
            {sortedWishlist.length > 0 && (
              <CardFooter className="pt-0 flex justify-between">
                <Button variant="outline" size="sm">
                  <Search className="mr-2 h-4 w-4" />
                  Check Availability
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  Last checked: {new Date().toLocaleDateString()}
                </p>
              </CardFooter>
            )}
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notify">Email Notifications</Label>
                <Switch id="email-notify" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="browser-notify">Browser Notifications</Label>
                <Switch id="browser-notify" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="check-frequency">Check Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Daily" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
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
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
