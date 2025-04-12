
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium mb-1">Theme Preference</label>
      <ToggleGroup 
        type="single" 
        value={theme} 
        onValueChange={(value) => value && setTheme(value as 'light' | 'dark')}
        className="bg-secondary rounded-lg p-1"
      >
        <ToggleGroupItem 
          value="light" 
          aria-label="Light mode" 
          className="flex items-center gap-1.5 data-[state=on]:bg-blue-500 data-[state=on]:text-white rounded-md transition-all duration-200"
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="dark" 
          aria-label="Dark mode" 
          className="flex items-center gap-1.5 data-[state=on]:bg-blue-800 data-[state=on]:text-white rounded-md transition-all duration-200"
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ThemeToggle;
