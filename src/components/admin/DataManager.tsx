
import React, { useRef } from "react";
import { FileDown, FileUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/contexts/NotificationContext";

const DataManager = () => {
  const { addNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Export all system data
  const handleExportData = () => {
    try {
      const exportData = {
        date: new Date().toISOString(),
        version: "1.0",
        domains: JSON.parse(localStorage.getItem('domains_data') || '[]'),
        soldDomains: JSON.parse(localStorage.getItem('sold_domains_data') || '[]'),
        users: JSON.parse(localStorage.getItem('dms_users') || '[]'),
        settings: {
          // Include any app settings
          installed: localStorage.getItem('dms_installed') === 'true',
        }
      };
      
      // Convert to JSON and create download link
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportName = `dms-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportName);
      linkElement.click();
      
      addNotification({
        title: "Export Successful",
        message: "System data has been exported successfully.",
        type: "info",
        global: true,
      });
    } catch (error) {
      console.error("Export failed:", error);
      addNotification({
        title: "Export Failed",
        message: "Failed to export system data. Please try again.",
        type: "error",
        global: true,
      });
    }
  };
  
  // Import system data
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        // Validate import data structure
        if (!importData.domains || !importData.version) {
          throw new Error("Invalid import file structure");
        }
        
        // Store imported data
        localStorage.setItem('dms_users', JSON.stringify(importData.users || []));
        
        // Save domains and sold domains to localStorage
        localStorage.setItem('domains_data', JSON.stringify(importData.domains || []));
        localStorage.setItem('sold_domains_data', JSON.stringify(importData.soldDomains || []));
        
        addNotification({
          title: "Import Successful",
          message: "System data has been imported successfully. Refresh the page to see changes.",
          type: "info",
          global: true,
        });
        
        // Force page reload to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error("Import failed:", error);
        addNotification({
          title: "Import Failed", 
          message: "Failed to import system data. File may be corrupted or invalid.",
          type: "error",
          global: true,
        });
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Reset to default data
  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all data to default? This action cannot be undone.")) {
      // Assuming resetToInitialData resets localStorage keys accordingly
      localStorage.removeItem('domains_data');
      localStorage.removeItem('sold_domains_data');
      localStorage.removeItem('dms_users');
      localStorage.removeItem('dms_installed');
      
      addNotification({
        title: "Data Reset",
        message: "All data has been reset to default. Refresh the page to see changes.",
        type: "info",
        global: true,
      });
      
      // Force page reload after reset
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          Export, import, or reset system data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleExportData}
            className="flex items-center gap-2"
            variant="outline"
          >
            <FileDown className="w-4 h-4" />
            Export All Data
          </Button>
          
          <Button
            onClick={triggerFileInput}
            className="flex items-center gap-2"
            variant="outline"
          >
            <FileUp className="w-4 h-4" />
            Import Data
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportData}
            accept=".json"
            className="hidden"
          />
        </div>
        
        <div className="my-4 border-t border-border" />
        
        <div>
          <Button
            onClick={handleResetData}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Default Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataManager;
