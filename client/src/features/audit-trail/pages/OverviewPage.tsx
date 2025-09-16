import { useState, useEffect } from "react";
import { useLocation } from "wouter";
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
  const [, setLocation] = useLocation();
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
    // Navigate to detail page with domain, model, and record ID
    setLocation(`/audit-trail/${selectedTab}/${effectiveModel}/${record.history_id || record.id}`);
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
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <History className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold">Audit Trail</h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-1">
                  Track and review all changes across the AquaMind platform
                </p>
              </div>
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
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto p-1">
            <TabsTrigger value={APP_DOMAINS.BATCH} className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Batch</span>
              <span className="sm:hidden">Batch</span>
            </TabsTrigger>
            <TabsTrigger value={APP_DOMAINS.INFRASTRUCTURE} className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <Database className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Infrastructure</span>
              <span className="sm:hidden">Infra</span>
            </TabsTrigger>
            <TabsTrigger value={APP_DOMAINS.INVENTORY} className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <Database className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Inventory</span>
              <span className="sm:hidden">Inv</span>
            </TabsTrigger>
            <TabsTrigger value={APP_DOMAINS.HEALTH} className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <Stethoscope className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Health</span>
              <span className="sm:hidden">Health</span>
            </TabsTrigger>
            <TabsTrigger value={APP_DOMAINS.SCENARIO} className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <Calculator className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Scenario</span>
              <span className="sm:hidden">Scen</span>
            </TabsTrigger>
            <TabsTrigger value={APP_DOMAINS.USERS} className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Users</span>
              <span className="sm:hidden">Users</span>
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
