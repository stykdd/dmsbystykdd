
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Plus,
  Trash2,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCategories, addCategory } from "@/services/categoryService";

// Import custom components
import WishlistTable from '@/components/wishlist/WishlistTable';
import EmptyWishlist from '@/components/wishlist/EmptyWishlist';
import AddDomainDialog from '@/components/wishlist/AddDomainDialog';
import EditDomainDialog from '@/components/wishlist/EditDomainDialog';
import AddCategoryDialog from '@/components/wishlist/AddCategoryDialog';
import StatisticsCard from '@/components/wishlist/StatisticsCard';
import NotificationsCard from '@/components/wishlist/NotificationsCard';

// Import custom hook
import { useWishlistDomains } from '@/hooks/useWishlistDomains';

const WishlistPage: React.FC = () => {
  // States for domain management
  const [newDomain, setNewDomain] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  // States for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editTarget, setEditTarget] = useState<string | null>(null);
  const [editDomain, setEditDomain] = useState<string>("");
  const [editCategory, setEditCategory] = useState<string>("");
  const [editNote, setEditNote] = useState<string>("");
  
  // Category management
  const [categories, setCategories] = useState<{ id: string; name: string; color: string; }[]>([]);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#8B5CF6");
  const [categoryAddError, setCategoryAddError] = useState<string | null>(null);
  
  // Load categories
  useEffect(() => {
    setCategories(getCategories());
  }, [isAddCategoryDialogOpen]);
  
  const domainCategories = categories.map(c => c.name);
  
  // Get wishlist functionality from custom hook
  const {
    sortedWishlist,
    filteredWishlist,
    isChecking,
    selectedDomains,
    filterCategory,
    sortOrder,
    setFilterCategory,
    setSortOrder,
    addDomain,
    updateDomain,
    toggleNotification,
    deleteSelected,
    toggleSelectDomain,
    selectAllDomains,
    handleManualCheck,
    wishlist
  } = useWishlistDomains();

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

  // --- Adding a new domain ---
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
    addDomain(newDomain, selectedCategory, note);
    setNewDomain("");
    setSelectedCategory("");
    setNote("");
    setIsAddDialogOpen(false);
  };

  // --- Editing domain ---
  const openEditDialog = (domainObj: { id: string; domain: string; category: string; note?: string }) => {
    setEditTarget(domainObj.id);
    setEditDomain(domainObj.domain);
    setEditCategory(domainObj.category);
    setEditNote(domainObj.note || "");
    setError(null);
    setIsEditDialogOpen(true);
  };

  const handleEditDomain = () => {
    if (!editDomain.trim()) {
      setError("Please enter a domain name");
      return;
    }
    
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(editDomain)) {
      setError("Please enter a valid domain name (e.g., example.com)");
      return;
    }
    
    if (wishlist.some(item => item.domain === editDomain && item.id !== editTarget)) {
      setError("This domain is already in your wishlist");
      return;
    }
    
    setError(null);
    if (editTarget) {
      updateDomain(editTarget, editDomain, editCategory, editNote);
    }
    setIsEditDialogOpen(false);
    setEditTarget(null);
  };

  // --- Adding a new category ---
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      setCategoryAddError("Category name cannot be empty");
      return;
    }
    
    if (categories.some(({ name }) => name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      setCategoryAddError("Category already exists");
      return;
    }
    
    const newCat = addCategory({
      name: newCategoryName,
      color: newCategoryColor,
      description: "",
    });
    
    setCategories(getCategories());
    setNewCategoryName("");
    setIsAddCategoryDialogOpen(false);
    setCategoryAddError(null);
    
    // Set the new category in dialogs
    setSelectedCategory(newCat.name);
    setEditCategory(newCat.name);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Domain Wishlist</h1>
        <AddDomainDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          error={error}
          newDomain={newDomain}
          setNewDomain={setNewDomain}
          selectedCategory={selectedCategory}
          note={note}
          setNote={setNote}
          handleAddDomain={handleAddDomain}
          categories={domainCategories}
          onCategoryChange={setSelectedCategory}
          onAddCategory={() => setIsAddCategoryDialogOpen(true)}
        />
        <Dialog>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Domain
          </Button>
        </Dialog>
      </div>

      <div className="space-y-6">
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
                    {domainCategories.map(category => (
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
                onClick={deleteSelected}
                className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete Selected
              </Button>
            </div>
          )}
          
          <CardContent className="pt-4">
            {sortedWishlist.length > 0 ? (
              <WishlistTable 
                wishlist={sortedWishlist}
                selectedDomains={selectedDomains}
                toggleSelectDomain={toggleSelectDomain}
                selectAllDomains={selectAllDomains}
                openEditDialog={openEditDialog}
                toggleNotification={toggleNotification}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
              />
            ) : (
              <EmptyWishlist onAddDomain={() => setIsAddDialogOpen(true)} />
            )}
          </CardContent>
          
          {sortedWishlist.length > 0 && (
            <CardFooter className="pt-0 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualCheck}
                disabled={isChecking}
                className="flex items-center gap-2"
              >
                <Search className="mr-2 h-4 w-4" />
                {isChecking ? "Checking..." : "Check Availability"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
                Last checked: {wishlist[0]?.availability?.lastChecked ? formatDate(wishlist[0].availability.lastChecked) : new Date().toLocaleDateString()}
              </p>
            </CardFooter>
          )}
        </Card>

        <EditDomainDialog 
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          error={error}
          domain={editDomain}
          setDomain={setEditDomain}
          category={editCategory}
          setCategory={setEditCategory}
          note={editNote}
          setNote={setEditNote}
          handleSave={handleEditDomain}
          categories={domainCategories}
          onAddCategory={() => setIsAddCategoryDialogOpen(true)}
        />

        <AddCategoryDialog 
          open={isAddCategoryDialogOpen}
          onOpenChange={setIsAddCategoryDialogOpen}
          error={categoryAddError}
          categoryName={newCategoryName}
          setCategoryName={setNewCategoryName}
          categoryColor={newCategoryColor}
          setCategoryColor={setNewCategoryColor}
          handleAddCategory={handleAddCategory}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NotificationsCard />
          <StatisticsCard wishlist={wishlist} />
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
