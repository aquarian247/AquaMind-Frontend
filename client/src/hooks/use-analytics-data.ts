import { useMemo } from "react";
import { differenceInDays, parseISO } from "date-fns";
import { calculatePerformanceMetrics } from "@/features/batch-management/utils/analyticsCalculations";

interface GrowthSample {
  id: number;
  sample_date: string | undefined;
  avg_weight_g: string;
  avg_length_cm: string;
  assignment: number;
}

interface BatchAssignment {
  id: number;
  population_count: number | undefined;
  biomass_kg: string;
}

interface FeedingSummary {
  total_feed_kg: string;
  total_feed_consumed_kg?: string;
  total_biomass_gain_kg?: string;
  fcr?: string;
}

interface EnvironmentalReading {
  parameter: number;
  value: string;
  reading_time: string;
}

interface Scenario {
  name: string;
  duration_days: number;
  // We might get scenarios with different shapes, handling partials
  [key: string]: any; 
}

export interface GrowthMetrics {
  date: string;
  averageWeight: number;
  totalBiomass: number;
  populationCount: number;
  growthRate: number;
  condition: number;
}

export interface PerformanceMetrics {
  survivalRate: number;
  growthRate: number;
  feedConversionRatio: number;
  healthScore: number;
  productivity: number;
  efficiency: number;
}

export interface EnvironmentalCorrelation {
  parameter: string;
  correlation: number;
  impact: 'positive' | 'negative' | 'neutral';
  significance: 'high' | 'medium' | 'low';
}

export interface PredictiveInsight {
  metric: string;
  currentValue: number;
  predictedValue: number;
  trend: 'improving' | 'declining' | 'stable';
  confidence: number;
  timeframe: string;
}

export interface Benchmark {
  metric: string;
  current: number;
  target: number;
  industry: number;
  status: 'above' | 'below' | 'on-target';
}

interface Props {
  growthAnalysis: any;
  performanceMetricsRaw: any;
  feedingStats: any;
  latestFeedingSummary?: any;
  scenarios: Scenario[];
}

export function useAnalyticsData({
  growthAnalysis,
  performanceMetricsRaw,
  feedingStats,
  latestFeedingSummary,
  scenarios,
}: Props) {

  const aggregatedDailyStates = useMemo((): GrowthMetrics[] => {
    if (!growthAnalysis?.actual_daily_states?.length) return [];

    const grouped = new Map<
      string,
      {
        totalPopulation: number;
        weightedWeight: number;
        totalBiomass: number;
        conditionSum: number;
        conditionCount: number;
      }
    >();

    growthAnalysis.actual_daily_states.forEach((state: any) => {
      if (!state?.date) return;
      const population = Number(state.population) || 0;
      const avgWeight = Number(state.avg_weight_g) || 0;
      const biomass = Number(state.biomass_kg) || 0;
      const condition = Number(state.condition_factor);

      if (!grouped.has(state.date)) {
        grouped.set(state.date, {
          totalPopulation: 0,
          weightedWeight: 0,
          totalBiomass: 0,
          conditionSum: 0,
          conditionCount: 0,
        });
      }

      const entry = grouped.get(state.date)!;
      entry.totalPopulation += population;
      entry.weightedWeight += avgWeight * population;
      entry.totalBiomass += biomass;

      if (!Number.isNaN(condition) && condition > 0) {
        entry.conditionSum += condition;
        entry.conditionCount += 1;
      }
    });

    return Array.from(grouped.entries())
      .map(([date, entry]) => ({
        date,
        averageWeight: entry.totalPopulation > 0 ? entry.weightedWeight / entry.totalPopulation : 0,
        totalBiomass: entry.totalBiomass,
        populationCount: entry.totalPopulation,
        growthRate: 0,
        condition: entry.conditionCount > 0 ? entry.conditionSum / entry.conditionCount : 1.0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [growthAnalysis]);

  // Transform server-provided metrics or fall back to aggregated daily states
  const calculatedGrowthMetrics = useMemo((): GrowthMetrics[] => {
    if (growthAnalysis?.growth_metrics?.length) {
      return growthAnalysis.growth_metrics
        .map((metric: any) => ({
          date: metric.date,
          averageWeight: metric.avg_weight_g || 0,
          totalBiomass: metric.total_biomass_kg || 0,
          populationCount: metric.population_count || 0,
          growthRate: metric.growth_rate || 0,
          condition: metric.condition_factor || 1.0,
        }))
        .sort((a: GrowthMetrics, b: GrowthMetrics) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return aggregatedDailyStates;
  }, [growthAnalysis, aggregatedDailyStates]);

  const lifetimeFeedTotals = feedingStats?.lifetime || null;
  const periodFeedTotals = feedingStats?.period || null;

  // Calculate performance metrics from available data
  const performanceMetrics = useMemo((): PerformanceMetrics | null => {
    if (!performanceMetricsRaw && !growthAnalysis) return null;

    // 1. Survival Rate
    const survivalRate = performanceMetricsRaw?.mortality_metrics?.survival_rate 
      ?? (100 - (performanceMetricsRaw?.mortality_metrics?.mortality_rate || 0));
      
    // 2. Growth Rate (Weekly Growth Rate %)
    // Calculated from Actual Daily States to match Growth Graph
    // Formula: ((Weight_Now - Weight_7_Days_Ago) / Weight_7_Days_Ago) * 100
    let growthRate = 0;
    const states = calculatedGrowthMetrics;
    
    if (states.length >= 2) {
      // Ensure we have at least 2 points to calculate growth
      const latest = states[states.length - 1];
      const dateLatest = latest?.date ? new Date(latest.date) : null;

      if (dateLatest && latest?.averageWeight > 0) {
        let previousIndex = states.length - 2;
        let previous: GrowthMetrics | null = null;
        let daysDiff = 0;

        while (previousIndex >= 0) {
          const candidate = states[previousIndex];
          if (candidate?.date && candidate.averageWeight > 0) {
            const candidateDate = new Date(candidate.date);
            const diff = differenceInDays(dateLatest, candidateDate);
            if (diff > 0) {
              previous = candidate;
              daysDiff = diff;
              break;
            }
          }
          previousIndex -= 1;
        }

        if (previous && daysDiff > 0) {
          const weightDiff = latest.averageWeight - previous.averageWeight;
          growthRate = ((weightDiff / previous.averageWeight) / daysDiff) * 7 * 100;
        }
      }
    }
    
    // Fallback to pre-calculated average if daily states unavailable or calc failed
    if (growthRate === 0) {
       growthRate = growthAnalysis?.growth_summary?.avg_growth_rate 
        ?? performanceMetricsRaw?.current_metrics?.avg_growth_rate 
        ?? 0;
    }

    // 3. FCR
    // Use weighted_avg_fcr from the latest batch feeding summary
    // This is the most accurate "current" FCR
    let feedConversionRatio = 0;
    if (latestFeedingSummary?.weighted_avg_fcr) {
      feedConversionRatio = parseFloat(latestFeedingSummary.weighted_avg_fcr);
    } else if (latestFeedingSummary?.fcr) {
      feedConversionRatio = parseFloat(latestFeedingSummary.fcr);
    } else if (feedingStats?.period?.avg_fcr) {
       // Fallback to aggregated avg (period)
      feedConversionRatio = parseFloat(feedingStats.period.avg_fcr);
    }

    // 4. Health Score
    const avgCondition = calculatedGrowthMetrics.length > 0 
      ? calculatedGrowthMetrics.reduce((acc, m) => acc + m.condition, 0) / calculatedGrowthMetrics.length
      : 1.0;
    const conditionScore = avgCondition * 20; 
    const healthScore = Math.min(Math.round((survivalRate * 0.6) + (conditionScore * 0.4)), 100);

    // 5. Productivity (Biomass gain per day * 100)
    let productivity = 0;
    if (performanceMetricsRaw?.days_active > 0 && performanceMetricsRaw?.current_metrics?.biomass_kg) {
      productivity = (performanceMetricsRaw.current_metrics.biomass_kg / performanceMetricsRaw.days_active) * 100;
    }

    // 6. Efficiency (Growth Rate / FCR * 10)
    // If FCR is 3.00 and Growth Rate is 1.5, Efficiency = (1.5 / 3.0) * 10 = 5.0
    const efficiency = feedConversionRatio > 0 ? (growthRate / feedConversionRatio) * 10 : growthRate;

    return {
      survivalRate,
      growthRate,
      feedConversionRatio,
      healthScore,
      productivity,
      efficiency
    };
  }, [growthAnalysis, performanceMetricsRaw, feedingStats, latestFeedingSummary, calculatedGrowthMetrics]);

  // Calculate environmental correlations (MOCK - placeholder for future implementation)
  const environmentalCorrelations = useMemo((): EnvironmentalCorrelation[] => {
    return [];
  }, []);

  // Generate predictive insights
  const predictiveInsights = useMemo((): PredictiveInsight[] => {
    if (scenarios.length > 0) {
      const latestWeight = calculatedGrowthMetrics.length > 0 ? calculatedGrowthMetrics[calculatedGrowthMetrics.length - 1].averageWeight : 0;
      
      return scenarios.slice(0, 3).map(scenario => {
        const duration = scenario.duration_days || 30;
        // Simple projection logic
        const mockProjectedWeight = latestWeight * (1 + ((performanceMetrics?.growthRate || 0) / 100) * duration / 7);

        return {
          metric: scenario.name || 'Growth Projection',
          currentValue: latestWeight,
          predictedValue: mockProjectedWeight,
          trend: mockProjectedWeight > latestWeight ? 'improving' : 'declining',
          confidence: 85,
          timeframe: `${duration} days`
        };
      });
    } 
    
    return [];
  }, [scenarios, calculatedGrowthMetrics, performanceMetrics]);

  // Generate benchmarks
  const benchmarks = useMemo((): Benchmark[] => {
    if (!performanceMetrics) return [];

    const industryStandards = {
      fcr: 1.2,
      growthRate: 1.5, 
      survivalRate: 92,
      condition: 1.1
    };

    const targetValues = {
      fcr: 1.1,
      growthRate: 1.7,
      survivalRate: 95,
      condition: 1.2
    };
    
    const latestCondition = calculatedGrowthMetrics.length > 0 
      ? calculatedGrowthMetrics[calculatedGrowthMetrics.length - 1].condition 
      : 1.0;

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
        current: latestCondition,
        target: targetValues.condition,
        industry: industryStandards.condition,
        status: latestCondition >= targetValues.condition ? 'above' : 'below'
      }
    ];
  }, [calculatedGrowthMetrics, performanceMetrics]);

  // Calculate derived metrics
  const latestGrowthData = calculatedGrowthMetrics.length > 0 ? calculatedGrowthMetrics[calculatedGrowthMetrics.length - 1] : null;
  const growthTrend = calculatedGrowthMetrics.length > 1
    ? (calculatedGrowthMetrics[calculatedGrowthMetrics.length - 1].growthRate - calculatedGrowthMetrics[calculatedGrowthMetrics.length - 2].growthRate)
    : 0;

  const lifetimeBiomassKg = performanceMetricsRaw?.current_metrics?.biomass_kg || null;
  const lifetimeFeedKg = lifetimeFeedTotals?.total_feed_kg || null;
  const lifetimeFeedCost = lifetimeFeedTotals?.total_feed_cost || null;
  const lifetimeFCR = lifetimeFeedKg && lifetimeBiomassKg && lifetimeBiomassKg > 0
    ? lifetimeFeedKg / lifetimeBiomassKg
    : null;

  return {
    growthMetrics: calculatedGrowthMetrics,
    performanceMetrics,
    periodFeedTotals,
    lifetimeFeedTotals,
    lifetimeFCR,
    lifetimeFeedCost,
    lifetimeBiomassKg,
    environmentalCorrelations,
    predictiveInsights,
    benchmarks,
    latestGrowthData,
    growthTrend
  };
}
