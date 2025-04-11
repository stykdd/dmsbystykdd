import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Clock, 
  AlertTriangle, 
  Trash2,
  PlusCircle,
  ArrowRight,
  DollarSign,
  ShoppingCart,
  ListTodo,
  Key
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDomainStats, getDomains } from '../services/domainService';
import { DomainStats, Domain } from '../types/domain';
import { formatDate } from '@/lib/date-utils';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DomainStats>({
    total: 0,
    active: 0,
    expiring: 0,
    expired: 0,
    trash: 0,
    totalSold: 0,
    totalRevenue: 0
  });
  
  const [recentDomains, setRecentDomains] = useState<Domain[]>([]);
  const [expiringDomains, setExpiringDomains] = useState<Domain[]>([]);
  
  useEffect(() => {
    // Get domain statistics
    const domainStats = getDomainStats();
    setStats(domainStats);
    
    // Get recent domains
    const allDomains = getDomains({ sortBy: 'updatedAt', sortOrder: 'desc' });
    setRecentDomains(allDomains.slice(0, 5));
    
    // Get expiring domains
    const expiring = getDomains({ status: 'expiring' });
    setExpiringDomains(expiring);
  }, []);

  // Format currency for display
  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return '$0';
    return `$${amount.toLocaleString()}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/domains/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Domain
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium leading-tight">Active<br/>Domains</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Total active domains
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="link" className="p-0 text-xs text-blue-500 hover:underline">
              <Link to="/domains">View Domains</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium leading-tight">Expiring<br/>Domains</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiring}</div>
            <p className="text-xs text-muted-foreground">
              Domains expiring
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="link" className="p-0 text-xs text-blue-500 hover:underline">
              <Link to="/expiration">View Domains</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium leading-tight">Expired<br/>Domains</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expired}</div>
            <p className="text-xs text-muted-foreground">
              Domains expired
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="link" className="p-0 text-xs text-blue-500 hover:underline">
              <Link to="/expired">View Domains</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium leading-tight">Deleted<br/>Domains</CardTitle>
            <Trash2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trash}</div>
            <p className="text-xs text-muted-foreground">
              Domains in trash
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="link" className="p-0 text-xs text-blue-500 hover:underline">
              <Link to="/trash">View Trash</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium leading-tight">Sold<br/>Domains</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSold || 0}</div>
            <p className="text-xs text-muted-foreground">
              Domains sold
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="link" className="p-0 text-xs text-blue-500 hover:underline">
              <Link to="/sales">View Sales</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium leading-tight">Total<br/>Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From sold domains
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="link" className="p-0 text-xs text-blue-500 hover:underline">
              <Link to="/sales">View Sales</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {expiringDomains.length > 0 && (
        <Card className="border border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Domains Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {expiringDomains.map(domain => (
                <li key={domain.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{domain.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      Expires in {domain.daysUntilExpiration} days
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/domains/${domain.id}`}>View</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/expiration">
                View All Expiring Domains
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Domains</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentDomains.map(domain => (
                <li key={domain.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{domain.name}</div>
                    <div className="text-sm text-gray-500">
                      {domain.status === 'active' && (
                        <span className="domain-status-active">Active</span>
                      )}
                      {domain.status === 'expiring' && (
                        <span className="domain-status-expiring">Expiring</span>
                      )}
                      {domain.status === 'expired' && (
                        <span className="domain-status-expired">Expired</span>
                      )}
                      {domain.status === 'trash' && (
                        <span className="domain-status-trash">Trash</span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Expires: {formatDate(domain.expirationDate)}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/domains">
                View All Domains
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/domains/add">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Domain
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/check-availability">
                  <Globe className="mr-2 h-4 w-4" />
                  Check Domains
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/todo">
                  <ListTodo className="mr-2 h-4 w-4" />
                  To-Do List
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/password-generator">
                  <Key className="mr-2 h-4 w-4" />
                  Password Generator
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/sales">
                  <DollarSign className="mr-2 h-4 w-4" />
                  View Sales History
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/trash">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Manage Trash
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
