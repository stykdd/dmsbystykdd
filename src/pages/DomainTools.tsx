
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CheckAvailability from './CheckAvailability';
import KeywordSearchCount from './features/KeywordSearchCount';
import BulkEmailVerification from './features/BulkEmailVerification';
import DomainAppraisal from './features/DomainAppraisal';
import WebsiteScraper from './features/WebsiteScraper';

const DomainTools = () => {
  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Domain Tools</h1>
        <p className="text-muted-foreground">Powerful tools to manage and analyze your domains</p>
      </div>
      
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle>Domain Tools Suite</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="check" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="check">Check Availability</TabsTrigger>
              <TabsTrigger value="keyword">Keyword Search</TabsTrigger>
              <TabsTrigger value="email">Email Verification</TabsTrigger>
              <TabsTrigger value="appraisal">Domain Appraisal</TabsTrigger>
              <TabsTrigger value="scraper">Website Scraper</TabsTrigger>
            </TabsList>
            <TabsContent value="check" className="mt-0">
              <CheckAvailability />
            </TabsContent>
            <TabsContent value="keyword" className="mt-0">
              <KeywordSearchCount />
            </TabsContent>
            <TabsContent value="email" className="mt-0">
              <BulkEmailVerification />
            </TabsContent>
            <TabsContent value="appraisal" className="mt-0">
              <DomainAppraisal />
            </TabsContent>
            <TabsContent value="scraper" className="mt-0">
              <WebsiteScraper />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DomainTools;
