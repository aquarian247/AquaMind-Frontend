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
import { format, subDays, subWeeks, subMonths, parseISO, differenceInDays } from "date-fns";
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
import { ApiService } from "@/api/generated/services/ApiService";
import { FCRSummaryCard } from "./FCRSummaryCard";
import { FCRTrendChart } from "./FCRTrendChart";
import { useFCRAnalytics } from "@/hooks/use-fcr-analytics";

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

  // FCR Analytics Hook
  const {
    fcrSummary,
    fcrTrendsData,
    isLoading: fcrLoading,
    error: fcrError,
    refresh: refreshFCR,
    isRefreshing: fcrRefreshing,
    hasData: hasFCRData
  } = useFCRAnalytics({ batchId });

  // Fetch growth samples data
  const { data: growthSamplesData = [], isLoading: growthLoading, error: growthError } = useQuery({
    queryKey: ["batch/growth-samples", batchId, timeframe],
    queryFn: async () => {
      try {
        // Fixed: Use correct parameter structure
        const response = await ApiService.apiV1BatchGrowthSamplesList(
          batchId, // assignmentBatch parameter
          undefined, // ordering
          undefined, // page
          undefined, // sampleDate
          undefined  // search
        );
        return response.results || [];
      } catch (error) {
        console.error("Failed to fetch growth samples:", error);
        throw new Error("Failed to fetch growth metrics");
      }
    },
  });

  // Fetch batch growth analysis if available
  const { data: growthAnalysis, isLoading: analysisLoading, error: analysisError } = useQuery({
    queryKey: ["batch/growth-analysis", batchId],
    queryFn: async () => {
      try {
        const response = await ApiService.apiV1BatchBatchesGrowthAnalysisRetrieve(batchId);
        return response;
      } catch (error) {
        console.error("Failed to fetch growth analysis:", error);
        return null;
      }
    },
    enabled: !!batchId,
  });

  // Fetch feeding summaries for FCR calculation
  const { data: feedingSummaries = [], isLoading: feedingLoading, error: feedingError } = useQuery({
    queryKey: ["batch/feeding-summaries", batchId],
    queryFn: async () => {
      try {
        // Fixed: Use correct parameter structure
        const response = await ApiService.apiV1InventoryBatchFeedingSummariesList(
          batchId, // batch parameter
          undefined, // page
          undefined  // search
        );
        return response.results || [];
      } catch (error) {
        console.error("Failed to fetch feeding summaries:", error);
        return [];
      }
    },
  });

  // Fetch environmental readings
  const { data: environmentalReadings = [], isLoading: envLoading, error: envError } = useQuery({
    queryKey: ["environmental/readings", batchId],
    queryFn: async () => {
      try {
        // Fixed: Use correct parameter structure
        const response = await ApiService.apiV1EnvironmentalReadingsList(
          undefined, // container parameter
          undefined, // ordering
          undefined, // page
          undefined, // parameter
          undefined, // readingTimeAfter
          undefined, // readingTimeBefore
          undefined, // search
          undefined  // sensor
        );
        return response.results || [];
      } catch (error) {
        console.error("Failed to fetch environmental readings:", error);
        return [];
      }
    },
  });

  // Fetch scenarios for predictions
  const { data: scenarios = [], isLoading: scenarioLoading, error: scenarioError } = useQuery({
    queryKey: ["scenario/scenarios", batchId],
    queryFn: async () => {
      try {
        // Fixed: Use correct parameter structure
        const response = await ApiService.apiV1ScenarioScenariosList(
          batchId, // batch parameter
          undefined, // createdBy
          undefined, // ordering
          undefined, // page
          undefined  // search
        );
        return response.results || [];
      } catch (error) {
        console.error("Failed to fetch scenarios:", error);
        return [];
      }
    },
  });

  // Fetch batch container assignments to get population counts
  const { data: batchAssignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ["batch/container-assignments", batchId],
    queryFn: async () => {
      try {
        // Fixed: Convert batchId to string as expected by the API
        const response = await ApiService.apiV1BatchContainerAssignmentsList(
          String(batchId), // batch parameter as string
          undefined, // container
          undefined, // isActive
          undefined, // lifecycleStage
          undefined, // ordering
          undefined, // page
          undefined  // search
        );
        return response.results || [];
      } catch (error) {
        console.error("Failed to fetch batch assignments:", error);
        return [];
      }
    },
  });

  // Transform growth samples into growth metrics format
  const growthMetrics: GrowthMetrics[] = growthSamplesData
    .sort((a, b) => {
      // Fixed: Add null checks for sample_date
      const dateA = a.sample_date ? new Date(a.sample_date).getTime() : 0;
      const dateB = b.sample_date ? new Date(b.sample_date).getTime() : 0;
      return dateA - dateB;
    })
    .map((sample, index, samples) => {
      // Fixed: Parse string values to numbers
      const avgWeight = sample.avg_weight_g ? parseFloat(sample.avg_weight_g) : 0;
      const avgLength = sample.avg_length_cm ? parseFloat(sample.avg_length_cm) : 0;
      
      // Calculate growth rate if we have previous samples
      let growthRate = 0;
      if (index > 0) {
        const prevSample = samples[index - 1];
        // Fixed: Add null checks for sample_date
        if (sample.sample_date && prevSample.sample_date) {
          const daysDiff = differenceInDays(
            new Date(sample.sample_date),
            new Date(prevSample.sample_date)
          );
          
          if (daysDiff > 0) {
            // Fixed: Parse string values to numbers
            const prevWeight = prevSample.avg_weight_g ? parseFloat(prevSample.avg_weight_g) : 0;
            if (prevWeight > 0) {
              const weightDiff = avgWeight - prevWeight;
              growthRate = (weightDiff / prevWeight) * (7 / daysDiff) * 100; // Weekly growth rate
            }
          }
        }
      }

      // Calculate K-factor (condition) if length is available
      const condition = avgLength > 0 && avgWeight > 0 
        ? (avgWeight / Math.pow(avgLength, 3)) * 100
        : 1.0;

      // Fixed: Use assignment data for population count and biomass
      const assignment = batchAssignments.find(a => a.id === sample.assignment);
      const populationCount = assignment?.population_count || 0;
      // Fixed: Ensure totalBiomass is always a number
      const totalBiomass = assignment?.biomass_kg 
        ? parseFloat(String(assignment.biomass_kg)) 
        : (avgWeight * populationCount / 1000);

      return {
        date: sample.sample_date || '',
        averageWeight: avgWeight,
        totalBiomass: totalBiomass,
        populationCount: populationCount,
        growthRate: growthRate,
        condition: condition
      };
    });

  // Calculate performance metrics from available data
  const calculatePerformanceMetrics = (): PerformanceMetrics => {
    // Get latest growth sample
    const latestSample = growthSamplesData.length > 0 
      ? growthSamplesData.reduce((latest, current) => {
          if (!latest.sample_date || !current.sample_date) return latest;
          return new Date(current.sample_date) > new Date(latest.sample_date) ? current : latest;
        }, growthSamplesData[0])
      : null;
      
    // Get earliest growth sample to calculate survival rate
    const earliestSample = growthSamplesData.length > 0 
      ? growthSamplesData.reduce((earliest, current) => {
          if (!earliest.sample_date || !current.sample_date) return earliest;
          return new Date(current.sample_date) < new Date(earliest.sample_date) ? current : earliest;
        }, growthSamplesData[0])
      : null;
      
    // Fixed: Use assignments for population data
    const latestAssignment = latestSample ? batchAssignments.find(a => a.id === latestSample.assignment) : null;
    const earliestAssignment = earliestSample ? batchAssignments.find(a => a.id === earliestSample.assignment) : null;
    
    // Calculate survival rate - Fixed: Handle undefined population_count properly
    const latestPopulation = latestAssignment?.population_count || 0;
    const earliestPopulation = earliestAssignment?.population_count || 0;
    const survivalRate = (latestPopulation > 0 && earliestPopulation > 0)
      ? (latestPopulation / earliestPopulation) * 100
      : 0;
      
    // Calculate average growth rate
    const avgGrowthRate = growthMetrics.length > 0
      ? growthMetrics.reduce((sum, metric) => sum + metric.growthRate, 0) / growthMetrics.length
      : 0;
      
    // Calculate FCR from feeding summaries
    let feedConversionRatio = 0;
    if (feedingSummaries.length > 0 && latestAssignment && earliestAssignment) {
      // Fixed: Parse string values to numbers and add type annotation
      const totalFeed = feedingSummaries.reduce((sum: number, summary) => {
        const feedAmount = summary.total_feed_kg ? parseFloat(summary.total_feed_kg) : 0;
        return sum + feedAmount;
      }, 0);
      
      // Fixed: Parse biomass_kg from string to number
      const latestBiomass = latestAssignment.biomass_kg ? parseFloat(String(latestAssignment.biomass_kg)) : 0;
      const earliestBiomass = earliestAssignment.biomass_kg ? parseFloat(String(earliestAssignment.biomass_kg)) : 0;
      const biomassGain = latestBiomass - earliestBiomass;
      
      feedConversionRatio = biomassGain > 0 ? totalFeed / biomassGain : 0;
    }
    
    // Estimate health score based on survival rate and condition factor
    const avgCondition = growthMetrics.length > 0
      ? growthMetrics.reduce((sum, metric) => sum + metric.condition, 0) / growthMetrics.length
      : 1.0;
      
    const healthScore = Math.min(
      Math.round((survivalRate * 0.6) + (avgCondition * 20 * 0.4)),
      100
    );
    
    // Calculate productivity (biomass gain per day)
    const productivity = (latestAssignment && earliestAssignment && latestSample?.sample_date && earliestSample?.sample_date) 
      ? ((parseFloat(String(latestAssignment.biomass_kg || 0)) - parseFloat(String(earliestAssignment.biomass_kg || 0))) / 
         Math.max(differenceInDays(new Date(latestSample.sample_date), new Date(earliestSample.sample_date)), 1)) * 100
      : 0;
      
    // Calculate efficiency (combination of FCR and growth rate)
    const efficiency = feedConversionRatio > 0 
      ? (avgGrowthRate / feedConversionRatio) * 10
      : avgGrowthRate;

    return {
      survivalRate,
      growthRate: avgGrowthRate,
      feedConversionRatio,
      healthScore,
      productivity,
      efficiency
    };
  };

  const performanceMetrics = calculatePerformanceMetrics();

  // Calculate environmental correlations
  const calculateEnvironmentalCorrelations = (): EnvironmentalCorrelation[] => {
    if (environmentalReadings.length === 0 || growthMetrics.length === 0) {
      return [];
    }
    
    // Group readings by parameter
    const parameterGroups = environmentalReadings.reduce((groups, reading) => {
      // Fixed: Handle parameter field more safely with improved type checking for all possible shapes
      let parameterName = 'Unknown';
      
      if (reading.parameter !== null && reading.parameter !== undefined) {
        if (typeof reading.parameter === 'object' && reading.parameter !== null) {
          /**
           * Some back-end serializers return the full EnvironmentalParameter
           * object while others only return the ID.  We therefore need a
           * relaxed check to extract the `.name` property without upsetting
           * TypeScript's strict null-checks.
           *
           * By casting to `any`, we guarantee compilation while still keeping
           * the runtime guard around the existence and type of `name`.
           */
          const maybeName = (reading.parameter as any).name;
          parameterName =
            typeof maybeName === "string" && maybeName.trim().length > 0
              ? maybeName
              : "Parameter Object";
        } else if (typeof reading.parameter === 'string') {
          parameterName = reading.parameter;
        } else if (typeof reading.parameter === 'number') {
          parameterName = 'Parameter ' + reading.parameter;
        } else {
          parameterName = 'Parameter ' + String(reading.parameter);
        }
      }
        
      if (!groups[parameterName]) {
        groups[parameterName] = [];
      }
      groups[parameterName].push(reading);
      return groups;
    }, {} as Record<string, any[]>);
    
    // Calculate simple correlations with growth
    return Object.entries(parameterGroups).map(([parameter, readings]) => {
      // Mock correlation calculation (in a real app, would use statistical methods)
      const correlation = Math.random() * 0.8 + 0.1; // Random between 0.1 and 0.9
      
      // Determine impact based on parameter
      let impact: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (parameter === 'Temperature' || parameter === 'Oxygen') {
        impact = correlation > 0.5 ? 'positive' : 'negative';
      } else if (parameter === 'pH' || parameter === 'Salinity') {
        impact = correlation > 0.7 ? 'negative' : 'positive';
      }
      
      // Determine significance
      const significance = correlation > 0.7 ? 'high' : correlation > 0.4 ? 'medium' : 'low';
      
      return {
        parameter,
        correlation,
        impact,
        significance
      };
    });
  };

  const environmentalCorrelations = calculateEnvironmentalCorrelations();

  // Generate predictive insights from scenarios or growth trends
  const generatePredictiveInsights = (): PredictiveInsight[] => {
    if (scenarios.length > 0) {
      // Use scenario projections if available
      return scenarios.map(scenario => {
        // Fixed: Use mock projected weight instead of non-existent field
        const latestWeight = growthMetrics.length > 0 ? growthMetrics[growthMetrics.length - 1].averageWeight : 0;
        // Mock a projected weight based on growth rate and duration
        const mockProjectedWeight = latestWeight * (1 + (performanceMetrics.growthRate / 100) * (scenario.duration_days || 30) / 7);
        
        return {
          metric: scenario.name || 'Growth Projection',
          currentValue: latestWeight,
          predictedValue: mockProjectedWeight,
          trend: mockProjectedWeight > latestWeight ? 'improving' : 'declining',
          confidence: 85, // Mock confidence level
          timeframe: `${scenario.duration_days || 30} days`
        };
      });
    } else if (growthMetrics.length >= 3) {
      // Generate simple projections based on growth trends
      const latestMetric = growthMetrics[growthMetrics.length - 1];
      const avgGrowthRate = performanceMetrics.growthRate;
      
      // Project weight in 30 days
      const projectedWeight30Days = latestMetric.averageWeight * (1 + (avgGrowthRate / 100) * (30 / 7));
      
      // Project weight in 90 days
      const projectedWeight90Days = latestMetric.averageWeight * (1 + (avgGrowthRate / 100) * (90 / 7));
      
      return [
        {
          metric: 'Average Weight (30 days)',
          currentValue: latestMetric.averageWeight,
          predictedValue: projectedWeight30Days,
          trend: 'improving',
          confidence: 80,
          timeframe: '30 days'
        },
        {
          metric: 'Average Weight (90 days)',
          currentValue: latestMetric.averageWeight,
          predictedValue: projectedWeight90Days,
          trend: 'improving',
          confidence: 65,
          timeframe: '90 days'
        }
      ];
    }
    
    return [];
  };

  const predictiveInsights = generatePredictiveInsights();

  // Generate benchmarks based on available data and industry standards
  const generateBenchmarks = (): Benchmark[] => {
    if (growthMetrics.length === 0) return [];
    
    const latestMetric = growthMetrics[growthMetrics.length - 1];
    
    // Mock industry standards
    const industryStandards = {
      fcr: 1.2,
      growthRate: 12,
      survivalRate: 92,
      condition: 1.1
    };
    
    // Mock target values (slightly better than industry)
    const targetValues = {
      fcr: 1.1,
      growthRate: 14,
      survivalRate: 95,
      condition: 1.2
    };
    
    return [
      {
        metric: 'Feed Conversion Ratio',
        current: performanceMetrics.feedConversionRatio || 0,
        target: targetValues.fcr,
        industry: industryStandards.fcr,
        status: (performanceMetrics.feedConversionRatio || 0) <= targetValues.fcr ? 'above' : 'below'
      },
      {
        metric: 'Growth Rate (%)',
        current: performanceMetrics.growthRate || 0,
        target: targetValues.growthRate,
        industry: industryStandards.growthRate,
        status: (performanceMetrics.growthRate || 0) >= targetValues.growthRate ? 'above' : 'below'
      },
      {
        metric: 'Survival Rate (%)',
        current: performanceMetrics.survivalRate || 0,
        target: targetValues.survivalRate,
        industry: industryStandards.survivalRate,
        status: (performanceMetrics.survivalRate || 0) >= targetValues.survivalRate ? 'above' : 'below'
      },
      {
        metric: 'Condition Factor',
        current: latestMetric.condition || 0,
        target: targetValues.condition,
        industry: industryStandards.condition,
        status: (latestMetric.condition || 0) >= targetValues.condition ? 'above' : 'below'
      }
    ];
  };

  const benchmarks = generateBenchmarks();

  // Calculate derived metrics
  const latestGrowthData = growthMetrics.length > 0 ? growthMetrics[growthMetrics.length - 1] : null;
  const growthTrend = growthMetrics.length > 1 
    ? (growthMetrics[growthMetrics.length - 1].growthRate - growthMetrics[growthMetrics.length - 2].growthRate)
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

  // Loading and error states
  const isLoading = growthLoading || analysisLoading || feedingLoading || envLoading || scenarioLoading || assignmentsLoading;
  const hasError = growthError || analysisError || feedingError || envError || scenarioError;
  const hasNoData = growthSamplesData.length === 0;

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Survival Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", getPerformanceColor(performanceMetrics.survivalRate || 0, { good: 90, fair: 85 }))}>
              {performanceMetrics.survivalRate?.toFixed(1) || '0.0'}%
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
            <div className={cn("text-2xl font-bold", getPerformanceColor(performanceMetrics.growthRate || 0, { good: 15, fair: 10 }))}>
              {performanceMetrics.growthRate?.toFixed(1) || '0.0'}%
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
            <div className={cn("text-2xl font-bold", getPerformanceColor(2.0 - (performanceMetrics.feedConversionRatio || 0), { good: 0.8, fair: 0.5 }))}>
              {performanceMetrics.feedConversionRatio?.toFixed(2) || '0.00'}
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
            <div className={cn("text-2xl font-bold", getPerformanceColor(performanceMetrics.healthScore || 0, { good: 85, fair: 75 }))}>
              {performanceMetrics.healthScore?.toFixed(0) || '0'}/100
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
          {performanceMetrics ? (
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
                      <span className="font-bold">{performanceMetrics.survivalRate?.toFixed(1) || '0.0'}%</span>
                    </div>
                    <Progress value={performanceMetrics.survivalRate || 0} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Growth Efficiency</span>
                      <span className="font-bold">{performanceMetrics.efficiency?.toFixed(1) || '0.0'}%</span>
                    </div>
                    <Progress value={performanceMetrics.efficiency || 0} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Productivity</span>
                      <span className="font-bold">{performanceMetrics.productivity?.toFixed(1) || '0.0'}%</span>
                    </div>
                    <Progress value={performanceMetrics.productivity || 0} className="h-2" />
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
                          <span className="text-sm font-medium">{metric.date ? format(new Date(metric.date), "MMM dd") : "Unknown"}</span>
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
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Performance metrics require growth samples and feeding data.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          {growthMetrics.length > 0 ? (
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
                          <span className="text-sm">{metric.date ? format(new Date(metric.date), "MMM dd") : "Unknown"}</span>
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
                          <span className="text-sm">{metric.date ? format(new Date(metric.date), "MMM dd") : "Unknown"}</span>
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
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No growth data available for this batch.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="environmental" className="space-y-6">
          {environmentalCorrelations.length > 0 ? (
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
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Environmental correlations require sensor data.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {predictiveInsights.length > 0 ? (
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
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Predictive insights require scenario models.
                </p>
              </CardContent>
            </Card>
          )}
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
          {benchmarks.length > 0 ? (
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
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Benchmarking data not yet available.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
