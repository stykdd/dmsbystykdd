
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  RefreshCw, 
  MoreHorizontal, 
  ArrowUpDown,
  ArrowLeft,
  ArrowUpCircle,
  Globe
} from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { 
  getDomains, 
  restoreDomain, 
  permanentlyDeleteDomain 
} from '../services/domainService';
import { Domain } from '../types/domain';
import { formatDate } from '@/lib/date-utils';

const TrashPage: React.FC = () => {
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

  const loadTrashDomains = () => {
    setIsLoading(true);
    const trashDomains = getDomains({
      status: 'trash',
      search: searchQuery,
      sortBy: sortBy === 'tld' ? 'name' : sortBy,
      sortOrder
    });

    // Apply TLD filter if needed
    let filteredDomains = trashDomains;
    if (tldFilter !== 'all') {
      filteredDomains = trashDomains.filter(domain => 
        getTldFromDomain(domain.name) === tldFilter
      );
    }

    // Sort by TLD if selected
    if (sortBy === 'tld') {
      filteredDomains.sort((a, b) => {
        const tldA = getTldFromDomain(a.name);
        const tldB = getTldFromDomain(b.name);
        return sortOrder === 'asc' 
          ? tldA.localeCompare(tldB)
          : tldB.localeCompare(tldA);
      });
    }

    setDomains(filteredDomains);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTrashDomains();
  }, [searchQuery, sortBy, sortOrder, tldFilter]);

  const handleSort = (column: keyof Domain | 'tld') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleRestore = (id: string, domainName: string) => {
    restoreDomain(id);
    toast({
      title: "Domain Restored",
      description: `${domainName} has been restored.`,
    });
    loadTrashDomains();
  };

  const handlePermanentDelete = (id: string, domainName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete ${domainName}? This action cannot be undone.`)) {
      permanentlyDeleteDomain(id);
      toast({
        title: "Domain Deleted",
        description: `${domainName} has been permanently deleted.`,
      });
      loadTrashDomains();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trash</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={loadTrashDomains}
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

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Search domains in trash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            <SelectItem value="updatedAt">Deleted On</SelectItem>
            <SelectItem value="expirationDate">Expiration Date</SelectItem>
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
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Domain Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('tld')}
              >
                <div className="flex items-center">
                  TLD
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Deleted On</TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('expirationDate')}
              >
                <div className="flex items-center">
                  Expiration Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
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
                  Trash is empty
                </TableCell>
              </TableRow>
            ) : (
              domains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell className="font-medium">{domain.name}</TableCell>
                  <TableCell className="font-medium text-blue-600">{getTldFromDomain(domain.name)}</TableCell>
                  <TableCell>{formatDate(domain.updatedAt)}</TableCell>
                  <TableCell>{formatDate(domain.expirationDate)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleRestore(domain.id, domain.name)}>
                        <ArrowUpCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handlePermanentDelete(domain.id, domain.name)} className="text-red-600">
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

export default TrashPage;
