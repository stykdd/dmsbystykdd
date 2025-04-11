
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DonationSettings: React.FC = () => {
  const [donationLink, setDonationLink] = useState('https://donate.stykdd.com');
  const [buttonText, setButtonText] = useState('Support Us');
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, this would save to backend/database
    localStorage.setItem('donation_link', donationLink);
    localStorage.setItem('donation_button_text', buttonText);
    
    toast({
      title: "Settings saved",
      description: "Donation settings have been updated successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" fill="#ea384c" />
          Donation Settings
        </CardTitle>
        <CardDescription>
          Configure donation button and link settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="donationLink" className="text-sm font-medium">
            Donation Link URL
          </label>
          <div className="flex gap-2">
            <Input
              id="donationLink"
              value={donationLink}
              onChange={(e) => setDonationLink(e.target.value)}
              placeholder="https://example.com/donate"
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => window.open(donationLink, '_blank')}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="buttonText" className="text-sm font-medium">
            Button Tooltip Text
          </label>
          <Input
            id="buttonText"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            placeholder="Support Our Project"
          />
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationSettings;
