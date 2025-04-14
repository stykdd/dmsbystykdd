import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  RefreshCw,
  Tags,
  Globe,
  User,
  Loader2,
  AlertOctagon,
  DollarSign,
  Euro,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  getDomains, 
  deleteDomain, 
  refreshWhoisData, 
  markDomainAsSold 
} from '../services/domainService';
import { getRegistrars, getRegistrarAccounts } from '../services/registrarService';
import { getCategories } from '../services/categoryService';
import { Domain, DomainFilterOptions, DomainStatus, Registrar, RegistrarAccount, DomainCategory, Currency } from '../types/domain';
import { formatDate, formatDateWithTime } from '@/lib/date-utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

//const statusOptions = [
//  { value: 'all', label: 'All Statuses' },
//  { value: 'active', label: 'Active' },
//  { value: 'expiring', label: 'Expiring Soon' },
//  { value: 'sold', label: 'Sold' },
//];

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  MAD: 'د.م.'
};

const formatCurrency = (amount?: number, currency?: Currency) => {
  if (!amount) return '-';

  const currencyCode = currency || 'USD';

  return `${currencySymbols[currencyCode]} ${amount.toLocaleString()}`;
};

const TLD_CATEGORIES = {
  gTLDs: ['.com', '.org', '.net', '.info', '.biz', '.app', '.dev', '.io'],
  ccTLDs: ['.us', '.uk', '.ca', '.au', '.de', '.fr', '.es', '.it'],
  newTLDs: ['.blog', '.shop', '.site', '.store', '.online', '.tech']
};

const COMMON_TLDS = ['.com', '.org', '.net', '.io', '.co', '.app', '.dev'];

const DomainList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [registrars, setRegistrars] = useState<Registrar[]>([]);
  const [tldFilter, setTldFilter] = useState<string>('all');
  const [registrarAccounts, setRegistrarAccounts] = useState<RegistrarAccount[]>([]);
  const [categories, setCategories] = useState<DomainCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  //const [statusFilter, setStatusFilter] = useState<string>('all');
  const [registrarFilter, setRegistrarFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<keyof Domain>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({});
  const [saleDialogOpen, setSaleDialogOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);

  const saleFormSchema = z.object({
    salePrice: z.number().min(0, "Price must be a positive number"),
    purchasePrice: z.number().min(0, "Price must be a positive number"),
    saleDate: z.string().min(1, "Sale date is required"),
    buyer: z.string().optional(),
    marketplace: z.string().min(1, "Marketplace is required"),
    saleNotes: z.string().optional(),
  });

  const saleForm = useForm<z.infer<typeof saleFormSchema>>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      salePrice: 0,
      purchasePrice: 0,
      saleDate: new Date().toISOString().split('T')[0],
      buyer: "",
      saleNotes: "",
    },
  });

  useEffect(() => {
    const regs = getRegistrars();
    const accounts = getRegistrarAccounts();
    const cats = getCategories();

    setRegistrars(regs);
    setRegistrarAccounts(accounts);
    setCategories(cats);
  }, []);

  useEffect(() => {
    loadDomains();
  }, [searchQuery, registrarFilter, accountFilter, categoryFilter, tldFilter, sortBy, sortOrder]);

  const loadDomains = useCallback(() => {
    setIsLoading(true);

    const filters: DomainFilterOptions = {
      search: searchQuery,
      sortBy: sortBy === 'tld' ? 'name' : sortBy,
      sortOrder,
      excludeTrash: true
    };

    // Custom sorting for TLD
    if (sortBy === 'tld') {
      const getTld = (domain: string) => domain.substring(domain.lastIndexOf('.'));
      filters.customSort = (a, b) => {
        const tldA = getTld(a.name);
        const tldB = getTld(b.name);
        return sortOrder === 'asc' ? 
          tldA.localeCompare(tldB) : 
          tldB.localeCompare(tldA);
      };
    }


    if (registrarFilter !== 'all') {
      filters.registrarId = registrarFilter;
    }

    if (accountFilter !== 'all') {
      filters.registrarAccountId = accountFilter;
    }

    if (categoryFilter !== 'all') {
      filters.categoryId = categoryFilter;
    }

    let domainData = getDomains(filters);

    //if (statusFilter !== 'expired') {
    //  domainData = domainData.filter(domain => domain.status !== 'expired');
    //}

    if (tldFilter !== 'all') {
      domainData = domainData.filter(domain => 
        domain.name.toLowerCase().endsWith(tldFilter.toLowerCase())
      );
    }

    setDomains(domainData);
    setIsLoading(false);
  }, [searchQuery, registrarFilter, accountFilter, categoryFilter, sortBy, sortOrder]);

  const handleSort = (column: keyof Domain) => {
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
    loadDomains();
  };

  const handleRefreshWhois = async (id: string, domainName: string) => {
    try {
      setRefreshing(prev => ({ ...prev, [id]: true }));
      await refreshWhoisData(id);
      toast({
        title: "WHOIS Refreshed",
        description: `WHOIS data for ${domainName} has been refreshed.`,
      });
      loadDomains();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to refresh WHOIS data for ${domainName}.`,
        variant: "destructive",
      });
    } finally {
      setRefreshing(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSellDomain = (domain: Domain) => {
    setSelectedDomain(domain);
    saleForm.setValue('purchasePrice', domain.price || 0);
    setSaleDialogOpen(true);
  };

  const onSaleSubmit = (values: z.infer<typeof saleFormSchema>) => {
    if (!selectedDomain) return;

    try {
      markDomainAsSold(selectedDomain.id, {
        salePrice: values.salePrice,
        purchasePrice: values.purchasePrice,
        saleDate: values.saleDate,
        buyer: values.buyer,
        saleNotes: values.saleNotes,
      });

      toast({
        title: "Domain Marked as Sold",
        description: `${selectedDomain.name} has been marked as sold.`,
      });

      setSaleDialogOpen(false);
      loadDomains();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to mark domain as sold.`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const refreshStaleWhoisData = async () => {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const domainsNeedingRefresh = domains.filter(domain => {
        if (!domain.whoisData || !domain.whoisData.lastRefreshed) {
          return true;
        }

        const lastRefreshed = new Date(domain.whoisData.lastRefreshed);
        return lastRefreshed < thirtyDaysAgo;
      });

      if (domainsNeedingRefresh.length > 0) {
        toast({
          title: "Refreshing WHOIS data",
          description: `Automatically refreshing WHOIS data for ${domainsNeedingRefresh.length} domains.`,
        });

        for (const domain of domainsNeedingRefresh) {
          try {
            await handleRefreshWhois(domain.id, domain.name);
          } catch (error) {
            console.error(`Failed to refresh WHOIS for ${domain.name}:`, error);
          }
        }
      }
    };

    if (domains.length > 0) {
      refreshStaleWhoisData();
    }
  }, [domains.length]);

  const renderDomainStatus = (status: DomainStatus) => {
    switch(status) {
      case 'active':
        return <span className="text-green-500 font-medium">Active</span>;
      case 'expiring':
        return <span className="text-yellow-500 font-medium">Expiring Soon</span>;
      case 'expired':
        return <span className="text-red-500 font-medium">Expired</span>;
      case 'trash':
        return <span className="text-gray-500 font-medium">Trash</span>;
      case 'sold':
        return <span className="text-blue-500 font-medium">Sold</span>;
      default:
        return null;
    }
  };

  const getAccountDetails = (accountId?: string) => {
    if (!accountId) return { name: 'Not assigned', registrarName: '' };

    const account = registrarAccounts.find(acc => acc.id === accountId);
    if (!account) return { name: 'Unknown', registrarName: '' };

    const registrar = registrars.find(reg => reg.id === account.registrarId);
    return { 
      name: account.name, 
      registrarName: registrar ? registrar.name : 'Unknown' 
    };
  };

  const getCategoryBadges = (categoryIds?: string[]) => {
    if (!categoryIds || categoryIds.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1">
        {categoryIds.map(id => {
          const category = categories.find(cat => cat.id === id);
          if (!category) return null;

          return (
            <Badge
              key={id}
              variant="outline"
              style={{
                backgroundColor: `${category.color}20`,
                borderColor: category.color,
                color: category.color
              }}
            >
              {category.name}
            </Badge>
          );
        })}
      </div>
    );
  };

  const getFilteredAccounts = () => {
    if (registrarFilter !== 'all') {
      return registrarAccounts.filter(account => account.registrarId === registrarFilter);
    }
    return registrarAccounts;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Domains Portfolio</h1>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/expired">
              <AlertOctagon className="mr-2 h-4 w-4" />
              Expired
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/trash">
              <Trash2 className="mr-2 h-4 w-4" />
              Trash
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/sales">
              <DollarSign className="mr-2 h-4 w-4" />
              Sales
            </Link>
          </Button>
          <Button asChild>
            <Link to="/domains/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Domain
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Removed Status Filter */}
        {/*
        <div className="flex-shrink-0">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        */}

        {registrars.length > 0 && (
          <div className="w-full sm:w-auto">
            <Select
              value={registrarFilter}
              onValueChange={(value) => {
                setRegistrarFilter(value);
                setAccountFilter('all');
              }}
            >
              <SelectTrigger className="w-[180px]">
                <Globe className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Registrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Registrars</SelectItem>
                {registrars.map((registrar) => (
                  <SelectItem key={registrar.id} value={registrar.id}>
                    {registrar.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {registrarAccounts.length > 0 && (
          <div className="w-full sm:w-auto">
            <Select
              value={accountFilter}
              onValueChange={setAccountFilter}
            >
              <SelectTrigger className="w-[180px]">
                <User className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {getFilteredAccounts().map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {categories.length > 0 && (
          <div className="w-full sm:w-auto">
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-[180px]">
                <Tags className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
              {Array.from(new Set(domains.map(domain => 
                domain.name.substring(domain.name.lastIndexOf('.'))
              ))).sort().map(tld => (
                <SelectItem key={tld} value={tld}>
                  {tld}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
                className="cursor-pointer w-[100px]"
                onClick={() => handleSort('tld')}
              >
                <div className="flex items-center">
                  TLD
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('expirationDate')}
              >
                <div className="flex items-center">
                  Expiration Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Days Left</TableHead>
              <TableHead>WHOIS Last Refresh</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : domains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No domains found
                </TableCell>
              </TableRow>
            ) : (
              domains.map((domain) => {
                const accountDetails = getAccountDetails(domain.registrarAccountId);
                return (
                  <TableRow key={domain.id}>
                    <TableCell className="font-medium">{domain.name}</TableCell>
                    <TableCell className="font-medium text-blue-600">
                      {domain.name.substring(domain.name.lastIndexOf('.'))}
                    </TableCell>
                    <TableCell>{formatDate(domain.expirationDate)}</TableCell>
                    <TableCell>
                      {domain.registrarAccountId ? (
                        <div>
                          <div className="font-medium">{accountDetails.name}</div>
                          <div className="text-xs text-muted-foreground">{accountDetails.registrarName}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>{getCategoryBadges(domain.categoryIds)}</TableCell>
                    <TableCell>
                      {domain.price ? (
                        <div className="flex items-center">
                          <span>{formatCurrency(domain.price, domain.currency)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={
                        domain.daysUntilExpiration < 0 ? 'text-red-500' :
                        domain.daysUntilExpiration <= 30 ? 'text-yellow-500' :
                        'text-green-500'
                      }>
                        {domain.daysUntilExpiration < 0 
                          ? `Expired ${Math.abs(domain.daysUntilExpiration)} days ago` 
                          : `${domain.daysUntilExpiration} days`}
                      </span>
                    </TableCell>
                    <TableCell>
                      {domain.whoisData?.lastRefreshed ? (
                        <span className="text-sm">
                          {formatDate(domain.whoisData.lastRefreshed)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => navigate(`/domains/edit/${domain.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8"
                          disabled={refreshing[domain.id]}
                          onClick={() => handleRefreshWhois(domain.id, domain.name)}
                        >
                          {refreshing[domain.id] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                        {domain.status !== 'sold' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => handleSellDomain(domain)}
                          >
                            <DollarSign className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(domain.id, domain.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={saleDialogOpen} onOpenChange={setSaleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Mark Domain as Sold</DialogTitle>
            <DialogDescription>
              {selectedDomain ? `Enter sale details for ${selectedDomain.name}` : 'Enter sale details'}
            </DialogDescription>
          </DialogHeader>
          <Form {...saleForm}>
            <form onSubmit={saleForm.handleSubmit(onSaleSubmit)} className="space-y-4">
              <FormField
                control={saleForm.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Price</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Select defaultValue={selectedDomain?.currency || "USD"}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="MAD">MAD</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={saleForm.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={saleForm.control}
                name="saleDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={saleForm.control}
                name="marketplace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marketplace</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select marketplace" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dan">Dan.com</SelectItem>
                          <SelectItem value="afternic">Afternic</SelectItem>
                          <SelectItem value="sedo">Sedo</SelectItem>
                          <SelectItem value="godaddy">GoDaddy</SelectItem>
                          <SelectItem value="direct">Direct Sale</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={saleForm.control}
                name="buyer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buyer</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={saleForm.control}
                name="saleNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Notes</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSaleDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Mark as Sold</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DomainList;
