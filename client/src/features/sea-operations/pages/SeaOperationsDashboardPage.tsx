import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeographyFilter } from '@/features/executive/components/GeographyFilter';
import { ApiService } from '@/api/generated';
import { useQuery } from '@tanstack/react-query';
import type { GeographyFilterValue, GeographyFilterOption } from '@/features/executive/types';
import { WeeklyReportTab } from '../components/WeeklyReportTab';
import { LiceManagementTab } from '../components/LiceManagementTab';
import { MarketIntelligenceTab } from '../components/MarketIntelligenceTab';
import { FacilityComparisonTab } from '../components/FacilityComparisonTab';

export default function SeaOperationsDashboardPage() {
  const [geography, setGeography] = useState<GeographyFilterValue>('global');
  const [activeTab, setActiveTab] = useState('weekly');

  const { data: geographiesData } = useQuery({
    queryKey: ['geographies-list'],
    queryFn: () => ApiService.apiV1InfrastructureGeographiesList(),
    staleTime: 30 * 60 * 1000,
  });

  const geographies = useMemo(() => {
    const options: GeographyFilterOption[] = [{ id: 'global' as const, name: 'Global' }];
    if (geographiesData?.results) {
      geographiesData.results.forEach((geo) => {
        if (geo.id && geo.name) options.push({ id: geo.id, name: geo.name });
      });
    }
    return options;
  }, [geographiesData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sea Operations</h1>
          <p className="text-muted-foreground mt-1">
            Operations control tower &mdash; weekly reporting, lice management, and facility performance
          </p>
        </div>

        <div className="w-full sm:w-64">
          <GeographyFilter
            value={geography}
            onChange={setGeography}
            geographies={geographies}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weekly">Weekly Report</TabsTrigger>
          <TabsTrigger value="lice">Lice Management</TabsTrigger>
          <TabsTrigger value="market">Market Intelligence</TabsTrigger>
          <TabsTrigger value="comparison">Facility Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <WeeklyReportTab geography={geography} />
        </TabsContent>

        <TabsContent value="lice" className="space-y-4">
          <LiceManagementTab geography={geography} />
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <MarketIntelligenceTab geography={geography} />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <FacilityComparisonTab geography={geography} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
