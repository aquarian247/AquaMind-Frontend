import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

import Dashboard from "@/pages/dashboard";
import Monitoring from "@/pages/monitoring";
import FarmManagement from "@/pages/farm-management";
import Inventory from "@/pages/inventory";
import Analytics from "@/pages/analytics";
import MortalityReporting from "@/pages/mortality-reporting";
import NotFound from "@/pages/not-found";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

function Router() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      {/* Responsive main content area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64 pt-16 lg:pt-0">
        {/* Header only shows on desktop */}
        <div className="hidden lg:block">
          <Header />
        </div>
        <main className="flex-1 overflow-auto p-3 lg:p-6">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/monitoring" component={Monitoring} />
            <Route path="/farm-management" component={FarmManagement} />
            <Route path="/inventory" component={Inventory} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/mortality-reporting" component={MortalityReporting} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="ocean-depths" defaultMode="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
