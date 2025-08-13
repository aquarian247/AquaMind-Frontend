# Front-End Testing Guide

A quick reference for writing and running tests in this repo.

---

## Overview

• Test runner: **Vitest**  
• DOM helpers: **React Testing Library**  
• Environment: **jsdom**

Everything lives under `client/`. Test files use `*.test.ts(x)`.

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
* MSW server is started by default; useful for integration tests.
* Polyfills a safe `AbortController`.
* Logs any unhandled request when `onUnhandledRequest: 'error'`.

---

## Patterns for Mocking API Calls

### 1. Unit tests for `src/lib/api.ts`
Mock the underlying **generated client**:

```ts
import { ApiService } from '@/api/generated';
vi.spyOn(ApiService, 'apiV1BatchBatchesList').mockResolvedValue({ results: [] });
```

### 2. Hook / Component tests
Mock the **api wrapper** instead:

```ts
import { api } from '@/lib/api';
vi.spyOn(api, 'getDashboardKPIs').mockResolvedValue({ totalFish: 0, healthRate: 0 });
```

Avoid network calls; keep tests fast and deterministic.

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

## Mock Service Worker (optional)

* Handlers live in `client/src/test/msw`.
* Prefer **path-based** rules (`path:/api/v1/*`) so host doesn’t matter.
* Keep `server.events.on('request:start')` logs while debugging.
* Switch `onUnhandledRequest` to `'warn'` or `'bypass'` when noise is high.

---

## Coverage

* Config in `vite.config.ts`.
* Excludes generated API client & `src/pages/**`.
* Global thresholds are minimal (10 %) while suite grows.
* **Expectations**:  
  – Dashboard slice ≥ 30 % lines.  
  – New testable files ≥ 80 %.

Check HTML/LCOV output in `coverage/`.

---

## View-only Components (Smoke Tests)

Scope (Batch Management views)
- Render without crashing
- Basic tab navigation (userEvent)
- Loading state and error state
- 1–2 key data points per view

Mocking
- Prefer `vi.spyOn(globalThis, 'fetch')` for unit-level read-only components.
- Return minimal JSON shapes matching what the component reads.

Example
```ts
// Success
vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
  new Response(JSON.stringify({ results: [] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
);

// Error
vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
  new Response('Server Error', { status: 500 })
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
- MSW is available for integration tests; unit tests typically mock `fetch` directly.

---

## Troubleshooting Cheatsheet

| Symptom | Quick Fix |
|---------|-----------|
| `AbortController: signal not instance` | Use shim already in `setupTests.ts`. |
| `getContext not implemented` | Ensure Chart.js is mocked (it is by default). |
| Requests hit `localhost:3000` not mocked | Use path-based MSW handlers or mock the api module directly. |
| Unhandled request error | Add a handler or spy, or lower `onUnhandledRequest` severity. |

Happy testing!
