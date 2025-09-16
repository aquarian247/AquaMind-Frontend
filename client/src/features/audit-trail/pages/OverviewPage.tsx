import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, BarChart3, Database, Stethoscope, Calculator, Users } from "lucide-react";
import { MemoizedFilterBar as FilterBar } from "../components/FilterBar";
import { MemoizedHistoryTable as HistoryTable } from "../components/HistoryTable";
import { MemoizedModelSelector as ModelSelector } from "../components/ModelSelector";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ErrorState } from "../components/ErrorState";
import { PageLoadingState } from "../components/LoadingState";
import { useHistoryList } from "../hooks/useHistory";
import { useAccessibility } from "../hooks/useAccessibility";
import { APP_DOMAINS, getAvailableModels } from "../index";
import type { AppDomain } from "../index";
import type { ApiError } from "../api/api";
import { useHistoryFilters } from "../hooks/useHistoryFilters";

export function OverviewPage() {
  const [selectedTab, setSelectedTab] = useState<AppDomain>(APP_DOMAINS.BATCH);
  const [, setLocation] = useLocation();
  const { filters, updateFilters, resetFilters, getApiFilters } = useHistoryFilters();

  // Accessibility hook for comprehensive accessibility features
  const {
    announce,
    getAriaAttributes,
    createSkipLink,
    announcementRef,
    focusRef,
    announcements
  } = useAccessibility();

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

  // Get display name for domain
  const getDomainDisplayName = useMemo(() => (domain: AppDomain): string => {
    const names: Record<AppDomain, string> = {
      [APP_DOMAINS.BATCH]: 'Batch Management',
      [APP_DOMAINS.INFRASTRUCTURE]: 'Infrastructure',
      [APP_DOMAINS.INVENTORY]: 'Inventory',
      [APP_DOMAINS.HEALTH]: 'Health & Welfare',
      [APP_DOMAINS.SCENARIO]: 'Scenario Planning',
      [APP_DOMAINS.USERS]: 'User Management'
    };
    return names[domain] || domain;
  }, []);

  // Announce loading and data states
  useEffect(() => {
    if (isLoading) {
      announce('Loading audit trail records...', 'polite');
    } else if (data) {
      const recordCount = data.results?.length || 0;
      const totalCount = data.count || 0;
      announce(`Loaded ${recordCount} of ${totalCount} audit records for ${getDomainDisplayName(selectedTab)}`, 'polite');
    }
  }, [isLoading, data, selectedTab, announce, getDomainDisplayName]);

  // Skip links for accessibility
  const skipLinks = useMemo(() => [
    createSkipLink('main-content', 'Skip to main content'),
    createSkipLink('filters', 'Skip to filters'),
    createSkipLink('results', 'Skip to results'),
  ], [createSkipLink]);

  const handleTabChange = (value: string) => {
    const newTab = value as AppDomain;
    setSelectedTab(newTab);
    // Reset model selection when changing tabs, but it will be set to default by useEffect
    updateFilters({ selectedModel: undefined });
    // Announce tab change to screen readers
    announce(`Switched to ${getDomainDisplayName(newTab)} tab`, 'polite');
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
      {/* Skip Links */}
      <nav aria-label="Skip navigation">
        {skipLinks.map((link, index) =>
          link ? (
            <a key={index} {...link} />
          ) : null
        )}
      </nav>

      {/* Screen Reader Announcements */}
      <div
        ref={announcementRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>

      <div className="container mx-auto p-4 space-y-6" role="main" id="main-content">
        {/* Page Header */}
        <header className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <History className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold" id="page-title">Audit Trail</h1>
                <p className="text-muted-foreground text-sm sm:text-base mt-1">
                  Track and review all changes across the AquaMind platform
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Filters */}
        <section
          id="filters"
          aria-labelledby="filters-heading"
          {...getAriaAttributes('region', 'Audit trail filters', 'Filter and search audit trail records')}
        >
          <h2 id="filters-heading" className="sr-only">Filters</h2>
          <FilterBar
            filters={filters}
            onFiltersChange={updateFilters}
            onResetFilters={resetFilters}
          />
        </section>

        {/* Tabs for App Domains */}
        <section
          id="results"
          aria-labelledby="results-heading"
          {...getAriaAttributes('region', 'Audit trail results', 'Browse audit records by application domain')}
        >
          <h2 id="results-heading" className="sr-only">Audit Trail Results</h2>
          <Tabs
            value={selectedTab}
            onValueChange={handleTabChange}
            {...getAriaAttributes(
              undefined,
              'Application domain tabs',
              'Switch between different application domains to view their audit records'
            )}
          >
            <TabsList
              className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto p-1"
              role="tablist"
              aria-label="Application domains"
            >
              <TabsTrigger
                value={APP_DOMAINS.BATCH}
                className="text-xs sm:text-sm py-2 px-1 sm:px-3"
                {...getAriaAttributes(
                  'tab',
                  'Batch Management',
                  'View audit records for batch management operations'
                )}
              >
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Batch</span>
                <span className="sm:hidden">Batch</span>
              </TabsTrigger>
              <TabsTrigger
                value={APP_DOMAINS.INFRASTRUCTURE}
                className="text-xs sm:text-sm py-2 px-1 sm:px-3"
                {...getAriaAttributes(
                  'tab',
                  'Infrastructure Management',
                  'View audit records for infrastructure operations'
                )}
              >
                <Database className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Infrastructure</span>
                <span className="sm:hidden">Infra</span>
              </TabsTrigger>
              <TabsTrigger
                value={APP_DOMAINS.INVENTORY}
                className="text-xs sm:text-sm py-2 px-1 sm:px-3"
                {...getAriaAttributes(
                  'tab',
                  'Inventory Management',
                  'View audit records for inventory operations'
                )}
              >
                <Database className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Inventory</span>
                <span className="sm:hidden">Inv</span>
              </TabsTrigger>
              <TabsTrigger
                value={APP_DOMAINS.HEALTH}
                className="text-xs sm:text-sm py-2 px-1 sm:px-3"
                {...getAriaAttributes(
                  'tab',
                  'Health Management',
                  'View audit records for health and welfare operations'
                )}
              >
                <Stethoscope className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Health</span>
                <span className="sm:hidden">Health</span>
              </TabsTrigger>
              <TabsTrigger
                value={APP_DOMAINS.SCENARIO}
                className="text-xs sm:text-sm py-2 px-1 sm:px-3"
                {...getAriaAttributes(
                  'tab',
                  'Scenario Planning',
                  'View audit records for scenario planning operations'
                )}
              >
                <Calculator className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Scenario</span>
                <span className="sm:hidden">Scen</span>
              </TabsTrigger>
              <TabsTrigger
                value={APP_DOMAINS.USERS}
                className="text-xs sm:text-sm py-2 px-1 sm:px-3"
                {...getAriaAttributes(
                  'tab',
                  'User Management',
                  'View audit records for user management operations'
                )}
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Users</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
            </TabsList>

          {/* Model Selector for each tab */}
          <div className="mt-4" {...getAriaAttributes('region', 'Model type selector', 'Choose which model type to view audit records for')}>
            <ModelSelector
              appDomain={selectedTab}
              selectedModel={effectiveModel}
              onModelChange={(model) => {
                updateFilters({ selectedModel: model });
                announce(`Selected ${model} model for filtering`, 'polite');
              }}
            />
          </div>

          {/* Content for each tab */}
          {Object.values(APP_DOMAINS).map((domain: AppDomain) => (
            <TabsContent
              key={domain}
              value={domain}
              className="mt-6"
              {...getAriaAttributes(
                'tabpanel',
                `${getDomainDisplayName(domain)} audit records`,
                `View audit trail records for ${getDomainDisplayName(domain).toLowerCase()}`
              )}
            >
              <HistoryTable
                data={selectedTab === domain ? displayData : undefined}
                isLoading={selectedTab === domain ? isLoading : false}
                error={selectedTab === domain ? error : undefined}
                onViewDetail={handleViewDetail}
                onNextPage={() => {
                  updateFilters({ page: (filters.page || 1) + 1 });
                  announce(`Loading page ${(filters.page || 1) + 1}`, 'polite');
                }}
                onPrevPage={() => {
                  updateFilters({ page: Math.max(1, (filters.page || 1) - 1) });
                  announce(`Loading page ${Math.max(1, (filters.page || 1) - 1)}`, 'polite');
                }}
                currentPage={filters.page || 1}
                pageSize={filters.pageSize || 25}
                domain={domain}
                model={effectiveModel}
              />
            </TabsContent>
          ))}
        </Tabs>
      </section>
      </div>
    </ErrorBoundary>
  );
}
