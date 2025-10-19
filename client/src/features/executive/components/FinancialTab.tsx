/**
 * FinancialTab Component
 * 
 * Financial analytics tab showing revenue trends, cost breakdown, and key financial metrics.
 * ⚠️ NOTE: Uses placeholder data until backend financial aggregation endpoints are available.
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { KPICard } from './KPICard';
import { useFinancialSummary } from '../api/api';
import type { GeographyFilterValue, KPIData } from '../types';
import { formatKPI } from '../utils/kpiCalculations';

export interface FinancialTabProps {
  geography: GeographyFilterValue;
}

/**
 * FinancialTab Component
 * 
 * Displays financial KPIs with placeholder data until backend integration.
 * 
 * @example
 * ```tsx
 * <FinancialTab geography="global" />
 * ```
 */
export function FinancialTab({ geography }: FinancialTabProps) {
  const { data: financial } = useFinancialSummary(geography);

  // Prepare financial KPIs
  const financialKPIs: KPIData[] = React.useMemo(() => {
    // Return empty array if no data
    if (!financial) {
      return [];
    }

    return [
      formatKPI({
        title: 'Total Revenue',
        value: financial.total_revenue,
        unit: '€',
        subtitle: 'Current period',
      }),
      formatKPI({
        title: 'Total Costs',
        value: financial.total_costs,
        unit: '€',
        subtitle: 'Current period',
      }),
      formatKPI({
        title: 'Gross Margin',
        value: financial.gross_margin_percentage,
        unit: '%',
        subtitle: 'Revenue - Costs',
      }),
      formatKPI({
        title: 'EBITDA',
        value: financial.ebitda,
        unit: '€',
        subtitle: 'Earnings before interest, tax, depreciation, amortization',
      }),
      formatKPI({
        title: 'Operating Margin',
        value: financial.operating_margin_percentage,
        unit: '%',
        subtitle: 'Operating efficiency',
      }),
      formatKPI({
        title: 'ROI',
        value: financial.roi_percentage,
        unit: '%',
        subtitle: 'Return on investment',
      }),
    ];
  }, [financial]);

  return (
    <div className="space-y-6">
      {/* Integration Pending Banner */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Financial Integration Pending:</strong> Backend financial aggregation endpoints
          are under development. This tab will display real revenue, cost, and margin data once
          the <code>/api/v1/finance/summary/</code> endpoint is implemented. See{' '}
          <code>TASK_0_BACKEND_API_GAPS.md</code> for details.
        </AlertDescription>
      </Alert>

      {/* Financial KPIs */}
      <section aria-label="Financial KPIs">
        <h2 className="text-lg font-semibold mb-4">Key Financial Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {financialKPIs.length === 0 ? (
            <div className="col-span-3 text-center text-muted-foreground py-4">
              Financial data not available
            </div>
          ) : (
            financialKPIs.map((kpi, index) => (
              <KPICard key={`financial-kpi-${index}`} data={kpi} />
            ))
          )}
        </div>
      </section>

      {/* Revenue Trend Chart (Placeholder) */}
      <section aria-label="Revenue Trends">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue by geography</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Info className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p>Revenue trend chart will appear here</p>
                <p className="text-xs">Once financial data endpoints are available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cost Breakdown Chart (Placeholder) */}
      <section aria-label="Cost Breakdown">
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>Operational cost distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Info className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p>Cost breakdown chart will appear here</p>
                <p className="text-xs">Expected categories: Feed, Labor, Transport, Maintenance, Other</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

