import type { AlertLevel, MortalityPeriod } from '../types';

const MORTALITY_THRESHOLDS: Record<MortalityPeriod, { yellow: number; red: number }> = {
  '14d': { yellow: 0.50, red: 0.75 },
  '30d': { yellow: 0.75, red: 1.20 },
  '90d': { yellow: 1.20, red: 3.00 },
};

const TGC_THRESHOLDS = {
  good: 3.5,
  medium: 3.0,
};

const FCR_THRESHOLDS = {
  excellent: 1.0,
  good: 1.15,
};

export function getFreshwaterMortalityAlertLevel(
  rate: number | null,
  period: MortalityPeriod
): AlertLevel {
  if (rate === null) return 'info';
  const { yellow, red } = MORTALITY_THRESHOLDS[period];
  if (rate >= red) return 'danger';
  if (rate >= yellow) return 'warning';
  return 'success';
}

export function getFreshwaterTGCAlertLevel(tgc: number | null): AlertLevel {
  if (tgc === null) return 'info';
  if (tgc >= TGC_THRESHOLDS.good) return 'success';
  if (tgc >= TGC_THRESHOLDS.medium) return 'warning';
  return 'danger';
}

export function getFreshwaterFCRAlertLevel(fcr: number | null): AlertLevel {
  if (fcr === null) return 'info';
  if (fcr <= FCR_THRESHOLDS.excellent) return 'success';
  if (fcr <= FCR_THRESHOLDS.good) return 'warning';
  return 'danger';
}

export function getFreshwaterStationHealthStatus(params: {
  mortality_pct: number | null;
  tgc: number | null;
  fcr: number | null;
}): AlertLevel {
  const { mortality_pct, tgc, fcr } = params;

  const mortalityLevel = getFreshwaterMortalityAlertLevel(mortality_pct, '30d');
  if (mortalityLevel === 'danger') return 'danger';

  const tgcLevel = getFreshwaterTGCAlertLevel(tgc);
  if (tgcLevel === 'danger') return 'danger';

  if (mortalityLevel === 'warning' || tgcLevel === 'warning') return 'warning';

  const fcrLevel = getFreshwaterFCRAlertLevel(fcr);
  if (fcrLevel === 'danger') return 'warning';

  if (mortalityLevel === 'info' && tgcLevel === 'info' && fcrLevel === 'info') return 'info';

  return 'success';
}

export function getAlertColorClass(level: AlertLevel): string {
  const map: Record<AlertLevel, string> = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-muted-foreground',
  };
  return map[level];
}

export function getAlertBgClass(level: AlertLevel): string {
  const map: Record<AlertLevel, string> = {
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    danger: 'bg-red-50 border-red-200',
    info: 'bg-muted/50 border-border',
  };
  return map[level];
}
