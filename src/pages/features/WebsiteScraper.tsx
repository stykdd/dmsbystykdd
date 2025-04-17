
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Copy, Mail, Phone, Globe, Download, AlertCircle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock data structure for scraped results
interface ScrapedData {
  domain: string;
  emails: string[];
  phones: string[];
  socialMedia: Array<{ platform: string; url: string }>;
  lastScraped: string;
}

const WebsiteScraper: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scrapingOptions, setScrapingOptions] = useState({
    emails: true,
    phones: true,
    socialMedia: true
  });
  const [scrapingHistory, setScrapingHistory] = useState<string[]>([]);

  const handleScrape = () => {
    if (!url.trim()) {
      setError("Please enter a website URL");
      return;
    }

    // Simple URL validation
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+.?)$/;
    let processedUrl = url;

    // Add https:// if not present
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = 'https://' + processedUrl;
    }

    // Check if domain part is valid
    const domainMatch = processedUrl.match(/^https?:\/\/([^\/]+)/i);
    if (!domainMatch || !urlRegex.test(domainMatch[1])) {
      setError("Please enter a valid URL (e.g., example.com or https://example.com)");
      return;
    }

    setError(null);
    setIsLoading(true);

    // Extract domain for display
    const domain = processedUrl.replace(/^https?:\/\//i, '').split('/')[0];

    // Simulate API call with mock data
    setTimeout(() => {
      // Generate random number of emails (1-5)
      const numEmails = Math.floor(Math.random() * 5) + 1;
      const emails = Array.from({ length: numEmails }, (_, i) => {
        const prefixes = ['info', 'contact', 'support', 'sales', 'hello', 'admin'];
        return `${prefixes[Math.floor(Math.random() * prefixes.length)]}@${domain}`;
      });
      
      // Generate random number of phone numbers (1-3)
      const numPhones = Math.floor(Math.random() * 3) + 1;
      const phones = Array.from({ length: numPhones }, () => {
        return `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
      });
      
      // Generate social media profiles
      const socialPlatforms = ['Facebook', 'Twitter', 'LinkedIn', 'Instagram', 'YouTube'];
      const numSocial = Math.floor(Math.random() * 5) + 1;
      const platformsToUse = [...socialPlatforms].sort(() => 0.5 - Math.random()).slice(0, numSocial);
      
      const socialMedia = platformsToUse.map(platform => {
        // Convert domain to a suitable handle
        const handle = domain.split('.')[0].replace(/-/g, '');
        let url;
        
        switch (platform) {
          case 'Facebook':
            url = `https://facebook.com/${handle}`;
            break;
          case 'Twitter':
            url = `https://twitter.com/${handle}`;
            break;
          case 'LinkedIn':
            url = `https://linkedin.com/company/${handle}`;
            break;
          case 'Instagram':
            url = `https://instagram.com/${handle}`;
            break;
          case 'YouTube':
            url = `https://youtube.com/@${handle}`;
            break;
          default:
            url = `https://${platform.toLowerCase()}.com/${handle}`;
        }
        
        return { platform, url };
      });
      
      const mockData: ScrapedData = {
        domain,
        emails: scrapingOptions.emails ? emails : [],
        phones: scrapingOptions.phones ? phones : [],
        socialMedia: scrapingOptions.socialMedia ? socialMedia : [],
        lastScraped: new Date().toISOString()
      };
      
      setScrapedData(mockData);
      
      // Add to history if not already present
      if (!scrapingHistory.includes(domain)) {
        setScrapingHistory(prev => [domain, ...prev].slice(0, 10));
      }
      
      setIsLoading(false);
    }, 2000);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const handleExportData = () => {
    if (!scrapedData) return;
    
    // Format the data for export
    const exportData = {
      domain: scrapedData.domain,
      scraped_at: scrapedData.lastScraped,
      emails: scrapedData.emails,
      phones: scrapedData.phones,
      social_profiles: scrapedData.socialMedia
    };
    
    // Create a JSON blob and trigger download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scrapedData.domain}-scrape-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Website Scraper</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Extract Contact Information</CardTitle>
              <CardDescription>
                Scrape emails, phone numbers, and social media profiles from any website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter website URL (e.g., example.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                    className="flex-1"
                  />
                  <Button onClick={handleScrape} disabled={isLoading}>
                    {isLoading ? "Scraping..." : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Scrape
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="emails" 
                      checked={scrapingOptions.emails}
                      onCheckedChange={(checked) => 
                        setScrapingOptions(prev => ({ ...prev, emails: !!checked }))
                      }
                    />
                    <Label htmlFor="emails">Emails</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="phones" 
                      checked={scrapingOptions.phones}
                      onCheckedChange={(checked) => 
                        setScrapingOptions(prev => ({ ...prev, phones: !!checked }))
                      }
                    />
                    <Label htmlFor="phones">Phone Numbers</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="social" 
                      checked={scrapingOptions.socialMedia}
                      onCheckedChange={(checked) => 
                        setScrapingOptions(prev => ({ ...prev, socialMedia: !!checked }))
                      }
                    />
                    <Label htmlFor="social">Social Media</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 bg-muted/40 rounded-lg">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">Scraping website data...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
            </div>
          )}
          
          {scrapedData && !isLoading && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">Results for {scrapedData.domain}</CardTitle>
                <Badge variant="outline" className="ml-2">
                  Scraped {formatDate(scrapedData.lastScraped)}
                </Badge>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="emails" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="emails" disabled={scrapedData.emails.length === 0}>
                      Emails ({scrapedData.emails.length})
                    </TabsTrigger>
                    <TabsTrigger value="phones" disabled={scrapedData.phones.length === 0}>
                      Phones ({scrapedData.phones.length})
                    </TabsTrigger>
                    <TabsTrigger value="social" disabled={scrapedData.socialMedia.length === 0}>
                      Social Media ({scrapedData.socialMedia.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="emails">
                    {scrapedData.emails.length > 0 ? (
                      <div className="space-y-3">
                        {scrapedData.emails.map((email, index) => (
                          <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                            <div className="flex items-center">
                              <Mail className="h-5 w-5 mr-2 text-blue-500" />
                              <span className="font-mono">{email}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleCopyToClipboard(email)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No email addresses found</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="phones">
                    {scrapedData.phones.length > 0 ? (
                      <div className="space-y-3">
                        {scrapedData.phones.map((phone, index) => (
                          <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                            <div className="flex items-center">
                              <Phone className="h-5 w-5 mr-2 text-green-500" />
                              <span className="font-mono">{phone}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleCopyToClipboard(phone)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Phone className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No phone numbers found</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="social">
                    {scrapedData.socialMedia.length > 0 ? (
                      <div className="space-y-3">
                        {scrapedData.socialMedia.map((social, index) => (
                          <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                            <div className="flex items-center">
                              <Globe className="h-5 w-5 mr-2 text-purple-500" />
                              <span className="font-medium">{social.platform}</span>
                            </div>
                            <div className="flex items-center">
                              <a 
                                href={social.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:underline mr-2 flex items-center"
                              >
                                {social.url.substring(0, 30)}...
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleCopyToClipboard(social.url)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No social media profiles found</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Results
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Scrapes</CardTitle>
            </CardHeader>
            <CardContent>
              {scrapingHistory.length > 0 ? (
                <ul className="space-y-2">
                  {scrapingHistory.map((domain, index) => (
                    <li key={index}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start h-auto py-2"
                        onClick={() => {
                          setUrl(domain);
                          handleScrape();
                        }}
                      >
                        <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                        {domain}
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Your recent scrapes will appear here
                </p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Only scrape public information from websites where you have permission to do so.
                </p>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Contact emails are typically found on About, Contact, or Support pages.
                </p>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Phone numbers are most commonly listed in the site footer or contact page.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WebsiteScraper;
