import React, { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, Edit, Check, X, PlusCircle, Tags, Globe, User, Mail, Moon, Sun, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  getRegistrars, 
  addRegistrar, 
  updateRegistrar, 
  deleteRegistrar,
  getRegistrarAccounts,
  addRegistrarAccount,
  updateRegistrarAccount,
  deleteRegistrarAccount
} from '../services/registrarService';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../services/categoryService';
import { Registrar, RegistrarAccount, DomainCategory } from '../types/domain';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ThemeToggle from '@/components/admin/ThemeToggle';
import EmailSettings from '@/components/admin/EmailSettings';
import NotificationSettings from '@/components/admin/NotificationSettings';
import DonationSettings from '@/components/admin/DonationSettings';
import { initializeEmailNotifier } from '@/services/emailNotifier';

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  
  // Registrars state
  const [registrars, setRegistrars] = useState<Registrar[]>([]);
  const [openRegistrarDialog, setOpenRegistrarDialog] = useState(false);
  const [currentRegistrar, setCurrentRegistrar] = useState<Registrar | null>(null);
  const [registrarFormData, setRegistrarFormData] = useState({
    name: '',
    website: '',
    description: '',
  });
  
  // Registrar accounts state
  const [registrarAccounts, setRegistrarAccounts] = useState<RegistrarAccount[]>([]);
  const [openAccountDialog, setOpenAccountDialog] = useState(false);
  const [currentAccount, setCurrentAccount] = useState<RegistrarAccount | null>(null);
  const [accountFormData, setAccountFormData] = useState({
    name: '',
    registrarId: '',
    username: '',
    password: '',
    apiKey: '',
  });
  
  // Categories state
  const [categories, setCategories] = useState<DomainCategory[]>([]);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<DomainCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    color: '#4F46E5', // Default color
  });
  
  // Load data
  useEffect(() => {
    loadData();
    // Initialize email notifier
    initializeEmailNotifier();
  }, []);
  
  const loadData = () => {
    const regList = getRegistrars();
    const accounts = getRegistrarAccounts();
    const cats = getCategories();
    
    setRegistrars(regList);
    setRegistrarAccounts(accounts);
    setCategories(cats);
  };
  
  // Registrar handlers
  const handleOpenRegistrarDialog = (registrar?: Registrar) => {
    if (registrar) {
      setCurrentRegistrar(registrar);
      setRegistrarFormData({
        name: registrar.name,
        website: registrar.website || '',
        description: registrar.description || '',
      });
    } else {
      setCurrentRegistrar(null);
      setRegistrarFormData({
        name: '',
        website: '',
        description: '',
      });
    }
    setOpenRegistrarDialog(true);
  };
  
  const handleRegistrarFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegistrarFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveRegistrar = () => {
    const { name } = registrarFormData;
    
    if (!name) {
      toast({
        title: "Validation Error",
        description: "Registrar name is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentRegistrar) {
      // Update existing
      updateRegistrar(currentRegistrar.id, registrarFormData);
      toast({
        title: "Registrar Updated",
        description: `${name} has been updated successfully.`,
      });
    } else {
      // Add new
      addRegistrar(registrarFormData);
      toast({
        title: "Registrar Added",
        description: `${name} has been added successfully.`,
      });
    }
    
    setOpenRegistrarDialog(false);
    loadData();
  };
  
  const handleDeleteRegistrar = (id: string, name: string) => {
    // Check if there are accounts using this registrar
    const accountsUsingRegistrar = registrarAccounts.filter(account => account.registrarId === id);
    
    if (accountsUsingRegistrar.length > 0) {
      toast({
        title: "Cannot Delete",
        description: `${name} has ${accountsUsingRegistrar.length} account(s) associated with it. Delete the accounts first.`,
        variant: "destructive",
      });
      return;
    }
    
    deleteRegistrar(id);
    toast({
      title: "Registrar Deleted",
      description: `${name} has been deleted.`,
    });
    loadData();
  };
  
  // Account handlers
  const handleOpenAccountDialog = (account?: RegistrarAccount) => {
    if (account) {
      setCurrentAccount(account);
      setAccountFormData({
        name: account.name,
        registrarId: account.registrarId,
        username: account.username,
        password: account.password || '',
        apiKey: account.apiKey || '',
      });
    } else {
      setCurrentAccount(null);
      setAccountFormData({
        name: '',
        registrarId: registrars.length > 0 ? registrars[0].id : '',
        username: '',
        password: '',
        apiKey: '',
      });
    }
    setOpenAccountDialog(true);
  };
  
  const handleAccountFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveAccount = () => {
    const { name, registrarId, username } = accountFormData;
    
    if (!name || !registrarId || !username) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentAccount) {
      // Update existing
      updateRegistrarAccount(currentAccount.id, accountFormData);
      toast({
        title: "Account Updated",
        description: `${name} has been updated successfully.`,
      });
    } else {
      // Add new
      addRegistrarAccount(accountFormData);
      toast({
        title: "Account Added",
        description: `${name} has been added successfully.`,
      });
    }
    
    setOpenAccountDialog(false);
    loadData();
  };
  
  const handleDeleteAccount = (id: string, name: string) => {
    deleteRegistrarAccount(id);
    toast({
      title: "Account Deleted",
      description: `${name} has been deleted.`,
    });
    loadData();
  };
  
  // Category handlers
  const handleOpenCategoryDialog = (category?: DomainCategory) => {
    if (category) {
      setCurrentCategory(category);
      setCategoryFormData({
        name: category.name,
        description: category.description || '',
        color: category.color || '#4F46E5',
      });
    } else {
      setCurrentCategory(null);
      setCategoryFormData({
        name: '',
        description: '',
        color: '#4F46E5',
      });
    }
    setOpenCategoryDialog(true);
  };
  
  const handleCategoryFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveCategory = () => {
    const { name, description, color } = categoryFormData;
    
    if (!name) {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentCategory) {
      // Update existing
      updateCategory(currentCategory.id, categoryFormData);
      toast({
        title: "Category Updated",
        description: `${name} has been updated successfully.`,
      });
    } else {
      // Add new
      addCategory(categoryFormData);
      toast({
        title: "Category Added",
        description: `${name} has been added successfully.`,
      });
    }
    
    setOpenCategoryDialog(false);
    loadData();
  };
  
  const handleDeleteCategory = (id: string, name: string) => {
    deleteCategory(id);
    toast({
      title: "Category Deleted",
      description: `${name} has been deleted.`,
    });
    loadData();
  };
  
  // Get registrar name by ID
  const getRegistrarName = (id: string): string => {
    const registrar = registrars.find(r => r.id === id);
    return registrar ? registrar.name : 'Unknown';
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <Tabs defaultValue="registrars">
        <TabsList>
          <TabsTrigger value="registrars">Domain Registrars</TabsTrigger>
          <TabsTrigger value="accounts">Registrar Accounts</TabsTrigger>
          <TabsTrigger value="categories">Domain Categories</TabsTrigger>
          <TabsTrigger value="general">Notifications Settings</TabsTrigger>
          <TabsTrigger value="email">Email Configuration</TabsTrigger>
          <TabsTrigger value="theme">Theme Settings</TabsTrigger>
          <TabsTrigger value="donation">Donation Settings</TabsTrigger>
        </TabsList>
        
        {/* Registrars Tab */}
        <TabsContent value="registrars">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Domain Registrars</CardTitle>
                  <CardDescription>
                    Manage your domain registrar companies.
                  </CardDescription>
                </div>
                <Dialog open={openRegistrarDialog} onOpenChange={setOpenRegistrarDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleOpenRegistrarDialog()}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Registrar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {currentRegistrar ? 'Edit Registrar' : 'Add Registrar'}
                      </DialogTitle>
                      <DialogDescription>
                        Enter the details for the domain registrar.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Registrar Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={registrarFormData.name}
                          onChange={handleRegistrarFormChange}
                          placeholder="e.g. GoDaddy, Namecheap"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website (optional)</Label>
                        <Input
                          id="website"
                          name="website"
                          value={registrarFormData.website}
                          onChange={handleRegistrarFormChange}
                          placeholder="e.g. https://www.godaddy.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Input
                          id="description"
                          name="description"
                          value={registrarFormData.description}
                          onChange={handleRegistrarFormChange}
                          placeholder="Brief description of the registrar"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenRegistrarDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveRegistrar}>
                        {currentRegistrar ? 'Update' : 'Add'} Registrar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Accounts</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrars.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No registrars found. Add your first registrar to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    registrars.map((registrar) => {
                      const accountsCount = registrarAccounts.filter(a => a.registrarId === registrar.id).length;
                      return (
                        <TableRow key={registrar.id}>
                          <TableCell className="font-medium">{registrar.name}</TableCell>
                          <TableCell>
                            {registrar.website ? (
                              <a 
                                href={registrar.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700 hover:underline"
                              >
                                {registrar.website}
                              </a>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>{registrar.description || <span className="text-gray-400">N/A</span>}</TableCell>
                          <TableCell>{accountsCount} account(s)</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleOpenRegistrarDialog(registrar)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteRegistrar(registrar.id, registrar.name)}
                                disabled={accountsCount > 0}
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
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Registrar Accounts Tab */}
        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Registrar Accounts</CardTitle>
                  <CardDescription>
                    Manage your domain registrar accounts.
                  </CardDescription>
                </div>
                <Dialog open={openAccountDialog} onOpenChange={setOpenAccountDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => handleOpenAccountDialog()}
                      disabled={registrars.length === 0}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {currentAccount ? 'Edit Registrar Account' : 'Add Registrar Account'}
                      </DialogTitle>
                      <DialogDescription>
                        Enter the details for the registrar account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Account Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={accountFormData.name}
                          onChange={handleAccountFormChange}
                          placeholder="e.g. My Personal GoDaddy Account"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registrarId">Registrar</Label>
                        <Select 
                          value={accountFormData.registrarId} 
                          onValueChange={(value) => setAccountFormData(prev => ({ ...prev, registrarId: value }))}
                        >
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
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username / Email</Label>
                        <Input
                          id="username"
                          name="username"
                          value={accountFormData.username}
                          onChange={handleAccountFormChange}
                          placeholder="e.g. user@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password (optional, stored securely)</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={accountFormData.password}
                          onChange={handleAccountFormChange}
                          placeholder="Enter account password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apiKey">API Key (optional)</Label>
                        <Input
                          id="apiKey"
                          name="apiKey"
                          value={accountFormData.apiKey}
                          onChange={handleAccountFormChange}
                          placeholder="Enter API key if available"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenAccountDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveAccount}>
                        {currentAccount ? 'Update' : 'Add'} Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {registrars.length === 0 ? (
                <div className="text-center p-6 border border-dashed rounded-md">
                  <Globe className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Registrars Available</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    You need to add at least one domain registrar before you can create accounts.
                  </p>
                  <Button asChild>
                    <TabsTrigger value="registrars">
                      Add a Registrar
                    </TabsTrigger>
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Registrar</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Has API Key</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrarAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No accounts found. Add your first account to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      registrarAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-medium">{account.name}</TableCell>
                          <TableCell>{getRegistrarName(account.registrarId)}</TableCell>
                          <TableCell>{account.username}</TableCell>
                          <TableCell>
                            {account.apiKey ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <X className="h-4 w-4 text-gray-400" />
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleOpenAccountDialog(account)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteAccount(account.id, account.name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Domain Categories</CardTitle>
                  <CardDescription>
                    Manage categories to organize your domains.
                  </CardDescription>
                </div>
                <Dialog open={openCategoryDialog} onOpenChange={setOpenCategoryDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleOpenCategoryDialog()}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {currentCategory ? 'Edit Category' : 'Add Category'}
                      </DialogTitle>
                      <DialogDescription>
                        Enter the details for the domain category.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Category Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={categoryFormData.name}
                          onChange={handleCategoryFormChange}
                          placeholder="e.g. Personal, Business, Client"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Input
                          id="description"
                          name="description"
                          value={categoryFormData.description}
                          onChange={handleCategoryFormChange}
                          placeholder="Brief description of this category"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="color"
                            name="color"
                            type="color"
                            value={categoryFormData.color}
                            onChange={handleCategoryFormChange}
                            className="w-16 h-10"
                          />
                          <Input
                            name="color"
                            value={categoryFormData.color}
                            onChange={handleCategoryFormChange}
                            placeholder="#HEX"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenCategoryDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveCategory}>
                        {currentCategory ? 'Update' : 'Add'} Category
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No categories found. Add your first category to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description || <span className="text-gray-400">N/A</span>}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            <span>{category.color}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenCategoryDialog(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteCategory(category.id, category.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Settings Tab */}
        <TabsContent value="general">
          <NotificationSettings />
        </TabsContent>
        
        {/* Email Configuration Tab */}
        <TabsContent value="email">
          <EmailSettings />
        </TabsContent>
        
        {/* Theme Settings Tab */}
        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5" />
                Theme Settings
              </CardTitle>
              <CardDescription>
                Customize your application theme preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Donation Settings Tab */}
        <TabsContent value="donation">
          <DonationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
