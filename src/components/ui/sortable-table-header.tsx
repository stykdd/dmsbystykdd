
import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { TableHead } from './table';
import { cn } from '@/lib/utils';

interface SortableTableHeaderProps extends React.HTMLAttributes<HTMLTableCellElement> {
  isActive: boolean;
  direction?: 'asc' | 'desc';
  className?: string;
}

export const SortableTableHeader = React.forwardRef<HTMLTableCellElement, SortableTableHeaderProps>(
  ({ children, isActive, direction, className, ...props }, ref) => {
    return (
      <TableHead
        ref={ref}
        className={cn("cursor-pointer select-none", className)}
        {...props}
      >
        <div className="flex items-center gap-1">
          {children}
          {isActive ? (
            direction === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
        </div>
      </TableHead>
    );
  }
);

SortableTableHeader.displayName = "SortableTableHeader";
