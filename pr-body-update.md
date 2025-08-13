QA: Frontend test framework + Dashboard/API tests (Droid-assisted PR)

Summary
- Phase 6 complete: Dashboard & API layer tests added.
- Tests: KPI cards, fish-growth chart, water-quality chart, use-dashboard-data hooks, and lib/api wrapper.
- Mocking: vi.spyOn on ApiService/api wrappers for unit tests; MSW server/handlers added as optional utilities.
- Infra: Chart.js mocked in setupTests.ts; AbortController shim; stricter onUnhandledRequest during debug.
- Docs: docs/frontend_testing_guide.md and Phase 6 section in docs/qa_improvement/QA_Improvement_Master_Plan.md updated.

Coverage (local snapshot)
- Overall: ~17.4% lines (global thresholds low while suite grows)
- Dashboard components: ~52.5% lines / ~81% branches
- New test files: 100% lines
- lib/api.ts: ~44.4% lines

CI/Contract
- Type-check fixed by declaring MockChart.destroyed; npm run type-check passes.
- Contract validation step green; OpenAPI client remains generated via workflow.

Notes
- Kept MSW utilities for future higher-level tests; unit tests prefer direct module spies for determinism.

---

## Phase 7 – Batch Management Smoke Tests (Droid-assisted)

Summary  
- Implemented smoke-level tests for **five** read-only batch views: *Analytics*, *Container*, *Health*, *Traceability*, *Feed History*.  
- Verified render, basic tab navigation, loading & error states, and 1–2 key data points per view.  
- Mocking: `vi.spyOn(globalThis, 'fetch')` for unit tests; **MSW** reserved for integration.  
- React Query: tests create a `QueryClient` using app default `getQueryFn`, with retries disabled and minimal cache.  
- Infra: `setupTests.ts` hardened with stable `matchMedia`, `ResizeObserver`, and Canvas stubs; duplicate text handled via `findAllByText`.

Status  
- **31 tests** across **14 files**; all green locally (`npm run test:ci`).

Docs  
- Updated Phase 7 section in `docs/qa_improvement/QA_Improvement_Master_Plan.md`.  
- Added “View-only Components (Smoke Tests)” section to `docs/frontend_testing_guide.md`.
