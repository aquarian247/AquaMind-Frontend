# Front-End Testing Guide

A quick reference for writing and running tests in this repo.

---

## Overview

• Test runner: **Vitest**  
• DOM helpers: **React Testing Library**  
• Environment: **jsdom**

Everything lives under `client/`. Test files use `*.test.ts(x)`.

ℹ️ **Real API vs. mock endpoints**  
The suite now targets the *real* Django REST API (`/api/v1/...`).  Tests should
mock those URLs (or the generated ApiService) instead of the legacy “/api/foo”
place-holders.  Keep the response shape identical to what Django returns so the
UI logic (pagination, field names, etc.) stays truthful.

---

## Running Tests

| Command           | Description                                    |
|-------------------|------------------------------------------------|
| `npm run test`    | Interactive watch mode.                        |
| `npm run test:ci` | One-off run with coverage output to `client/coverage/`. |

---

## Global Setup (`client/src/setupTests.ts`)

* Adds **jest-dom** matchers.
* Mocks **Chart.js** so `canvas.getContext` never runs.
* **MSW is disabled** by default to allow simple fetch mocks.
* Polyfills a safe `AbortController`.
* Stubs `matchMedia` and `ResizeObserver` for testing.

---

## Patterns for Mocking API Calls

### 1. Simple Fetch Mocks (Recommended)
Use Vitest's built-in mocking for reliable, simple API mocking:

```ts
// In test setup
const fetchMock = vi.fn();
global.fetch = fetchMock;

// In test cases
fetchMock.mockImplementationOnce(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      count: 2,
      next: null,
      previous: null,
      results: [
        { id: 1, name: 'Test Item 1' },
        { id: 2, name: 'Test Item 2' }
      ]
    })
  })
);
```

### 2. Alternative: Mock the generated API client
For cases where you want to mock at the service layer:

```ts
import { ApiService } from '@/api/generated';
vi.spyOn(ApiService, 'apiV1BatchBatchesList').mockResolvedValue({ results: [] });
```

🚩 **Paginated responses**  
Most Django list endpoints return:

```json
{
  "count": 12,
  "next": null,
  "previous": null,
  "results": [ /* array of objects */ ]
}
```
Always mock the full envelope so components that read `.results` (or check `.count`)
work exactly as in production.

---

## Chart.js in Tests

* Chart is class-mocked in `setupTests.ts`; no real canvas work.
* Assert **presence of `<canvas>`**, not pixel data.
* If you accidentally call `getContext`, jsdom throws:  
  “*HTMLCanvasElement.prototype.getContext not implemented*” – the mock prevents this.

---

## React Query Tips

* Create a **fresh `QueryClient` per test**:

```ts
const qc = new QueryClient({ defaultOptions:{ queries:{ retry:false, cacheTime:0 } }});
render(<QueryClientProvider client={qc}>...</QueryClientProvider>);
```

* Disable retry & cache for predictability.

---

## Mock Service Worker (Deprecated)

* **MSW is currently disabled** in `setupTests.ts` due to reliability issues.
* Handlers exist in `client/src/test/msw` but are not used.
* **Use simple fetch mocks instead** for new tests.
* If MSW is re-enabled, prefer path-based rules (`path:/api/v1/*`).

---

## Coverage

* Config in `vite.config.ts`.
* Excludes generated API client & `src/pages/**`.
* **Current: 38.93% overall** with focus on business logic.
* **Realistic Target: 50-60%** - Focus on high-value areas.
* **Priority Areas** (currently low coverage but high business value):
  – **AuthService** (30%) - Centralized authentication & token management
  – **AuthContext** (20%) - React state management for auth
  – **Infrastructure pages** (0%) - Data aggregation & filtering
  – **API utilities** (13%) - Data processing & fallbacks
  – **Pagination utility** (0%) - Large dataset handling
  – **Container filtering** (business rules for categorization)

* **Coverage Strategy**: Quality over quantity - test business logic that matters.
* **What to Test**: Authentication, data processing, business rules, error handling.
* **What NOT to Test**: Simple UI components, basic rendering, CSS classes, static content.

Check HTML/LCOV output in `coverage/`.

---

## View-only Components (Smoke Tests)

Scope (Batch Management views)
- Render without crashing
- Basic tab navigation (userEvent)
- Loading state and error state
- 1–2 key data points per view

Mocking
- **Use simple fetch mocks** (`global.fetch = vi.fn()`) for reliable testing.
- Return minimal JSON shapes matching what the component reads.

Example
```ts
// Setup fetch mock
const fetchMock = vi.fn();
global.fetch = fetchMock;

// Success case
fetchMock.mockImplementationOnce(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      count: 0,
      next: null,
      previous: null,
      results: [],
    })
  })
);

// Error case
fetchMock.mockImplementationOnce(() =>
  Promise.resolve({
    ok: false,
    status: 500
  })
);
```

React Query
- Use app default query function so component queries work without bespoke stubs:
```ts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';

const qc = new QueryClient({
  defaultOptions: { queries: { queryFn: getQueryFn(), retry: false, gcTime: 0 } },
});
```

Assertions
- Prefer role-based queries; use `findBy*`/`findAllBy*` for async UI.
- Handle duplicate text with `findAllByText` or by scoping to a container.

Environment
- `matchMedia`, `ResizeObserver`, and Canvas are stubbed in `setupTests.ts`.
- **Simple fetch mocks** are the standard approach; MSW is disabled.

---

## Troubleshooting Cheatsheet

| Symptom | Quick Fix |
|---------|-----------|
| `AbortController: signal not instance` | Use shim already in `setupTests.ts`. |
| `getContext not implemented` | Ensure Chart.js is mocked (it is by default). |
| Fetch calls not mocked | Use `global.fetch = vi.fn()` and `fetchMock.mockImplementationOnce()`. |
| MSW errors (deprecated) | MSW is disabled; use simple fetch mocks instead. |
| Test timeout | Ensure fetch mocks resolve quickly; use `Promise.resolve()` not `setTimeout()`. |

Happy testing!
