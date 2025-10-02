import { useState } from "react";
import { Dna, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart3, Target, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/api/generated";
import { BroodstockKPIs } from "@/features/broodstock/components/BroodstockKPIs";
import { BroodstockOverview } from "@/features/broodstock/components/BroodstockOverview";
import { BroodstockPrograms } from "@/features/broodstock/components/BroodstockPrograms";
import { BroodstockGenetic } from "@/features/broodstock/components/BroodstockGenetic";
import { BroodstockPopulation } from "@/features/broodstock/components/BroodstockPopulation";
import { useBroodstockKPIs } from "@/features/broodstock/hooks/useBroodstockKPIs";
import { useBroodstockPrograms } from "@/features/broodstock/hooks/useBroodstockPrograms";
import { useBroodstockGenetic } from "@/features/broodstock/hooks/useBroodstockGenetic";
import { useBroodstockPopulation } from "@/features/broodstock/hooks/useBroodstockPopulation";

function BroodstockDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedGeography, setSelectedGeography] = useState("all");

  // Custom hooks for data management
  const { kpis, isLoading: kpisLoading } = useBroodstockKPIs();
  const { programs, activities, tasks, programsLoading, activitiesLoading, tasksLoading } = useBroodstockPrograms();
  const { traitData, isLoading: traitsLoading } = useBroodstockGenetic();
  const { containers, containerCount, isLoading: containersLoading } = useBroodstockPopulation();

  // Geography data for dropdown
  const { data: geographiesData } = useQuery({
    queryKey: ["infrastructure/geographies"],
    queryFn: () => ApiService.apiV1InfrastructureGeographiesList()
  });

  const combinedLoading = kpisLoading || programsLoading || traitsLoading || containersLoading || activitiesLoading || tasksLoading;

  if (combinedLoading) {
    return (
      <div className="p-3 lg:p-6">
        <div className="space-y-4">
          <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-24 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        {/* Left: icon + title */}
        <div className="flex items-center space-x-2">
          <Dna className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Broodstock Management</h1>
            <p className="text-muted-foreground">
              Genetic optimization and breeding program oversight
            </p>
          </div>
        </div>

        {/* Right: controls */}
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select
              value={selectedGeography}
              onChange={(e) => setSelectedGeography(e.target.value)}
              className="h-9 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            >
              <option value="all">All Geographies</option>
              {geographiesData?.results?.map((geo: any) => (
                <option key={geo.id} value={geo.name.toLowerCase()}>
                  {geo.name}
                </option>
              ))}
            </select>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Program
          </Button>
        </div>
      </div>

      {/* 
        ⚠️ DATA PROCESSING & AVAILABILITY NOTICE ⚠️
        
        Current Implementation Status:
        - Active Pairs, Population, Progeny: Calculated from backend API responses
        - Progeny Count: Client-side pagination aggregation (egg productions over 7 days)
        - Genetic Diversity Index, Pending Selections, Genetic Gain: Not yet calculated (N/A)
        - Programs, Activities, Traits: Placeholder data (backend endpoints not implemented)
        
        Limitations:
        - Genetic metrics require backend analysis algorithms
        - Breeding programs require dedicated management endpoints
        - Some data fetched using client-side pagination loops (not optimal)
        
        Production Roadmap:
        TODO: Backend team should implement:
        - /api/v1/broodstock/summary/ - Aggregated KPIs with date filtering
        - /api/v1/broodstock/programs/ - Breeding program management
        - /api/v1/broodstock/genetic-analysis/ - Trait analysis and diversity calculations
        
        Migration Path:
        1. Replace client-side aggregation with server-side summary endpoint
        2. Implement breeding program tracking
        3. Add genetic analysis algorithms
        4. Remove this disclosure banner
      */}
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-700">Data Processing Notice</AlertTitle>
        <AlertDescription className="text-blue-600">
          Some broodstock metrics are currently calculated from multiple data sources. 
          Genetic diversity, pending selections, and breeding program data are not yet available. 
          Backend aggregation endpoints will improve performance and enable advanced genetic analytics in future releases.
        </AlertDescription>
      </Alert>

      {/* KPI Cards */}
      <BroodstockKPIs kpis={kpis} isLoading={kpisLoading} />

      {/* Responsive Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Programs</span>
          </TabsTrigger>
          <TabsTrigger value="genetic" className="flex items-center gap-2">
            <Dna className="w-4 h-4" />
            <span className="hidden sm:inline">Genetic</span>
          </TabsTrigger>
          <TabsTrigger value="population" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Population</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <BroodstockOverview
            programs={programs}
            traitData={traitData}
            activities={activities}
            tasks={tasks}
            programsLoading={programsLoading}
            traitsLoading={traitsLoading}
            activitiesLoading={activitiesLoading}
            tasksLoading={tasksLoading}
          />
        </TabsContent>

        {/* Programs Tab */}
        <TabsContent value="programs">
          <BroodstockPrograms
            programs={programs}
            isLoading={programsLoading}
          />
        </TabsContent>

        {/* Genetic Tab */}
        <TabsContent value="genetic">
          <BroodstockGenetic
            traitData={traitData}
            isLoading={traitsLoading}
          />
        </TabsContent>

        {/* Population Tab */}
        <TabsContent value="population">
          <BroodstockPopulation
            containers={containers}
            containerCount={containerCount}
            totalFishCount={kpis.broodstockPopulation}
            isLoading={containersLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default BroodstockDashboard;
