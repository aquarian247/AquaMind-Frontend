import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActiveAlerts } from "@/hooks/use-dashboard-data";
import { ThemeSelector } from "@/components/theme-selector";

export default function Header() {
  const { data: alerts } = useActiveAlerts();
  const alertCount = alerts?.length || 0;

  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AquaMind Dashboard</h2>
          <p className="text-muted-foreground mt-1">Norwegian Salmon Farming Intelligence</p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeSelector />
          
          <div className="relative">
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {alertCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">JH</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">John Hansen</p>
              <p className="text-xs text-muted-foreground">Farm Manager</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
