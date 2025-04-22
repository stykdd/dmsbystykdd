
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddDomainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error: string | null;
  newDomain: string;
  setNewDomain: (value: string) => void;
  selectedCategory: string;
  note: string;
  setNote: (value: string) => void;
  handleAddDomain: () => void;
  categories: string[];
  onCategoryChange: (value: string) => void;
  onAddCategory: () => void;
}

const AddDomainDialog: React.FC<AddDomainDialogProps> = ({
  open,
  onOpenChange,
  error,
  newDomain,
  setNewDomain,
  selectedCategory,
  note,
  setNote,
  handleAddDomain,
  categories,
  onCategoryChange,
  onAddCategory,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={v => {
                if (v === "__add_new__") {
                  onAddCategory();
                } else {
                  onCategoryChange(v);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background">
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem key="__add_new__" value="__add_new__" className="text-primary">
                    <Plus className="inline w-4 h-4 mr-1" /> Add Category
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddDomain}>
            Add to Wishlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDomainDialog;
