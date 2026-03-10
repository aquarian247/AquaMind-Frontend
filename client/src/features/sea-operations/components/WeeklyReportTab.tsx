import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import type { GeographyFilterValue } from '../types';
import { useSeaOperationsKPIs, useAreaSummaries } from '../api/api';
import { KPIDashboard } from './KPIDashboard';
import { FacilitySummaryTable } from './FacilitySummaryTable';

interface WeeklyReportTabProps {
  geography: GeographyFilterValue;
}

export function WeeklyReportTab({ geography }: WeeklyReportTabProps) {
  const { data: kpis, isLoading: kpisLoading } = useSeaOperationsKPIs(geography);
  const { data: areas, isLoading: areasLoading } = useAreaSummaries(geography);

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Executive Summary</h2>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <FileDown className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      <section aria-label="Key Performance Indicators">
        <KPIDashboard kpis={kpis} isLoading={kpisLoading} />
      </section>

      <section aria-label="Facility Summary">
        <h3 className="text-base font-medium mb-3">Facility Summary</h3>
        <FacilitySummaryTable data={areas || []} isLoading={areasLoading} />
      </section>
    </div>
  );
}
