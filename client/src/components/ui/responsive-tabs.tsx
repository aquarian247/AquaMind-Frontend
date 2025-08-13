import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface ResponsiveTabsProps {
  defaultValue: string;
  items: TabItem[];
  className?: string;
}

export function ResponsiveTabs({ defaultValue, items, className = "" }: ResponsiveTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className={`space-y-4 ${className}`}>
      {/* Desktop tabs - hidden on mobile */}
      <TabsList className="hidden md:grid w-full" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((item) => (
          <TabsTrigger key={item.value} value={item.value}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Mobile dropdown - hidden on desktop */}
      <div className="md:hidden">
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full">
            <SelectValue>
              {items.find(item => item.value === activeTab)?.label}
            </SelectValue>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tab content */}
      {items.map((item) => (
        <TabsContent key={item.value} value={item.value} className="space-y-4">
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
