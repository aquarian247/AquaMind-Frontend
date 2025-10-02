# Multi-Entity Filter Components

> **📖 For comprehensive documentation, see [Multi-Entity Filtering Guide](/docs/multi-entity-filtering-guide.md)**

## Quick Reference

This directory contains reusable components for multi-entity filtering with backend `__in` support.

### Components

- **`MultiSelectFilter.tsx`** - Searchable multi-select component with validation
- **`index.ts`** - Barrel export

### Usage

```tsx
import { MultiSelectFilter } from '@/components/filters';

<MultiSelectFilter
  options={halls.map(h => ({ id: h.id, label: h.name }))}
  selectedIds={selectedHallIds}
  onChange={setSelectedHallIds}
  label="Halls"
/>
```

### Related

- **Hook**: `hooks/useMultiEntityFilter.ts` - State management
- **Utilities**: `lib/filterUtils.ts` - Core utilities
- **Documentation**: `/docs/multi-entity-filtering-guide.md` - Full guide
- **Demo**: `pages/examples/multi-entity-filtering-demo.tsx` - Live example
