import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronsUpDown, Loader2, DollarSign, Euro, CreditCard } from "lucide-react";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { addDomain } from '../services/domainService';
import { getRegistrars, getRegistrarAccounts } from '../services/registrarService';
import { getCategories } from '../services/categoryService';
import { Domain, Registrar, RegistrarAccount, DomainCategory, Currency } from '../types/domain';
import { cn } from '@/lib/utils';

const currencyIcons: Record<Currency, React.ReactNode> = {
  USD: <DollarSign className="h-4 w-4" />,
  EUR: <Euro className="h-4 w-4" />,
  MAD: <CreditCard className="h-4 w-4" />
};

const AddDomain: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Load registrars, accounts and categories
  const [registrars, setRegistrars] = useState<Registrar[]>([]);
  const [registrarAccounts, setRegistrarAccounts] = useState<RegistrarAccount[]>([]);
  const [categories, setCategories] = useState<DomainCategory[]>([]);
  const [selectedRegistrar, setSelectedRegistrar] = useState<string>('');
  const [filteredAccounts, setFilteredAccounts] = useState<RegistrarAccount[]>([]);
  
  // For single domain
  const [domainName, setDomainName] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [registrarAccountId, setRegistrarAccountId] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAddingSingle, setIsAddingSingle] = useState(false);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [currency, setCurrency] = useState<Currency>('USD');
  
  // For bulk domains
  const [bulkDomains, setBulkDomains] = useState('');
  const [bulkRegistrarId, setBulkRegistrarId] = useState('');
  const [bulkAccountId, setBulkAccountId] = useState('');
  const [bulkCategories, setBulkCategories] = useState<string[]>([]);
  const [bulkPrice, setBulkPrice] = useState<number | undefined>(undefined);
  const [bulkCurrency, setBulkCurrency] = useState<Currency>('USD');
  const [bulkFilteredAccounts, setBulkFilteredAccounts] = useState<RegistrarAccount[]>([]);
  const [isAddingBulk, setIsAddingBulk] = useState(false);
  
  // Load data
  useEffect(() => {
    const regs = getRegistrars();
    const accounts = getRegistrarAccounts();
    const cats = getCategories();
    
    setRegistrars(regs);
    setRegistrarAccounts(accounts);
    setCategories(cats);
    
    // Set defaults if available
    if (accounts.length > 0) {
      setRegistrarAccountId(accounts[0].id);
      setBulkAccountId(accounts[0].id);
    }
    
    if (regs.length > 0) {
      setSelectedRegistrar(regs[0].id);
      setBulkRegistrarId(regs[0].id);
    }
  }, []);
  
  // Filter accounts based on selected registrar
  useEffect(() => {
    if (selectedRegistrar) {
      const accounts = getRegistrarAccounts(selectedRegistrar);
      setFilteredAccounts(accounts);
      
      // Reset selected account if it doesn't belong to the selected registrar
      if (registrarAccountId) {
        const accountExists = accounts.some(acc => acc.id === registrarAccountId);
        if (!accountExists && accounts.length > 0) {
          setRegistrarAccountId(accounts[0].id);
        } else if (!accountExists) {
          setRegistrarAccountId('');
        }
      } else if (accounts.length > 0) {
        setRegistrarAccountId(accounts[0].id);
      }
    } else {
      setFilteredAccounts(registrarAccounts);
    }
  }, [selectedRegistrar, registrarAccounts]);
  
  // Filter bulk accounts based on selected registrar
  useEffect(() => {
    if (bulkRegistrarId) {
      const accounts = getRegistrarAccounts(bulkRegistrarId);
      setBulkFilteredAccounts(accounts);
      
      // Reset selected account if it doesn't belong to the selected registrar
      if (bulkAccountId) {
        const accountExists = accounts.some(acc => acc.id === bulkAccountId);
        if (!accountExists && accounts.length > 0) {
          setBulkAccountId(accounts[0].id);
        } else if (!accountExists) {
          setBulkAccountId('');
        }
      } else if (accounts.length > 0) {
        setBulkAccountId(accounts[0].id);
      }
    } else {
      setBulkFilteredAccounts(registrarAccounts);
    }
  }, [bulkRegistrarId, registrarAccounts]);
  
  const handleAddSingleDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domainName) {
      toast({
        title: "Error",
        description: "Please enter a domain name.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAddingSingle(true);
    
    try {
      // Create domain with empty dates to trigger WHOIS fetch
      const newDomain: Omit<Domain, 'id' | 'createdAt' | 'updatedAt' | 'daysUntilExpiration'> = {
        name: domainName,
        registrationDate: '', // Empty string will trigger WHOIS fetch
        expirationDate: '',   // Empty string will trigger WHOIS fetch
        status: 'active',
        registrarAccountId: registrarAccountId || undefined,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
        price: price,
        currency: currency
      };
      
      await addDomain(newDomain);
      
      toast({
        title: "Domain Added",
        description: `${domainName} has been added successfully with WHOIS data.`,
      });
      
      navigate('/domains');
    } catch (error) {
      console.error("Error adding domain:", error);
      toast({
        title: "Error",
        description: "Failed to add domain. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingSingle(false);
    }
  };
  
  const handleAddBulkDomains = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bulkDomains) {
      toast({
        title: "Error",
        description: "Please enter at least one domain.",
        variant: "destructive",
      });
      return;
    }
    
    // Split by newlines and filter empty lines
    const domainLines = bulkDomains
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (domainLines.length === 0) {
      toast({
        title: "Error",
        description: "No valid domains found in the input.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAddingBulk(true);
    
    try {
      // Process each domain and add them one by one
      for (const domainName of domainLines) {
        const newDomain: Omit<Domain, 'id' | 'createdAt' | 'updatedAt' | 'daysUntilExpiration'> = {
          name: domainName,
          registrationDate: '', // Empty string will trigger WHOIS fetch
          expirationDate: '',   // Empty string will trigger WHOIS fetch
          status: 'active',
          registrarAccountId: bulkAccountId || undefined,
          categoryIds: bulkCategories.length > 0 ? bulkCategories : undefined,
          price: bulkPrice,
          currency: bulkCurrency
        };
        
        await addDomain(newDomain);
      }
      
      toast({
        title: "Domains Added",
        description: `${domainLines.length} domains have been added successfully with WHOIS data.`,
      });
      
      navigate('/domains');
    } catch (error) {
      console.error("Error adding bulk domains:", error);
      toast({
        title: "Error",
        description: "Failed to add some domains. Please check your input and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingBulk(false);
    }
  };
  
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const toggleBulkCategory = (categoryId: string) => {
    setBulkCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Get registrar name by ID
  const getRegistrarName = (id: string): string => {
    const registrar = registrars.find(r => r.id === id);
    return registrar ? registrar.name : 'Unknown';
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Domain</h1>
      
      <Tabs defaultValue="single">
        <TabsList className="mb-6">
          <TabsTrigger value="single">Single Domain</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
        </TabsList>
        
        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle>Add a Single Domain</CardTitle>
              <CardDescription>
                Enter the domain name. Registration date and expiration date will be automatically fetched from WHOIS data.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleAddSingleDomain}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="domainName">Domain Name</Label>
                  <Input 
                    id="domainName"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    placeholder="example.com"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Purchase Price</Label>
                    <Input 
                      id="price"
                      type="number"
                      value={price === undefined ? '' : price}
                      onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                      <SelectTrigger id="currency" className="w-full">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>USD</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="EUR">
                          <div className="flex items-center">
                            <Euro className="h-4 w-4 mr-2" />
                            <span>EUR</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="MAD">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            <span>MAD</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="text-sm text-muted-foreground mb-2">
                    Registration and expiration dates will be automatically fetched from WHOIS data when you add the domain.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registrar">Registrar</Label>
                  {registrars.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No registrars found. <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/settings')}>Add one in Settings</Button>
                    </div>
                  ) : (
                    <Select value={selectedRegistrar} onValueChange={setSelectedRegistrar}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a registrar" />
                      </SelectTrigger>
                      <SelectContent>
                        {registrars.map(registrar => (
                          <SelectItem key={registrar.id} value={registrar.id}>
                            {registrar.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="registrarAccount">Registrar Account</Label>
                  {filteredAccounts.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No accounts found for this registrar. <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/settings')}>Add one in Settings</Button>
                    </div>
                  ) : (
                    <Select value={registrarAccountId} onValueChange={setRegistrarAccountId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Categories</Label>
                  {categories.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No categories found. <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/settings')}>Add one in Settings</Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <Button
                          key={category.id}
                          type="button"
                          variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                          size="sm"
                          className="rounded-full"
                          style={{
                            backgroundColor: selectedCategories.includes(category.id) ? category.color : 'transparent',
                            borderColor: category.color,
                            color: selectedCategories.includes(category.id) ? 'white' : category.color
                          }}
                          onClick={() => toggleCategory(category.id)}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate('/domains')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isAddingSingle}
                >
                  {isAddingSingle ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fetching WHOIS Data...
                    </>
                  ) : 'Add Domain'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Import Domains</CardTitle>
              <CardDescription>
                Enter multiple domains, one per line. Registration and expiration dates will be automatically fetched from WHOIS data for each domain.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleAddBulkDomains}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bulkDomains">Domain Names (one per line)</Label>
                  <Textarea 
                    id="bulkDomains"
                    value={bulkDomains}
                    onChange={(e) => setBulkDomains(e.target.value)}
                    placeholder="example.com&#10;mydomain.org&#10;test.net"
                    rows={10}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bulkPrice">Purchase Price (for all domains)</Label>
                    <Input 
                      id="bulkPrice"
                      type="number"
                      value={bulkPrice === undefined ? '' : bulkPrice}
                      onChange={(e) => setBulkPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bulkCurrency">Currency</Label>
                    <Select value={bulkCurrency} onValueChange={(value) => setBulkCurrency(value as Currency)}>
                      <SelectTrigger id="bulkCurrency" className="w-full">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>USD</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="EUR">
                          <div className="flex items-center">
                            <Euro className="h-4 w-4 mr-2" />
                            <span>EUR</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="MAD">
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2" />
                            <span>MAD</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2 bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="text-sm text-muted-foreground mb-2">
                    Registration and expiration dates will be automatically fetched from WHOIS data when you add the domains.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bulkRegistrar">Registrar</Label>
                  {registrars.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No registrars found. <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/settings')}>Add one in Settings</Button>
                    </div>
                  ) : (
                    <Select value={bulkRegistrarId} onValueChange={setBulkRegistrarId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a registrar" />
                      </SelectTrigger>
                      <SelectContent>
                        {registrars.map(registrar => (
                          <SelectItem key={registrar.id} value={registrar.id}>
                            {registrar.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bulkRegistrarAccount">Registrar Account</Label>
                  {bulkFilteredAccounts.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No accounts found for this registrar. <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/settings')}>Add one in Settings</Button>
                    </div>
                  ) : (
                    <Select value={bulkAccountId} onValueChange={setBulkAccountId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                      <SelectContent>
                        {bulkFilteredAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Categories</Label>
                  {categories.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No categories found. <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/settings')}>Add one in Settings</Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <Button
                          key={category.id}
                          type="button"
                          variant={bulkCategories.includes(category.id) ? "default" : "outline"}
                          size="sm"
                          className="rounded-full"
                          style={{
                            backgroundColor: bulkCategories.includes(category.id) ? category.color : 'transparent',
                            borderColor: category.color,
                            color: bulkCategories.includes(category.id) ? 'white' : category.color
                          }}
                          onClick={() => toggleBulkCategory(category.id)}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate('/domains')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isAddingBulk}
                >
                  {isAddingBulk ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Fetching WHOIS Data...
                    </>
                  ) : 'Add Domains'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddDomain;
