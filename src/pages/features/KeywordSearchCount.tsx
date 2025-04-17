
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock data for keyword frequencies
const mockKeywordData = [
  { keyword: "crypto", count: 84, domains: ["cryptoworld.com", "cryptomarket.io", "bestcrypto.net"] },
  { keyword: "blockchain", count: 62, domains: ["blockchaintechnology.com", "blockchain101.org"] },
  { keyword: "nft", count: 53, domains: ["nftcollection.com", "nftmarket.io", "buynft.org"] },
  { keyword: "metaverse", count: 47, domains: ["metaverseworld.net", "entermetaverse.com"] },
  { keyword: "defi", count: 41, domains: ["defiplatform.io", "defimarket.org"] },
  { keyword: "bitcoin", count: 38, domains: ["bitcointrader.com", "bitcoinvalue.net"] },
  { keyword: "ethereum", count: 32, domains: ["ethereumwallet.com", "buyethereum.org"] },
  { keyword: "wallet", count: 29, domains: ["cryptowallet.net", "securewallet.io"] },
  { keyword: "token", count: 25, domains: ["tokenmarket.io", "tokenvalue.com"] },
  { keyword: "mining", count: 21, domains: ["cryptomining.net", "miningpool.org"] },
];

const KeywordSearchCount: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<typeof mockKeywordData>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    // Simulate API call with loading state
    setIsLoading(true);
    
    setTimeout(() => {
      const filteredResults = mockKeywordData.filter(item => 
        item.keyword.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
      setIsLoading(false);
      
      // Add to recent searches if not already present
      if (!recentSearches.includes(searchTerm)) {
        setRecentSearches(prev => [searchTerm, ...prev].slice(0, 5));
      }
    }, 800);
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
    // Perform search immediately when clicking a recent search
    const filteredResults = mockKeywordData.filter(item => 
      item.keyword.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  // Calculate max count for relative scaling
  const maxCount = Math.max(...searchResults.map(item => item.count), 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Keyword Search Count</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Search Domain Keywords</CardTitle>
          <CardDescription>
            Enter a keyword to see how frequently it's used across registered domains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <Input
              placeholder="Enter keyword (e.g., crypto, nft, blockchain)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          {recentSearches.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleRecentSearchClick(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="space-y-4 my-6">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
            </div>
          )}

          {!isLoading && searchResults.length > 0 && (
            <div className="space-y-6 mt-4">
              <h3 className="text-lg font-medium">Results for "{searchTerm}"</h3>
              
              <div className="space-y-4">
                {searchResults.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.keyword}</span>
                      <span className="text-sm text-muted-foreground">{item.count} domains</span>
                    </div>
                    <Progress value={(item.count / maxCount) * 100} className="h-2" />
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.domains.map((domain, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {domain}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoading && searchResults.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
              <p className="text-sm mt-2">Try searching for keywords like "crypto", "nft", or "blockchain"</p>
            </div>
          )}

          {!searchTerm && !isLoading && searchResults.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Enter a keyword to see results</p>
              <p className="text-sm mt-2">Popular keywords: crypto, blockchain, nft, metaverse</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KeywordSearchCount;
