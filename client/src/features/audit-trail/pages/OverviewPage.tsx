import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, BarChart3, Database, Stethoscope, Calculator, Users } from "lucide-react";
import { FilterBar } from "../components/FilterBar";
import { HistoryTable } from "../components/HistoryTable";
import { ModelSelector } from "../components/ModelSelector";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ErrorState } from "../components/ErrorState";
import { PageLoadingState } from "../components/LoadingState";
import { useHistoryList } from "../hooks/useHistory";
import { APP_DOMAINS, getAvailableModels } from "../index";
import type { AppDomain } from "../index";
import type { ApiError } from "../api/api";
import { useHistoryFilters } from "../hooks/useHistoryFilters";

export function OverviewPage() {
  const [selectedTab, setSelectedTab] = useState<AppDomain>(APP_DOMAINS.BATCH);
  const { filters, updateFilters, resetFilters, getApiFilters } = useHistoryFilters();

  // Initialize default model when component loads or tab changes
  useEffect(() => {
    if (!filters.selectedModel) {
      const availableModels = getAvailableModels(selectedTab);
      if (availableModels.length > 0) {
        updateFilters({ selectedModel: availableModels[0].value });
      }
    }
  }, [selectedTab, filters.selectedModel, updateFilters]);

  // Get the effective model (use selectedModel if available, otherwise get first available model)
  const effectiveModel = filters.selectedModel || getAvailableModels(selectedTab)[0]?.value || '';

  const { data, isLoading, error, refetch } = useHistoryList(
    selectedTab,
    effectiveModel,
    getApiFilters()
  );

  // Use data for the currently selected tab
  const displayData = data;

  const handleTabChange = (value: string) => {
    const newTab = value as AppDomain;
    setSelectedTab(newTab);
    // Reset model selection when changing tabs, but it will be set to default by useEffect
    updateFilters({ selectedModel: undefined });
  };

  const handleViewDetail = (record: any) => {
    // TODO: Navigate to detail page
    console.log('View detail for record:', record);
  };

  const handleRetry = () => {
    refetch();
  };

  // Show loading state for initial load
  if (isLoading && !data) {
    return <PageLoadingState />;
  }

  // Show error state with retry functionality
  if (error) {
    const apiError = error as ApiError;
    return (
      <ErrorState
        error={apiError}
        statusCode={apiError.statusCode}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <ErrorBoundary>
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
              selectedModel={effectiveModel}
              onModelChange={(model) => updateFilters({ selectedModel: model })}
            />
          </div>

          {/* Content for each tab */}
          {Object.values(APP_DOMAINS).map((domain: AppDomain) => (
            <TabsContent key={domain} value={domain} className="mt-6">
              <HistoryTable
                data={selectedTab === domain ? displayData : undefined}
                isLoading={selectedTab === domain ? isLoading : false}
                error={selectedTab === domain ? error : undefined}
                onViewDetail={handleViewDetail}
                onNextPage={() => updateFilters({ page: (filters.page || 1) + 1 })}
                onPrevPage={() => updateFilters({ page: Math.max(1, (filters.page || 1) - 1) })}
                currentPage={filters.page || 1}
                pageSize={filters.pageSize || 25}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ErrorBoundary>
  );
}
