import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import type { GeographyFilterValue } from '../types';

interface MarketIntelligenceTabProps {
  geography: GeographyFilterValue;
}

export function MarketIntelligenceTab({ geography }: MarketIntelligenceTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Market Intelligence</h2>
        <p className="text-sm text-muted-foreground">Salmon prices and harvest optimization</p>
      </div>

      <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                Market Data Integration Pending
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                The Stagri Salmon Index integration is not yet available. When connected,
                this tab will display real-time salmon pricing by size class, historical
                trends, and harvest timing recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-50">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Price Matrix</CardTitle>
            <CardDescription>Stagri Salmon Index by size class (NOK/kg)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
              9 size classes x 4 weeks of pricing data
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Price Trends</CardTitle>
            <CardDescription>Historical comparison 2023-2025</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
              Average price trend by week
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="text-sm">Harvest Timing Optimizer</CardTitle>
          <CardDescription>Recommendations based on biomass distribution and price projections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
            Size class | Biomass | Fish Count | Current Price | Revenue | Recommendation
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
