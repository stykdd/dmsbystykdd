import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  RefreshCw, 
  ArrowUpDown,
  ArrowLeft,
  Globe,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from '@/hooks/use-toast';
import { getDomains, deleteDomain } from '../services/domainService';
import { Domain } from '../types/domain';
import { formatDate } from '@/lib/date-utils';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';

const ExpiredPage: React.FC = () => {
  const { toast } = useToast();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Domain | 'tld'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [tldFilter, setTldFilter] = useState('all');

  const getTldFromDomain = (domain: string) => {
    const parts = domain.split('.');
    return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
  };

  const getUniqueTlds = () => {
    const tlds = new Set(domains.map(domain => getTldFromDomain(domain.name)));
    return Array.from(tlds).sort();
  };

  const loadExpiredDomains = useCallback(() => {
    setIsLoading(true);

    const allDomains = getDomains({
      search: searchQuery,
      sortBy: sortBy === 'tld' ? 'name' : sortBy,
      sortOrder,
      excludeTrash: true
    });

    // Filter to only expired domains
    let expiredDomains = allDomains.filter(domain => domain.status === 'expired');

    // Apply TLD filter
    if (tldFilter !== 'all') {
      expiredDomains = expiredDomains.filter(domain => 
        getTldFromDomain(domain.name) === tldFilter
      );
    }

    // Sort by TLD if selected
    if (sortBy === 'tld') {
      expiredDomains.sort((a, b) => {
        const tldA = getTldFromDomain(a.name);
        const tldB = getTldFromDomain(b.name);
        return sortOrder === 'asc' 
          ? tldA.localeCompare(tldB)
          : tldB.localeCompare(tldA);
      });
    }

    // Sort by days overdue
    if (sortBy === 'daysUntilExpiration') {
      expiredDomains.sort((a, b) => {
        return sortOrder === 'asc'
          ? Math.abs(a.daysUntilExpiration) - Math.abs(b.daysUntilExpiration)
          : Math.abs(b.daysUntilExpiration) - Math.abs(a.daysUntilExpiration);
      });
    }

    setDomains(expiredDomains);
    setIsLoading(false);
  }, [searchQuery, sortBy, sortOrder, tldFilter]);

  useEffect(() => {
    loadExpiredDomains();
  }, [loadExpiredDomains]);

  const handleSort = (column: keyof Domain | 'tld') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleDelete = (id: string, domainName: string) => {
    deleteDomain(id);
    toast({
      title: "Domain Moved to Trash",
      description: `${domainName} has been moved to trash.`,
    });
    loadExpiredDomains();
  };

  const renderSortableHeader = (column: keyof Domain | 'tld', label: string) => (
    <SortableTableHeader
      isActive={sortBy === column}
      direction={sortOrder}
      onClick={() => handleSort(column)}
    >
      {label}
    </SortableTableHeader>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Expired Domains</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={loadExpiredDomains}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/domains">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Domains
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search expired domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={tldFilter} onValueChange={setTldFilter}>
          <SelectTrigger className="w-[180px]">
            <Globe className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter TLD" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All TLDs</SelectItem>
            {getUniqueTlds().map(tld => (
              <SelectItem key={tld} value={tld}>{tld}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as keyof Domain | 'tld')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Domain Name</SelectItem>
            <SelectItem value="tld">TLD</SelectItem>
            <SelectItem value="expirationDate">Expiration Date</SelectItem>
            <SelectItem value="daysUntilExpiration">Days Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Domains Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {renderSortableHeader('name', 'Domain Name')}
              {renderSortableHeader('tld', 'TLD')}
              {renderSortableHeader('expirationDate', 'Expiration Date')}
              {renderSortableHeader('daysUntilExpiration', 'Days Overdue')}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : domains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No expired domains found
                </TableCell>
              </TableRow>
            ) : (
              domains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell className="font-medium">
                    {domain.name}
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">{getTldFromDomain(domain.name)}</TableCell>
                  <TableCell className="text-red-500">{formatDate(domain.expirationDate)}</TableCell>
                  <TableCell className="text-red-500">
                    {Math.abs(domain.daysUntilExpiration)} days
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(domain.id, domain.name)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExpiredPage;
