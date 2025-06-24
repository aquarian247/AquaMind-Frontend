import React from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

import Dashboard from "@/pages/dashboard";
import Monitoring from "@/pages/monitoring";
import FarmManagement from "@/pages/farm-management";
import Infrastructure from "@/pages/infrastructure";
import InfrastructureAreas from "@/pages/infrastructure-areas";
import InfrastructureStations from "@/pages/infrastructure-stations";
import AreaDetail from "@/pages/area-detail";
import StationDetail from "@/pages/station-detail";
import AreaRings from "@/pages/area-rings";
import StationHalls from "@/pages/station-halls";
import RingDetail from "@/pages/ring-detail";
import HallDetail from "@/pages/hall-detail";
import ContainerDetail from "@/pages/container-detail";
import InfrastructureContainers from "@/pages/infrastructure-containers";
import InfrastructureSensors from "@/pages/infrastructure-sensors";
import Inventory from "@/pages/inventory-simple";
import Analytics from "@/pages/analytics";
import MortalityReporting from "@/pages/mortality-reporting";
import BatchManagement from "@/pages/batch-management";
import BatchDetails from "@/pages/batch-details";
import Health from "@/pages/health";
import Broodstock from "@/pages/broodstock";
import BroodstockPrograms from "@/pages/broodstock-programs";
import BroodstockGenetic from "@/pages/broodstock-genetic";
import BroodstockPopulation from "@/pages/broodstock-population";
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
            <Route path="/infrastructure" component={Infrastructure} />
            <Route path="/infrastructure/areas" component={InfrastructureAreas} />
            <Route path="/infrastructure/stations" component={InfrastructureStations} />
            <Route path="/infrastructure/containers" component={InfrastructureContainers} />
            <Route path="/infrastructure/sensors" component={InfrastructureSensors} />
            <Route path="/infrastructure/areas/:id">
              {(params) => <AreaDetail params={params} />}
            </Route>
            <Route path="/infrastructure/areas/:id/rings">
              {(params) => <AreaRings params={params} />}
            </Route>
            <Route path="/infrastructure/rings/:id">
              {(params) => <RingDetail params={params} />}
            </Route>
            <Route path="/infrastructure/stations/:id">
              {(params) => <StationDetail params={params} />}
            </Route>
            <Route path="/infrastructure/stations/:id/halls">
              {(params) => <StationHalls params={params} />}
            </Route>
            <Route path="/infrastructure/halls/:id">
              {(params) => <HallDetail params={params} />}
            </Route>
            <Route path="/infrastructure/containers/:id">
              {(params) => <ContainerDetail params={params} />}
            </Route>
            <Route path="/batch-management" component={BatchManagement} />
        <Route path="/batch-details/:id" component={BatchDetails} />
            <Route path="/health" component={Health} />
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
