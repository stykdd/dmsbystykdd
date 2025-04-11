
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, DollarSign, Euro, CreditCard } from 'lucide-react';
import { getDomainById, updateDomain } from '../services/domainService';
import { getRegistrars, getRegistrarAccounts } from '../services/registrarService';
import { getCategories } from '../services/categoryService';
import { Domain, Registrar, RegistrarAccount, DomainCategory, Currency } from '../types/domain';

const EditDomain: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [domain, setDomain] = useState<Domain | null>(null);
  const [registrars, setRegistrars] = useState<Registrar[]>([]);
  const [registrarAccounts, setRegistrarAccounts] = useState<RegistrarAccount[]>([]);
  const [categories, setCategories] = useState<DomainCategory[]>([]);
  const [selectedRegistrar, setSelectedRegistrar] = useState<string>('');
  const [registrarAccountId, setRegistrarAccountId] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isUpdating, setIsUpdating] = useState(false);
  const [filteredAccounts, setFilteredAccounts] = useState<RegistrarAccount[]>([]);

  useEffect(() => {
    if (!id) return;
    
    const domain = getDomainById(id);
    if (!domain) {
      toast({
        title: "Error",
        description: "Domain not found",
        variant: "destructive",
      });
      navigate('/domains');
      return;
    }
    
    setDomain(domain);
    setPrice(domain.price);
    setCurrency(domain.currency || 'USD');
    setRegistrarAccountId(domain.registrarAccountId || '');
    setSelectedCategories(domain.categoryIds || []);
    
    const regs = getRegistrars();
    const accounts = getRegistrarAccounts();
    const cats = getCategories();
    
    setRegistrars(regs);
    setRegistrarAccounts(accounts);
    setCategories(cats);
    
    if (domain.registrarAccountId) {
      const account = accounts.find(acc => acc.id === domain.registrarAccountId);
      if (account) {
        setSelectedRegistrar(account.registrarId);
      }
    }
  }, [id]);

  useEffect(() => {
    if (selectedRegistrar) {
      const accounts = registrarAccounts.filter(acc => acc.registrarId === selectedRegistrar);
      setFilteredAccounts(accounts);
      
      if (registrarAccountId) {
        const accountExists = accounts.some(acc => acc.id === registrarAccountId);
        if (!accountExists && accounts.length > 0) {
          setRegistrarAccountId(accounts[0].id);
        }
      }
    } else {
      setFilteredAccounts(registrarAccounts);
    }
  }, [selectedRegistrar, registrarAccounts]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    
    setIsUpdating(true);
    
    try {
      const updatedDomain = updateDomain(domain.id, {
        registrarAccountId,
        categoryIds: selectedCategories,
        price,
        currency
      });
      
      toast({
        title: "Domain Updated",
        description: `${domain.name} has been updated successfully.`,
      });
      
      navigate('/domains');
    } catch (error) {
      console.error("Error updating domain:", error);
      toast({
        title: "Error",
        description: "Failed to update domain. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!domain) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Domain: {domain.name}</h1>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Edit Domain Details</CardTitle>
            <CardDescription>
              Update the domain information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : 'Update Domain'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditDomain;
