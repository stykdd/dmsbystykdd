import React, { useState } from 'react';
import { Star, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { checkDomainAvailability, bulkCheckAvailability, fetchWhoisData } from '../services/domainService';
import { BulkCheckResult } from '../types/domain';
import { CheckCircle, XCircle, Loader2, Info, Search, Database } from 'lucide-react';
import { addToHistory } from '../services/historyService';
import { formatDate, formatWhoisDate } from '../lib/date-utils';

const TLD_CATEGORIES = {
  gTLDs: [
    '.com', '.org', '.net', '.info', '.biz', '.name', '.pro', 
    '.app', '.dev', '.io', '.co', '.me', '.tv', '.xyz', 
    '.blog', '.club', '.shop', '.site', '.store', '.online',
    '.tech', '.agency', '.design', '.cloud', '.market'
  ],
  ccTLDs: [
    '.us', '.uk', '.ca', '.au', '.de', '.fr', '.es', '.it', '.nl', '.ru',
    '.cn', '.jp', '.br', '.in', '.mx', '.se', '.no', '.dk', '.fi', '.ch',
    '.at', '.be', '.eu', '.nz', '.sg', '.kr', '.za', '.ie', '.pl', '.tr'
  ],
  newTLDs: [
    '.academy', '.audio', '.cafe', '.capital', '.careers', '.codes', '.consulting',
    '.digital', '.email', '.events', '.express', '.finance', '.foundation', '.gallery',
    '.guru', '.healthcare', '.industries', '.lawyer', '.media', '.network', '.photography',
    '.properties', '.solutions', '.systems', '.ventures', '.vision', '.world', '.zone'
  ]
};

const COMMON_TLDS = [
  '.com', '.org', '.net', '.io', '.co', '.info', '.biz', '.app', '.dev'
];

const CheckAvailability: React.FC = () => {
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<"availability" | "whois">("availability");
  
  const [domainName, setDomainName] = useState('');
  const [isCheckingSingle, setIsCheckingSingle] = useState(false);
  const [singleResult, setSingleResult] = useState<{ available: boolean, domain: string } | null>(null);
  
  const [whoisDomain, setWhoisDomain] = useState('');
  const [isFetchingWhois, setIsFetchingWhois] = useState(false);
  const [whoisData, setWhoisData] = useState<any>(null);
  
  const [bulkDomains, setBulkDomains] = useState('');
  const [isCheckingBulk, setIsCheckingBulk] = useState(false);
  const [bulkResults, setBulkResults] = useState<BulkCheckResult[]>([]);
  const [bulkWhoisData, setBulkWhoisData] = useState<{[domain: string]: any}>({});
  const [loadingWhoisDomains, setLoadingWhoisDomains] = useState<string[]>([]);

  const [baseDomain, setBaseDomain] = useState('');
  const [selectedTlds, setSelectedTlds] = useState<string[]>(['.com', '.org', '.net']);
  const [isCheckingTlds, setIsCheckingTlds] = useState(false);
  const [tldResults, setTldResults] = useState<BulkCheckResult[]>([]);
  const [tldWhoisData, setTldWhoisData] = useState<{[domain: string]: any}>({});
  const [loadingTldWhoisDomains, setLoadingTldWhoisDomains] = useState<string[]>([]);
  
  const [activeTldCategory, setActiveTldCategory] = useState<"common" | "gtlds" | "cctlds" | "newtlds">("common");

  const handleSingleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domainName) {
      toast({
        title: "Error",
        description: "Please enter a domain name.",
        variant: "destructive",
      });
      return;
    }
    
    setIsCheckingSingle(true);
    setSingleResult(null);
    
    try {
      const available = await checkDomainAvailability(domainName);
      setSingleResult({ available, domain: domainName });
      
      addToHistory({
        domain: domainName,
        available,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check domain availability.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingSingle(false);
    }
  };
  
  const handleBulkCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bulkDomains) {
      toast({
        title: "Error",
        description: "Please enter at least one domain name.",
        variant: "destructive",
      });
      return;
    }
    
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
    
    setIsCheckingBulk(true);
    setBulkResults([]);
    setBulkWhoisData({});
    
    try {
      const results = await bulkCheckAvailability(domainLines);
      setBulkResults(results);
      
      results.forEach(result => {
        addToHistory({
          domain: result.domain,
          available: result.available,
        });
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check domain availability.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingBulk(false);
    }
  };

  const handleMultiTldCheck = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!baseDomain) {
      toast({
        title: "Error",
        description: "Please enter a base domain name.",
        variant: "destructive",
      });
      return;
    }

    if (selectedTlds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one TLD to check.",
        variant: "destructive",
      });
      return;
    }

    let cleanBaseDomain = baseDomain;
    const allTlds = [
      ...TLD_CATEGORIES.gTLDs,
      ...TLD_CATEGORIES.ccTLDs,
      ...TLD_CATEGORIES.newTLDs
    ];
    
    for (const tld of allTlds) {
      if (cleanBaseDomain.endsWith(tld)) {
        cleanBaseDomain = cleanBaseDomain.slice(0, -tld.length);
        break;
      }
    }

    const domainsToCheck = selectedTlds.map(tld => `${cleanBaseDomain}${tld}`);

    setIsCheckingTlds(true);
    setTldResults([]);
    setTldWhoisData({});

    try {
      const results = await bulkCheckAvailability(domainsToCheck);
      setTldResults(results);

      results.forEach(result => {
        addToHistory({
          domain: result.domain,
          available: result.available,
        });
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check domain availability across TLDs.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingTlds(false);
    }
  };

  const handleTldToggle = (tld: string) => {
    if (selectedTlds.includes(tld)) {
      setSelectedTlds(selectedTlds.filter(t => t !== tld));
    } else {
      setSelectedTlds([...selectedTlds, tld]);
    }
  };

  const handleSelectCategory = (category: keyof typeof TLD_CATEGORIES) => {
    const categoryTlds = TLD_CATEGORIES[category];
    const currentlySelected = selectedTlds.filter(tld => !categoryTlds.includes(tld));
    setSelectedTlds([...currentlySelected, ...categoryTlds]);
  };

  const handleDeselectCategory = (category: keyof typeof TLD_CATEGORIES) => {
    const categoryTlds = TLD_CATEGORIES[category];
    setSelectedTlds(selectedTlds.filter(tld => !categoryTlds.includes(tld)));
  };

  const fetchWhoisInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!whoisDomain) {
      toast({
        title: "Error",
        description: "Please enter a domain name.",
        variant: "destructive",
      });
      return;
    }

    setIsFetchingWhois(true);
    setWhoisData(null);

    try {
      const data = await fetchWhoisData(whoisDomain);
      setWhoisData(data);
      
      toast({
        title: "WHOIS Data Fetched",
        description: `Successfully retrieved WHOIS data for ${whoisDomain}`,
      });
      
      addToHistory({
        domain: whoisDomain,
        available: false,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch WHOIS data.",
        variant: "destructive",
      });
    } finally {
      setIsFetchingWhois(false);
    }
  };

  const fetchBulkWhoisData = async (domain: string) => {
    if (loadingWhoisDomains.includes(domain)) return;
    
    setLoadingWhoisDomains(prev => [...prev, domain]);
    
    try {
      const data = await fetchWhoisData(domain);
      setBulkWhoisData(prev => ({
        ...prev,
        [domain]: data
      }));
      
      toast({
        title: "WHOIS Data Fetched",
        description: `Successfully retrieved WHOIS data for ${domain}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch WHOIS data for ${domain}.`,
        variant: "destructive",
      });
    } finally {
      setLoadingWhoisDomains(prev => prev.filter(d => d !== domain));
    }
  };

  const fetchTldWhoisData = async (domain: string) => {
    if (loadingTldWhoisDomains.includes(domain)) return;
    
    setLoadingTldWhoisDomains(prev => [...prev, domain]);
    
    try {
      const data = await fetchWhoisData(domain);
      setTldWhoisData(prev => ({
        ...prev,
        [domain]: data
      }));
      
      toast({
        title: "WHOIS Data Fetched",
        description: `Successfully retrieved WHOIS data for ${domain}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch WHOIS data for ${domain}.`,
        variant: "destructive",
      });
    } finally {
      setLoadingTldWhoisDomains(prev => prev.filter(d => d !== domain));
    }
  };

  const renderWhoisData = (data: any) => {
    if (!data) return null;
    
    const whoisFields = [
      { key: 'domainName', label: 'Domain Name' },
      { key: 'registryDomainId', label: 'Registry Domain ID' },
      { key: 'registrarWhoisServer', label: 'Registrar WHOIS Server' },
      { key: 'registrarUrl', label: 'Registrar URL' },
      { key: 'updatedDate', label: 'Updated Date' },
      { key: 'creationDate', label: 'Creation Date' },
      { key: 'registryExpiryDate', label: 'Registry Expiry Date' },
      { key: 'registrar', label: 'Registrar' },
      { key: 'registrarIanaId', label: 'Registrar IANA ID' },
      { key: 'registrarAbuseContactEmail', label: 'Registrar Abuse Contact Email' },
      { key: 'registrarAbuseContactPhone', label: 'Registrar Abuse Contact Phone' },
      { key: 'domainStatus', label: 'Domain Status' },
      { key: 'nameServer1', label: 'Name Server' },
      { key: 'nameServer2', label: 'Name Server' },
      { key: 'dnssec', label: 'DNSSEC' },
      { key: 'urlOfIcannWhoisInaccuracyComplaintForm', label: 'URL of the ICANN Whois Inaccuracy Complaint Form' },
    ];
    
    return (
      <div className="space-y-1 text-sm font-mono whitespace-pre-wrap">
        {whoisFields.map(field => {
          const value = data[field.key];
          
          if (value === undefined) return null;
          
          const formattedValue = field.key.toLowerCase().includes('date') 
            ? formatWhoisDate(value as string) 
            : value;
          
          return (
            <div key={field.key} className="leading-tight">
              {field.label}: {formattedValue as React.ReactNode}
            </div>
          );
        })}
        
        <div className="mt-4 text-xs text-muted-foreground border-t pt-2">
          &gt;&gt;&gt; Last update of whois database: {formatWhoisDate(new Date().toISOString())} &lt;&lt;&lt;
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground">
          For more information on Whois status codes, please visit https://icann.org/epp
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          NOTICE: The expiration date displayed in this record is the date the
          registrar's sponsorship of the domain name registration in the registry is
          currently set to expire. This date does not necessarily reflect the expiration
          date of the domain name registrant's agreement with the sponsoring
          registrar.  Users may consult the sponsoring registrar's Whois database to
          view the registrar's reported date of expiration for this registration.
        </div>
      </div>
    );
  };

  const renderTldCategoryContent = (category: "common" | "gtlds" | "cctlds" | "newtlds") => {
    let tldList: string[] = [];
    let categoryTitle = "";
    
    switch (category) {
      case "common":
        tldList = COMMON_TLDS;
        categoryTitle = "Common TLDs";
        break;
      case "gtlds":
        tldList = TLD_CATEGORIES.gTLDs;
        categoryTitle = "Generic TLDs (gTLDs)";
        break;
      case "cctlds":
        tldList = TLD_CATEGORIES.ccTLDs;
        categoryTitle = "Country Code TLDs (ccTLDs)";
        break;
      case "newtlds":
        tldList = TLD_CATEGORIES.newTLDs;
        categoryTitle = "New TLDs";
        break;
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">{categoryTitle}</h3>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => category !== "common" ? handleSelectCategory(
                category === "gtlds" ? "gTLDs" : 
                category === "cctlds" ? "ccTLDs" : "newTLDs"
              ) : setSelectedTlds([...selectedTlds, ...COMMON_TLDS])}
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => category !== "common" ? handleDeselectCategory(
                category === "gtlds" ? "gTLDs" : 
                category === "cctlds" ? "ccTLDs" : "newTLDs"
              ) : setSelectedTlds(selectedTlds.filter(tld => !COMMON_TLDS.includes(tld)))}
            >
              Deselect All
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {tldList.map((tld) => (
            <div key={tld} className="flex items-center space-x-2">
              <Checkbox 
                id={`tld-${tld}`} 
                checked={selectedTlds.includes(tld)}
                onCheckedChange={() => handleTldToggle(tld)}
              />
              <label 
                htmlFor={`tld-${tld}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tld}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Check Domains</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/history">
              <History className="mr-2 h-4 w-4" />
              History
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/favorites">
              <Star className="mr-2 h-4 w-4" />
              Favorites
            </a>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="availability" className="mb-6" onValueChange={(value) => setActiveTab(value as "availability" | "whois")}>
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="availability" className="flex-1">
            <Search className="mr-2 h-4 w-4" />
            Check Availability
          </TabsTrigger>
          <TabsTrigger value="whois" className="flex-1">
            <Database className="mr-2 h-4 w-4" />
            Check WHOIS
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="availability">
          <Tabs defaultValue="single">
            <TabsList className="mb-6">
              <TabsTrigger value="single">Single Domain</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Check</TabsTrigger>
              <TabsTrigger value="tlds">Multiple TLDs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="single">
              <Card>
                <CardHeader>
                  <CardTitle>Check a Single Domain</CardTitle>
                  <CardDescription>
                    Check if a domain name is available for registration.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="singleDomain">Domain Name</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="singleDomain"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                        placeholder="example.com"
                        required
                      />
                      <Button 
                        type="button"
                        onClick={handleSingleCheck}
                        disabled={isCheckingSingle}
                      >
                        {isCheckingSingle ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Check
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {singleResult && (
                    <div className={`p-4 rounded-md ${singleResult.available ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                      <div className="flex items-center">
                        {singleResult.available ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span className="font-medium text-green-800">
                              {singleResult.domain} is available for registration!
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-red-500 mr-2" />
                            <span className="font-medium text-red-800">
                              {singleResult.domain} is already registered.
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="bulk">
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Domain Check</CardTitle>
                  <CardDescription>
                    Check multiple domains at once (one per line).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bulkDomains">Domain Names (one per line)</Label>
                    <Textarea 
                      id="bulkDomains"
                      value={bulkDomains}
                      onChange={(e) => setBulkDomains(e.target.value)}
                      placeholder="example.com&#10;mydomain.org&#10;test.net"
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div>
                    <Button 
                      type="button"
                      onClick={handleBulkCheck}
                      disabled={isCheckingBulk}
                      className="w-full"
                    >
                      {isCheckingBulk ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Checking Domains...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Check Domains
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {bulkResults.length > 0 && (
                    <div className="rounded-md border mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Domain Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">WHOIS</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bulkResults.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{result.domain}</TableCell>
                              <TableCell>
                                {result.error ? (
                                  <span className="text-yellow-600 flex items-center">
                                    {result.error}
                                  </span>
                                ) : result.available ? (
                                  <span className="text-green-600 flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Available
                                  </span>
                                ) : (
                                  <span className="text-red-600 flex items-center">
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Registered
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {!result.error && (
                                  <div className="flex items-center justify-between">
                                    {bulkWhoisData[result.domain] ? (
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button variant="outline" size="sm">
                                            <Info className="h-4 w-4" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-3 w-[480px] max-h-[500px] overflow-auto">
                                          <h3 className="font-semibold mb-2 text-sm">WHOIS Information</h3>
                                          {renderWhoisData(bulkWhoisData[result.domain])}
                                        </PopoverContent>
                                      </Popover>
                                    ) : (
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => fetchBulkWhoisData(result.domain)}
                                        disabled={loadingWhoisDomains.includes(result.domain)}
                                      >
                                        {loadingWhoisDomains.includes(result.domain) ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Database className="h-4 w-4" />
                                        )}
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tlds">
              <Card>
                <CardHeader>
                  <CardTitle>Check Multiple TLDs</CardTitle>
                  <CardDescription>
                    Check a domain name across multiple top-level domains (TLDs).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="baseDomain">Base Domain Name</Label>
                    <Input 
                      id="baseDomain"
                      value={baseDomain}
                      onChange={(e) => setBaseDomain(e.target.value)}
                      placeholder="example"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter the domain name without TLD (e.g., "example" to check example.com, example.org, etc.)
                    </p>
                  </div>

                  <div className="space-y-2 mt-6 border rounded-md p-4">
                    <h3 className="font-medium text-base mb-4">Select TLDs to check ({selectedTlds.length} selected)</h3>
                    
                    <Tabs 
                      defaultValue="common" 
                      className="w-full" 
                      onValueChange={(value) => setActiveTldCategory(value as "common" | "gtlds" | "cctlds" | "newtlds")}
                    >
                      <TabsList className="mb-4 w-full grid grid-cols-4">
                        <TabsTrigger value="common">Common</TabsTrigger>
                        <TabsTrigger value="gtlds">gTLDs</TabsTrigger>
                        <TabsTrigger value="cctlds">ccTLDs</TabsTrigger>
                        <TabsTrigger value="newtlds">New TLDs</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="common">
                        {renderTldCategoryContent("common")}
                      </TabsContent>
                      
                      <TabsContent value="gtlds">
                        {renderTldCategoryContent("gtlds")}
                      </TabsContent>
                      
                      <TabsContent value="cctlds">
                        {renderTldCategoryContent("cctlds")}
                      </TabsContent>
                      
                      <TabsContent value="newtlds">
                        {renderTldCategoryContent("newtlds")}
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  {selectedTlds.length > 0 && (
                    <div className="mt-2">
                      <Label className="text-sm font-medium mb-2 block">Selected TLDs:</Label>
                      <div className="flex flex-wrap gap-1">
                        {selectedTlds.map(tld => (
                          <div 
                            key={tld} 
                            className="bg-slate-100 text-slate-800 px-2 py-1 rounded-md text-xs flex items-center"
                          >
                            {tld}
                            <Button
                              type="button"
                              variant="ghost"
                              className="h-4 w-4 p-0 ml-1 text-slate-500 hover:text-slate-800"
                              onClick={() => handleTldToggle(tld)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    type="button"
                    onClick={handleMultiTldCheck}
                    disabled={isCheckingTlds}
                    className="w-full mt-4"
                  >
                    {isCheckingTlds ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking TLDs...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Check All Selected TLDs
                      </>
                    )}
                  </Button>
                  
                  {tldResults.length > 0 && (
                    <div className="rounded-md border mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Domain Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">WHOIS</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tldResults.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{result.domain}</TableCell>
                              <TableCell>
                                {result.error ? (
                                  <span className="text-yellow-600 flex items-center">
                                    {result.error}
                                  </span>
                                ) : result.available ? (
                                  <span className="text-green-600 flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Available
                                  </span>
                                ) : (
                                  <span className="text-red-600 flex items-center">
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Registered
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {!result.error && (
                                  <div className="flex items-center justify-between">
                                    {tldWhoisData[result.domain] ? (
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button variant="outline" size="sm">
                                            <Info className="h-4 w-4" />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="p-3 w-[480px] max-h-[500px] overflow-auto">
                                          <h3 className="font-semibold mb-2 text-sm">WHOIS Information</h3>
                                          {renderWhoisData(tldWhoisData[result.domain])}
                                        </PopoverContent>
                                      </Popover>
                                    ) : (
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => fetchTldWhoisData(result.domain)}
                                        disabled={loadingTldWhoisDomains.includes(result.domain)}
                                      >
                                        {loadingTldWhoisDomains.includes(result.domain) ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <Database className="h-4 w-4" />
                                        )}
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="whois">
          <Card>
            <CardHeader>
              <CardTitle>WHOIS Lookup</CardTitle>
              <CardDescription>
                Look up detailed WHOIS information for a domain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whoisDomain">Domain Name</Label>
                <div className="flex gap-2">
                  <Input 
                    id="whoisDomain"
                    value={whoisDomain}
                    onChange={(e) => setWhoisDomain(e.target.value)}
                    placeholder="example.com"
                    required
                  />
                  <Button 
                    type="button"
                    onClick={fetchWhoisInfo}
                    disabled={isFetchingWhois}
                  >
                    {isFetchingWhois ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <Database className="mr-2 h-4 w-4" />
                        Lookup WHOIS
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {whoisData && (
                <div className="mt-3 p-3 bg-slate-50 rounded-md border border-gray-200 overflow-auto max-h-96">
                  <h3 className="font-semibold mb-2 text-sm">WHOIS Information for {whoisDomain}</h3>
                  {renderWhoisData(whoisData)}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CheckAvailability;
