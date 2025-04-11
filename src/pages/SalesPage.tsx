import React, { useState } from 'react';
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
import { DollarSign, ArrowUp, ArrowDown, Tag, Euro, CreditCard, Edit, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getSoldDomains, getDomains } from '@/services/domainService';
import { Currency, Domain } from '@/types/domain';
import { Button } from "@/components/ui/button"; // Added import


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

  const sortedDomains = React.useMemo(() => {
    if (!soldDomains) return [];

    const sortableItems = [...soldDomains];

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
  }, [soldDomains, sortConfig]);

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

  const totalAllPurchasePrice = React.useMemo(() => {
    const activeDomainsPrices = allDomains.reduce((sum, domain) => sum + (domain.price || 0), 0);
    return activeDomainsPrices + totalSoldPurchasePrice;
  }, [allDomains, totalSoldPurchasePrice]);

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

  const handleEdit = (domain: Domain) => {
    // Implement your edit logic here
    console.log("Editing domain:", domain);
  };

  const handleDelete = (id: string) => {
    // Implement your delete logic here
    console.log("Deleting domain with ID:", id);
  };


  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (soldError) {
    return <div className="text-red-500 p-4">Error loading sold domains data.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Domain Sales</h1>
      <p className="text-muted-foreground">Track your domain selling performance and revenue</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchase (All)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAllPurchasePrice)}</div>
            <p className="text-xs text-muted-foreground">
              Investment across all domains
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
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
                <TableHead>Marketplace</TableHead> {/* Added Marketplace column */}
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('roi')}
                >
                  ROI {renderSortIcon('roi')}
                </TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Actions</TableHead> {/* Added Actions column */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDomains.length > 0 ? (
                sortedDomains.map((domain) => (
                  <TableRow key={domain.id}>
                    <TableCell className="font-medium">{domain.name}</TableCell>
                    <TableCell>{formatCurrency(domain.salePrice, domain.currency)}</TableCell>
                    <TableCell>{formatCurrency(domain.purchasePrice, domain.currency)}</TableCell>
                    <TableCell>{formatDate(domain.saleDate)}</TableCell>
                    <TableCell>{domain.buyer || '-'}</TableCell>
                    <TableCell>{domain.marketplace || '-'}</TableCell> {/* Added Marketplace data */}
                    <TableCell>{domain.roi}%</TableCell>
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
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
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