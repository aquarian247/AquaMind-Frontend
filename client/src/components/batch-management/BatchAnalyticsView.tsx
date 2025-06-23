import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format, subDays, subWeeks, subMonths } from "date-fns";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Activity, 
  Zap,
  Scale,
  Fish,
  Heart,
  Thermometer,
  Droplets,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BatchAnalyticsViewProps {
  batchId: number;
  batchName: string;
}

interface GrowthMetrics {
  date: string;
  averageWeight: number;
  totalBiomass: number;
  populationCount: number;
  growthRate: number;
  condition: number;
}

interface PerformanceMetrics {
  survivalRate: number;
  growthRate: number;
  feedConversionRatio: number;
  healthScore: number;
  productivity: number;
  efficiency: number;
}

interface EnvironmentalCorrelation {
  parameter: string;
  correlation: number;
  impact: 'positive' | 'negative' | 'neutral';
  significance: 'high' | 'medium' | 'low';
}

interface PredictiveInsight {
  metric: string;
  currentValue: number;
  predictedValue: number;
  trend: 'improving' | 'declining' | 'stable';
  confidence: number;
  timeframe: string;
}

interface Benchmark {
  metric: string;
  current: number;
  target: number;
  industry: number;
  status: 'above' | 'below' | 'on-target';
}

export function BatchAnalyticsView({ batchId, batchName }: BatchAnalyticsViewProps) {
  const [activeTab, setActiveTab] = useState("performance");
  const [timeframe, setTimeframe] = useState("30");
  const [metricFilter, setMetricFilter] = useState("all");
  const isMobile = useIsMobile();

  // Fetch analytics data
  const { data: growthMetrics = [] } = useQuery<GrowthMetrics[]>({
    queryKey: ["/api/batch/growth-metrics", batchId, timeframe],
    queryFn: async () => {
      const response = await fetch(`/api/batch/growth-metrics?batchId=${batchId}&timeframe=${timeframe}`);
      if (!response.ok) throw new Error("Failed to fetch growth metrics");
      return response.json();
    },
  });

  const { data: performanceMetrics } = useQuery<PerformanceMetrics>({
    queryKey: ["/api/batch/performance-metrics", batchId],
    queryFn: async () => {
      const response = await fetch(`/api/batch/performance-metrics?batchId=${batchId}`);
      if (!response.ok) throw new Error("Failed to fetch performance metrics");
      return response.json();
    },
  });

  const { data: environmentalCorrelations = [] } = useQuery<EnvironmentalCorrelation[]>({
    queryKey: ["/api/batch/environmental-correlations", batchId],
    queryFn: async () => {
      const response = await fetch(`/api/batch/environmental-correlations?batchId=${batchId}`);
      if (!response.ok) throw new Error("Failed to fetch environmental correlations");
      return response.json();
    },
  });

  const { data: predictiveInsights = [] } = useQuery<PredictiveInsight[]>({
    queryKey: ["/api/batch/predictive-insights", batchId],
    queryFn: async () => {
      const response = await fetch(`/api/batch/predictive-insights?batchId=${batchId}`);
      if (!response.ok) throw new Error("Failed to fetch predictive insights");
      return response.json();
    },
  });

  const { data: benchmarks = [] } = useQuery<Benchmark[]>({
    queryKey: ["/api/batch/benchmarks", batchId],
    queryFn: async () => {
      const response = await fetch(`/api/batch/benchmarks?batchId=${batchId}`);
      if (!response.ok) throw new Error("Failed to fetch benchmarks");
      return response.json();
    },
  });

  // Calculate derived metrics
  const latestGrowthData = growthMetrics[growthMetrics.length - 1];
  const growthTrend = growthMetrics.length > 1 
    ? growthMetrics[growthMetrics.length - 1].growthRate - growthMetrics[growthMetrics.length - 2].growthRate
    : 0;

  const getPerformanceColor = (value: number, threshold: { good: number; fair: number }) => {
    if (value >= threshold.good) return "text-green-600";
    if (value >= threshold.fair) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBg = (value: number, threshold: { good: number; fair: number }) => {
    if (value >= threshold.good) return "bg-green-100 border-green-200";
    if (value >= threshold.fair) return "bg-yellow-100 border-yellow-200";
    return "bg-red-100 border-red-200";
  };

  const getCorrelationColor = (impact: string) => {
    switch (impact) {
      case 'positive': return "text-green-600 bg-green-50";
      case 'negative': return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const getBenchmarkStatus = (status: string) => {
    switch (status) {
      case 'above': return { icon: CheckCircle, color: "text-green-600" };
      case 'below': return { icon: AlertTriangle, color: "text-red-600" };
      default: return { icon: Target, color: "text-blue-600" };
    }
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Survival Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", getPerformanceColor(performanceMetrics?.survivalRate || 0, { good: 90, fair: 85 }))}>
              {performanceMetrics?.survivalRate?.toFixed(1) || '0.0'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Population retention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", getPerformanceColor(performanceMetrics?.growthRate || 0, { good: 15, fair: 10 }))}>
              {performanceMetrics?.growthRate?.toFixed(1) || '0.0'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Weekly growth rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feed Conversion</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", getPerformanceColor(2.0 - (performanceMetrics?.feedConversionRatio || 0), { good: 0.8, fair: 0.5 }))}>
              {performanceMetrics?.feedConversionRatio?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              FCR ratio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", getPerformanceColor(performanceMetrics?.healthScore || 0, { good: 85, fair: 75 }))}>
              {performanceMetrics?.healthScore?.toFixed(0) || '0'}/100
            </div>
            <p className="text-xs text-muted-foreground">
              Overall health
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobile ? (
          <div className="mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {activeTab === "performance" && "Performance Metrics"}
                  {activeTab === "growth" && "Growth Analytics"}
                  {activeTab === "environmental" && "Environmental Impact"}
                  {activeTab === "predictions" && "Predictive Insights"}
                  {activeTab === "benchmarks" && "Benchmarking"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">Performance Metrics</SelectItem>
                <SelectItem value="growth">Growth Analytics</SelectItem>
                <SelectItem value="environmental">Environmental Impact</SelectItem>
                <SelectItem value="predictions">Predictive Insights</SelectItem>
                <SelectItem value="benchmarks">Benchmarking</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="environmental">Environmental</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
                <CardDescription>Detailed performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Survival Rate</span>
                    <span className="font-bold">{performanceMetrics?.survivalRate?.toFixed(1) || '0.0'}%</span>
                  </div>
                  <Progress value={performanceMetrics?.survivalRate || 0} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Growth Efficiency</span>
                    <span className="font-bold">{performanceMetrics?.efficiency?.toFixed(1) || '0.0'}%</span>
                  </div>
                  <Progress value={performanceMetrics?.efficiency || 0} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Productivity</span>
                    <span className="font-bold">{performanceMetrics?.productivity?.toFixed(1) || '0.0'}%</span>
                  </div>
                  <Progress value={performanceMetrics?.productivity || 0} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
                <CardDescription>Recent growth pattern analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {growthMetrics.slice(-5).map((metric, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="space-y-1">
                        <span className="text-sm font-medium">{format(new Date(metric.date), "MMM dd")}</span>
                        <div className="text-xs text-muted-foreground">
                          {metric.populationCount.toLocaleString()} fish
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <span className="font-bold">{metric.averageWeight.toFixed(2)}g</span>
                        <div className="text-xs text-muted-foreground">
                          {metric.totalBiomass.toFixed(2)}kg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Rate Analysis</CardTitle>
                <CardDescription>Weekly growth rate progression</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Growth Rate</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{latestGrowthData?.growthRate?.toFixed(2) || '0.00'}%</span>
                      {growthTrend > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : growthTrend < 0 ? (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      ) : (
                        <Activity className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Weekly Growth Progression</span>
                    {growthMetrics.slice(-4).map((metric, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{format(new Date(metric.date), "MMM dd")}</span>
                        <span className={cn("font-semibold", 
                          metric.growthRate > 15 ? "text-green-600" : 
                          metric.growthRate > 10 ? "text-blue-600" : "text-orange-600"
                        )}>
                          {metric.growthRate.toFixed(2)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Condition Factor</CardTitle>
                <CardDescription>Fish body condition and health indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Condition</span>
                    <span className="font-bold">{latestGrowthData?.condition?.toFixed(2) || '0.00'}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Condition Trend</span>
                    {growthMetrics.slice(-4).map((metric, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{format(new Date(metric.date), "MMM dd")}</span>
                        <span className={cn("font-semibold",
                          metric.condition > 1.0 ? "text-green-600" :
                          metric.condition > 0.8 ? "text-blue-600" : "text-red-600"
                        )}>
                          {metric.condition.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Environmental Impact Analysis</CardTitle>
              <CardDescription>How environmental factors affect batch performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {environmentalCorrelations.map((correlation, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {correlation.parameter === 'Temperature' && <Thermometer className="h-4 w-4" />}
                      {correlation.parameter === 'Oxygen' && <Droplets className="h-4 w-4" />}
                      {correlation.parameter === 'pH' && <Zap className="h-4 w-4" />}
                      <span className="font-medium">{correlation.parameter}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getCorrelationColor(correlation.impact)}>
                        {correlation.impact}
                      </Badge>
                      <span className="font-bold">
                        {(correlation.correlation * 100).toFixed(0)}%
                      </span>
                      <Badge variant="outline" className={
                        correlation.significance === 'high' ? 'border-red-200' :
                        correlation.significance === 'medium' ? 'border-yellow-200' : 'border-gray-200'
                      }>
                        {correlation.significance}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="space-y-4">
            {predictiveInsights.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{insight.metric}</CardTitle>
                      <CardDescription>Prediction for {insight.timeframe}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(insight.trend)}
                      <Badge variant="outline">{insight.confidence}% confidence</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Current Value</label>
                      <p className="text-xl font-bold">{insight.currentValue.toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Predicted Value</label>
                      <p className={cn("text-xl font-bold",
                        insight.trend === 'improving' ? "text-green-600" :
                        insight.trend === 'declining' ? "text-red-600" : "text-blue-600"
                      )}>
                        {insight.predictedValue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Progress 
                      value={insight.confidence} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Prediction confidence: {insight.confidence}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          <div className="space-y-4">
            {benchmarks.map((benchmark, index) => {
              const StatusIcon = getBenchmarkStatus(benchmark.status).icon;
              const statusColor = getBenchmarkStatus(benchmark.status).color;
              
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={cn("h-5 w-5", statusColor)} />
                        <span className="font-medium">{benchmark.metric}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <label className="text-xs text-muted-foreground">Current</label>
                          <p className="font-bold">{benchmark.current.toFixed(2)}</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Target</label>
                          <p className="font-bold text-blue-600">{benchmark.target.toFixed(2)}</p>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Industry</label>
                          <p className="font-bold text-gray-600">{benchmark.industry.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div>
                        <Progress 
                          value={(benchmark.current / benchmark.target) * 100} 
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">vs Target</p>
                      </div>
                      <div>
                        <Progress 
                          value={(benchmark.current / benchmark.industry) * 100} 
                          className="h-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">vs Industry</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}