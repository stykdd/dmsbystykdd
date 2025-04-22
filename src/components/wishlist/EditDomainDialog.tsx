
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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

interface EditDomainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error: string | null;
  domain: string;
  setDomain: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
  handleSave: () => void;
  categories: string[];
  onAddCategory: () => void;
}

const EditDomainDialog: React.FC<EditDomainDialogProps> = ({
  open,
  onOpenChange,
  error,
  domain,
  setDomain,
  category,
  setCategory,
  note,
  setNote,
  handleSave,
  categories,
  onAddCategory,
}) => {
  return (
    <Dialog open={open} onOpenChange={open => { 
      onOpenChange(open); 
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Domain</DialogTitle>
          <DialogDescription>Edit the domain name, category, or note.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="edit-domain">Domain Name</Label>
            <Input
              id="edit-domain"
              placeholder="example.com"
              value={domain}
              onChange={e => setDomain(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <div className="flex gap-2">
              <Select value={category} onValueChange={v => {
                if (v === "__add_new__") onAddCategory();
                else setCategory(v);
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
            <Label htmlFor="edit-note">Note (Optional)</Label>
            <Textarea
              id="edit-note"
              placeholder="Add a note about this domain"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDomainDialog;
