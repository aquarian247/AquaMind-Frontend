import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSelector } from "@/components/theme-selector";
import bakkafrostLogo from "@assets/image_1749821987657.png";

const navigationItems = [
  {
    id: 1,
    label: "Dashboard",
    icon: "fas fa-tachometer-alt",
    path: "/",
  },
  {
    id: 2,
    label: "Monitoring",
    icon: "fas fa-heart",
    path: "/monitoring",
  },
  {
    id: 3,
    label: "Farm Management",
    icon: "fas fa-warehouse",
    path: "/farm-management",
  },
  {
    id: 4,
    label: "Batch Management",
    icon: "fas fa-fish",
    path: "/batch-management",
  },
  {
    id: 5,
    label: "Health",
    icon: "fas fa-heart",
    path: "/health",
  },
  {
    id: 6,
    label: "Inventory",
    icon: "fas fa-boxes",
    path: "/inventory",
  },
  {
    id: 7,
    label: "Analytics",
    icon: "fas fa-chart-line",
    path: "/analytics",
  },
  {
    id: 8,
    label: "Reports",
    icon: "fas fa-file-alt",
    path: "/reports",
  },
  {
    id: 9,
    label: "Settings",
    icon: "fas fa-cog",
    path: "/settings",
  },
  {
    id: 10,
    label: "Mortality Report",
    icon: "fas fa-clipboard-list",
    path: "/mortality-reporting",
  },
];

// Navigation items component for reuse
function NavigationMenu({ onItemClick }: { onItemClick?: () => void }) {
  const [location] = useLocation();

  return (
    <div className="space-y-2">
      {navigationItems.map((item) => (
        <Link key={item.id} href={item.path}>
          <div
            onClick={onItemClick}
            className={cn(
              "sidebar-nav-item touch-manipulation",
              location === item.path && "active"
            )}
          >
            <i className={cn(item.icon, "mr-3 w-5 text-center")}></i>
            {item.label}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Header with Hamburger Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <i className="fas fa-fish text-white text-sm"></i>
          </div>
          <div>
            <h1 className="text-lg font-bold text-blue-600">AquaMind</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Farm Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeSelector />
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="p-2 h-10 w-10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                      <i className="fas fa-fish text-white text-lg"></i>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-blue-600">AquaMind</h1>
                      <p className="text-sm text-gray-500">Farm Management</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 px-4 py-6">
                  <NavigationMenu onItemClick={() => setMobileMenuOpen(false)} />
                </div>
                
                {/* Theme Controls in Mobile Menu */}
                <div className="px-4 py-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeSelector />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block bg-card border-r shadow-lg w-64 fixed h-full z-10">
        {/* Sidebar Header */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <img 
              src={bakkafrostLogo} 
              alt="Bakkafrost Logo" 
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold">AquaMind</h1>
              <p className="text-sm text-muted-foreground">Farm Management</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6">
          <div className="px-4">
            <NavigationMenu />
          </div>
        </nav>
      </div>
    </>
  );
}