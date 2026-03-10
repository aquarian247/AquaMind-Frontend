import { describe, it, expect } from 'vitest';
import {
  getMatureLiceAlertLevel,
  getMovableLiceAlertLevel,
  getCombinedLiceAlertLevel,
  getLiceStatus,
  isSpringPeriod,
  getSpringLiceAlertLevel,
  getLiceColorClass,
  BAKKAFROST_2025_GOALS,
} from './liceThresholds';

describe('liceThresholds', () => {
  describe('BAKKAFROST_2025_GOALS', () => {
    it('should define correct mature lice thresholds', () => {
      expect(BAKKAFROST_2025_GOALS.mature.target).toBe(0.2);
      expect(BAKKAFROST_2025_GOALS.mature.warning).toBe(0.5);
      expect(BAKKAFROST_2025_GOALS.mature.critical).toBe(1.0);
    });

    it('should define correct movable lice thresholds', () => {
      expect(BAKKAFROST_2025_GOALS.movable.target).toBe(0.1);
      expect(BAKKAFROST_2025_GOALS.movable.warning).toBe(1.0);
      expect(BAKKAFROST_2025_GOALS.movable.critical).toBe(3.0);
    });

    it('should define spring period threshold', () => {
      expect(BAKKAFROST_2025_GOALS.spring.matureLiceMax).toBe(0.8);
    });
  });

  describe('getMatureLiceAlertLevel', () => {
    it('should return info for null', () => {
      expect(getMatureLiceAlertLevel(null)).toBe('info');
    });

    it('should return success below warning', () => {
      expect(getMatureLiceAlertLevel(0.3)).toBe('success');
    });

    it('should return warning at threshold', () => {
      expect(getMatureLiceAlertLevel(0.5)).toBe('warning');
    });

    it('should return danger at critical', () => {
      expect(getMatureLiceAlertLevel(1.0)).toBe('danger');
    });

    it('should return danger above critical', () => {
      expect(getMatureLiceAlertLevel(2.5)).toBe('danger');
    });
  });

  describe('getMovableLiceAlertLevel', () => {
    it('should return success below warning', () => {
      expect(getMovableLiceAlertLevel(0.5)).toBe('success');
    });

    it('should return warning at threshold', () => {
      expect(getMovableLiceAlertLevel(1.0)).toBe('warning');
    });

    it('should return danger at critical', () => {
      expect(getMovableLiceAlertLevel(3.0)).toBe('danger');
    });
  });

  describe('getCombinedLiceAlertLevel', () => {
    it('should return info when both null', () => {
      expect(getCombinedLiceAlertLevel(null, null)).toBe('info');
    });

    it('should return danger if either is danger', () => {
      expect(getCombinedLiceAlertLevel(1.5, 0.2)).toBe('danger');
      expect(getCombinedLiceAlertLevel(0.2, 4.0)).toBe('danger');
    });

    it('should return warning if either is warning and none danger', () => {
      expect(getCombinedLiceAlertLevel(0.6, 0.5)).toBe('warning');
    });

    it('should return success when both good', () => {
      expect(getCombinedLiceAlertLevel(0.2, 0.5)).toBe('success');
    });
  });

  describe('getLiceStatus', () => {
    it('should return good for low values', () => {
      expect(getLiceStatus(0.2, 0.5)).toBe('good');
    });

    it('should return warning for medium values', () => {
      expect(getLiceStatus(0.6, 0.5)).toBe('warning');
    });

    it('should return critical for high values', () => {
      expect(getLiceStatus(1.5, 0.5)).toBe('critical');
    });
  });

  describe('isSpringPeriod', () => {
    it('should return true for March', () => {
      expect(isSpringPeriod(new Date(2025, 2, 15))).toBe(true);
    });

    it('should return true for April', () => {
      expect(isSpringPeriod(new Date(2025, 3, 15))).toBe(true);
    });

    it('should return true for May', () => {
      expect(isSpringPeriod(new Date(2025, 4, 15))).toBe(true);
    });

    it('should return false for June', () => {
      expect(isSpringPeriod(new Date(2025, 5, 15))).toBe(false);
    });

    it('should return false for January', () => {
      expect(isSpringPeriod(new Date(2025, 0, 15))).toBe(false);
    });
  });

  describe('getSpringLiceAlertLevel', () => {
    it('should return info for null', () => {
      expect(getSpringLiceAlertLevel(null)).toBe('info');
    });

    it('should return success below 60% of max', () => {
      expect(getSpringLiceAlertLevel(0.3)).toBe('success');
    });

    it('should return danger at spring max', () => {
      expect(getSpringLiceAlertLevel(0.8)).toBe('danger');
    });
  });

  describe('getLiceColorClass', () => {
    it('should return green classes for success', () => {
      expect(getLiceColorClass('success')).toContain('green');
    });

    it('should return yellow classes for warning', () => {
      expect(getLiceColorClass('warning')).toContain('yellow');
    });

    it('should return red classes for danger', () => {
      expect(getLiceColorClass('danger')).toContain('red');
    });

    it('should return muted classes for info', () => {
      expect(getLiceColorClass('info')).toContain('muted');
    });
  });
});
