
import React, { useState, useEffect } from 'react';
import { Filter, Globe } from 'lucide-react';
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
import { Badge } from "@/components/ui/badge";
import { getDomains } from "@/services/domainService";
import { Domain } from "@/types/domain";

// Mock data for users
const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "User", status: "Active", lastLogin: "2024-04-01 14:22" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "User", status: "Inactive", lastLogin: "2024-03-25 09:15" },
  { id: "3", name: "Admin User", email: "demo@example.com", role: "Admin", status: "Active", lastLogin: "2024-04-04 16:30" },
  { id: "4", name: "Sarah Johnson", email: "sarah@example.com", role: "User", status: "Active", lastLogin: "2024-04-02 11:45" }
];

// Mock user-domain associations
const mockUserDomains = {
  "1": ["example.com", "testsite.net"],
  "2": ["mydomain.org"],
  "3": ["myapp.io", "deletedsite.com"],
  "4": []
};

const UserDomains: React.FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>("all");
  const [filteredUsers, setFilteredUsers] = useState<typeof mockUsers>(mockUsers);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [userDomains, setUserDomains] = useState<Record<string, Domain[]>>({});
  
  useEffect(() => {
    // Get all domains
    const allDomains = getDomains();
    setDomains(allDomains);
    
    // Assign domains to users based on our mock data
    const domainsPerUser: Record<string, Domain[]> = {};
    
    mockUsers.forEach(user => {
      const userDomainNames = mockUserDomains[user.id] || [];
      domainsPerUser[user.id] = allDomains.filter(domain => 
        userDomainNames.includes(domain.name)
      );
    });
    
    setUserDomains(domainsPerUser);
  }, []);
  
  useEffect(() => {
    if (selectedUserId === "all") {
      setFilteredUsers(mockUsers);
    } else {
      setFilteredUsers(mockUsers.filter(user => user.id === selectedUserId));
    }
  }, [selectedUserId]);

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge variant="default" className="bg-green-500">Active</Badge>;
    } else if (status === "expiring") {
      return <Badge variant="default" className="bg-yellow-500">Expiring</Badge>;
    } else if (status === "expired") {
      return <Badge variant="default" className="bg-red-500">Expired</Badge>;
    } else if (status === "trash") {
      return <Badge variant="default" className="bg-gray-500">Trash</Badge>;
    }
    return null;
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filter by User:</span>
        </div>
        <Select
          value={selectedUserId}
          onValueChange={setSelectedUserId}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {mockUsers.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-medium">{user.name}</h3>
              <Badge variant="outline" className="ml-2">
                {userDomains[user.id]?.length || 0} domains
              </Badge>
            </div>
            
            {userDomains[user.id]?.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Days Until Expiration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userDomains[user.id]?.map((domain) => (
                    <TableRow key={domain.id}>
                      <TableCell className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-500" />
                        {domain.name}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(domain.status)}
                      </TableCell>
                      <TableCell>{domain.expirationDate}</TableCell>
                      <TableCell>
                        {domain.daysUntilExpiration > 0 
                          ? `${domain.daysUntilExpiration} days` 
                          : "Expired"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                No domains registered for this user.
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default UserDomains;
