
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  error: string | null;
  categoryName: string;
  setCategoryName: (value: string) => void;
  categoryColor: string;
  setCategoryColor: (value: string) => void;
  handleAddCategory: () => void;
}

const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  open,
  onOpenChange,
  error,
  categoryName,
  setCategoryName,
  categoryColor,
  setCategoryColor,
  handleAddCategory,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Label htmlFor="new-cat-name">Name</Label>
          <Input
            id="new-cat-name"
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
            placeholder="Category name"
          />
          <Label htmlFor="new-cat-color">Color</Label>
          <Input
            id="new-cat-color"
            type="color"
            className="w-10 h-10 p-0 border-none bg-transparent"
            value={categoryColor}
            onChange={e => setCategoryColor(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleAddCategory}>Add Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryDialog;
