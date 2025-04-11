import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { DollarSign, ArrowUp, ArrowDown, Tag, Euro, CreditCard, Edit, Trash2, ArrowLeft, Globe, Filter, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSoldDomains, getDomains, deleteSoldDomain, updateSoldDomain } from '@/services/domainService';
import { Currency, Domain, SoldDomain } from '@/types/domain';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  MAD: 'د.م.'
};

const currencyIcons: Record<Currency, React.ReactNode> = {
  USD: <DollarSign className="h-4 w-4" />,
  EUR: <Euro className="h-4 w-4" />,
  MAD: <CreditCard className="h-4 w-4" />
};

const SalesPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [marketplaceFilter, setMarketplaceFilter] = useState('all');
  const [tldFilter, setTldFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{
    key: 'name' | 'saleDate' | 'salePrice' | 'roi';
    direction: 'asc' | 'desc';
  }>({
    key: 'saleDate',
    direction: 'desc'
  });

  const { data: soldDomains = [], isLoading: isSoldLoading, error: soldError } = useQuery({
    queryKey: ['soldDomains'],
    queryFn: getSoldDomains
  });

  const { data: allDomains = [], isLoading: isDomainsLoading } = useQuery({
    queryKey: ['domains'],
    queryFn: () => getDomains()
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSoldDomain(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['soldDomains'] });
      toast({
        title: "Domain deleted",
        description: "The domain has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete the domain.",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (domain: SoldDomain) => {
    toast({
      title: "Edit domain",
      description: `Editing domain ${domain.name}`,
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const filteredDomains = React.useMemo(() => {
    return soldDomains.filter(domain => {
      const matchesSearch = domain.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMarketplace = marketplaceFilter === 'all' || domain.marketplace === marketplaceFilter;
      const matchesTld = tldFilter === 'all' || domain.name.endsWith(tldFilter);
      return matchesSearch && matchesMarketplace && matchesTld;
    });
  }, [soldDomains, searchQuery, marketplaceFilter, tldFilter]);

  const sortedDomains = React.useMemo(() => {
    if (!filteredDomains.length) return [];

    const sortableItems = [...filteredDomains];

    sortableItems.sort((a, b) => {
      if (sortConfig.key === 'salePrice' || sortConfig.key === 'roi') {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      } else {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
    });

    return sortableItems;
  }, [filteredDomains, sortConfig]);

  const requestSort = (key: 'name' | 'saleDate' | 'salePrice' | 'roi') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const totalSoldPurchasePrice = React.useMemo(() => {
    return soldDomains.reduce((sum, domain) => sum + domain.purchasePrice, 0);
  }, [soldDomains]);

  const totalRevenue = React.useMemo(() => {
    return soldDomains.reduce((sum, domain) => sum + domain.salePrice, 0);
  }, [soldDomains]);

  const avgROI = React.useMemo(() => {
    if (soldDomains.length === 0) return 0;
    return soldDomains.reduce((sum, domain) => sum + domain.roi, 0) / soldDomains.length;
  }, [soldDomains]);

  const renderSortIcon = (columnName: 'name' | 'saleDate' | 'salePrice' | 'roi') => {
    if (sortConfig.key !== columnName) return null;

    return sortConfig.direction === 'asc' ? (
      <ArrowUp size={14} className="inline ml-1" />
    ) : (
      <ArrowDown size={14} className="inline ml-1" />
    );
  };

  const formatCurrency = (amount: number, currency?: Currency) => {
    const currencyCode = currency || 'USD';
    const symbol = currencySymbols[currencyCode];

    return `${symbol} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCurrencyIcon = (currency?: Currency) => {
    const currencyCode = currency || 'USD';
    return currencyIcons[currencyCode];
  };

  const isLoading = isSoldLoading || isDomainsLoading;

  const marketplaces = React.useMemo(() => {
    const allMarketplaces = new Set<string>();
    soldDomains.forEach(domain => {
      if (domain.marketplace) {
        allMarketplaces.add(domain.marketplace);
      }
    });
    return Array.from(allMarketplaces);
  }, [soldDomains]);

  const tlds = React.useMemo(() => {
    const allTlds = new Set<string>();
    soldDomains.forEach(domain => {
      const tld = domain.name.substring(domain.name.lastIndexOf('.'));
      allTlds.add(tld);
    });
    return Array.from(allTlds).sort();
  }, [soldDomains]);

  if (soldError) {
    return <div className="text-red-500 p-4">Error loading sold domains data.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Domains Sales</h1>
        <Button asChild variant="outline">
          <Link to="/domains">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Domains
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground">Track your domain selling performance and revenue</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchase</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCurrency(totalSoldPurchasePrice)}</div>
            <p className="text-xs text-muted-foreground">
              Investment across sold domains
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From {soldDomains.length} domains sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgROI.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              Return on investment across all sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Performing Sale</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {soldDomains.length > 0 ? (
              <>
                <div className="text-2xl font-bold">
                  {soldDomains.sort((a, b) => b.roi - a.roi)[0].name}
                </div>
                <p className="text-xs text-muted-foreground">
                  {soldDomains.sort((a, b) => b.roi - a.roi)[0].roi.toFixed(2)}% ROI
                </p>
              </>
            ) : (
              <div className="text-muted-foreground">No sales data</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative w-[300px]">
          <Input
            placeholder="Search domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        </div>

        <div className="w-full sm:w-auto">
          <Select
            value={marketplaceFilter}
            onValueChange={setMarketplaceFilter}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Marketplace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Marketplaces</SelectItem>
              {marketplaces.map((marketplace) => (
                <SelectItem key={marketplace} value={marketplace}>
                  {marketplace.charAt(0).toUpperCase() + marketplace.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-auto">
          <Select
            value={tldFilter}
            onValueChange={setTldFilter}
          >
            <SelectTrigger className="w-[180px]">
              <Globe className="mr-2 h-4 w-4" />
              <SelectValue placeholder="TLD" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All TLDs</SelectItem>
              {tlds.map(tld => (
                <SelectItem key={tld} value={tld}>
                  {tld}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
          <CardDescription>
            Complete list of all domains sold with price and performance data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  Domain Name {renderSortIcon('name')}
                </TableHead>
                <TableHead>
                  TLD
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('saleDate')}
                >
                  Sale Date {renderSortIcon('saleDate')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('salePrice')}
                >
                  Sale Price {renderSortIcon('salePrice')}
                </TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Marketplace</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('roi')}
                >
                  ROI {renderSortIcon('roi')}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6">Loading...</TableCell>
                </TableRow>
              ) : sortedDomains.length > 0 ? (
                sortedDomains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell className="font-medium">{domain.name}</TableCell>
                    <TableCell className="font-medium text-blue-600">
                      {domain.name.substring(domain.name.lastIndexOf('.'))}
                    </TableCell>
                    <TableCell>{formatDate(domain.saleDate)}</TableCell>
                    <TableCell>{formatCurrency(domain.salePrice, domain.currency)}</TableCell>
                    <TableCell>{formatCurrency(domain.purchasePrice, domain.currency)}</TableCell>
                    <TableCell>{domain.buyer || '-'}</TableCell>
                    <TableCell>{domain.marketplace ? domain.marketplace.charAt(0).toUpperCase() + domain.marketplace.slice(1) : '-'}</TableCell>
                    <TableCell>{domain.roi.toFixed(2)}%</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(domain)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(domain.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                    No domain sales data available yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPage;
