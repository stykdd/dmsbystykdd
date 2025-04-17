
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

// Mock data for the statistics dashboard
const usageData = [
  { month: 'Jan', verifications: 45, searches: 120, appraisals: 30 },
  { month: 'Feb', verifications: 52, searches: 140, appraisals: 35 },
  { month: 'Mar', verifications: 61, searches: 155, appraisals: 40 },
  { month: 'Apr', verifications: 67, searches: 162, appraisals: 45 },
  { month: 'May', verifications: 70, searches: 170, appraisals: 50 },
  { month: 'Jun', verifications: 78, searches: 190, appraisals: 55 },
];

const pieData = [
  { name: 'Email Verifications', value: 400, fill: '#0088FE' },
  { name: 'Keyword Searches', value: 300, fill: '#00C49F' },
  { name: 'Domain Appraisals', value: 200, fill: '#FFBB28' },
  { name: 'Website Scrapes', value: 100, fill: '#FF8042' },
];

const StatsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6months');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Statistics Dashboard</h1>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Email Verifications</CardTitle>
            <CardDescription>Total verified emails</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,452</div>
            <div className="text-sm text-green-500">+12% from last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Keyword Searches</CardTitle>
            <CardDescription>Total searches performed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3,827</div>
            <div className="text-sm text-green-500">+8% from last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Domain Appraisals</CardTitle>
            <CardDescription>Total domains appraised</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">824</div>
            <div className="text-sm text-green-500">+15% from last month</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage">
        <TabsList>
          <TabsTrigger value="usage">Usage Trends</TabsTrigger>
          <TabsTrigger value="distribution">Feature Distribution</TabsTrigger>
        </TabsList>
        <TabsContent value="usage" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage Over Time</CardTitle>
              <CardDescription>Track how frequently each feature is used</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={usageData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="verifications" stroke="#0088FE" name="Email Verifications" />
                    <Line type="monotone" dataKey="searches" stroke="#00C49F" name="Keyword Searches" />
                    <Line type="monotone" dataKey="appraisals" stroke="#FFBB28" name="Domain Appraisals" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="distribution" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage Distribution</CardTitle>
              <CardDescription>See which features are used most often</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={160}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    />
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Feature Comparison</CardTitle>
          <CardDescription>Compare feature usage side by side</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={usageData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="verifications" name="Email Verifications" fill="#0088FE" />
                <Bar dataKey="searches" name="Keyword Searches" fill="#00C49F" />
                <Bar dataKey="appraisals" name="Domain Appraisals" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsDashboard;
