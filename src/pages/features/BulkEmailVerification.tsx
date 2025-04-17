
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Check, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EmailVerificationResult {
  email: string;
  isValid: boolean;
  reason?: string;
}

const BulkEmailVerification: React.FC = () => {
  const [emails, setEmails] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<EmailVerificationResult[]>([]);
  const [activeTab, setActiveTab] = useState<string>("input");
  const [error, setError] = useState<string | null>(null);

  // Stats for the verification results
  const validCount = verificationResults.filter(r => r.isValid).length;
  const invalidCount = verificationResults.filter(r => !r.isValid).length;

  const handleVerify = () => {
    if (!emails.trim()) {
      setError("Please enter at least one email address");
      return;
    }

    // Parse and clean email input
    const emailList = emails
      .split(/[\n,;]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    if (emailList.length === 0) {
      setError("No valid email format detected");
      return;
    }

    if (emailList.length > 100) {
      setError("Maximum 100 emails can be verified at once");
      return;
    }

    setError(null);
    setIsVerifying(true);
    
    // Simulate verification with mock results
    setTimeout(() => {
      const results = emailList.map(email => {
        // Simple regex validation for demo purposes
        const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        
        // Random validation for demo - in reality this would use a real API
        const validationChance = Math.random();
        const isValid = isValidFormat && validationChance > 0.3;
        
        let reason = "";
        if (!isValidFormat) {
          reason = "Invalid format";
        } else if (!isValid) {
          const reasons = [
            "Mailbox does not exist",
            "Domain not found",
            "Temporary unavailable",
            "Spam trap detected",
            "Catch-all rejection"
          ];
          reason = reasons[Math.floor(Math.random() * reasons.length)];
        }
        
        return { email, isValid, reason: isValid ? undefined : reason };
      });
      
      setVerificationResults(results);
      setIsVerifying(false);
      setActiveTab("results");
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Only accept .txt and .csv files
    if (file.type !== "text/plain" && file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      setError("Only .txt and .csv files are supported");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setEmails(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Bulk Email Verification</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Verify Email Addresses</CardTitle>
          <CardDescription>
            Check the validity of multiple email addresses at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="input">Input Emails</TabsTrigger>
              <TabsTrigger value="results" disabled={verificationResults.length === 0}>
                Results {verificationResults.length > 0 && `(${verificationResults.length})`}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="input" className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Enter email addresses (one per line, or comma/semicolon separated)
                </p>
                <Textarea 
                  placeholder="email1@example.com&#10;email2@example.com&#10;email3@example.com" 
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  rows={10}
                  className="font-mono"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".txt,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setEmails("")}
                    disabled={!emails}
                  >
                    Clear
                  </Button>
                </div>
                
                <Button 
                  onClick={handleVerify} 
                  disabled={isVerifying || !emails.trim()}
                >
                  {isVerifying ? "Verifying..." : "Verify Emails"}
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground mt-4">
                <p>Supported file formats: .txt, .csv</p>
                <p>Maximum 100 emails per batch</p>
              </div>
            </TabsContent>
            
            <TabsContent value="results">
              {verificationResults.length > 0 && (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Card className="flex-1 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Valid</p>
                          <p className="text-2xl font-bold">{validCount}</p>
                        </div>
                        <Check className="h-8 w-8 text-green-500" />
                      </div>
                    </Card>
                    <Card className="flex-1 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Invalid</p>
                          <p className="text-2xl font-bold">{invalidCount}</p>
                        </div>
                        <X className="h-8 w-8 text-red-500" />
                      </div>
                    </Card>
                    <Card className="flex-1 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total</p>
                          <p className="text-2xl font-bold">{verificationResults.length}</p>
                        </div>
                        <FileText className="h-8 w-8 text-blue-500" />
                      </div>
                    </Card>
                  </div>
                  
                  <div className="border rounded-md overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-medium">
                      <div className="col-span-5">Email</div>
                      <div className="col-span-3">Status</div>
                      <div className="col-span-4">Reason</div>
                    </div>
                    <div className="divide-y">
                      {verificationResults.map((result, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 p-4">
                          <div className="col-span-5 font-mono truncate">{result.email}</div>
                          <div className="col-span-3">
                            <Badge variant={result.isValid ? "success" : "destructive"}>
                              {result.isValid ? 'Valid' : 'Invalid'}
                            </Badge>
                          </div>
                          <div className="col-span-4 text-muted-foreground">
                            {result.reason || '-'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab('input')}>
                      Back to Input
                    </Button>
                    <Button variant="outline" onClick={() => window.print()}>
                      Export Results
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkEmailVerification;
