
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import CheckAvailability from './CheckAvailability';
import KeywordSearchCount from './features/KeywordSearchCount';
import BulkEmailVerification from './features/BulkEmailVerification';
import DomainAppraisal from './features/DomainAppraisal';
import WebsiteScraper from './features/WebsiteScraper';

const DomainTools = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Domain Tools</CardTitle>
        </CardHeader>
        <Tabs defaultValue="check" className="p-6">
          <TabsList className="w-full">
            <TabsTrigger value="check">Check Availability</TabsTrigger>
            <TabsTrigger value="keyword">Keyword Search</TabsTrigger>
            <TabsTrigger value="email">Email Verification</TabsTrigger>
            <TabsTrigger value="appraisal">Domain Appraisal</TabsTrigger>
            <TabsTrigger value="scraper">Website Scraper</TabsTrigger>
          </TabsList>
          <TabsContent value="check">
            <CheckAvailability />
          </TabsContent>
          <TabsContent value="keyword">
            <KeywordSearchCount />
          </TabsContent>
          <TabsContent value="email">
            <BulkEmailVerification />
          </TabsContent>
          <TabsContent value="appraisal">
            <DomainAppraisal />
          </TabsContent>
          <TabsContent value="scraper">
            <WebsiteScraper />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default DomainTools;
