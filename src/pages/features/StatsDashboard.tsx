import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  LineChart, 
  DonutChart,
  AreaChart
} from "@/components/ui/chart";
import { 
  ChartBar, 
  TrendingUp, 
  Search, 
  MailCheck, 
  Star, 
  Clock, 
  RefreshCw, 
  DollarSign,
  Calendar,
  ChevronDown
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const StatsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("month");
  
  // Mock data for statistics
  const stats = {
    totalDomains: 143,
    availabilityChecks: 567,
    emailVerifications: 1238,
    savedDomains: 42,
    wishlistItems: 28,
    domainAppraisals: 89
  };
  
  // Domains by category data for donut chart
  const domainsByCategory = [
    { name: "Technology", value: 45 },
    { name: "Finance", value: 28 },
    { name: "Health", value: 21 },
    { name: "E-commerce", value: 19 },
    { name: "Education", value: 16 },
    { name: "Entertainment", value: 14 }
  ];
  
  // Mock data for verification history
  const verificationHistory = [
    { date: "2023-10-01", count: 42 },
    { date: "2023-10-08", count: 56 },
    { date: "2023-10-15", count: 34 },
    { date: "2023-10-22", count: 48 },
    { date: "2023-10-29", count: 62 },
    { date: "2023-11-05", count: 53 },
    { date: "2023-11-12", count: 71 },
    { date: "2023-11-19", count: 44 },
    { date: "2023-11-26", count: 39 },
    { date: "2023-12-03", count: 51 },
    { date: "2023-12-10", count: 63 },
    { date: "2023-12-17", count: 58 }
  ];
  
  // Mock data for domain activity
  const domainActivity = [
    { date: "2023-10-01", added: 8, removed: 3 },
    { date: "2023-10-08", added: 12, removed: 6 },
    { date: "2023-10-15", added: 7, removed: 2 },
    { date: "2023-10-22", added: 9, removed: 4 },
    { date: "2023-10-29", added: 15, removed: 5 },
    { date: "2023-11-05", added: 11, removed: 7 },
    { date: "2023-11-12", added: 17, removed: 8 },
    { date: "2023-11-19", added: 10, removed: 3 },
    { date: "2023-11-26", added: 9, removed: 2 },
    { date: "2023-12-03", added: 12, removed: 5 },
    { date: "2023-12-10", added: 15, removed: 7 },
    { date: "2023-12-17", added: 13, removed: 4 }
  ];
  
  // Mock data for top TLDs
  const topTLDs = [
    { name: ".com", count: 72, percentage: 50 },
    { name: ".org", count: 24, percentage: 17 },
    { name: ".net", count: 18, percentage: 13 },
    { name: ".io", count: 14, percentage: 10 },
    { name: ".co", count: 8, percentage: 6 },
    { name: "Others", count: 7, percentage: 4 }
  ];
  
  // Mock data for recent activities
  const recentActivities = [
    { type: "verification", subject: "Bulk email verification", count: 25, date: "2023-12-18T14:30:00Z" },
    { type: "search", subject: "Keyword searches", count: 8, date: "2023-12-18T10:15:00Z" },
    { type: "appraisal", subject: "techdomain.io", date: "2023-12-17T16:45:00Z" },
    { type: "wishlist", subject: "premiumdomain.com", date: "2023-12-16T09:20:00Z" },
    { type: "verification", subject: "Bulk email verification", count: 15, date: "2023-12-15T13:10:00Z" }
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Check if date is today
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if date is yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise return formatted date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
           ` at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Statistics Dashboard</h1>
        
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
              <SelectItem value="year">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
              <CardDescription>Your domain portfolio</CardDescription>
            </div>
            <ChartBar className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDomains}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12 from last {timeRange}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Availability Checks</CardTitle>
              <CardDescription>Domains searched for availability</CardDescription>
            </div>
            <Search className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availabilityChecks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +89 from last {timeRange}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Email Verifications</CardTitle>
              <CardDescription>Emails verified for validity</CardDescription>
            </div>
            <MailCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.emailVerifications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +254 from last {timeRange}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Domain Activity</CardTitle>
            <CardDescription>
              Domains added and removed over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={domainActivity}
              categories={["added", "removed"]}
              index="date"
              colors={["blue", "red"]}
              valueFormatter={(value) => `${value} domains`}
              className="h-80"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Domains by Category</CardTitle>
            <CardDescription>
              Distribution across categories
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <DonutChart
              data={domainsByCategory}
              category="value"
              index="name"
              valueFormatter={(value) => `${value} domains`}
              className="h-80"
              colors={["blue", "violet", "cyan", "amber", "emerald", "rose"]}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Verification Activity</CardTitle>
            <CardDescription>
              Email verification trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={verificationHistory}
              category="count"
              index="date"
              colors={["purple"]}
              valueFormatter={(value) => `${value} emails`}
              className="h-80"
            />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Feature Usage</CardTitle>
              <CardDescription>Usage statistics for platform features</CardDescription>
            </div>
            <Tabs defaultValue="count">
              <TabsList className="grid grid-cols-2 h-8">
                <TabsTrigger value="count" className="text-xs">Count</TabsTrigger>
                <TabsTrigger value="percentage" className="text-xs">Percentage</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <BarChart
              data={[
                { feature: "Email Verifications", count: stats.emailVerifications, percentage: 63 },
                { feature: "Availability Checks", count: stats.availabilityChecks, percentage: 29 },
                { feature: "Domain Appraisals", count: stats.domainAppraisals, percentage: 5 },
                { feature: "Wishlist Items", count: stats.wishlistItems, percentage: 2 },
                { feature: "Saved Domains", count: stats.savedDomains, percentage: 1 }
              ]}
              index="feature"
              categories={["count", "percentage"]}
              valueFormatter={(value) => `${value}`}
              colors={["blue"]}
              className="h-80"
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top TLDs</CardTitle>
            <CardDescription>
              Most common domain extensions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTLDs.map((tld, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{tld.name}</span>
                    <div className="flex gap-2 items-center">
                      <span className="text-muted-foreground">{tld.count}</span>
                      <Badge variant="outline" className="text-xs">
                        {tld.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={tld.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest platform usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivities.map((activity, index) => {
                // Determine icon based on activity type
                let Icon;
                let iconColor;
                
                switch (activity.type) {
                  case "verification":
                    Icon = MailCheck;
                    iconColor = "text-blue-500";
                    break;
                  case "search":
                    Icon = Search;
                    iconColor = "text-purple-500";
                    break;
                  case "appraisal":
                    Icon = DollarSign;
                    iconColor = "text-green-500";
                    break;
                  case "wishlist":
                    Icon = Star;
                    iconColor = "text-amber-500";
                    break;
                  default:
                    Icon = Clock;
                    iconColor = "text-gray-500";
                }
                
                return (
                  <div key={index} className="flex">
                    <div className={`rounded-full p-2 ${iconColor} bg-muted mr-4`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.type === "verification" ? (
                          <>
                            Verified {activity.count} emails via {activity.subject}
                          </>
                        ) : activity.type === "search" ? (
                          <>
                            Performed {activity.count} {activity.subject}
                          </>
                        ) : activity.type === "appraisal" ? (
                          <>
                            Appraised domain value for {activity.subject}
                          </>
                        ) : (
                          <>
                            Added {activity.subject} to wishlist
                          </>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                View All Activity
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsDashboard;
