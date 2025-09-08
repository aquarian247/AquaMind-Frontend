import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import LoginPage from "@/pages/login";

const TemperatureDataView = lazy(() => import("./pages/TemperatureDataView"));

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
import Inventory from "@/pages/inventory";
import Analytics from "@/pages/analytics";
import MortalityReporting from "@/pages/mortality-reporting";
import BatchManagement from "@/pages/batch-management";
import BatchDetails from "@/pages/batch-details";
import Health from "@/pages/health";
import Broodstock from "@/pages/broodstock";
import BroodstockPrograms from "@/pages/broodstock-programs";
import BroodstockGenetic from "@/pages/broodstock-genetic";
import BroodstockPopulation from "@/pages/broodstock-population";
import BreedingProgramDetails from "@/pages/breeding-program-details";
import BroodstockContainerDetails from "@/pages/broodstock-container-details";
import ScenarioPlanning from "@/pages/ScenarioPlanning";
import { ScenarioDetailPage } from "@/pages/ScenarioDetailPage";
import NotFound from "@/pages/not-found";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

// Root redirect component
const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Redirect to={isAuthenticated ? "/dashboard" : "/login"} />;
};

// Layout wrapper component
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen bg-background">
    <Sidebar />
    {/* Responsive main content area */}
    <div className="flex-1 flex flex-col overflow-hidden lg:ml-64 pt-16 lg:pt-0">
      {/* Header only shows on desktop */}
      <div className="hidden lg:block">
        <Header />
      </div>
      <main className="flex-1 overflow-auto p-3 lg:p-6">
        {children}
      </main>
    </div>
  </div>
);

function Router() {
  return (
    <Switch>
      {/* Root path redirect */}
      <Route path="/" component={RootRedirect} />
      
      {/* Login route - outside layout */}
      <Route path="/login" component={LoginPage} />
      
      {/* Protected routes with layout */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/monitoring">
        <ProtectedRoute>
          <AppLayout>
            <Monitoring />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/farm-management">
        <ProtectedRoute>
          <AppLayout>
            <FarmManagement />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/infrastructure">
        <ProtectedRoute>
          <AppLayout>
            <Infrastructure />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/infrastructure/areas">
        <ProtectedRoute>
          <AppLayout>
            <InfrastructureAreas />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/infrastructure/stations">
        <ProtectedRoute>
          <AppLayout>
            <InfrastructureStations />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/infrastructure/containers">
        <ProtectedRoute>
          <AppLayout>
            <InfrastructureContainers />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/infrastructure/sensors">
        <ProtectedRoute>
          <AppLayout>
            <InfrastructureSensors />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/infrastructure/areas/:id">
        {(params) => (
          <ProtectedRoute>
            <AppLayout>
              <AreaDetail params={params} />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/infrastructure/areas/:id/rings">
        {(params) => (
          <ProtectedRoute>
            <AppLayout>
              <AreaRings params={params} />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/infrastructure/rings/:id">
        {(params) => (
          <ProtectedRoute>
            <AppLayout>
              <RingDetail params={params} />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/infrastructure/stations/:id">
        {(params) => (
          <ProtectedRoute>
            <AppLayout>
              <StationDetail params={params} />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/infrastructure/stations/:id/halls">
        {(params) => (
          <ProtectedRoute>
            <AppLayout>
              <StationHalls params={params} />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/infrastructure/halls/:id">
        {(params) => (
          <ProtectedRoute>
            <AppLayout>
              <HallDetail params={params} />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/infrastructure/containers/:id">
        {(params) => (
          <ProtectedRoute>
            <AppLayout>
              <ContainerDetail params={params} />
            </AppLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/batch-management">
        <ProtectedRoute>
          <AppLayout>
            <BatchManagement />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/batch-details/:id">
        <ProtectedRoute>
          <AppLayout>
            <BatchDetails />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/health">
        <ProtectedRoute>
          <AppLayout>
            <Health />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/broodstock">
        <ProtectedRoute>
          <AppLayout>
            <Broodstock />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/broodstock/programs">
        <ProtectedRoute>
          <AppLayout>
            <BroodstockPrograms />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/broodstock/genetic">
        <ProtectedRoute>
          <AppLayout>
            <BroodstockGenetic />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/broodstock/population">
        <ProtectedRoute>
          <AppLayout>
            <BroodstockPopulation />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/breeding-program-details/:id">
        <ProtectedRoute>
          <AppLayout>
            <BreedingProgramDetails />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/broodstock-container-details/:id">
        <ProtectedRoute>
          <AppLayout>
            <BroodstockContainerDetails />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/scenario-planning">
        <ProtectedRoute>
          <AppLayout>
            <ScenarioPlanning />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/scenario-planning/scenarios/:id">
        <ProtectedRoute>
          <AppLayout>
            <ScenarioDetailPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/temperature-data/:id">
        <ProtectedRoute>
          <AppLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <TemperatureDataView />
            </Suspense>
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/inventory">
        <ProtectedRoute>
          <AppLayout>
            <Inventory />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/analytics">
        <ProtectedRoute>
          <AppLayout>
            <Analytics />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/mortality-reporting">
        <ProtectedRoute>
          <AppLayout>
            <MortalityReporting />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      
      <Route>
        <ProtectedRoute>
          <AppLayout>
            <NotFound />
          </AppLayout>
        </ProtectedRoute>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="ocean-depths" defaultMode="light">
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
