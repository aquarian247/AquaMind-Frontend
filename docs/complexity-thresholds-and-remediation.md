# Frontend Complexity Analysis & Thresholds

Date: 2025-09-14
Status: Active (Warn-only mode)

## Overview

This document outlines the code complexity analysis thresholds and remediation strategies implemented as part of Issue #5 of the frontend maintainability improvement plan.

## Analysis Tools

### Lizard Code Complexity Analyzer

- **Tool**: [Lizard](https://github.com/terryyin/lizard) - A code complexity analyzer
- **Metrics**:
  - **CCN** (Cyclomatic Complexity Number): Measures decision points in code
  - **NLOC** (Lines of Code): Non-comment lines of code
  - **Token Count**: Number of tokens in the function
  - **Function Length**: Total lines in function

## Thresholds (Current - Warn Only)

### Cyclomatic Complexity (CCN)
- **Warning Threshold**: CCN > 15
- **Target**: CCN ≤ 15 for all functions
- **Rationale**: Functions with CC > 15 are hard to understand and test

### Function Length
- **Warning Threshold**: Length > 300 lines
- **Target**: Functions ≤ 300 lines
- **Rationale**: Very long functions are difficult to maintain and test

### File Size
- **Warning Threshold**: NLOC > 1000 lines per file
- **Target**: Files ≤ 1000 lines
- **Rationale**: Large files are hard to navigate and maintain

## Current Status

Based on baseline analysis (2025-09-14):

### Critical Violations (CCN > 15)
- `hooks/aggregations/useBatchFcr.ts` - async function with CCN=23 (98 lines)
- This is the only function currently violating CCN > 15

### File Size Analysis
- Largest file: `lib/api.ts` - 953 NLOC
- Second largest: `hooks/use-fcr-analytics.ts` - 408 NLOC
- Average file size: ~300 NLOC across analyzed files

## Remediation Strategies

### For High CCN Functions

#### Strategy 1: Extract Pure Helper Functions
```typescript
// BEFORE (CCN=23)
async function processBatchData(data: BatchData) {
  if (!data) return null;
  if (data.status === 'inactive') return null;
  // ... many nested conditions
  const result = calculateFcr(data.metrics);
  if (result > threshold) {
    // complex logic
  }
  // ... more complexity
}

// AFTER (CCN=8)
async function processBatchData(data: BatchData) {
  if (!isValidBatchData(data)) return null;

  const metrics = extractBatchMetrics(data);
  const fcr = calculateFcr(metrics);

  return processFcrResult(fcr, data);
}

// Extracted helpers (CCN=1 each)
function isValidBatchData(data: BatchData): boolean {
  return data && data.status !== 'inactive';
}

function extractBatchMetrics(data: BatchData) {
  // Simple extraction logic
}

function calculateFcr(metrics: Metrics) {
  // Pure calculation
}

function processFcrResult(fcr: number, data: BatchData) {
  // Simple processing
}
```

#### Strategy 2: Early Returns
Replace nested if-else chains with early returns:

```typescript
// BEFORE (nested conditions)
function validateAndProcess(data) {
  if (data) {
    if (data.isValid) {
      if (data.type === 'A') {
        // process A
      } else if (data.type === 'B') {
        // process B
      }
    }
  }
}

// AFTER (early returns)
function validateAndProcess(data) {
  if (!data) return;
  if (!data.isValid) return;

  if (data.type === 'A') return processA(data);
  if (data.type === 'B') return processB(data);
}
```

#### Strategy 3: Replace Complex Conditionals with Data Structures

```typescript
// BEFORE (complex switch/if chain)
function getProcessingStrategy(type: string) {
  switch (type) {
    case 'A': return { method: 'fast', priority: 1 };
    case 'B': return { method: 'slow', priority: 2 };
    case 'C': return { method: 'async', priority: 3 };
    // ... many more cases
  }
}

// AFTER (lookup table)
const PROCESSING_STRATEGIES = {
  A: { method: 'fast', priority: 1 },
  B: { method: 'slow', priority: 2 },
  C: { method: 'async', priority: 3 },
} as const;

function getProcessingStrategy(type: string) {
  return PROCESSING_STRATEGIES[type] || { method: 'default', priority: 0 };
}
```

### For Large Functions (>300 lines)

#### Strategy 1: Extract Sub-functions
Break large functions into smaller, focused functions:

```typescript
// BEFORE (300+ lines)
async function handleBatchSubmission(batchData) {
  // 50 lines of validation
  // 100 lines of data processing
  // 80 lines of API calls
  // 70 lines of error handling
}

// AFTER (multiple focused functions)
async function handleBatchSubmission(batchData) {
  const validated = await validateBatchData(batchData);
  const processed = await processBatchData(validated);
  const result = await submitBatchToAPI(processed);
  return handleBatchResult(result);
}
```

#### Strategy 2: Extract Custom Hooks
For React components with large useEffect or event handlers:

```typescript
// BEFORE (large component)
function BatchManagementView() {
  // 200+ lines of state management and effects
  // 100+ lines of event handlers
}

// AFTER (extracted hooks)
function useBatchManagement() {
  // State and effects logic
}

function useBatchActions() {
  // Action handlers
}

function BatchManagementView() {
  const { state, actions } = useBatchManagement();
  // Simple render logic
}
```

### For Large Files (>1000 NLOC)

#### Strategy 1: Split by Responsibility
Break large files into smaller modules:

```
lib/api.ts (953 lines) → split into:
├── api/batches.ts
├── api/sensors.ts
├── api/users.ts
├── api/common.ts
└── api/index.ts (re-exports)
```

#### Strategy 2: Extract Utilities
Move pure utility functions to dedicated files:

```
utils/
├── validation.ts
├── formatting.ts
├── calculations.ts
└── constants.ts
```

## CI Integration

### Automated Analysis
The CI pipeline now runs complexity analysis on every PR and push:

```bash
# Generate full analysis (overwrites latest file)
npm run complexity:analyze

# Generate component analysis only (overwrites latest file)
npm run complexity:analyze:components

# Check for violations (warn-only)
npm run complexity:check

# Clean up old metrics files (removes files older than 7 days)
npm run complexity:cleanup
```

### Artifact Storage
- Complexity reports are uploaded as CI artifacts
- Files: `docs/metrics/frontend_lizard_latest.txt`, `docs/metrics/frontend_lizard_components_latest.txt`
- Retention: 30 days
- Accessible from CI run details
- Old files are automatically cleaned up (files older than 7 days removed)

## Monitoring & Alerts

### Current Implementation (Warn-Only)
- CI continues even with violations
- Warnings logged in CI output
- Metrics uploaded as artifacts for review

### Future Implementation (Blocking)
When thresholds are consistently met:
- Add `--warnings-as-errors` flag to make CI fail on violations
- Set up notifications for threshold breaches
- Add complexity trend monitoring

## Progress Tracking

### Baseline (2025-09-14)
- Total functions analyzed: 254
- Functions with CCN > 15: 1 (0.4%)
- Average CCN: 1.7
- Files with NLOC > 1000: 0

### Targets
- Functions with CCN > 15: 0 (0%)
- Files with NLOC > 1000: 0
- Average CCN: < 2.0

## Local Development

### Running Analysis Locally
```bash
# Full analysis (overwrites latest file)
npm run complexity:analyze

# Component analysis only (overwrites latest file)
npm run complexity:analyze:components

# Check violations
npm run complexity:check

# Clean up old metrics files (removes files older than 7 days)
npm run complexity:cleanup
```

### IDE Integration
Consider adding lizard to your IDE for real-time feedback:
- VS Code: Install "CodeMetrics" extension
- Other editors: Check for complexity analysis plugins

## References

- [Lizard Documentation](https://github.com/terryyin/lizard)
- [Cyclomatic Complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity)
- [Maintainability Index](https://docs.microsoft.com/en-us/visualstudio/code-quality/code-metrics-maintainability-index-range-and-meaning)

---

**Note**: This analysis is currently in warn-only mode to allow gradual remediation without blocking development. Once the codebase consistently meets thresholds, the CI can be configured to fail on violations.
