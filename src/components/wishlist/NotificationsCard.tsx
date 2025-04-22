
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NotificationsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notify">Email Notifications</Label>
          <Switch id="email-notify" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="browser-notify">Browser Notifications</Label>
          <Switch id="browser-notify" defaultChecked />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Label htmlFor="check-frequency">Check Frequency</Label>
          <Select defaultValue="daily">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Daily" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationsCard;
