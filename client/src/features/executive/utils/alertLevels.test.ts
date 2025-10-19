/**
 * Alert Level Utilities - Tests
 */

import { describe, it, expect } from 'vitest';
import {
  getLiceAlertLevel,
  getMortalityAlertLevel,
  getFCRAlertLevel,
  getTGCAlertLevel,
  getCapacityAlertLevel,
  getFacilityHealthStatus,
  getAlertLevelClass,
  getAlertLevelBadgeVariant,
  getAlertLevelLabel,
} from './alertLevels';

describe('getLiceAlertLevel', () => {
  it('should return danger for high mature lice', () => {
    expect(getLiceAlertLevel(0.6, null)).toBe('danger');
    expect(getLiceAlertLevel(0.8, 0.3)).toBe('danger');
  });

  it('should return warning for moderate mature lice', () => {
    expect(getLiceAlertLevel(0.3, null)).toBe('warning');
    expect(getLiceAlertLevel(0.4, 0.2)).toBe('warning');
  });

  it('should return success for low lice counts', () => {
    expect(getLiceAlertLevel(0.1, 0.2)).toBe('success');
    expect(getLiceAlertLevel(0.15, null)).toBe('success');
  });

  it('should check movable lice when mature lice is null', () => {
    expect(getLiceAlertLevel(null, 1.5)).toBe('danger');
    expect(getLiceAlertLevel(null, 0.7)).toBe('warning');
  });

  it('should return info when no data available', () => {
    expect(getLiceAlertLevel(null, null)).toBe('info');
  });
});

describe('getMortalityAlertLevel', () => {
  it('should return danger for high mortality', () => {
    expect(getMortalityAlertLevel(3.5)).toBe('danger');
    expect(getMortalityAlertLevel(2.1)).toBe('danger');
  });

  it('should return warning for moderate mortality', () => {
    expect(getMortalityAlertLevel(1.5)).toBe('warning');
    expect(getMortalityAlertLevel(1.0)).toBe('warning');
  });

  it('should return success for low mortality', () => {
    expect(getMortalityAlertLevel(0.5)).toBe('success');
    expect(getMortalityAlertLevel(0.9)).toBe('success');
  });

  it('should return info when no data', () => {
    expect(getMortalityAlertLevel(null)).toBe('info');
  });
});

describe('getFCRAlertLevel', () => {
  it('should return danger for high FCR (poor performance)', () => {
    expect(getFCRAlertLevel(1.4)).toBe('danger');
    expect(getFCRAlertLevel(1.5)).toBe('danger');
  });

  it('should return warning for moderate FCR', () => {
    expect(getFCRAlertLevel(1.2)).toBe('warning');
    expect(getFCRAlertLevel(1.24)).toBe('warning');
  });

  it('should return success for low FCR (good performance)', () => {
    expect(getFCRAlertLevel(1.0)).toBe('success');
    expect(getFCRAlertLevel(1.14)).toBe('success');
  });

  it('should return info when no data', () => {
    expect(getFCRAlertLevel(null)).toBe('info');
  });
});

describe('getTGCAlertLevel', () => {
  it('should return danger for low TGC (poor performance)', () => {
    expect(getTGCAlertLevel(2.0)).toBe('danger');
    expect(getTGCAlertLevel(2.4)).toBe('danger');
  });

  it('should return warning for moderate TGC', () => {
    expect(getTGCAlertLevel(2.7)).toBe('warning');
    expect(getTGCAlertLevel(2.9)).toBe('warning');
  });

  it('should return success for high TGC (good performance)', () => {
    expect(getTGCAlertLevel(3.1)).toBe('success');
    expect(getTGCAlertLevel(3.5)).toBe('success');
  });

  it('should return info when no data', () => {
    expect(getTGCAlertLevel(null)).toBe('info');
  });
});

describe('getCapacityAlertLevel', () => {
  it('should return warning for low utilization', () => {
    expect(getCapacityAlertLevel(50)).toBe('warning');
    expect(getCapacityAlertLevel(69)).toBe('warning');
  });

  it('should return info for moderate utilization', () => {
    expect(getCapacityAlertLevel(75)).toBe('info');
    expect(getCapacityAlertLevel(84)).toBe('info');
  });

  it('should return success for high utilization', () => {
    expect(getCapacityAlertLevel(90)).toBe('success');
    expect(getCapacityAlertLevel(95)).toBe('success');
  });

  it('should return info when no data', () => {
    expect(getCapacityAlertLevel(null)).toBe('info');
  });
});

describe('getFacilityHealthStatus', () => {
  it('should prioritize lice danger', () => {
    const status = getFacilityHealthStatus({
      matureLice: 0.7, // danger
      movableLice: 0.3,
      mortalityPercentage: 0.5, // success
      fcr: 1.1, // success
    });
    expect(status).toBe('danger');
  });

  it('should prioritize mortality danger if lice is not danger', () => {
    const status = getFacilityHealthStatus({
      matureLice: 0.3, // warning
      movableLice: 0.3,
      mortalityPercentage: 2.5, // danger
      fcr: 1.1,
    });
    expect(status).toBe('danger');
  });

  it('should return warning if any metric is warning', () => {
    const status = getFacilityHealthStatus({
      matureLice: 0.3, // warning
      movableLice: 0.3,
      mortalityPercentage: 0.8, // success
      fcr: 1.1, // success
    });
    expect(status).toBe('warning');
  });

  it('should return success if all metrics are good', () => {
    const status = getFacilityHealthStatus({
      matureLice: 0.1, // success
      movableLice: 0.2,
      mortalityPercentage: 0.5, // success
      fcr: 1.0, // success
    });
    expect(status).toBe('success');
  });

  it('should return info when no data available', () => {
    const status = getFacilityHealthStatus({
      matureLice: null,
      movableLice: null,
      mortalityPercentage: null,
      fcr: null,
    });
    expect(status).toBe('info');
  });
});

describe('getAlertLevelClass', () => {
  it('should return correct Tailwind classes', () => {
    expect(getAlertLevelClass('success')).toContain('text-green-600');
    expect(getAlertLevelClass('warning')).toContain('text-yellow-600');
    expect(getAlertLevelClass('danger')).toContain('text-red-600');
    expect(getAlertLevelClass('info')).toContain('text-gray-600');
  });
});

describe('getAlertLevelBadgeVariant', () => {
  it('should return correct badge variants', () => {
    expect(getAlertLevelBadgeVariant('success')).toBe('default');
    expect(getAlertLevelBadgeVariant('warning')).toBe('secondary');
    expect(getAlertLevelBadgeVariant('danger')).toBe('destructive');
    expect(getAlertLevelBadgeVariant('info')).toBe('outline');
  });
});

describe('getAlertLevelLabel', () => {
  it('should return human-readable labels', () => {
    expect(getAlertLevelLabel('success')).toBe('Good');
    expect(getAlertLevelLabel('warning')).toBe('Caution');
    expect(getAlertLevelLabel('danger')).toBe('Critical');
    expect(getAlertLevelLabel('info')).toBe('N/A');
  });
});

