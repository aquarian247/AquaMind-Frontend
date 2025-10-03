/**
 * Tests for Scenario KPI Calculation Utilities
 * 
 * TASK 3: Comprehensive test coverage for extracted KPI logic
 * Target: 90%+ coverage with all edge cases
 */

import { describe, it, expect } from 'vitest';
import {
  hasBackendSummaryFields,
  extractBackendKPIs,
  countScenariosInProgress,
  countCompletedProjections,
  calculateAverageProjectionDuration,
  calculateClientKPIs,
  calculateScenarioKPIs,
  type ScenarioPlanningKPIs,
} from './kpiCalculations';

describe('hasBackendSummaryFields', () => {
  it('returns false for null data', () => {
    expect(hasBackendSummaryFields(null)).toBe(false);
  });

  it('returns false for undefined data', () => {
    expect(hasBackendSummaryFields(undefined)).toBe(false);
  });

  it('returns false for non-object data', () => {
    expect(hasBackendSummaryFields("string")).toBe(false);
    expect(hasBackendSummaryFields(123)).toBe(false);
    expect(hasBackendSummaryFields(true)).toBe(false);
  });

  it('returns false for empty object', () => {
    expect(hasBackendSummaryFields({})).toBe(false);
  });

  it('returns true when totalActiveScenarios field exists', () => {
    expect(hasBackendSummaryFields({ totalActiveScenarios: 5 })).toBe(true);
  });

  it('returns true when scenariosInProgress field exists', () => {
    expect(hasBackendSummaryFields({ scenariosInProgress: 2 })).toBe(true);
  });

  it('returns true when completedProjections field exists', () => {
    expect(hasBackendSummaryFields({ completedProjections: 3 })).toBe(true);
  });

  it('returns true when averageProjectionDuration field exists', () => {
    expect(hasBackendSummaryFields({ averageProjectionDuration: 45 })).toBe(true);
  });

  it('returns true when multiple summary fields exist', () => {
    expect(hasBackendSummaryFields({
      totalActiveScenarios: 10,
      scenariosInProgress: 4,
      completedProjections: 6,
      averageProjectionDuration: 30,
    })).toBe(true);
  });

  it('returns true even when other non-summary fields present', () => {
    expect(hasBackendSummaryFields({
      id: 1,
      name: "Test",
      totalActiveScenarios: 5,
    })).toBe(true);
  });
});

describe('extractBackendKPIs', () => {
  it('extracts all KPI fields from backend response', () => {
    const summaryData = {
      totalActiveScenarios: 15,
      scenariosInProgress: 5,
      completedProjections: 10,
      averageProjectionDuration: 42.5,
    };

    const result = extractBackendKPIs(summaryData);

    expect(result).toEqual({
      totalActiveScenarios: 15,
      scenariosInProgress: 5,
      completedProjections: 10,
      averageProjectionDuration: 42.5,
    });
  });

  it('uses 0 fallback for missing totalActiveScenarios', () => {
    const summaryData = {
      scenariosInProgress: 5,
      completedProjections: 10,
      averageProjectionDuration: 42.5,
    };

    const result = extractBackendKPIs(summaryData);
    expect(result.totalActiveScenarios).toBe(0);
  });

  it('uses 0 fallback for missing scenariosInProgress', () => {
    const summaryData = {
      totalActiveScenarios: 15,
      completedProjections: 10,
      averageProjectionDuration: 42.5,
    };

    const result = extractBackendKPIs(summaryData);
    expect(result.scenariosInProgress).toBe(0);
  });

  it('uses 0 fallback for missing completedProjections', () => {
    const summaryData = {
      totalActiveScenarios: 15,
      scenariosInProgress: 5,
      averageProjectionDuration: 42.5,
    };

    const result = extractBackendKPIs(summaryData);
    expect(result.completedProjections).toBe(0);
  });

  it('uses 0 fallback for missing averageProjectionDuration', () => {
    const summaryData = {
      totalActiveScenarios: 15,
      scenariosInProgress: 5,
      completedProjections: 10,
    };

    const result = extractBackendKPIs(summaryData);
    expect(result.averageProjectionDuration).toBe(0);
  });

  it('handles null values with 0 fallback', () => {
    const summaryData = {
      totalActiveScenarios: null,
      scenariosInProgress: null,
      completedProjections: null,
      averageProjectionDuration: null,
    };

    const result = extractBackendKPIs(summaryData);

    expect(result).toEqual({
      totalActiveScenarios: 0,
      scenariosInProgress: 0,
      completedProjections: 0,
      averageProjectionDuration: 0,
    });
  });

  it('handles undefined values with 0 fallback', () => {
    const summaryData = {
      totalActiveScenarios: undefined,
      scenariosInProgress: undefined,
      completedProjections: undefined,
      averageProjectionDuration: undefined,
    };

    const result = extractBackendKPIs(summaryData);

    expect(result).toEqual({
      totalActiveScenarios: 0,
      scenariosInProgress: 0,
      completedProjections: 0,
      averageProjectionDuration: 0,
    });
  });

  it('ignores extra non-KPI fields', () => {
    const summaryData = {
      id: 123,
      name: "Test Scenario",
      description: "Test description",
      totalActiveScenarios: 8,
      scenariosInProgress: 3,
      completedProjections: 5,
      averageProjectionDuration: 35,
      extraField: "ignored",
    };

    const result = extractBackendKPIs(summaryData);

    expect(result).toEqual({
      totalActiveScenarios: 8,
      scenariosInProgress: 3,
      completedProjections: 5,
      averageProjectionDuration: 35,
    });
  });
});

describe('countScenariosInProgress', () => {
  it('returns 0 for empty array', () => {
    expect(countScenariosInProgress([])).toBe(0);
  });

  it('counts scenarios with "running" status', () => {
    const scenarios = [
      { status: 'running', duration_days: 30 },
      { status: 'completed', duration_days: 45 },
      { status: 'running', duration_days: 15 },
      { status: 'draft', duration_days: 0 },
    ];

    expect(countScenariosInProgress(scenarios)).toBe(2);
  });

  it('returns 0 when no scenarios are running', () => {
    const scenarios = [
      { status: 'completed', duration_days: 45 },
      { status: 'draft', duration_days: 0 },
      { status: 'failed', duration_days: 10 },
    ];

    expect(countScenariosInProgress(scenarios)).toBe(0);
  });

  it('handles scenarios with no status field', () => {
    const scenarios = [
      { duration_days: 30 },
      { status: 'running', duration_days: 15 },
    ];

    expect(countScenariosInProgress(scenarios)).toBe(1);
  });

  it('handles scenarios with null status', () => {
    const scenarios = [
      { status: null, duration_days: 30 },
      { status: 'running', duration_days: 15 },
    ];

    expect(countScenariosInProgress(scenarios)).toBe(1);
  });
});

describe('countCompletedProjections', () => {
  it('returns 0 for empty array', () => {
    expect(countCompletedProjections([])).toBe(0);
  });

  it('counts scenarios with "completed" status', () => {
    const scenarios = [
      { status: 'completed', duration_days: 45 },
      { status: 'running', duration_days: 30 },
      { status: 'completed', duration_days: 50 },
      { status: 'draft', duration_days: 0 },
    ];

    expect(countCompletedProjections(scenarios)).toBe(2);
  });

  it('returns 0 when no scenarios are completed', () => {
    const scenarios = [
      { status: 'running', duration_days: 30 },
      { status: 'draft', duration_days: 0 },
      { status: 'failed', duration_days: 10 },
    ];

    expect(countCompletedProjections(scenarios)).toBe(0);
  });

  it('handles scenarios with no status field', () => {
    const scenarios = [
      { duration_days: 30 },
      { status: 'completed', duration_days: 45 },
    ];

    expect(countCompletedProjections(scenarios)).toBe(1);
  });
});

describe('calculateAverageProjectionDuration', () => {
  it('returns 0 for empty array', () => {
    expect(calculateAverageProjectionDuration([])).toBe(0);
  });

  it('calculates average duration for single scenario', () => {
    const scenarios = [{ status: 'completed', duration_days: 42 }];
    expect(calculateAverageProjectionDuration(scenarios)).toBe(42);
  });

  it('calculates average duration for multiple scenarios', () => {
    const scenarios = [
      { status: 'completed', duration_days: 30 },
      { status: 'completed', duration_days: 40 },
      { status: 'completed', duration_days: 50 },
    ];

    expect(calculateAverageProjectionDuration(scenarios)).toBe(40);
  });

  it('handles scenarios with null duration_days', () => {
    const scenarios = [
      { status: 'completed', duration_days: 30 },
      { status: 'completed', duration_days: null },
      { status: 'completed', duration_days: 50 },
    ];

    // 30 + 0 + 50 = 80 / 3 = 26.666...
    expect(calculateAverageProjectionDuration(scenarios)).toBeCloseTo(26.67, 2);
  });

  it('handles scenarios with undefined duration_days', () => {
    const scenarios = [
      { status: 'completed', duration_days: 30 },
      { status: 'completed' },
      { status: 'completed', duration_days: 50 },
    ];

    // 30 + 0 + 50 = 80 / 3 = 26.666...
    expect(calculateAverageProjectionDuration(scenarios)).toBeCloseTo(26.67, 2);
  });

  it('returns 0 when all durations are null/undefined', () => {
    const scenarios = [
      { status: 'completed', duration_days: null },
      { status: 'completed' },
      { status: 'completed', duration_days: undefined },
    ];

    expect(calculateAverageProjectionDuration(scenarios)).toBe(0);
  });

  it('handles decimal durations', () => {
    const scenarios = [
      { status: 'completed', duration_days: 30.5 },
      { status: 'completed', duration_days: 45.7 },
      { status: 'completed', duration_days: 50.3 },
    ];

    // 30.5 + 45.7 + 50.3 = 126.5 / 3 = 42.166...
    expect(calculateAverageProjectionDuration(scenarios)).toBeCloseTo(42.17, 2);
  });
});

describe('calculateClientKPIs', () => {
  it('returns zeros for empty array', () => {
    const result = calculateClientKPIs([]);

    expect(result).toEqual({
      totalActiveScenarios: 0,
      scenariosInProgress: 0,
      completedProjections: 0,
      averageProjectionDuration: 0,
    });
  });

  it('calculates all KPIs correctly for realistic dataset', () => {
    const scenarios = [
      { status: 'running', duration_days: 30 },
      { status: 'running', duration_days: 45 },
      { status: 'completed', duration_days: 60 },
      { status: 'completed', duration_days: 50 },
      { status: 'draft', duration_days: 0 },
    ];

    const result = calculateClientKPIs(scenarios);

    expect(result).toEqual({
      totalActiveScenarios: 5,
      scenariosInProgress: 2,
      completedProjections: 2,
      averageProjectionDuration: 37, // (30+45+60+50+0)/5 = 185/5 = 37
    });
  });

  it('handles single scenario', () => {
    const scenarios = [
      { status: 'running', duration_days: 25 },
    ];

    const result = calculateClientKPIs(scenarios);

    expect(result).toEqual({
      totalActiveScenarios: 1,
      scenariosInProgress: 1,
      completedProjections: 0,
      averageProjectionDuration: 25,
    });
  });

  it('handles scenarios with missing fields', () => {
    const scenarios = [
      { status: 'running' },
      { duration_days: 40 },
      {},
    ];

    const result = calculateClientKPIs(scenarios);

    expect(result).toEqual({
      totalActiveScenarios: 3,
      scenariosInProgress: 1,
      completedProjections: 0,
      averageProjectionDuration: 40 / 3, // 40/3 = 13.333...
    });
  });
});

describe('calculateScenarioKPIs', () => {
  describe('with backend summary data', () => {
    it('uses backend data when summary fields present', () => {
      const summaryData = {
        totalActiveScenarios: 20,
        scenariosInProgress: 8,
        completedProjections: 12,
        averageProjectionDuration: 55,
      };
      const scenariosList = [
        { status: 'running', duration_days: 10 },
      ];

      const result = calculateScenarioKPIs(summaryData, scenariosList);

      // Should use backend data, not client calculation
      expect(result).toEqual({
        totalActiveScenarios: 20,
        scenariosInProgress: 8,
        completedProjections: 12,
        averageProjectionDuration: 55,
      });
    });

    it('prioritizes backend data even with empty scenarios list', () => {
      const summaryData = {
        totalActiveScenarios: 15,
        scenariosInProgress: 5,
        completedProjections: 10,
        averageProjectionDuration: 45,
      };

      const result = calculateScenarioKPIs(summaryData, []);

      expect(result).toEqual({
        totalActiveScenarios: 15,
        scenariosInProgress: 5,
        completedProjections: 10,
        averageProjectionDuration: 45,
      });
    });
  });

  describe('fallback to client-side calculation', () => {
    it('uses client calculation when backend data is null', () => {
      const scenariosList = [
        { status: 'running', duration_days: 30 },
        { status: 'completed', duration_days: 45 },
      ];

      const result = calculateScenarioKPIs(null, scenariosList);

      expect(result).toEqual({
        totalActiveScenarios: 2,
        scenariosInProgress: 1,
        completedProjections: 1,
        averageProjectionDuration: 37.5, // (30+45)/2
      });
    });

    it('uses client calculation when backend data is undefined', () => {
      const scenariosList = [
        { status: 'running', duration_days: 25 },
      ];

      const result = calculateScenarioKPIs(undefined, scenariosList);

      expect(result).toEqual({
        totalActiveScenarios: 1,
        scenariosInProgress: 1,
        completedProjections: 0,
        averageProjectionDuration: 25,
      });
    });

    it('uses client calculation when backend data has no summary fields', () => {
      const summaryData = {
        id: 123,
        name: "Test Scenario",
        description: "No summary fields here",
      };
      const scenariosList = [
        { status: 'completed', duration_days: 60 },
        { status: 'completed', duration_days: 40 },
      ];

      const result = calculateScenarioKPIs(summaryData, scenariosList);

      expect(result).toEqual({
        totalActiveScenarios: 2,
        scenariosInProgress: 0,
        completedProjections: 2,
        averageProjectionDuration: 50, // (60+40)/2
      });
    });

    it('returns zeros when both backend and scenarios are empty', () => {
      const result = calculateScenarioKPIs(null, []);

      expect(result).toEqual({
        totalActiveScenarios: 0,
        scenariosInProgress: 0,
        completedProjections: 0,
        averageProjectionDuration: 0,
      });
    });
  });

  describe('edge cases', () => {
    it('handles partial backend data with fallbacks', () => {
      const summaryData = {
        totalActiveScenarios: 10,
        // other fields missing
      };

      const result = calculateScenarioKPIs(summaryData, []);

      expect(result).toEqual({
        totalActiveScenarios: 10,
        scenariosInProgress: 0,
        completedProjections: 0,
        averageProjectionDuration: 0,
      });
    });

    it('handles mixed statuses in client calculation', () => {
      const scenariosList = [
        { status: 'running', duration_days: 20 },
        { status: 'completed', duration_days: 40 },
        { status: 'draft', duration_days: 0 },
        { status: 'failed', duration_days: 10 },
        { status: 'running', duration_days: 30 },
      ];

      const result = calculateScenarioKPIs(null, scenariosList);

      expect(result).toEqual({
        totalActiveScenarios: 5,
        scenariosInProgress: 2,
        completedProjections: 1,
        averageProjectionDuration: 20, // (20+40+0+10+30)/5 = 100/5 = 20
      });
    });
  });
});

