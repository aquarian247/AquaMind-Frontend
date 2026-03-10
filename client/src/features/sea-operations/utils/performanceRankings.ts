import type { AreaFacilitySummary, FacilityRanking, RankingMetric } from '../types';

const METRIC_CONFIG: Record<RankingMetric, {
  field: keyof AreaFacilitySummary;
  lowerIsBetter: boolean;
  label: string;
}> = {
  tgc: { field: 'tgc', lowerIsBetter: false, label: 'Top Performers by TGC' },
  fcr: { field: 'fcr', lowerIsBetter: true, label: 'Best FCR' },
  mortality: { field: 'mortality_pct', lowerIsBetter: true, label: 'Lowest Mortality' },
  lice: { field: 'mature_lice', lowerIsBetter: true, label: 'Lowest Lice Counts' },
};

export function rankByMetric(
  facilities: AreaFacilitySummary[],
  metric: RankingMetric,
  topN: number = 5
): FacilityRanking[] {
  const config = METRIC_CONFIG[metric];
  const field = config.field as string;

  const withData = facilities.filter(
    (f) => (f as any)[field] !== null && (f as any)[field] > 0
  );

  const sorted = [...withData].sort((a, b) => {
    const aVal = (a as any)[field] as number;
    const bVal = (b as any)[field] as number;
    return config.lowerIsBetter ? aVal - bVal : bVal - aVal;
  });

  return sorted.slice(0, topN).map((f) => ({
    facility: f.name,
    value: (f as any)[field] as number,
    area_id: f.id,
    geography: f.geography_name,
  }));
}

export function getRankingLabel(metric: RankingMetric): string {
  return METRIC_CONFIG[metric].label;
}

export function isLowerBetter(metric: RankingMetric): boolean {
  return METRIC_CONFIG[metric].lowerIsBetter;
}
