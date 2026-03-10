import type { AlertLevel, LiceGoals } from '../types';

export const BAKKAFROST_2025_GOALS: LiceGoals = {
  mature: { target: 0.2, warning: 0.5, critical: 1.0 },
  movable: { target: 0.1, warning: 1.0, critical: 3.0 },
  spring: { matureLiceMax: 0.8 },
};

export function getMatureLiceAlertLevel(value: number | null): AlertLevel {
  if (value === null) return 'info';
  if (value >= BAKKAFROST_2025_GOALS.mature.critical) return 'danger';
  if (value >= BAKKAFROST_2025_GOALS.mature.warning) return 'warning';
  return 'success';
}

export function getMovableLiceAlertLevel(value: number | null): AlertLevel {
  if (value === null) return 'info';
  if (value >= BAKKAFROST_2025_GOALS.movable.critical) return 'danger';
  if (value >= BAKKAFROST_2025_GOALS.movable.warning) return 'warning';
  return 'success';
}

export function getCombinedLiceAlertLevel(
  mature: number | null,
  movable: number | null
): AlertLevel {
  const matureLevel = getMatureLiceAlertLevel(mature);
  const movableLevel = getMovableLiceAlertLevel(movable);
  if (matureLevel === 'danger' || movableLevel === 'danger') return 'danger';
  if (matureLevel === 'warning' || movableLevel === 'warning') return 'warning';
  if (matureLevel === 'info' && movableLevel === 'info') return 'info';
  return 'success';
}

export function getLiceStatus(
  mature: number | null,
  movable: number | null
): 'good' | 'warning' | 'critical' {
  const level = getCombinedLiceAlertLevel(mature, movable);
  if (level === 'danger') return 'critical';
  if (level === 'warning') return 'warning';
  return 'good';
}

export function isSpringPeriod(date?: Date): boolean {
  const d = date ?? new Date();
  const month = d.getMonth();
  return month >= 2 && month <= 4; // March (2) through May (4)
}

export function getSpringLiceAlertLevel(matureLice: number | null): AlertLevel {
  if (matureLice === null) return 'info';
  if (matureLice >= BAKKAFROST_2025_GOALS.spring.matureLiceMax) return 'danger';
  if (matureLice >= BAKKAFROST_2025_GOALS.spring.matureLiceMax * 0.6) return 'warning';
  return 'success';
}

export function getLiceColorClass(level: AlertLevel): string {
  const map: Record<AlertLevel, string> = {
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-muted text-muted-foreground',
  };
  return map[level];
}
