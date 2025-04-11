
import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for system logs
const mockLogs = [
  { id: 1, user: "John Doe", action: "Added domain example.org", timestamp: "2024-04-04 15:30:22", status: "success" },
  { id: 2, user: "Admin User", action: "Updated WHOIS for mydomain.com", timestamp: "2024-04-04 14:25:13", status: "success" },
  { id: 3, user: "Jane Smith", action: "Failed login attempt", timestamp: "2024-04-04 12:10:45", status: "error" },
  { id: 4, user: "Admin User", action: "Deleted domain testsite.io", timestamp: "2024-04-04 11:05:37", status: "success" },
  { id: 5, user: "System", action: "Scheduled backup completed", timestamp: "2024-04-04 03:00:00", status: "success" }
];

const SystemLogs: React.FC = () => {
  const getStatusIcon = (status: string) => {
    if (status === "success") {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    } else if (status === "error") {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Status</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Action</TableHead>
          <TableHead className="w-[180px]">Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockLogs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>
              {getStatusIcon(log.status)}
            </TableCell>
            <TableCell>{log.user}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell className="text-sm text-muted-foreground">
              <Clock className="h-3 w-3 inline mr-1" />
              {log.timestamp}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SystemLogs;
