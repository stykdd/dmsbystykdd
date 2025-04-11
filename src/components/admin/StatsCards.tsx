
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold text-foreground">{value}</span>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

interface StatsCardsProps {
  userCount: number;
  domainCount: number;
  activeUsers: number;
  systemEvents: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ 
  userCount, 
  domainCount, 
  activeUsers, 
  systemEvents 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Users"
        value={userCount}
        description="Total Users"
      />
      <StatCard
        title="Domains"
        value={domainCount}
        description="Total Domains"
      />
      <StatCard
        title="Active Users"
        value={activeUsers}
        description="Active Users Today"
      />
      <StatCard
        title="Events"
        value={systemEvents}
        description="System Events Today"
      />
    </div>
  );
};

export default StatsCards;
