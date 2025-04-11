
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

// Extended mock data with dates
const allUserLoginData = [
  { date: 'Apr 01', count: 12, fullDate: '2024-04-01' },
  { date: 'Apr 02', count: 19, fullDate: '2024-04-02' },
  { date: 'Apr 03', count: 15, fullDate: '2024-04-03' },
  { date: 'Apr 04', count: 18, fullDate: '2024-04-04' },
  { date: 'Apr 05', count: 21, fullDate: '2024-04-05' },
  { date: 'Apr 06', count: 13, fullDate: '2024-04-06' },
  { date: 'Apr 07', count: 8, fullDate: '2024-04-07' },
  { date: 'Mar 25', count: 10, fullDate: '2024-03-25' },
  { date: 'Mar 26', count: 14, fullDate: '2024-03-26' },
  { date: 'Mar 27', count: 16, fullDate: '2024-03-27' },
  { date: 'Mar 28', count: 12, fullDate: '2024-03-28' },
  { date: 'Mar 29', count: 9, fullDate: '2024-03-29' },
  { date: 'Mar 30', count: 7, fullDate: '2024-03-30' },
  { date: 'Mar 31', count: 11, fullDate: '2024-03-31' },
];

const domainActivityData = [
  { name: 'Added', count: 24 },
  { name: 'Updated', count: 13 },
  { name: 'Deleted', count: 5 },
  { name: 'Renewed', count: 8 },
  { name: 'Expired', count: 3 },
];

const usersByRole = [
  { name: 'Admin', count: 3 },
  { name: 'User', count: 12 },
  { name: 'Editor', count: 7 },
  { name: 'Viewer', count: 9 },
];

// Date range options
const dateRanges = [
  { value: '7days', label: 'Last 7 Days' },
  { value: '14days', label: 'Last 14 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: 'all', label: 'All Time' },
];

const UserActivityCharts: React.FC = () => {
  const [dateRange, setDateRange] = useState('7days');
  
  // Filter data based on selected date range
  const filterDataByDateRange = (range: string) => {
    const today = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '7days':
        startDate.setDate(today.getDate() - 7);
        break;
      case '14days':
        startDate.setDate(today.getDate() - 14);
        break;
      case '30days':
        startDate.setDate(today.getDate() - 30);
        break;
      case 'all':
      default:
        return allUserLoginData;
    }
    
    return allUserLoginData.filter(item => {
      const itemDate = new Date(item.fullDate);
      return itemDate >= startDate && itemDate <= today;
    });
  };
  
  const userLoginData = filterDataByDateRange(dateRange);

  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>User Activity Analytics</CardTitle>
            <CardDescription className="mt-1">
              User login patterns, domain management activity, and system usage metrics
            </CardDescription>
          </div>
          <div className="mt-3 sm:mt-0 flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="logins">
          <TabsList className="mb-4">
            <TabsTrigger value="logins">User Logins</TabsTrigger>
            <TabsTrigger value="domains">Domain Activity</TabsTrigger>
            <TabsTrigger value="users">User Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="logins" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={userLoginData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  name="Logins" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="domains" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={domainActivityData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Domain Operations" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="users" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={usersByRole}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Users" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserActivityCharts;
