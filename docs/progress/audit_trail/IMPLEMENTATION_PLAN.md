## Audit Trail Frontend – Overview and Detail Pages (Implementation Plan)

### Scope and goals

- Build a first-class Audit Trail experience with a left-menu entry, a responsive overview page with tabs (and optional sub-tabs), and record detail pages.
- Consume the existing history endpoints documented in the OpenAPI spec and integration guide; no client-side aggregation beyond what’s necessary for pagination/filters.
- Strictly adhere to the design system and page composition patterns used by other top-level modules (Batch, Infrastructure, Inventory, Health, Scenario).
- Always render honest fallbacks when data is absent: “N/A” or “No Data Available” (never hardcoded or misleading values).
- Single feature branch for the whole implementation; one PR at the end of implementation.

### Assumptions

- Backend endpoints are available and documented; TypeScript client is generated from `api/openapi.yaml`.
- No audit trail seed data exists initially; UI must handle empty results gracefully.
- Authentication uses the canonical JWT endpoints and the app-wide auth configuration.

### High-level UI

- Left Nav: “Audit Trail” (top-level, consistent with other modules)
- Overview Page: Tabs by app domain with common filters
  - Tabs: Batch, Infrastructure, Inventory, Health, Scenario, Users
  - Within each tab: model selector (dropdown) when multiple models exist
  - Filters: Date range, Change type (+, ~, -), Username (icontains), Page size
  - Results: Paginated table with Date, User, Type (badge), Entity/Model summary, Reason, Actions (View details)
- Detail Page: Record snapshot and change context
  - Header: Timestamp, User, Type, Reason
  - Body: Field/value snapshot; best-effort before/after comparison when possible; fallback to snapshot-only with “N/A” for unknowns
  - Secondary info: Model name, record id; links to related entities when available

---

## Tasks (single-session sized) – one feature branch, one PR at the end

Each task includes: a minimal reading list, implementation steps, quality checks, and deliverables.

### Task 0 (Optional but recommended): Minimal backend seed for audit events ✅ COMPLETED

- Purpose: Provide a handful of real audit trail records in dev to visually validate UI.
- Reading list (short):
  - Backend repo: `apps/*/api/viewsets` to identify safe models for seed ops
  - Backend scripts: `AquaMind/scripts/data_generation` (patterns)
- Steps:
  - Add a backend management command or script to create/update/delete 30–50 records across 3–4 models (e.g., Batch, Infrastructure Area, Infrastructure Freshwater Station, Inventory), by 2-3 test users, so history events are emitted.
  - Run locally to confirm a few history records exist.
- Quality checks:
  - Verify endpoints return non-empty `results` in dev.
  - No schema or spectacular warnings introduced.
- Deliverable:
  - Simple backend command (referenced here; lives in backend repo), and brief note in this plan with run command.

**✅ COMPLETED: Created `generate_audit_trail_data` management command**
- Command: `python manage.py generate_audit_trail_data --force`
- Location: `apps/infrastructure/management/commands/generate_audit_trail_data.py`
- Generated: 30+ history records across Geography, Area, FreshwaterStation, Batch, Feed, and JournalEntry models
- Users: Created 3 test users (audit_user1, audit_user2, audit_admin) for history attribution
- Verification: Confirmed history records exist (Geography: 10 history records, Batch: 20 history records)

### Task 1: Sync OpenAPI and verify history endpoints ✅ COMPLETED

- Reading list:
  - `docs/audit-trail-frontend-integration-guide.md`
  - `README.md` (OpenAPI sync section)
  - `docs/CONTRIBUTING.md` (contract-first, generated client)
- Steps:
  - Run `npm run sync:openapi`.
  - Confirm presence of generated history methods, e.g., `ApiService.listBatchBatchHistory`, `ApiService.retrieveBatchBatchHistoryDetail`, etc.
  - Note supported filters: `date_from`, `date_to`, `history_user`, `history_type`, `page`, `page_size`.
- Quality checks:
  - TypeScript build passes: `npm run type-check`.
  - No unresolved imports in `client/src/api/generated`.
- Deliverable:
  - Short checklist added to this doc confirming generated methods exist.

**✅ COMPLETED: Generated history methods verified**
- ✅ `npm run sync:openapi` - Successfully synced OpenAPI spec and regenerated API client
- ✅ History methods confirmed present:
  - `listBatchBatchHistory()` - Batch history list endpoint
  - `retrieveBatchBatchHistoryDetail(historyId)` - Batch history detail endpoint
  - `listInfrastructureAreaHistory()` - Infrastructure area history
  - `listHealthJournalEntryHistory()` - Health journal entry history
  - `listInventoryFeedStockHistory()` - Inventory feed stock history
  - `listScenarioScenarioHistory()` - Scenario history
  - `listUsersUserProfileHistory()` - User profile history
- ✅ Supported filters confirmed: `date_from`, `date_to`, `history_user`, `history_type`, `page`
- ✅ TypeScript build passes: `npm run type-check` completed without errors
- ✅ No unresolved imports in `client/src/api/generated` (verified by successful type check)

### Task 2: Feature scaffolding and navigation entry ✅ COMPLETED

- Reading list:
  - `docs/code_organization_guidelines.md` (feature slices, routing)
  - `docs/NAVIGATION_ARCHITECTURE.md` (how top-level nav is wired)
- Steps:
  - Create `client/src/features/audit-trail/` with:
    - `api.ts` (TanStack Query hooks around generated client)
    - `hooks/` (UI/business logic helpers e.g., filters state)
    - `components/` (FilterBar, HistoryTable, EmptyState, TypeBadge, ModelSelector)
    - `pages/OverviewPage.tsx`, `pages/RecordDetailPage.tsx`
    - `index.ts` (barrel for router lazy import)
  - Add "Audit Trail" to left navigation using the same pattern as existing top-level modules.
- Quality checks:
  - Files follow naming/size limits; no unused exports.
  - Route is reachable under `/audit-trail`.
- Deliverable:
  - Feature skeleton renders a placeholder page without errors.

**✅ COMPLETED: Audit trail feature fully scaffolded**
- ✅ Created complete feature directory structure with all required subdirectories
- ✅ Implemented comprehensive API hooks (`useHistory.ts`, `useHistoryFilters.ts`) with TanStack Query integration
- ✅ Built all UI components: FilterBar, HistoryTable, EmptyState, TypeBadge, ModelSelector
- ✅ Created OverviewPage with tabbed interface for all 6 app domains
- ✅ Created RecordDetailPage for individual record viewing
- ✅ Added "Audit Trail" to left navigation with proper icon and routing
- ✅ Implemented lazy loading with Suspense fallbacks in App.tsx routing
- ✅ TypeScript compilation passes without errors
- ✅ ESLint validation passes without warnings
- ✅ Development server starts successfully and routes are functional
- ✅ All components follow size limits (<300 LOC) and naming conventions
- ✅ Feature follows proper slice architecture pattern
- ✅ No unused exports, clean barrel exports implemented

### Task 3: API hooks and types

- Reading list:
  - `docs/audit-trail-frontend-integration-guide.md` (parameters, envelopes)
  - `docs/frontend_testing_guide.md` (mocking ApiService)
- Steps:
  - Implement `useHistoryList(params)` that calls the appropriate generated list method based on selected app/model.
  - Implement `useHistoryDetail(id)` for detail view calls.
  - Centralize common `queryKey` patterns and default options (no retry for predictability, reasonable `staleTime`).
- Quality checks:
  - Proper typings from generated models; no `any`.
  - Unit tests mock ApiService and assert envelope handling (`results`, `count`).
- Deliverable:
  - `api.ts` with exported hooks + green unit tests.

### Task 4: Overview Page – tabs, filters, table

- Reading list:
  - `docs/code_organization_guidelines.md` (component decomposition)
  - `docs/frontend_testing_guide.md` (React Query setup in tests)
- Steps:
  - Tabs by app: Batch, Infrastructure, Inventory, Health, Scenario, Users.
  - Inside each tab, a Model selector (dropdown) to switch history endpoint for that app.
  - FilterBar: Date range, Username, Change type (+/~/-), Page size; apply to queries.
  - HistoryTable: columns Date, User, Type badge, Entity summary (model + id or name), Reason, and an action to open detail.
  - Paginate with server data; display total `count` where helpful.
- Quality checks:
  - Empty state shows “No Data Available” when `results` length is 0.
  - N/A placeholder for unknown or missing fields (per team rule).
  - Keyboard navigation and focus are correct for tabs and filters.
- Deliverable:
  - Fully functional overview with filters and pagination, responsive.

### Task 5: Detail Page – record snapshot and change context

- Reading list:
  - `docs/audit-trail-frontend-integration-guide.md` (detail operations)
- Steps:
  - Render header with timestamp, user, type badge, reason (or N/A).
  - Snapshot section: list field/value pairs based on returned record.
  - If prior record can be fetched (neighboring history id), compute a simple before/after comparison for changed fields; otherwise, show snapshot-only with informative copy.
  - Avoid new dependencies; use existing UI primitives for two-column or stacked layout.
- Quality checks:
  - Works for create/update/delete types; never crashes when fields missing.
  - Mobile layout stacks gracefully; long values wrap.
- Deliverable:
  - Detail page reachable from overview and via direct URL.

### Task 6: Error, loading, and empty states

- Reading list:
  - `README.md` (dev and env configuration)
- Steps:
  - Centralize Loading and Error components consistent with other modules.
  - Ensure all network paths produce one of: table, loading skeleton, error message, or “No Data Available”.
- Quality checks:
  - Simulated 403/404/500 show correct, accessible messages.
  - No console errors in common flows.
- Deliverable:
  - Predictable user feedback across states.

### Task 7: Accessibility, responsiveness, performance

- Reading list:
  - `docs/code_organization_guidelines.md` (performance & quality gates)
- Steps:
  - Verify ARIA attributes on tabs and table.
  - Ensure responsive breakpoints for filters/table; horizontal scroll for narrow screens.
  - Avoid over-fetching; rely on server pagination and filters.
- Quality checks:
  - Lighthouse a11y >= 90 on the page locally.
  - No layout shift during data load.
- Deliverable:
  - Page meets baseline a11y/perf expectations.

### Task 8: Tests

- Reading list:
  - `docs/frontend_testing_guide.md`
- Steps:
  - Unit tests for `useHistoryList` and `useHistoryDetail` (ApiService mocked, envelope shape).
  - Component tests for FilterBar and HistoryTable (empty + success + error cases).
  - Smoke test for OverviewPage (tabs render, filter interaction triggers query).
- Quality checks:
  - `npm run test` green; coverage includes hooks and table logic.
  - No MSW; use simple fetch mocks or ApiService spies as per guide.
- Deliverable:
  - Tests co-located with source files; coverage reported.

### Task 9: Integration and docs

- Reading list:
  - `docs/CONTRIBUTING.md`
- Steps:
  - Verify `.env` usage; ensure `VITE_USE_DJANGO_API` paths work.
  - Update documentation as needed (short README blurb for new page route and behavior of empty states).
  - Final branch push, open single PR.
- Quality checks:
  - Lint and type-check pass.
  - Manual smoke with backend on `http://localhost:8000` shows either records or honest empty states.
- Deliverable:
  - One PR containing all frontend changes for Audit Trail.

---

## Definition of Done (per task)

- Code follows feature slice, naming, and size limits.
- Uses generated ApiService (no ad-hoc fetch) unless explicitly justified.
- Handles empty/error/loading with honest fallbacks (N/A, No Data Available).
- Passes type-check, lint, and tests.
- UI matches existing top-level modules’ layout and spacing.
- Accessible and responsive.

---

## Test plan for Product Owner (manual)

Prereqs: Backend running (`VITE_USE_DJANGO_API=true`) and you are logged in. If no audit data exists, expect empty states.

1) Navigate to “Audit Trail” in left menu.
2) Overview Page renders with tabs: Batch, Infrastructure, Inventory, Health, Scenario, Users.
3) Select Batch tab → Model dropdown defaults to the most common model; table appears.
   - If no data: page shows “No Data Available” and filter controls are visible.
4) Apply filters:
   - Date range (last 7 days), Change type “~”, Username contains “admin”.
   - Table updates and shows total count; pagination works.
5) Open a record via “View details”.
   - Detail Page shows timestamp, user, type badge, reason (or N/A).
   - Snapshot fields render; long values wrap on mobile.
6) Switch to another tab (e.g., Infrastructure) and repeat quick checks.
7) Resize browser to narrow width (<640px):
   - FilterBar stacks nicely; table scrolls horizontally if needed.
8) Error simulation (optional via devtools or test build):
   - Verify a clear, accessible error message is rendered (no raw stack traces).

Expected: No hardcoded values; where a field is unknown, N/A is displayed. Filters and tabs are keyboard navigable.

---

## Branch and PR

- Use a single implementation branch for all tasks (example: `feature/audit-trail-ui`).
- Open one PR when all tasks are complete. Ensure it includes:
  - Screenshots (desktop and mobile)
  - Notes on empty/error states
  - Test summary and coverage note
  - Any backend seed command used

---

## Minimal reading list (global)

- `docs/audit-trail-frontend-integration-guide.md`
- `AquaMind/aquamind/docs/quality_assurance/api_standards.md`
- `README.md` (OpenAPI sync)
- `docs/CONTRIBUTING.md`
- `docs/code_organization_guidelines.md`
- `docs/frontend_testing_guide.md`

---

Last updated: 2025-09-15

