/**
 * Format a number as tonnes (divide kg by 1000).
 */
export function formatTonnes(kg: number | null, precision: number = 1): string {
  if (kg === null) return 'N/A';
  return (kg / 1000).toFixed(precision);
}

/**
 * Format a population count in millions.
 */
export function formatMillions(count: number | null, precision: number = 2): string {
  if (count === null) return 'N/A';
  return (count / 1_000_000).toFixed(precision);
}

/**
 * Format a weight in grams with specified precision.
 */
export function formatWeightG(weightG: number | null, precision: number = 1): string {
  if (weightG === null) return 'N/A';
  return `${weightG.toFixed(precision)}g`;
}

/**
 * Format a percentage value.
 */
export function formatPct(value: number | null, precision: number = 2): string {
  if (value === null) return 'N/A';
  return `${value.toFixed(precision)}%`;
}

/**
 * Format a date string to a short display format.
 */
export function formatReportDate(dateStr: string | null): string {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}

/**
 * Get the current ISO week number and year.
 */
export function getCurrentWeek(): { week: number; year: number } {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return { week, year: now.getFullYear() };
}

/**
 * Get date range for the current reporting week (Mon-Sun).
 */
export function getWeekDateRange(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
}
