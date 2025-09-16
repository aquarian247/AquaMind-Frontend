import { describe, it, expect } from 'vitest';
import {
  useHistoryList,
  useHistoryDetail,
  APP_MODELS,
  getHistoryTypeLabel,
  getHistoryTypeColor,
  getHistoryQueryKey,
  HistoryType
} from './useHistory';

// Import from api to verify re-exports
import {
  useHistoryList as apiUseHistoryList,
  useHistoryDetail as apiUseHistoryDetail,
  APP_MODELS as apiAPP_MODELS,
  getHistoryTypeLabel as apiGetHistoryTypeLabel,
  getHistoryTypeColor as apiGetHistoryTypeColor,
  getHistoryQueryKey as apiGetHistoryQueryKey,
  type HistoryType as ApiHistoryType
} from '../api/api';

describe('useHistory (re-exports)', () => {
  it('should re-export useHistoryList from api', () => {
    expect(useHistoryList).toBe(apiUseHistoryList);
  });

  it('should re-export useHistoryDetail from api', () => {
    expect(useHistoryDetail).toBe(apiUseHistoryDetail);
  });

  it('should re-export APP_MODELS from api', () => {
    expect(APP_MODELS).toBe(apiAPP_MODELS);
  });

  it('should re-export getHistoryTypeLabel from api', () => {
    expect(getHistoryTypeLabel).toBe(apiGetHistoryTypeLabel);
  });

  it('should re-export getHistoryTypeColor from api', () => {
    expect(getHistoryTypeColor).toBe(apiGetHistoryTypeColor);
  });

  it('should re-export getHistoryQueryKey from api', () => {
    expect(getHistoryQueryKey).toBe(apiGetHistoryQueryKey);
  });

  it('should re-export HistoryType alias from api', () => {
    // Test that the type is the same by using it in a function signature
    const testHistoryType = (type: HistoryType) => type;
    const testApiHistoryType = (type: ApiHistoryType) => type;

    // Both should accept the same values
    expect(testHistoryType('+')).toBe('+');
    expect(testApiHistoryType('+')).toBe('+');
    expect(testHistoryType('~')).toBe('~');
    expect(testApiHistoryType('~')).toBe('~');
    expect(testHistoryType('-')).toBe('-');
    expect(testApiHistoryType('-')).toBe('-');
  });
});
