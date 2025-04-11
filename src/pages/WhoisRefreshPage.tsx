
import React, { useState } from 'react';
import { RefreshCw, Check, AlertTriangle } from 'lucide-react';
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
import { getDomains, refreshWhoisData } from '@/services/domainService';
import { Domain } from '@/types/domain';
import { formatDateWithTime } from '@/lib/date-utils';

const WhoisRefreshPage: React.FC = () => {
  const { toast } = useToast();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState<string[]>([]);
  const [refreshed, setRefreshed] = useState<string[]>([]);
  const [refreshFailed, setRefreshFailed] = useState<string[]>([]);

  React.useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = () => {
    setIsLoading(true);
    const allDomains = getDomains();
    
    if (searchQuery) {
      const filtered = allDomains.filter(domain => 
        domain.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDomains(filtered);
    } else {
      setDomains(allDomains);
    }
    
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadDomains();
  };

  const handleRefreshWhois = async (id: string) => {
    try {
      setRefreshing(prev => [...prev, id]);
      
      await refreshWhoisData(id);
      
      setRefreshing(prev => prev.filter(domainId => domainId !== id));
      setRefreshed(prev => [...prev, id]);
      
      toast({
        title: "WHOIS Refreshed",
        description: "WHOIS data has been successfully updated.",
      });
      
      // Clear the success indication after 3 seconds
      setTimeout(() => {
        setRefreshed(prev => prev.filter(domainId => domainId !== id));
      }, 3000);
      
      loadDomains();
    } catch (error) {
      setRefreshing(prev => prev.filter(domainId => domainId !== id));
      setRefreshFailed(prev => [...prev, id]);
      
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh WHOIS data. Please try again.",
        variant: "destructive",
      });
      
      // Clear the failure indication after 3 seconds
      setTimeout(() => {
        setRefreshFailed(prev => prev.filter(domainId => domainId !== id));
      }, 3000);
    }
  };

  const handleRefreshAll = async () => {
    toast({
      title: "Bulk Refresh Started",
      description: "WHOIS refresh has been initiated for all domains.",
    });
    
    for (const domain of domains) {
      await handleRefreshWhois(domain.id);
    }
    
    toast({
      title: "Bulk Refresh Complete",
      description: "WHOIS refresh has been completed for all domains.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">WHOIS Data Refresh</h1>
        <Button onClick={handleRefreshAll}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh All WHOIS Data
        </Button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4">
        <Input
          placeholder="Search domains..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <Button type="submit">Search</Button>
      </form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain Name</TableHead>
              <TableHead>Registrar</TableHead>
              <TableHead>Last WHOIS Refresh</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : domains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No domains found
                </TableCell>
              </TableRow>
            ) : (
              domains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell className="font-medium">{domain.name}</TableCell>
                  <TableCell>{domain.whoisData?.registrar || 'N/A'}</TableCell>
                  <TableCell>
                    {domain.whoisData?.lastRefreshed 
                      ? formatDateWithTime(domain.whoisData.lastRefreshed)
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline"
                      onClick={() => handleRefreshWhois(domain.id)}
                      disabled={refreshing.includes(domain.id)}
                      className="flex items-center"
                    >
                      {refreshing.includes(domain.id) ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Refreshing...
                        </>
                      ) : refreshed.includes(domain.id) ? (
                        <>
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          Updated
                        </>
                      ) : refreshFailed.includes(domain.id) ? (
                        <>
                          <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                          Failed
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh WHOIS
                        </>
                      )}
                    </Button>
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

export default WhoisRefreshPage;
