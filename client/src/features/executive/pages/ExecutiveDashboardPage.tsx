/**
 * ExecutiveDashboardPage
 * 
 * Main page component for the Executive Dashboard feature.
 * Provides 4 tabs: Overview, Financial, Strategic, and Market Intelligence.
 * 
 * Target personas: CEO, CFO, Executives
 */

import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeographyFilter } from '../components/GeographyFilter';
import { OverviewTab } from '../components/OverviewTab';
import { FinancialTab } from '../components/FinancialTab';
import { StrategicTab } from '../components/StrategicTab';
import { MarketTab } from '../components/MarketTab';
import type { GeographyFilterValue, GeographyFilterOption } from '../types';
import { ApiService } from '@/api/generated';
import { useQuery } from '@tanstack/react-query';

/**
 * Executive Dashboard Page
 * 
 * Main orchestrator component that:
 * - Manages geography filter state
 * - Provides tab navigation
 * - Renders tab content components
 */
export default function ExecutiveDashboardPage() {
  const [, navigate] = useLocation();
  const [geography, setGeography] = useState<GeographyFilterValue>(1); // Default to Faroe Islands
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch available geographies for filter
  const { data: geographiesData } = useQuery({
    queryKey: ['geographies-list'],
    queryFn: () => ApiService.apiV1InfrastructureGeographiesList(),
    staleTime: 30 * 60 * 1000, // 30 minutes (relatively static data)
  });

  // Format geographies for filter component
  const geographies = React.useMemo(() => {
    const options: GeographyFilterOption[] = [{ id: 'global' as const, name: 'Global' }];
    
    if (geographiesData?.results) {
      geographiesData.results.forEach((geo) => {
        if (geo.id && geo.name) {
          options.push({ id: geo.id as number, name: geo.name });
        }
      });
    }
    
    return options;
  }, [geographiesData]);

  // Navigate to scenario planning
  const handleNavigateToScenario = () => {
    navigate('/scenario-planning');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Strategic oversight and decision-making
          </p>
        </div>

        {/* Geography Filter */}
        <div className="w-full sm:w-64">
          <GeographyFilter
            value={geography}
            onChange={setGeography}
            geographies={geographies}
          />
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="strategic">Strategic</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab geography={geography} />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <FinancialTab geography={geography} />
        </TabsContent>

        <TabsContent value="strategic" className="space-y-4">
          <StrategicTab
            geography={geography}
            onNavigateToScenario={handleNavigateToScenario}
          />
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <MarketTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

