/**
 * Area Detail Page (Shell)
 * 
 * Orchestrates area detail view with server-side KPI aggregation.
 * Shell pattern: minimal orchestration, delegates to hooks and components.
 * 
 * @module features/infrastructure/pages/AreaDetailPage
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useAreaData } from "../hooks/useAreaData";
import { useContainerFilters } from "../hooks/useContainerFilters";
import { formatAreaKPIs } from "../utils/areaFormatters";
import { AreaHeader } from "../components/AreaHeader";
import { AreaEnvironmentalTab } from "../components/AreaEnvironmentalTab";
import { AreaContainersTab } from "../components/AreaContainersTab";
import { AreaOperationsTab } from "../components/AreaOperationsTab";
import { AreaRegulatoryTab } from "../components/AreaRegulatoryTab";
import { AreaMaintenanceTab } from "../components/AreaMaintenanceTab";

interface AreaDetailPageProps {
  params: { id: string };
}

/**
 * Area Detail Page
 * 
 * Shell component that orchestrates area detail view.
 * Uses server-side aggregation for KPIs via useAreaSummary.
 */
export default function AreaDetailPage({ params }: AreaDetailPageProps) {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("environmental");

  const areaId = Number(params.id);

  // Hooks: data fetching and filtering
  const {
    area,
    areaSummary,
    rings,
    environmentalData,
    isLoading,
    isAreaSummaryLoading,
    isLoadingRings,
    error,
    areaSummaryError,
  } = useAreaData(areaId);

  const {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    filteredContainers,
  } = useContainerFilters(rings);

  // Format KPIs from server-side aggregation
  const formattedKPIs = formatAreaKPIs(areaSummary);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error || areaSummaryError || !area) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Area Not Found</h2>
          <p className="text-gray-600 mb-4">
            The requested sea area could not be found.
          </p>
          <Button onClick={() => setLocation("/infrastructure/areas")}>
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back to Areas</span>
          </Button>
        </div>
      </div>
    );
  }

  const tabItems = [
    { value: "environmental", label: "Environmental" },
    { value: "containers", label: "Containers" },
    { value: "operations", label: "Operations" },
    { value: "regulatory", label: "Regulatory" },
    { value: "maintenance", label: "Maintenance" },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header and KPI Cards */}
      <AreaHeader
        area={area}
        formattedKPIs={formattedKPIs}
        areaSummary={areaSummary}
        isAreaSummaryLoading={isAreaSummaryLoading}
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {/* Mobile dropdown */}
        <div className="md:hidden">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {tabItems.find((item) => item.value === activeTab)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {tabItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop tabs */}
        <TabsList className="hidden md:grid w-full grid-cols-5">
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="containers">Containers</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="environmental">
          <AreaEnvironmentalTab area={area} environmental={environmentalData} />
        </TabsContent>

        <TabsContent value="containers">
          <AreaContainersTab
            rings={rings}
            filteredRings={filteredContainers}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isLoadingRings={isLoadingRings}
            areaSummary={areaSummary}
            isAreaSummaryLoading={isAreaSummaryLoading}
            formattedKPIs={formattedKPIs}
          />
        </TabsContent>

        <TabsContent value="operations">
          <AreaOperationsTab area={area} areaSummary={areaSummary} />
        </TabsContent>

        <TabsContent value="regulatory">
          <AreaRegulatoryTab />
        </TabsContent>

        <TabsContent value="maintenance">
          <AreaMaintenanceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

