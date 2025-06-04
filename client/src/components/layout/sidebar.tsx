import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

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
    label: "Analytics",
    icon: "fas fa-chart-line",
    path: "/analytics",
  },
  {
    id: 5,
    label: "Reports",
    icon: "fas fa-file-alt",
    path: "/reports",
  },
  {
    id: 6,
    label: "Settings",
    icon: "fas fa-cog",
    path: "/settings",
  },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="bg-card border-r shadow-lg w-64 fixed h-full z-10">
      {/* Sidebar Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <i className="fas fa-fish text-primary-foreground text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold">AquaMind</h1>
            <p className="text-sm text-muted-foreground">Farm Management</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.id} href={item.path}>
              <div
                className={cn(
                  "sidebar-nav-item",
                  location === item.path && "active"
                )}
              >
                <i className={cn(item.icon, "mr-3 w-5 text-center")}></i>
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
