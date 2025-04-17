
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Clock, Award, Info, BarChart, Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AppraisalResult {
  domain: string;
  value: number;
  confidence: 'low' | 'medium' | 'high';
  factors: {
    length: number;
    extension: number;
    memorability: number;
    keywords: number;
    marketability: number;
  };
  recentSales: Array<{
    domain: string;
    price: number;
    date: string;
  }>;
}

const DomainAppraisal: React.FC = () => {
  const [domain, setDomain] = useState<string>("");
  const [isAppraising, setIsAppraising] = useState<boolean>(false);
  const [result, setResult] = useState<AppraisalResult | null>(null);
  const [appraisalHistory, setAppraisalHistory] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAppraisal = () => {
    if (!domain.trim()) {
      setError("Please enter a domain name");
      return;
    }

    // Simple validation for domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      setError("Please enter a valid domain name (e.g., example.com)");
      return;
    }

    setError(null);
    setIsAppraising(true);

    // Simulate API call with mock data
    setTimeout(() => {
      // Generate random appraisal value between $500 and $20,000
      const value = Math.floor(Math.random() * 19500) + 500;
      
      // Random confidence level
      const confidenceLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
      const confidence = confidenceLevels[Math.floor(Math.random() * 3)];
      
      // Random factor scores between 1-10
      const factors = {
        length: Math.floor(Math.random() * 10) + 1,
        extension: Math.floor(Math.random() * 10) + 1,
        memorability: Math.floor(Math.random() * 10) + 1,
        keywords: Math.floor(Math.random() * 10) + 1,
        marketability: Math.floor(Math.random() * 10) + 1
      };
      
      // Mock recent sales data
      const recentSales = [
        {
          domain: `similar${Math.floor(Math.random() * 100)}.com`,
          price: Math.floor(Math.random() * 15000) + 1000,
          date: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`
        },
        {
          domain: `related${Math.floor(Math.random() * 100)}.com`,
          price: Math.floor(Math.random() * 25000) + 2000,
          date: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`
        },
        {
          domain: `keyword${Math.floor(Math.random() * 100)}.net`,
          price: Math.floor(Math.random() * 8000) + 500,
          date: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`
        }
      ];
      
      const appraisalResult: AppraisalResult = {
        domain,
        value,
        confidence,
        factors,
        recentSales
      };
      
      setResult(appraisalResult);
      
      // Add to history if not already present
      if (!appraisalHistory.includes(domain)) {
        setAppraisalHistory(prev => [domain, ...prev].slice(0, 10));
      }
      
      setIsAppraising(false);
    }, 1500);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get confidence color
  const getConfidenceColor = (confidence: 'low' | 'medium' | 'high') => {
    switch (confidence) {
      case 'low': return 'text-yellow-500';
      case 'medium': return 'text-blue-500';
      case 'high': return 'text-green-500';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Domain Appraisal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Domain Value Estimation</CardTitle>
            <CardDescription>
              Get an estimated market value for any domain name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter domain name (e.g., example.com)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAppraisal()}
                  className="flex-1"
                />
                <Button onClick={handleAppraisal} disabled={isAppraising}>
                  {isAppraising ? "Calculating..." : "Appraise"}
                </Button>
              </div>
              
              {isAppraising && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="mt-4 text-muted-foreground">Analyzing domain factors...</p>
                </div>
              )}
              
              {result && !isAppraising && (
                <div className="space-y-6">
                  <div className="bg-muted p-6 rounded-lg">
                    <div className="text-center">
                      <h3 className="text-xl font-medium mb-2">Estimated Value</h3>
                      <div className="flex items-center justify-center">
                        <DollarSign className="h-10 w-10 text-primary" />
                        <span className="text-4xl font-bold">{formatCurrency(result.value)}</span>
                      </div>
                      <div className={`mt-2 ${getConfidenceColor(result.confidence)}`}>
                        {result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)} confidence
                      </div>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="factors">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="factors">Appraisal Factors</TabsTrigger>
                      <TabsTrigger value="comparables">Comparable Sales</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="factors" className="space-y-4 pt-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Domain Length</span>
                            <span className="text-sm">{result.factors.length}/10</span>
                          </div>
                          <Progress value={result.factors.length * 10} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">TLD Value</span>
                            <span className="text-sm">{result.factors.extension}/10</span>
                          </div>
                          <Progress value={result.factors.extension * 10} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Memorability</span>
                            <span className="text-sm">{result.factors.memorability}/10</span>
                          </div>
                          <Progress value={result.factors.memorability * 10} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Keyword Value</span>
                            <span className="text-sm">{result.factors.keywords}/10</span>
                          </div>
                          <Progress value={result.factors.keywords * 10} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Marketability</span>
                            <span className="text-sm">{result.factors.marketability}/10</span>
                          </div>
                          <Progress value={result.factors.marketability * 10} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="p-4 bg-muted rounded-md">
                        <div className="flex gap-2">
                          <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground">
                            Our domain appraisal algorithm uses machine learning to analyze historical sales data, domain characteristics, and market trends to estimate the value of your domain.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="comparables" className="pt-4">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">Recent comparable domain sales:</p>
                        
                        <div className="space-y-3">
                          {result.recentSales.map((sale, index) => (
                            <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                              <div className="flex items-center">
                                <Tag className="h-5 w-5 mr-2 text-muted-foreground" />
                                <span className="font-medium">{sale.domain}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4 inline-block mr-1" />
                                  {formatDate(sale.date)}
                                </div>
                                <div className="font-bold">
                                  {formatCurrency(sale.price)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="p-4 bg-muted rounded-md">
                          <div className="flex gap-2">
                            <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">
                              Comparable sales are based on domains with similar characteristics that have been sold recently.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appraisal History</CardTitle>
            </CardHeader>
            <CardContent>
              {appraisalHistory.length > 0 ? (
                <ul className="space-y-2">
                  {appraisalHistory.map((domain, index) => (
                    <li key={index}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start h-auto py-2"
                        onClick={() => {
                          setDomain(domain);
                          handleAppraisal();
                        }}
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        {domain}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Your recent appraisals will appear here
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Valuation Factors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Award className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Domain Age</h4>
                  <p className="text-sm text-muted-foreground">Older domains often have higher SEO value</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <BarChart className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Market Trends</h4>
                  <p className="text-sm text-muted-foreground">Domain values fluctuate based on industry trends</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <Tag className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium">Brandability</h4>
                  <p className="text-sm text-muted-foreground">Short, memorable domains command higher prices</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DomainAppraisal;
