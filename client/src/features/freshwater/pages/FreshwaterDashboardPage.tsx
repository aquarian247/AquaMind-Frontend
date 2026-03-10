import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StationFilter } from '../components/StationFilter';
import { WeeklyReportTab } from '../components/WeeklyReportTab';
import { ForensicAnalysisTab } from '../components/ForensicAnalysisTab';
import { TransferPlanningTab } from '../components/TransferPlanningTab';
import { StationDetailsTab } from '../components/StationDetailsTab';
import { useFreshwaterStations } from '../api/api';
import type { StationFilterValue, StationFilterOption } from '../types';

export default function FreshwaterDashboardPage() {
  const [stationId, setStationId] = useState<StationFilterValue>('all');
  const [activeTab, setActiveTab] = useState('weekly-report');

  const { data: stationsData } = useFreshwaterStations();

  const stationOptions = useMemo(() => {
    const options: StationFilterOption[] = [{ id: 'all' as const, name: 'All Stations' }];

    if (stationsData) {
      stationsData.forEach((station) => {
        options.push({ id: station.id, name: station.name });
      });
    }

    return options;
  }, [stationsData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Freshwater Operations</h1>
          <p className="text-muted-foreground mt-1">
            Weekly reporting, forensic analysis, and transfer planning
          </p>
        </div>

        <div className="w-full sm:w-64">
          <StationFilter
            value={stationId}
            onChange={setStationId}
            stations={stationOptions}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weekly-report">Weekly Report</TabsTrigger>
          <TabsTrigger value="forensic">Forensic Analysis</TabsTrigger>
          <TabsTrigger value="transfer">Transfer Planning</TabsTrigger>
          <TabsTrigger value="stations">Station Details</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly-report" className="space-y-4">
          <WeeklyReportTab stationId={stationId} />
        </TabsContent>

        <TabsContent value="forensic" className="space-y-4">
          <ForensicAnalysisTab stationId={stationId} />
        </TabsContent>

        <TabsContent value="transfer" className="space-y-4">
          <TransferPlanningTab stationId={stationId} />
        </TabsContent>

        <TabsContent value="stations" className="space-y-4">
          <StationDetailsTab stationId={stationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
