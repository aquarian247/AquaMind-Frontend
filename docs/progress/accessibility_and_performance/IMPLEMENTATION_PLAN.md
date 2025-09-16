## AquaMind Frontend Accessibility & Performance Rollout Plan

Last updated: 2025-09-16
Owner: Frontend Team
Status: Draft (ready to execute)

---

### Goals
- Establish consistent WCAG 2.1 AA accessibility and solid performance practices across the entire React frontend.
- Reuse the proven audit-trail patterns; avoid heavy tooling and avoid CI pain.
- Execute in small, session-sized tasks to minimize context rot and reduce merge risk.

### Success Criteria
- Lighthouse Accessibility ≥ 90 on key pages; no critical axe violations in smoke tests.
- Keyboard-only navigation works on all interactive flows.
- Screen readers receive meaningful announcements for dynamic changes (filters, tab switches, async loads).
- Uniform “N/A” empty-state and field fallback across pages.
- No significant performance regressions (keep render counts stable; no obvious jank; acceptable LCP on local builds).

---

### Principles
- Prefer semantic HTML and ARIA only where needed; keep it simple.
- Centralize patterns: hooks and primitives first, then apply to features.
- Minimize new dependencies; add only low-risk, well-supported tools.
- Small PRs by domain slice; each PR must be testable and revertable.
- Do not refactor business logic; focus on a11y, UX polish, and render performance.

---

### Minimal Tooling (lightweight and low-friction)
- Unit-level a11y checks: `axe-core` via `vitest-axe` (a thin wrapper that works with Vitest).
- Optional GUI a11y smoke: Playwright + `@axe-core/playwright` on 3–5 critical routes, run on-demand or nightly (not per-PR to avoid flakiness).
- Optional page quality check: Lighthouse CLI locally on key pages (manual or pre-release), not CI-blocking.

Notes:
- Keep CI simple: run existing Vitest suite plus 3–5 a11y smoke tests with `vitest-axe`. Make Playwright/Lighthouse jobs optional or scheduled.

---

### Order of Execution (to avoid debugging pain)
1) Foundation (shared utilities and app shell)
2) Cross-cutting primitives (tables, dialogs, filters, tabs)
3) Domain-by-domain adoption (small, focused sessions)
4) Light test automation (axe smoke tests), then optional Playwright sweeps
5) Documentation + progress logging

---

### Phase 0 — Foundation (2–3 sessions)

- 0.1 Create shared accessibility utilities (lifted from Audit Trail)
  - Move or generalize `useAccessibility` into `client/src/hooks/useAccessibility.ts` with:
    - announce(message, priority)
    - setFocus(element)
    - handleKeyboardNavigation(event, actions)
  - Provide a tiny `ScreenReaderLiveRegion` component (polite/assertive) for announcements.

- 0.2 App Shell & Landmarks
  - Ensure `App.tsx`/layout has: top-level landmarks (`<header>`, `<nav>` with `aria-label`, `<main id="main-content" role="main">`, `<footer>`), a working skip link to `#main-content`, and visible focus styles.
  - Add a global visually-hidden utility (if not already present) and confirm Tailwind focus styles are sufficiently visible.

- 0.3 Shared loading/error patterns
  - Standardize `LoadingState` and `ErrorState` with roles/`aria-live`. Use across pages.
  - Ensure all pages show consistent N/A when data is missing, per product preference.

- 0.4 Performance baselines (no new tools)
  - Minor cleanups: memoize heavy components, memo computed data, stabilize callbacks.
  - Ensure React Query defaults are sensible (reuse existing `getQueryFn`, avoid aggressive retries in views, tune `staleTime/gcTime` where noisy).

Deliverables: shared hook and components in `src/hooks` and `src/components/common`, app shell landmarks/skip link, N/A policy documented.

---

### Phase 1 — Cross-cutting primitives (3–4 sessions)

- 1.1 Table semantics wrapper
  - Create `AccessibleTable` utilities: `<table>` with `<caption>` (optional), `<thead>`, `<th scope="col">`, `<tbody>`, row actions as buttons/links, keyboard support for sorting.
  - Apply to common table usages starting with generic list pages.

- 1.2 FilterBar pattern
  - Label all inputs with `<label htmlFor>` or `aria-label`; fieldsets/legends for grouped filters.
  - `aria-live="polite"` region for active filter count; debounced search with cleanup.

- 1.3 Tabs/Dialogs with Shadcn primitives
  - Confirm they are used accessibly (focus trap, aria-*), add escape key handling and initial focus.

- 1.4 Buttons/Links
  - Ensure clickable divs become `<button>` or `<a>`; provide `aria-disabled` where appropriate.

Deliverables: common primitives ready; patterns documented in short README under `src/components/common/`.

---

### Phase 2 — Domain adoption (session-scoped tasks)
Each task below is a single agent session (or small pair), designed to be done independently and merged safely. Tackle in this sequence. Audit Trail is already done and serves as reference.

Legend: A11Y = accessibility; PERF = simple memoization/caching tweaks; TEST = add/extend a11y smoke tests.

- 2.1 Infrastructure — Lists (1 session)
  - Apply landmarks to pages, swap tables to `AccessibleTable`, label filters, add skip link anchor, ensure keyboard sorting.
  - PERF: memo rows/cells and expensive computed summaries.

- 2.2 Infrastructure — Details (1 session)
  - Headings hierarchy, `aria-describedby` tying metric cards to labels, N/A fallbacks, live announcements for async sections.

- 2.3 Infrastructure — Halls/Containers flows (1 session)
  - Keyboard navigation for action menus; ensure dialogs focus trap; announce success/errors.

- 2.4 Batch Management — Lists (1 session)
  - Table semantics, filters, keyboard nav for pagination/sorting; N/A in derived columns.

- 2.5 Batch Management — Details (1 session)
  - Sections with headings/landmarks; announce tab changes; PERF: memoized derived metrics.

- 2.6 Environmental — Readings & charts (1 session)
  - Ensure charts are wrapped with accessible descriptions; canvas has descriptive text alternative; table fallback summaries.
  - PERF: avoid unnecessary re-renders; keep chart props stable.

- 2.7 Inventory — Lists (1 session)
  - `AccessibleTable`, labels/filters; announce filter results count.

- 2.8 Inventory — Detail & actions (1 session)
  - Dialog/confirm flows; focus management; keyboard triggers; error alerts with role="alert".

- 2.9 Health — Journals & records (1 session)
  - Ensure forms have labels/validation messaging with `aria-describedby`; keyboard traversal.

- 2.10 Health — Detail/print views (1 session)
  - Headings/sections; readable summaries; N/A policy.

- 2.11 Operational — Tasks/boards (1 session)
  - Keyboard interaction for item navigation; ensure drag affordances have keyboard alternatives (or provide non-drag actions).

- 2.12 Scenario — Projections (1 session)
  - Tabs/filters; announce long-running computations starting/finished; avoid layout shift with skeletons.

- 2.13 Broodstock — Lists/Details (1 session)
  - Apply the standard table/detail patterns, labels, and announcements.

Note: If a domain slice is larger than expected, split the session into “Lists” and “Details” sub-sessions for that domain.

---

### Phase 3 — Light automation (2 sessions, optional per-PR)

- 3.1 Vitest a11y smoke tests
  - Add `vitest-axe`; write 3–5 smoke tests for App shell + 2–3 representative pages (no network; render with basic mocks).
  - Gate only on these lightweight tests in CI (keep them fast).

- 3.2 Optional Playwright + axe sweep (scheduled, not PR-blocking)
  - Add a minimal Playwright job that visits 3–5 critical routes and runs `page.checkA11y()`.
  - Schedule nightly or manual trigger; report violations as artifacts, not hard failures.

---

### Definition of Done (per session)
- Landmarks and headings hierarchy are correct.
- All interactive elements are native elements (`button`, `a`, `input`, etc.).
- Forms and filters have explicit labels; groups use `fieldset`/`legend` when meaningful.
- Keyboard-only users can complete the primary tasks on that page.
- Screen readers receive announcements for async state changes (loading complete, filters applied, tab switched, action done/failed).
- N/A fallback is used consistently where data is missing.
- Basic memoization applied; no obvious re-render thrash.
- Axe smoke test for the impacted page(s) shows no critical violations locally.

---

### Tracking & Reporting

Use this checklist to drive execution. Update as sessions complete.

- [x] Audit Trail domain (baseline reference)
- [ ] Phase 0 — Foundation (hooks, shell, loading/error, N/A policy)
- [ ] Phase 1 — Cross-cutting primitives (table, filters, tabs/dialogs, buttons)
- [ ] 2.1 Infrastructure — Lists
- [ ] 2.2 Infrastructure — Details
- [ ] 2.3 Infrastructure — Halls/Containers flows
- [ ] 2.4 Batch — Lists
- [ ] 2.5 Batch — Details
- [ ] 2.6 Environmental — Readings & charts
- [ ] 2.7 Inventory — Lists
- [ ] 2.8 Inventory — Details & actions
- [ ] 2.9 Health — Journals & records
- [ ] 2.10 Health — Detail/print views
- [ ] 2.11 Operational — Tasks/boards
- [ ] 2.12 Scenario — Projections
- [ ] 2.13 Broodstock — Lists/Details
- [ ] 3.1 Vitest a11y smoke tests
- [ ] 3.2 Optional Playwright sweep (scheduled)

Each completed session should also log a short entry in the repository’s progress section (see below).

---

### Minimal Code Changes Inventory (what to expect in each session)
- Add/adjust ARIA attributes: `aria-live`, `aria-describedby`, `aria-label` — only when needed.
- Replace non-semantic clickable elements with `<button>`/`<a>`.
- Add headings and region landmarks; wire skip link to `#main-content`.
- Ensure dialogs/tabs use accessible primitives; set initial focus; support `Escape`.
- Memoize heavy components and computed arrays/objects; stabilize callbacks.
- Ensure React Query caching/retry options don’t cause noisy refetches.
- Keep diffs small; do not restructure routing/business logic.

---

### Risks & Mitigations
- Large diffs create merge pain → Mitigation: session-sized PRs per domain slice.
- Flaky CI from new tools → Mitigation: keep axe tests unit-level and fast; keep Playwright optional/scheduled.
- Overuse of ARIA → Mitigation: strive for semantic HTML first, ARIA second.
- Performance regressions → Mitigation: memoize and stabilize props; avoid unnecessary state in parents.

---

### Appendices

A) Suggested tiny dependencies
- `vitest-axe` (or equivalent integration of `axe-core` with Vitest)
- `@axe-core/playwright` (optional)

B) Reference files to touch first
- `client/src/App.tsx` (landmarks/skip link)
- `client/src/index.css` (focus styles, visually-hidden util if missing)
- `client/src/hooks/useAccessibility.ts` (new; shared)
- `client/src/components/common/` (new; `AccessibleTable`, `LoadingState`, `ErrorState`, `ScreenReaderLiveRegion`)

C) Progress Logging (per implementation rules)
When a milestone completes, update the progress log:
- In this plan, tick the relevant checkbox above.
- In `docs/progress/accessibility_and_performance/COMPLETED.md`, append an entry:
  - Date (YYYY-MM-DD)
  - What was implemented
  - How it was implemented (key patterns/primitives)
  - Any deviations from plan

Example entry:
- 2025-09-20 — Phase 0 completed. Implemented shared a11y hook, app shell landmarks, skip link, standardized loading/error. Introduced `AccessibleTable` skeleton. No deviations.

---

This plan is intentionally lightweight, sequenced to reduce risk, and aligned with the already successful Audit Trail approach. Execute phases in order, keep PRs small, and favor semantics and small performance wins over tooling complexity.