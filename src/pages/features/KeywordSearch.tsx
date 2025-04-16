
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KeywordResult {
  keyword: string;
  count: number;
  domains: string[];
}

const mockResults: KeywordResult[] = [
  { keyword: "crypto", count: 156, domains: ["crypto.com", "cryptoworld.com", "cryptonews.com"] },
  { keyword: "nft", count: 89, domains: ["nftart.com", "nftmarket.com"] },
  { keyword: "meta", count: 234, domains: ["metamask.com", "metadata.com", "metaverse.com"] }
];

const KeywordSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<KeywordResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setResults(mockResults);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Keyword Search Count</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Search Domain Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter keyword to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Button 
              onClick={handleSearch}
              disabled={!searchTerm || isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="grid gap-4 mt-6">
          {results.map((result) => (
            <Card key={result.keyword}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{result.keyword}</h3>
                    <p className="text-sm text-muted-foreground">
                      Found in {result.count} domains
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {result.count}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Example domains:</p>
                  <ul className="list-disc list-inside mt-2">
                    {result.domains.map((domain) => (
                      <li key={domain}>{domain}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordSearch;
