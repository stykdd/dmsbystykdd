
import React, { useState, useEffect, useRef } from 'react';
import { Copy, RefreshCw, CheckCircle, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const PasswordGeneratorPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [length, setLength] = useState(12);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const { toast } = useToast();
  const passwordRef = useRef<HTMLDivElement>(null);

  // Generate password on initial render and when settings change
  useEffect(() => {
    generatePassword();
  }, [length, useUppercase, useNumbers, useSymbols]);

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let characters = lowercase;
    let result = '';
    
    if (useUppercase) characters += uppercase;
    if (useNumbers) characters += numbers;
    if (useSymbols) characters += symbols;
    
    // Ensure we have at least one character from each selected type
    if (useUppercase) result += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    if (useNumbers) result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    if (useSymbols) result += symbols.charAt(Math.floor(Math.random() * symbols.length));
    
    // Fill the rest of the password
    for (let i = result.length; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Shuffle the password
    result = result
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
    
    setPassword(result);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      toast({
        title: "Password Copied",
        description: "Password has been copied to clipboard"
      });
      
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const calculatePasswordStrength = () => {
    let strength = 0;
    
    // Length factor (up to 40%)
    strength += Math.min(40, (length / 20) * 40);
    
    // Character variety (up to 60%)
    if (useUppercase) strength += 20;
    if (useNumbers) strength += 20;
    if (useSymbols) strength += 20;
    
    return Math.min(100, Math.round(strength));
  };

  const getStrengthLabel = () => {
    const strength = calculatePasswordStrength();
    
    if (strength < 40) return { label: "Weak", color: "text-red-500" };
    if (strength < 70) return { label: "Medium", color: "text-yellow-500" };
    if (strength < 90) return { label: "Strong", color: "text-green-500" };
    return { label: "Very Strong", color: "text-emerald-500" };
  };

  const strengthInfo = getStrengthLabel();
  const strength = calculatePasswordStrength();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Password Generator</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Generator
          </CardTitle>
          <CardDescription>
            Create secure, random passwords for your accounts
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Password Display */}
          <div 
            className="p-4 bg-muted rounded-md font-mono text-xl break-all relative cursor-pointer group"
            onClick={copyToClipboard}
            ref={passwordRef}
          >
            {password}
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {copied ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5 text-muted-foreground opacity-50 group-hover:opacity-100" />
              )}
            </div>
          </div>
          
          {/* Password Strength */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Password Strength</span>
              <span className={`text-sm font-medium ${strengthInfo.color}`}>
                {strengthInfo.label}
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full transition-all" 
                style={{ 
                  width: `${strength}%`,
                  backgroundColor: 
                    strength < 40 ? '#ef4444' : 
                    strength < 70 ? '#eab308' : 
                    strength < 90 ? '#22c55e' : 
                    '#10b981'
                }} 
              />
            </div>
          </div>
          
          {/* Password Length */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password-length">Password Length</Label>
              <span className="text-sm font-medium">{length}</span>
            </div>
            <Slider
              id="password-length"
              min={8}
              max={32}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              className="w-full"
            />
          </div>
          
          {/* Password Options */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="uppercase">Include Uppercase</Label>
              <Switch 
                id="uppercase" 
                checked={useUppercase} 
                onCheckedChange={setUseUppercase} 
              />
            </div>
            
            <div className="flex justify-between items-center">
              <Label htmlFor="numbers">Include Numbers</Label>
              <Switch 
                id="numbers" 
                checked={useNumbers} 
                onCheckedChange={setUseNumbers} 
              />
            </div>
            
            <div className="flex justify-between items-center">
              <Label htmlFor="symbols">Include Symbols</Label>
              <Switch 
                id="symbols" 
                checked={useSymbols} 
                onCheckedChange={setUseSymbols} 
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full"
            onClick={generatePassword}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New Password
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PasswordGeneratorPage;
