/**
 * MarketTab Component
 * 
 * Market intelligence tab showing salmon market pricing, market share, and outlook.
 * ⚠️ NOTE: Uses placeholder data until market price integration is available.
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import { KPICard } from './KPICard';
import { useMarketPrices } from '../api/api';
import type { KPIData } from '../types';
import { formatKPI } from '../utils/kpiCalculations';

export interface MarketTabProps {
  className?: string;
}

/**
 * MarketTab Component
 * 
 * Displays market intelligence with placeholder data until external integration.
 * 
 * @example
 * ```tsx
 * <MarketTab />
 * ```
 */
export function MarketTab({ className }: MarketTabProps) {
  const { data: marketPrice } = useMarketPrices();

  // Market KPIs
  const marketKPIs: KPIData[] = React.useMemo(() => {
    return [
      formatKPI({
        title: 'Salmon Price',
        value: marketPrice?.current_price_per_kg || null,
        unit: '€/kg',
        subtitle: 'Current market price',
      }),
      {
        title: 'Market Outlook',
        value: null,
        unit: '',
        subtitle: marketPrice?.market_outlook || 'N/A',
      },
    ];
  }, [marketPrice]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Integration Pending Banner */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Market Data Integration Pending:</strong> External market price integration
          (Stágri Salmon Index or equivalent) is under development. This tab will display
          real-time salmon pricing and market intelligence once the integration is complete.
          See <code>TASK_0_BACKEND_API_GAPS.md</code> for details.
        </AlertDescription>
      </Alert>

      {/* Market Price KPIs */}
      <section aria-label="Market Pricing">
        <h2 className="text-lg font-semibold mb-4">Market Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketKPIs.map((kpi, index) => (
            <KPICard key={`market-kpi-${index}`} data={kpi} />
          ))}
        </div>
      </section>

      {/* Market Share (Placeholder) */}
      <section aria-label="Market Share">
        <Card>
          <CardHeader>
            <CardTitle>Global Market Share</CardTitle>
            <CardDescription>Company position in global salmon production</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Info className="h-8 w-8 mx-auto text-muted-foreground/50" />
                <p>Market share visualization will appear here</p>
                <p className="text-xs">Company vs competitors breakdown</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Supply & Demand Indicators (Placeholder) */}
      <section aria-label="Market Indicators">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Supply Outlook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-4">
                <p className="text-sm">Supply outlook data coming soon</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-blue-600" />
                Demand Outlook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-4">
                <p className="text-sm">Demand outlook data coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}






