# Audit Trail Frontend Integration Guide

## Overview

The audit trail system provides comprehensive history tracking for all Create/Update/Delete operations across the AquaMind platform. All 62 history endpoints are now fully documented in the OpenAPI schema with proper operation IDs, enabling clean TypeScript client generation.

## ✅ What's Fixed (Phase 5c)

- **Zero Spectacular warnings**: All W001/W002 warnings eliminated
- **Proper operation IDs**: Clean, descriptive method names in generated clients
- **Complete OpenAPI documentation**: All 62 history endpoints fully documented
- **Frontend-ready**: Generated ApiService methods are properly named

## 🔄 Integration Approach

### 1. Generate Updated Client

After backend deploys these changes, regenerate the frontend client:

```bash
npm run sync:openapi
```

This will update `client/src/api/generated/` with properly named history methods.

### 2. Available History Endpoints

All history endpoints follow the pattern: `/api/v1/{app}/history/{model}/`

#### Generated Method Names

**List Operations** (collection endpoints):
- `listBatchBatchHistory()`
- `listHealthJournalEntryHistory()`
- `listInfrastructureAreaHistory()`
- `listInventoryFeedStockHistory()`
- `listScenarioScenarioHistory()`
- `listUsersUserProfileHistory()`
- etc. (31 total list methods)

**Detail Operations** (individual record endpoints):
- `retrieveBatchBatchHistoryDetail(historyId)`
- `retrieveHealthJournalEntryHistoryDetail(historyId)`
- `retrieveInfrastructureAreaHistoryDetail(historyId)`
- `retrieveInventoryFeedStockHistoryDetail(historyId)`
- `retrieveScenarioScenarioHistoryDetail(historyId)`
- `retrieveUsersUserProfileHistoryDetail(historyId)`
- etc. (31 total detail methods)

### 3. Common Parameters

All history endpoints support:

**Query Parameters:**
- `date_from`: Filter by history_date >= date_from (ISO format)
- `date_to`: Filter by history_date <= date_to (ISO format)
- `history_user`: Filter by username (icontains)
- `history_type`: Filter by change type (+, ~, -)
- `page`: Pagination page number
- `page_size`: Items per page (default: 25, max: 100)

**Authentication:**
- All endpoints require JWT authentication
- Use `authenticatedFetch` or generated ApiService with auth headers

### 4. Response Format

All history endpoints return:

```typescript
{
  count: number,
  next: string | null,
  previous: string | null,
  results: HistoryRecord[]
}
```

Where `HistoryRecord` includes:
```typescript
interface HistoryRecord {
  // Model-specific fields (all original model fields)
  id: number;
  name: string;
  // ... other model fields

  // History-specific fields
  history_user: string;           // Username who made change
  history_date: string;           // ISO timestamp of change
  history_type: '+' | '~' | '-';  // Create/Update/Delete
  history_change_reason?: string; // Optional change reason
}
```

## 📋 Implementation Examples

### Using Generated ApiService (Recommended)

```typescript
import { ApiService } from '@/api/generated';

// Get batch history with filtering
const getBatchHistory = async (batchId: number, filters?: {
  date_from?: string;
  date_to?: string;
  history_user?: string;
  history_type?: '+' | '~' | '-';
}) => {
  try {
    const response = await ApiService.listBatchBatchHistory({
      ...filters,
      // Add any model-specific filters here
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch batch history:', error);
    throw error;
  }
};

// Get specific history record
const getBatchHistoryDetail = async (historyId: number) => {
  try {
    const response = await ApiService.retrieveBatchBatchHistoryDetail(historyId);
    return response;
  } catch (error) {
    console.error('Failed to fetch batch history detail:', error);
    throw error;
  }
};
```

### Using authenticatedFetch (Alternative)

```typescript
import { authenticatedFetch } from '@/services/api';

// Get health journal entry history
const getJournalHistory = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await authenticatedFetch(
    `/api/v1/health/history/journal-entries/?${params}`
  );
  return response.json();
};
```

## 🎯 Business Logic Integration

### Change Type Meanings

- **`+` (Plus)**: Record was created
- **`~` (Tilde)**: Record was updated
- **`-` (Minus)**: Record was deleted

### User Attribution

- `history_user`: Username of the person who made the change
- Available for all authenticated operations
- Links to Django User model

### Change Reasons

- `history_change_reason`: Optional text describing why the change was made
- May be null/empty for some operations
- Captured via API context when available

## 🔧 Error Handling

```typescript
try {
  const history = await ApiService.listBatchBatchHistory({
    date_from: '2024-01-01T00:00:00Z',
    history_type: '~'
  });

  if (history.results.length === 0) {
    // No history found - show "No changes found" message
    return [];
  }

  return history.results;
} catch (error) {
  if (error.status === 403) {
    // Permission denied - redirect to login
    redirectToLogin();
  } else if (error.status === 404) {
    // Endpoint not found - show error message
    showError('History service temporarily unavailable');
  } else {
    // Generic error handling
    showError('Failed to load history');
  }
}
```

## 📊 UI Component Patterns

### History Table Component

```typescript
const HistoryTable = ({ modelType, recordId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [modelType, recordId]);

  const loadHistory = async () => {
    try {
      let response;
      switch (modelType) {
        case 'batch':
          response = await ApiService.listBatchBatchHistory();
          break;
        case 'health':
          response = await ApiService.listHealthJournalEntryHistory();
          break;
        // Add other model types...
      }
      setHistory(response.results);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading history...</div>;

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>User</th>
          <th>Change Type</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {history.map(record => (
          <tr key={record.history_id}>
            <td>{new Date(record.history_date).toLocaleString()}</td>
            <td>{record.history_user}</td>
            <td>{getChangeTypeLabel(record.history_type)}</td>
            <td>{record.history_change_reason || 'No details'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const getChangeTypeLabel = (type) => {
  switch (type) {
    case '+': return 'Created';
    case '~': return 'Updated';
    case '-': return 'Deleted';
    default: return 'Unknown';
  }
};
```

## 🚀 Migration from Manual Fetch

If you were previously using manual fetch calls, here's how to migrate:

### Before (Manual)
```typescript
// Old way - manual fetch
const response = await authenticatedFetch('/api/v1/batch/history/batches/');
const data = await response.json();
```

### After (Generated)
```typescript
// New way - generated ApiService
const response = await ApiService.listBatchBatchHistory();
const data = response; // Already parsed JSON
```

## 📈 Performance Considerations

- **Pagination**: Use `page` and `page_size` parameters for large datasets
- **Filtering**: Apply date ranges and user filters to reduce data transfer
- **Caching**: Consider caching history data for frequently accessed records
- **Lazy Loading**: Load history on-demand rather than with initial page load

## 🔍 Testing Strategy

```typescript
// Unit test example
describe('History Integration', () => {
  it('should fetch batch history with filters', async () => {
    const mockResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          history_user: 'admin',
          history_date: '2024-01-01T10:00:00Z',
          history_type: '+',
          history_change_reason: 'Initial creation'
        }
      ]
    };

    // Mock the ApiService method
    vi.spyOn(ApiService, 'listBatchBatchHistory')
      .mockResolvedValue(mockResponse);

    const result = await getBatchHistory(1);
    expect(result.results).toHaveLength(1);
    expect(result.results[0].history_type).toBe('+');
  });
});
```

## 📚 Related Documentation

- [OpenAPI Specification](../api/openapi.yaml) - Complete API documentation
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contract-first development approach
- [Audit Trail Implementation Plan](../../AquaMind/aquamind/docs/progress/AUDIT_TRAIL_IMPLEMENTATION_PLAN.md) - Backend implementation details

## 🆘 Support

If you encounter issues:
1. Verify the OpenAPI schema is updated (`npm run sync:openapi`)
2. Check generated client methods exist in `client/src/api/generated/`
3. Ensure proper authentication headers are included
4. Test endpoint directly with curl/Postman first

---

**Last Updated**: Phase 5c completion - OpenAPI schema issues resolved
**Contact**: Backend team for API questions, Frontend team for integration support
