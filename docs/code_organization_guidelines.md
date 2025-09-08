# Code Organization Guidelines (Frontend – React 18 + TypeScript)

> **Scope** – These guidelines apply to the AquaMind **frontend** codebase (React 18, Vite, Tailwind CSS, Shadcn/ui, Wouter, TanStack Query, Chart.js & Recharts).

---

## 0  API Contract-First Workflow

The **OpenAPI spec (`api/openapi.yaml`) is the single source of truth** for all frontend–backend interactions.

1. **Typed client generation** – `npm run sync:openapi` (CI workflow) regenerates `client/src/api/generated`.
2. **Authentication** – token via `/api/v1/auth/token/`; the generated client handles auth header inclusion.
3. **Change flow**  
   Backend updates API ➜ pushes new `openapi.yaml` ➜ Frontend CI regenerates client & opens PR.
4. **Contract verification** – Backend CI runs **Schemathesis** to validate endpoints vs spec.
5. **Usage** – Always import from the generated client; never hard-code fetch calls.

```ts
import { ApiService } from "@/api/generated";

const batches = await ApiService.apiV1BatchBatchesList();
```

---

## 1  Folder & File Structure

```
client/src/
├── components/              # Re-usable UI pieces only concerned with rendering
│   ├── ui/                  # Base Shadcn/ui primitives (never modified)
│   ├── charts/              # Chart wrappers (Chart.js / Recharts)
│   ├── dashboard/           # Feature-specific visual components
│   └── …
├── features/                # Slice-based feature folders (state + pages + sub-components)
│   ├── batch-management/
│   │   ├── api.ts           # Feature API client (TanStack Query)
│   │   ├── hooks.ts         # Custom hooks (business logic)
│   │   ├── pages/           # Page level components (route targets)
│   │   └── components/      # Visual/presentational pieces
│   └── …
├── hooks/                   # Truly generic cross-feature hooks
├── lib/                     # Pure util helpers (date, math, validation …)
├── router/                  # Central route map & lazy imports
├── styles/                  # Tailwind base layers & global styles
├── types/                   # Global TypeScript types / generated API types
└── App.tsx                  # Top-level config (providers, layout, router)
```

**Rules**
1. Nothing outside `client/src` imports from inside `server/` (clear boundary).
2. Pages live inside the **feature** they belong to.
3. Components that are reused by >1 feature belong in `components/`.
4. Shared constants & enums go in `lib/constants.ts` (or feature-local if only used there).

---

## 2  File Naming & Size Limits

| Type            | Convention                | Max LOC | Notes |
|-----------------|---------------------------|---------|-------|
| Component       | `MyThing.tsx`             | 300     | Split when >300 LOC or >3 responsibilities |
| Hook            | `useThing.ts`             | 150     | Prefer small hooks composed together |
| Util / Helper   | `string.ts`, `math.ts`    | 200     | Pure functions only |
| Test            | `MyThing.test.tsx`        | —       | colocated with file under test |

Large domain pages (e.g. `Broodstock.tsx`) **must** be decomposed into:
* top-level route ≈ 100-150 LOC (layout / glue)
* sub-components & hooks for sections (charts, forms, tables)

---

## 3  Component Guidelines

1. **Functional Components only** – no class components.
2. Keep components **pure**; side-effects go in hooks.
3. Props first, then hooks, then render.

```tsx
function BatchTable({ batches }: { batches: Batch[] }) {
  /* 1. hooks */
  const navigate = useNavigate();

  /* 2. helpers */
  const columns = useMemo(() => [...], [/* deps */]);

  /* 3. render */
  return (
    <DataTable columns={columns} data={batches} onRowClick={b => navigate(`/batch/${b.id}`)} />
  );
}
```

### Presentational vs Smart
* **Presentational**: receives all data via props, unaware of TanStack Query.
* **Smart** (usually in `pages/` or `features/*/pages/`): owns data-fetch + mutations.

---

## 4  State Management with TanStack Query

1. **Queries** live in the **feature folder** (`features/foo/api.ts`).
2. Avoid global React Context; prefer server-state cached in Query + local component state.
3. Always supply `queryKey` using `["feature", params]` pattern.
4. Centralised **error boundary** at `App.tsx`.
5. Use `suspense: true` + React 18 `<Suspense>` for smoother loading.

---

## 5  Styling & UI

* **Tailwind first**, Shadcn/ui for accessible primitives.
* Never write plain CSS except in `styles/`.
* Follow **utility-first** order: `base -> layout -> modifiers -> state`.
* Theme tokens in `tailwind.config.ts` only.

```html
<div className="flex flex-col gap-4 p-6 bg-card text-card-foreground">
```

---

## 6  Routing (Wouter)

* All routes defined in `router/index.tsx`.
* Lazy-load heavy pages:

```tsx
const ScenarioPlanningPage = lazy(() => import("features/scenario/pages/ScenarioPlanningPage"));
```

---

## 7  Data Visualisation

* Wrap Chart.js/Recharts config in **thin wrapper components** under `components/charts`.
* Each chart component accepts **serialised props only** (no raw API models).
* Heavy chart libs loaded lazily with dynamic import + `Suspense`.

---

## 8  Custom Hooks & Utilities

* Prefix hooks with `use` and return **[value, actions]** pattern.
* Pure util functions: no DOM / React imports.
* Date/time handled via `dayjs` (single source).

---

## 9  Testing

* **Vitest + React Testing Library** for all unit & integration tests.
* Chart components – use snapshot & accessibility tests.
* Test hooks via components or `renderHook` from `@testing-library/react`.

---

## 10  Performance & Quality Gates

| Metric                    | Threshold |
|---------------------------|-----------|
| Bundle size main chunk    | < 250 KB gzipped |
| Lighthouse perf           | > 90     |
| ESLint (airbnb+react)     | 0 errors |
| TypeScript strict mode    | enabled  |
| CC per function           | < 15     |
| Test Coverage             | Defined in `vite.config.ts` (incrementally increasing). |

Use `vite --report` to watch chunk growth.

---

## 11  Refactoring Triggers

* Function >50 LOC or CC>15.
* Component with >2 useEffect hooks containing business logic.
* Duplicate util >2 locations.
* Metrics report flags (see `METRICS_REPORT.md`).

---

## 12  Example – Good Feature Slice (`batch-management`)

```
features/batch-management/
├── api.ts           # TanStack Query defs (getBatches, transferBatch …)
├── hooks.ts         # useBatchFilters, useTransferDialog
├── pages/
│   ├── BatchListPage.tsx
│   └── BatchDetailPage.tsx
├── components/
│   ├── BatchTable.tsx
│   └── BatchTransferDialog.tsx
└── index.ts         # barrel export for router lazy-import
```

---

## 13  Anti-Patterns to Avoid

1. **Massive monolithic page components** (>500 LOC).
2. Business logic inside JSX (move to hooks / utils).
3. Inline `fetch` without TanStack Query.
4. Global event bus / custom pub-sub (use React context or libraries).

---

## 14  Conclusion

Adhering to these guidelines will keep the AquaMind frontend performant, maintainable and scalable as the product grows. When in doubt, optimise for **readability**, **single-responsibility**, and **user experience**.

---

## General Principles

### Code Structure

- **TypeScript Strict Mode**: Project compiled with `"strict": true`.
- **ESLint + Prettier**: Linting/formatting enforced via `npm run lint` & Husky pre-commit.
- **Functional Components**: React 18 with hooks-only patterns; no class components.
- **Tailwind CSS & Shadcn/ui**: Primary styling methodology; avoid plain CSS.
- **Generated API Client**: All network calls must use `client/src/api/generated`.

---

## Code Organization Rules

### File Size Limits

- **Maximum File Size**: Keep files under 200-300 lines of code
- **When to Split**: Consider refactoring when a file approaches 300 lines
- **How to Split**: Extract logical components into separate modules or classes

### Function Size Limits

- **Maximum Function Size**: Keep functions under 50 lines of code
- **When to Split**: Consider refactoring when a function exceeds 30 lines
- **How to Split**: Extract reusable logic into helper functions

### Class Organization

- **Single Responsibility**: Each class should have a single responsibility
- **Maximum Methods**: Aim for no more than 10-15 methods per class
- **Method Order**:
  1. Class methods (`@classmethod`)
  2. Static methods (`@staticmethod`)
  3. Properties (`@property`)
  4. Initialization methods (`__init__`, etc.)
  5. Public methods
  6. Protected methods (prefixed with `_`)
  7. Private methods (prefixed with `__`)

### API Interaction Layer (Generated Client)

All network calls go through the generated client in `client/src/api/generated`. Do **not** edit generated code.

* Extend behaviour (e.g., retries, logging) via **wrapper functions** or **feature-level hooks**.
* Provide feature-level hooks such as `useBatches()` in `features/batch-management/api.ts` which call the generated client internally.

```ts
// features/batch-management/api.ts
import { ApiService } from "@/api/generated";
import { useQuery } from "@tanstack/react-query";

export function useBatches() {
  return useQuery({
    queryKey: ["batches"],
    queryFn: () => ApiService.apiV1BatchBatchesList(),
  });
}
```

### Bad Code Organization (Anti-Pattern)

```tsx
// ❌ DON'T: Massive component with business logic, API calls and rendering mixed
export default function ScenarioPlanningMonolith() {
  const [state, setState] = useState<ScenarioState>({/* … */});
  const [results, setResults] = useState<Result[]>([]);

  // inline fetch instead of generated client
  async function runScenario() {
    const res = await fetch("/api/v1/scenario/run", { /* … */ });
    setResults(await res.json());
  }

  useEffect(() => {
    // complex effect with multiple responsibilities
  }, [state]);

  return (
    <div>
      {/* 600+ lines of JSX */}
    </div>
  );
}
```

*Symptoms*: Hard to test, no separation of concerns, fetch calls duplicated, impossible to reuse logic.

**Fix**: Split into hooks (`useScenarioRunner`), presentational components, and use the generated client.
