import { describe, it, expect } from 'vitest';
import { getLifecycleStages, getStageProgress, getProgressColor } from './lifecycleHelpers';

describe('lifecycleHelpers', () => {
  describe('getLifecycleStages', () => {
    it('should return all 6 standard lifecycle stages', () => {
      const stages = getLifecycleStages();
      expect(stages).toHaveLength(6);
      expect(stages.map(s => s.name)).toEqual([
        'Egg',
        'Fry',
        'Parr',
        'Smolt',
        'Post-Smolt',
        'Adult'
      ]);
    });

    it('should have valid durations for all stages', () => {
      const stages = getLifecycleStages();
      stages.forEach(stage => {
        expect(stage.duration).toBeGreaterThan(0);
        expect(typeof stage.duration).toBe('number');
      });
    });

    it('should have color classes for all stages', () => {
      const stages = getLifecycleStages();
      stages.forEach(stage => {
        expect(stage.color).toBeTruthy();
        expect(stage.color).toContain('bg-');
      });
    });
  });

  describe('getStageProgress', () => {
    it('should return 0 for missing parameters', () => {
      expect(getStageProgress(undefined, 50)).toBe(0);
      expect(getStageProgress('Egg', undefined)).toBe(0);
      expect(getStageProgress(undefined, undefined)).toBe(0);
    });

    it('should return 0 for unknown stage name', () => {
      expect(getStageProgress('UnknownStage', 50)).toBe(0);
    });

    it('should calculate progress for Egg stage correctly', () => {
      // Egg is first stage, 100 days duration
      expect(getStageProgress('Egg', 0)).toBe(0);
      expect(getStageProgress('Egg', 50)).toBe(50);
      expect(getStageProgress('Egg', 100)).toBe(100);
    });

    it('should calculate progress for Fry stage correctly', () => {
      // Fry is second stage, starts at day 100, 100 days duration
      expect(getStageProgress('Fry', 100)).toBe(0);
      expect(getStageProgress('Fry', 150)).toBe(50);
      expect(getStageProgress('Fry', 200)).toBe(100);
    });

    it('should calculate progress for Adult stage correctly', () => {
      // Adult is last stage, starts at day 500, 450 days duration
      expect(getStageProgress('Adult', 500)).toBe(0);
      expect(getStageProgress('Adult', 725)).toBe(50);
      expect(getStageProgress('Adult', 950)).toBe(100);
    });

    it('should handle case-insensitive stage names', () => {
      expect(getStageProgress('egg', 50)).toBe(50);
      expect(getStageProgress('EGG', 50)).toBe(50);
      expect(getStageProgress('Egg', 50)).toBe(50);
    });

    it('should cap progress at 100%', () => {
      // Even if days exceed stage duration
      expect(getStageProgress('Egg', 200)).toBe(100);
    });

    it('should handle negative days by returning 0', () => {
      expect(getStageProgress('Egg', -10)).toBe(0);
    });
  });

  describe('getProgressColor', () => {
    it('should return green for progress < 60%', () => {
      expect(getProgressColor(0)).toBe('bg-green-500');
      expect(getProgressColor(30)).toBe('bg-green-500');
      expect(getProgressColor(59)).toBe('bg-green-500');
    });

    it('should return yellow for progress 60-74%', () => {
      expect(getProgressColor(60)).toBe('bg-yellow-500');
      expect(getProgressColor(70)).toBe('bg-yellow-500');
      expect(getProgressColor(74)).toBe('bg-yellow-500');
    });

    it('should return orange for progress 75-89%', () => {
      expect(getProgressColor(75)).toBe('bg-orange-500');
      expect(getProgressColor(80)).toBe('bg-orange-500');
      expect(getProgressColor(89)).toBe('bg-orange-500');
    });

    it('should return red for progress >= 90%', () => {
      expect(getProgressColor(90)).toBe('bg-red-700');
      expect(getProgressColor(95)).toBe('bg-red-700');
      expect(getProgressColor(100)).toBe('bg-red-700');
    });
  });
});

