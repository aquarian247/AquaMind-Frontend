import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, BarChart3, Database, Stethoscope, Calculator, Users } from "lucide-react";
import { FilterBar } from "../components/FilterBar";
import { HistoryTable } from "../components/HistoryTable";
import { ModelSelector } from "../components/ModelSelector";
import { useHistoryList, APP_DOMAINS, AppDomain } from "../hooks/useHistory";
import { useHistoryFilters } from "../hooks/useHistoryFilters";

export function OverviewPage() {
  const [selectedTab, setSelectedTab] = useState<AppDomain>(APP_DOMAINS.BATCH);
  const { filters, updateFilters, resetFilters, getApiFilters } = useHistoryFilters();

  const { data, isLoading, error } = useHistoryList(
    selectedTab,
    filters.selectedModel,
    getApiFilters()
  );

  // For now, only show data for batch tab since we're only fetching batch data
  const displayData = selectedTab === 'batch' ? data : undefined;

  const handleTabChange = (value: string) => {
    setSelectedTab(value as AppDomain);
    // Reset model selection when changing tabs
    updateFilters({ selectedModel: undefined });
  };

  const handleViewDetail = (record: any) => {
    // TODO: Navigate to detail page
    console.log('View detail for record:', record);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-destructive mb-2">
            Error Loading History
          </h3>
          <p className="text-muted-foreground">
            Failed to load audit trail data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <History className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold">Audit Trail</h1>
            <p className="text-muted-foreground mt-1">
              Track and review all changes across the AquaMind platform
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFiltersChange={updateFilters}
        onResetFilters={resetFilters}
      />

      {/* Tabs for App Domains */}
      <Tabs value={selectedTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value={APP_DOMAINS.BATCH}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Batch
          </TabsTrigger>
          <TabsTrigger value={APP_DOMAINS.INFRASTRUCTURE}>
            <Database className="w-4 h-4 mr-2" />
            Infrastructure
          </TabsTrigger>
          <TabsTrigger value={APP_DOMAINS.INVENTORY}>
            <Database className="w-4 h-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value={APP_DOMAINS.HEALTH}>
            <Stethoscope className="w-4 h-4 mr-2" />
            Health
          </TabsTrigger>
          <TabsTrigger value={APP_DOMAINS.SCENARIO}>
            <Calculator className="w-4 h-4 mr-2" />
            Scenario
          </TabsTrigger>
          <TabsTrigger value={APP_DOMAINS.USERS}>
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
        </TabsList>

        {/* Model Selector for each tab */}
        <div className="mt-4">
          <ModelSelector
            appDomain={selectedTab}
            selectedModel={filters.selectedModel}
            onModelChange={(model) => updateFilters({ selectedModel: model })}
          />
        </div>

        {/* Content for each tab */}
        {Object.values(APP_DOMAINS).map((domain) => (
          <TabsContent key={domain} value={domain} className="mt-6">
            <HistoryTable
              data={selectedTab === domain ? displayData : undefined}
              isLoading={selectedTab === domain ? isLoading : false}
              onViewDetail={handleViewDetail}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
