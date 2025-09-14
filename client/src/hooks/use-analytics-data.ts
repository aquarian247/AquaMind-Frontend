import { useMemo } from "react";
import { differenceInDays, parseISO } from "date-fns";

interface GrowthSample {
  id: number;
  sample_date: string;
  avg_weight_g: string;
  avg_length_cm: string;
  assignment: number;
}

interface BatchAssignment {
  id: number;
  population_count: number;
  biomass_kg: string;
}

interface FeedingSummary {
  total_feed_kg: string;
  total_feed_consumed_kg?: string;
  total_biomass_gain_kg?: string;
  fcr?: string;
}

interface EnvironmentalReading {
  parameter: string | { name: string };
  reading_value: string;
  reading_time: string;
}

interface Scenario {
  name: string;
  duration_days: number;
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

export function useAnalyticsData({
  growthSamplesData,
  batchAssignments,
  feedingSummaries,
  environmentalReadings,
  scenarios,
  growthMetrics
}: {
  growthSamplesData: GrowthSample[];
  batchAssignments: BatchAssignment[];
  feedingSummaries: FeedingSummary[];
  environmentalReadings: EnvironmentalReading[];
  scenarios: Scenario[];
  growthMetrics: GrowthMetrics[];
}) {

  // Transform growth samples into growth metrics format
  const calculatedGrowthMetrics = useMemo((): GrowthMetrics[] => {
    return growthSamplesData
      .sort((a, b) => {
        const dateA = a.sample_date ? new Date(a.sample_date).getTime() : 0;
        const dateB = b.sample_date ? new Date(b.sample_date).getTime() : 0;
        return dateA - dateB;
      })
      .map((sample, index, samples) => {
        const avgWeight = sample.avg_weight_g ? parseFloat(sample.avg_weight_g) : 0;
        const avgLength = sample.avg_length_cm ? parseFloat(sample.avg_length_cm) : 0;

        // Calculate growth rate if we have previous samples
        let growthRate = 0;
        if (index > 0) {
          const prevSample = samples[index - 1];
          if (sample.sample_date && prevSample.sample_date) {
            const daysDiff = differenceInDays(
              new Date(sample.sample_date),
              new Date(prevSample.sample_date)
            );

            if (daysDiff > 0) {
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

        // Get assignment data for population count and biomass
        const assignment = batchAssignments.find(a => a.id === sample.assignment);
        const populationCount = assignment?.population_count || 0;
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
  }, [growthSamplesData, batchAssignments]);

  // Calculate performance metrics from available data
  const performanceMetrics = useMemo((): PerformanceMetrics | null => {
    if (calculatedGrowthMetrics.length === 0) return null;

    // Get latest growth sample
    const latestSample = calculatedGrowthMetrics[calculatedGrowthMetrics.length - 1];
    const earliestSample = calculatedGrowthMetrics[0];

    // Get assignment data
    const latestAssignment = latestSample ? batchAssignments.find(a => a.id === growthSamplesData.find(s => s.sample_date === latestSample.date)?.assignment) : null;
    const earliestAssignment = earliestSample ? batchAssignments.find(a => a.id === growthSamplesData.find(s => s.sample_date === earliestSample.date)?.assignment) : null;

    // Calculate survival rate
    const latestPopulation = latestAssignment?.population_count || 0;
    const earliestPopulation = earliestAssignment?.population_count || 0;
    const survivalRate = (latestPopulation > 0 && earliestPopulation > 0)
      ? (latestPopulation / earliestPopulation) * 100
      : 0;

    // Calculate average growth rate
    const avgGrowthRate = calculatedGrowthMetrics.length > 0
      ? calculatedGrowthMetrics.reduce((sum, metric) => sum + metric.growthRate, 0) / calculatedGrowthMetrics.length
      : 0;

    // Calculate FCR from feeding summaries
    let feedConversionRatio = 0;
    if (feedingSummaries.length > 0 && latestAssignment && earliestAssignment) {
      const totalFeed = feedingSummaries.reduce((sum, summary) => {
        const feedAmount = summary.total_feed_kg ? parseFloat(summary.total_feed_kg) : 0;
        return sum + feedAmount;
      }, 0);

      const latestBiomass = latestAssignment.biomass_kg ? parseFloat(String(latestAssignment.biomass_kg)) : 0;
      const earliestBiomass = earliestAssignment.biomass_kg ? parseFloat(String(earliestAssignment.biomass_kg)) : 0;
      const biomassGain = latestBiomass - earliestBiomass;

      feedConversionRatio = biomassGain > 0 ? totalFeed / biomassGain : 0;
    }

    // Estimate health score based on survival rate and condition factor
    const avgCondition = calculatedGrowthMetrics.length > 0
      ? calculatedGrowthMetrics.reduce((sum, metric) => sum + metric.condition, 0) / calculatedGrowthMetrics.length
      : 1.0;

    const healthScore = Math.min(
      Math.round((survivalRate * 0.6) + (avgCondition * 20 * 0.4)),
      100
    );

    // Calculate productivity (biomass gain per day)
    const productivity = (latestAssignment && earliestAssignment && latestSample?.date && earliestSample?.date)
      ? ((parseFloat(String(latestAssignment.biomass_kg || 0)) - parseFloat(String(earliestAssignment.biomass_kg || 0))) /
         Math.max(differenceInDays(parseISO(latestSample.date), parseISO(earliestSample.date)), 1)) * 100
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
  }, [calculatedGrowthMetrics, batchAssignments, feedingSummaries, growthSamplesData]);

  // Calculate environmental correlations
  const environmentalCorrelations = useMemo((): EnvironmentalCorrelation[] => {
    if (environmentalReadings.length === 0 || calculatedGrowthMetrics.length === 0) {
      return [];
    }

    // Group readings by parameter
    const parameterGroups = environmentalReadings.reduce((groups, reading) => {
      let parameterName = 'Unknown';

      if (reading.parameter !== null && reading.parameter !== undefined) {
        if (typeof reading.parameter === 'object' && reading.parameter !== null) {
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
    }, {} as Record<string, EnvironmentalReading[]>);

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
  }, [environmentalReadings, calculatedGrowthMetrics]);

  // Generate predictive insights from scenarios or growth trends
  const predictiveInsights = useMemo((): PredictiveInsight[] => {
    if (scenarios.length > 0) {
      // Use scenario projections if available
      return scenarios.map(scenario => {
        const latestWeight = calculatedGrowthMetrics.length > 0 ? calculatedGrowthMetrics[calculatedGrowthMetrics.length - 1].averageWeight : 0;
        const mockProjectedWeight = latestWeight * (1 + ((performanceMetrics?.growthRate || 0) / 100) * (scenario.duration_days || 30) / 7);

        return {
          metric: scenario.name || 'Growth Projection',
          currentValue: latestWeight,
          predictedValue: mockProjectedWeight,
          trend: mockProjectedWeight > latestWeight ? 'improving' : 'declining',
          confidence: 85, // Mock confidence level
          timeframe: `${scenario.duration_days || 30} days`
        };
      });
    } else if (calculatedGrowthMetrics.length >= 3) {
      // Generate simple projections based on growth trends
      const latestMetric = calculatedGrowthMetrics[calculatedGrowthMetrics.length - 1];
      const avgGrowthRate = performanceMetrics?.growthRate || 0;

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
  }, [scenarios, calculatedGrowthMetrics, performanceMetrics]);

  // Generate benchmarks based on available data and industry standards
  const benchmarks = useMemo((): Benchmark[] => {
    if (calculatedGrowthMetrics.length === 0) return [];

    const latestMetric = calculatedGrowthMetrics[calculatedGrowthMetrics.length - 1];

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
        current: performanceMetrics?.feedConversionRatio || 0,
        target: targetValues.fcr,
        industry: industryStandards.fcr,
        status: (performanceMetrics?.feedConversionRatio || 0) <= targetValues.fcr ? 'above' : 'below'
      },
      {
        metric: 'Growth Rate (%)',
        current: performanceMetrics?.growthRate || 0,
        target: targetValues.growthRate,
        industry: industryStandards.growthRate,
        status: (performanceMetrics?.growthRate || 0) >= targetValues.growthRate ? 'above' : 'below'
      },
      {
        metric: 'Survival Rate (%)',
        current: performanceMetrics?.survivalRate || 0,
        target: targetValues.survivalRate,
        industry: industryStandards.survivalRate,
        status: (performanceMetrics?.survivalRate || 0) >= targetValues.survivalRate ? 'above' : 'below'
      },
      {
        metric: 'Condition Factor',
        current: latestMetric.condition || 0,
        target: targetValues.condition,
        industry: industryStandards.condition,
        status: (latestMetric.condition || 0) >= targetValues.condition ? 'above' : 'below'
      }
    ];
  }, [calculatedGrowthMetrics, performanceMetrics]);

  // Calculate derived metrics
  const latestGrowthData = calculatedGrowthMetrics.length > 0 ? calculatedGrowthMetrics[calculatedGrowthMetrics.length - 1] : null;
  const growthTrend = calculatedGrowthMetrics.length > 1
    ? (calculatedGrowthMetrics[calculatedGrowthMetrics.length - 1].growthRate - calculatedGrowthMetrics[calculatedGrowthMetrics.length - 2].growthRate)
    : 0;

  return {
    growthMetrics: calculatedGrowthMetrics,
    performanceMetrics,
    environmentalCorrelations,
    predictiveInsights,
    benchmarks,
    latestGrowthData,
    growthTrend
  };
}
