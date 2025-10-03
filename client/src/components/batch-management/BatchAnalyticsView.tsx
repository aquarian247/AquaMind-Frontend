import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  AlertTriangle,
  Activity,
  Target,
  CheckCircle,
  TrendingUp,
  Scale,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBatchAnalyticsData } from "@/hooks/useBatchAnalyticsData";
import { useFCRAnalytics } from "@/hooks/use-fcr-analytics";
import { useAnalyticsData } from "@/hooks/use-analytics-data";
import { FCRSummaryCard } from "./FCRSummaryCard";
import { FCRTrendChart } from "./FCRTrendChart";
import { PerformanceOverviewCards } from "./PerformanceOverviewCards";
import { PerformanceMetricsTab } from "./PerformanceMetricsTab";
import { GrowthAnalyticsTab } from "./GrowthAnalyticsTab";
import { EnvironmentalImpactTab } from "./EnvironmentalImpactTab";
import { PredictiveInsightsTab } from "./PredictiveInsightsTab";
import { BenchmarkingTab } from "./BenchmarkingTab";

interface BatchAnalyticsViewProps {
  batchId: number;
  batchName: string;
}

export function BatchAnalyticsView({ batchId, batchName }: BatchAnalyticsViewProps) {
  const [activeTab, setActiveTab] = useState("performance");
  const [timeframe, setTimeframe] = useState("30");
  const isMobile = useIsMobile();

  // FCR Analytics Hook
  const {
    fcrSummary,
    fcrTrendsData,
    isLoading: fcrLoading,
    error: fcrError,
    refresh: refreshFCR,
    hasData: hasFCRData
  } = useFCRAnalytics({ batchId });

  // Batch Analytics Data Hook - consolidates all data fetching
  const {
    growthSamplesData,
    feedingSummaries,
    environmentalReadings,
    scenarios,
    batchAssignments,
    isLoading,
    hasError,
    hasNoData,
  } = useBatchAnalyticsData(batchId, timeframe);

  // Use the analytics data hook to calculate all derived metrics
  const {
    growthMetrics,
    performanceMetrics,
    environmentalCorrelations,
    predictiveInsights,
    benchmarks,
    latestGrowthData,
    growthTrend
  } = useAnalyticsData({
    growthSamplesData,
    batchAssignments,
    feedingSummaries,
    environmentalReadings,
    scenarios,
    growthMetrics: [] // This will be calculated inside the hook
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-pulse mx-auto text-primary mb-4" />
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-4" />
          <p className="text-red-500">Error loading analytics data. Please try again.</p>
        </div>
      </div>
    );
  }

  if (hasNoData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No growth data available for this batch.</p>
          <p className="text-xs text-muted-foreground mt-2">
            Analytics require growth samples and feeding data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Analytics for {batchName}
          </h2>
          <p className="text-sm text-muted-foreground">
            Performance insights, trends, and predictive analytics
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <PerformanceOverviewCards
        survivalRate={performanceMetrics?.survivalRate || 0}
        growthRate={performanceMetrics?.growthRate || 0}
        feedConversionRatio={performanceMetrics?.feedConversionRatio || 0}
        healthScore={performanceMetrics?.healthScore || 0}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobile ? (
          <div className="mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {activeTab === "performance" && "Performance Metrics"}
                  {activeTab === "growth" && "Growth Analytics"}
                  {activeTab === "fcr" && "FCR Analytics"}
                  {activeTab === "environmental" && "Environmental Impact"}
                  {activeTab === "predictions" && "Predictive Insights"}
                  {activeTab === "benchmarks" && "Benchmarking"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Performance Metrics</SelectItem>
                <SelectItem value="growth">Growth Analytics</SelectItem>
                <SelectItem value="fcr">FCR Analytics</SelectItem>
                <SelectItem value="environmental">Environmental Impact</SelectItem>
                <SelectItem value="predictions">Predictive Insights</SelectItem>
                <SelectItem value="benchmarks">Benchmarking</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="fcr">FCR</TabsTrigger>
            <TabsTrigger value="environmental">Environmental</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="performance" className="space-y-6">
          <PerformanceMetricsTab
            performanceMetrics={performanceMetrics}
            growthMetrics={growthMetrics}
          />
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <GrowthAnalyticsTab
            growthMetrics={growthMetrics}
            latestGrowthData={latestGrowthData}
            growthTrend={growthTrend}
          />
        </TabsContent>

        <TabsContent value="environmental" className="space-y-6">
          <EnvironmentalImpactTab environmentalCorrelations={environmentalCorrelations} />
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <PredictiveInsightsTab predictiveInsights={predictiveInsights} />
        </TabsContent>

        <TabsContent value="fcr" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* FCR Summary Card */}
            <div className="lg:col-span-1">
              <FCRSummaryCard
                data={fcrSummary}
                onRefresh={refreshFCR}
                isLoading={fcrLoading}
              />
            </div>

            {/* FCR Trend Chart */}
            <div className="lg:col-span-2">
              <FCRTrendChart
                data={fcrTrendsData}
                title={`FCR Trends - ${batchName}`}
                isLoading={fcrLoading}
                error={fcrError?.message}
                onRefresh={refreshFCR}
                showConfidenceIndicators={true}
              />
            </div>
          </div>

          {/* FCR Insights */}
          {hasFCRData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  FCR Performance Insights
                </CardTitle>
                <CardDescription>
                  Key insights and recommendations based on FCR analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* FCR Trend Analysis */}
                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Current FCR Trend
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                        {fcrSummary.trend === 'down'
                          ? "FCR is trending downward, indicating improving feed efficiency."
                          : fcrSummary.trend === 'up'
                          ? "FCR is trending upward, which may indicate operational issues requiring attention."
                          : "FCR is stable, maintaining consistent feed efficiency."
                        }
                      </p>
                    </div>
                  </div>

                  {/* Confidence Level Insights */}
                  {(fcrSummary.confidenceLevel === 'LOW' || fcrSummary.confidenceLevel === 'MEDIUM') && (
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                          Data Freshness Alert
                        </h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-1">
                          FCR data is {fcrSummary.confidenceLevel.toLowerCase()} confidence due to time since last weighing.
                          Consider scheduling a growth sample to improve data accuracy.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Prediction vs Actual Comparison */}
                  {fcrSummary.deviation !== null && fcrSummary.deviation !== undefined && Math.abs(fcrSummary.deviation) > 0.1 && (
                    <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <Scale className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-orange-900 dark:text-orange-100">
                          Prediction Deviation
                        </h4>
                        <p className="text-sm text-orange-700 dark:text-orange-200 mt-1">
                          Actual FCR deviates from predicted by {Math.abs(fcrSummary.deviation!).toFixed(2)} units.
                          {fcrSummary.deviation! > 0
                            ? " Actual performance is worse than expected - investigate feed management or health issues."
                            : " Actual performance is better than expected - excellent feed efficiency achieved."
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {fcrSummary.confidenceLevel === 'VERY_HIGH' && fcrSummary.deviation !== null && fcrSummary.deviation !== undefined && Math.abs(fcrSummary.deviation) <= 0.1 && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900 dark:text-green-100">
                          Optimal Performance
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-200 mt-1">
                          FCR is performing optimally with high confidence data and predictions closely matching actual results.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          <BenchmarkingTab benchmarks={benchmarks} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
