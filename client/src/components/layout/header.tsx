import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActiveAlerts } from "@/hooks/use-dashboard-data";
import { ThemeSelector } from "@/components/theme-selector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";

export default function Header() {
  const { data: alerts } = useActiveAlerts();
  const alertCount = alerts?.length || 0;
  const { user, isLoading, logout, isAdmin, tokenInfo } = useAuth();
  const [, navigate] = useLocation();

  const initials = user
    ? user.full_name
      ? user.full_name
          .split(" ")
          .slice(0, 2)
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : user.username.slice(0, 2).toUpperCase()
    : "";

  const fullName = user?.full_name || user?.username;

  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AquaMind Dashboard</h2>
          <p className="text-muted-foreground mt-1">Bakkafrost Salmon Farming Intelligence</p>
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
          
          {/* User section */}
          {isLoading ? (
            <div className="flex items-center space-x-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ) : (
            user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 flex items-center space-x-3" aria-label="User menu">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-foreground">
                        {initials || "U"}
                      </span>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium">{fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {isAdmin() ? "Administrator" : "User"}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{fullName}</p>
                    <p className="text-xs text-muted-foreground break-all">{user.email}</p>
                    {tokenInfo.authSource && (
                      <Badge variant="secondary" className="mt-1">
                        {tokenInfo.authSource === "ldap" ? "LDAP" : "Local"}
                      </Badge>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate("/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          )}
        </div>
      </div>
    </header>
  );
}
