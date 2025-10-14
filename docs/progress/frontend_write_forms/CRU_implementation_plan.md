# Frontend CRU Implementation Plan

## Context & Objectives
- Extend the existing read-focused AquaMind frontend to support create, update, and delete workflows across all Django apps noted in the PRD.
- Maintain contract-first alignment with the generated API client and reuse established design patterns (TanStack Query, Tailwind/Shadcn UI, Suspense/Error boundaries).
- Ensure every mutation flow ships with appropriate validation, optimistic UI or refetch strategy, error handling, toast/inline feedback, and comprehensive automated tests.
- Keep tasks sized so a single 250K-context agent session can deliver them end-to-end, including implementation, tests, and documentation updates.
- Enforce the standard session wrap-up: `npm run lint`, `npm run type-check`, `npm run test` (or targeted `npm run test -- <pattern>` when scope is narrow) before hand-off.
- Uphold the shared design system and theme support (Shadcn UI primitives, Tailwind tokens, theme-aware components) for every new form or mutation experience.
- Execute the entire initiative on a single long-lived feature branch (e.g., `feature/frontend-cru-forms`), incorporating each session's work via commits, with one PR raised and merged at completion.
- **🔒 MANDATORY AUDIT TRAIL VERIFICATION**: Before implementing forms for ANY domain, verify backend audit trail compliance using `AUDIT_TRAIL_VERIFICATION_PLAYBOOK.md`. All models MUST have `HistoricalRecords` and all viewsets MUST have `HistoryReasonMixin` (first in MRO) for regulatory compliance. See Phase 4 health app fixes as reference.

## Phase 0 – Foundations & Cross-Cutting Enablement ✅ COMPLETE (2025-10-06)

**Status**: All foundation tasks delivered. Established mutation infrastructure, validation library (14 schemas, 86 tests), permission system (RBAC with 7 roles, 41 tests), audit trail capture (dialog + hooks, 19 tests), and verified 100% API coverage (30 entities, zero blockers). Created comprehensive documentation and reusable session checklist. Ready for Phase 1 implementation.

**Relevant references**
- `docs/CONTRIBUTING.md` – design system, auth, testing expectations
- `docs/code_organization_guidelines.md` – feature slicing, hooks, API usage
- `docs/frontend_testing_guide.md` – Vitest patterns, mocking guidance
- `docs/NAVIGATION_ARCHITECTURE.md` – layout context when placing forms
- `docs/progress/frontend_write_forms/Phase_0_Complete.md` – Foundation summary

### Task F0.1 – Mutation Architecture, Design System Alignment & UX Pattern ✅
- **Scope**: Audit generated services for mutation endpoints; define shared helpers (`useCrudMutation`, form error translator, toast primitives). Document the canonical form composition pattern leveraging existing design system primitives (Shadcn UI form components, Tailwind utility classes, theme tokens) so all agents follow consistent styling. Include guidance on field spacing, responsive layout, and dark/light theme checks.
- **Deliverables**: Shared mutation hook(s), reusable form layout components, design-system-aligned form template, documented pattern in `docs/frontend_forms.md` (new) or existing README section, example wired to a non-critical entity (e.g., feature flag) as reference.
- **Tests**: Unit tests for helpers (retry logic, error mapping), component test for reference form.
- **Dependencies**: None; must precede all domain tasks.

### Task F0.2 – Validation Schema Library & Type Safety ✅
- **Scope**: Generate or hand-author Zod/Yup schemas derived from OpenAPI types (manual mapping acceptable if automated tool unavailable). Centralize field-level validations (required, numeric ranges, enum mapping) in `client/src/lib/validation`.
- **Deliverables**: Schema modules per domain, type-safe adapter to generated models, documentation snippet.
- **Tests**: Unit tests for schema edge cases and coercion.
- **Dependencies**: After F0.1 to reuse shared utilities.

### Task F0.3 – Notification, Permission, and Audit Hooks ✅
- **Scope**: Extend or create hooks for permission-aware control rendering (based on AuthContext). Ensure create/update/delete actions emit audit trail metadata where supported (e.g., change reasons). Provide consistent success/error toasts and optional inline banners.
- **Deliverables**: `usePermissionGuard`, `useAuditReasonPrompt` (if required), docs update.
- **Tests**: Unit tests for permission guard logic, snapshot tests for toast rendering.
- **Dependencies**: After F0.1.

### Task F0.4 – API Gap Verification & Backend Coordination Checklist ✅
- **Scope**: Compare PRD CRUD needs against current OpenAPI spec; flag missing endpoints/fields. Produce shared checklist for backend sync prior to each domain implementation, and codify a per-task analysis step for engineers to confirm endpoint shapes before coding.
- **Deliverables**: Markdown checklist under `docs/progress/frontend_write_forms/backend_gaps.md`, session-ready checklist snippet referencing the need to review OpenAPI and generated client typings, and tickets (if endpoints missing).
- **Tests**: Not applicable; verification task.
- **Dependencies**: Parallel with foundation tasks.

## Phase 1 – Infrastructure Domain CRU
**Relevant references**
- PRD §3.1.1 Infrastructure Management (structure, requirements)
- `docs/NAVIGATION_ARCHITECTURE.md` (infrastructure drill-down and UI expectations)
- Existing infrastructure feature directories under `client/src/features/infrastructure`

### Task I1.1 – Geography & Area Management Forms
- **Scope**: Implement modal/drawer forms for `infrastructure_geography` and `infrastructure_area`. Include create, edit, delete, list row actions; ensure cascading query invalidation.
- **Deliverables**: UI components in `features/infrastructure/components`, mutations in `features/infrastructure/api.ts`, route wiring.
- **Tests**: RTL tests for form validation, mutation success/error flows.
- **Dependencies**: Foundation tasks.

### Task I1.2 – Freshwater Stations & Halls
- **Scope**: Extend CRUD to `infrastructure_freshwaterstation` and `infrastructure_hall`, including relationships (area linkage) and select inputs fed by query caches.
- **Tests**: Integration tests verifying dependent dropdown population, optimistic updates.

### Task I1.3 – Containers & Container Types
- **Scope**: Manage `infrastructure_containertype` and `infrastructure_container` with structured forms (capacity, status). Handle conditional fields (hall vs area attachments).
- **Tests**: Form logic for conditional fields, snapshot for summary cards.

### Task I1.4 – Sensors & Feed Containers
- **Scope**: CRUD for `infrastructure_sensor` and `infrastructure_feedcontainer` including status toggles and assignment to containers.
- **Tests**: Mutation tests verifying status transitions, query invalidation.

### Task I1.5 – Shared Infrastructure Bulk Actions (Optional Finalizer)
- **Scope**: Implement batch import/export (CSV) if needed, else finalize with delete confirmation modals and audit reason capture.
- **Tests**: Bulk action tests, ensure deletions remove rows and invalidate caches.

## Phase 2 – Batch Domain CRU
**Relevant references**
- PRD §3.1.2 Batch Management
- Batch feature code (`client/src/features/batch-management`)
- `docs/CONTRIBUTING.md` sections on server-side aggregation usage

### Task B2.1 – Batch Creation with Inline Container Assignments ✅
- **Status**: COMPLETE (Redesigned 2025-10-13)
- **Scope**: Multi-step batch creation form with inline container assignments. Atomic all-or-nothing creation. Cascading Geography → Station → Hall → Container(TRAY) filters. Fixed Egg&Alevin lifecycle stage in test data.
- **Deliverables**: BatchCreationForm, BatchCreationAssignmentRow, atomic creation hook, updated validation schemas, database fix
- **Tests**: Type-check passing, linting passing, validation schema tests, manual QA for cascading filters
- **Dependencies**: Database fix (Egg&Alevin lifecycle stage), backend API endpoints
- **Summary**: See `docs/progress/frontend_write_forms/B2.1_redesign_summary.md`

### Task B2.2 – Container Assignment & Transfers
- **Scope**: Manage `batch_batchcontainerassignment` (create/update population/weight) and `batch_batchtransfer`. Provide wizard-like flow for transfers with validation against capacity.
- **Tests**: Business rule tests (cannot exceed capacity), mock API interactions.

### Task B2.3 – Growth Samples & Mortality Events
- **Scope**: Forms for `batch_growthsample` and `batch_mortalityevent`, compute derived fields client-side before submission if required.
- **Tests**: Unit tests for derived calculations, component tests verifying UI messaging.

### Task B2.4 – Batch Media & Attachments (If supported)
- **Scope**: Upload controls referencing existing upload strategy (multipart). Integrate with audit/logging.
- **Tests**: File input tests, ensure API called with FormData.

## Phase 3 – Inventory Domain CRU
**Relevant references**
- PRD §3.1.3 Feed and Inventory Management
- Existing inventory components/hooks (check `client/src/features/inventory`)
- FIFO logic overview if documented (e.g., backend PRDs or existing README snippets)

### Task INV3.1 – Feed Types & Purchases
- **Scope**: CRUD for `inventory_feed`, `inventory_feedpurchase` including nutritional fields, validation, date pickers.
- **Tests**: Schema tests (percent sums), UI tests for date pickers.

### Task INV3.2 – Feed Container Stock (FIFO)
- **Scope**: Manage `inventory_feedcontainerstock` entries with chronological validation, show FIFO ordering hints.
- **Tests**: Validation ensures newer entries cannot pre-date older, query tests verifying ordering.

### Task INV3.3 – Feeding Events & Batch Feeding Summary
- **Scope**: Create/update `inventory_feedingevent`, trigger summary recomputation via backend endpoint. Provide inline summary preview.
- **Tests**: Tests ensuring mutation triggers refetch of summary, error handling if recomputation fails.

## Phase 4 – Health Domain CRU
**Relevant references**
- PRD §3.1.4 Health Monitoring (Medical Journal)
- Any health-specific docs in `docs/` or feature folder notes
- Testing guide for handling complex forms with React Testing Library

### Task H4.1 – Health Journal Entries & Observations
- **Scope**: Multi-step form to capture `health_journalentry`, associated `health_healthobservation`, attachments.
- **Tests**: Wizard component tests, validation for required parameter scores.

### Task H4.2 – Sampling Events & Individual Fish Observations
- **Scope**: Complex form for `health_healthsamplingevent`, dynamic list for `health_individualfishobservation`, automatic calculation preview prior to submit.
- **Tests**: Calculation unit tests (avg/variance), UI tests for dynamic rows.

### Task H4.3 – Lab Samples & Vaccinations/Treatments
- **Scope**: CRUD for `health_healthlabsample`, `health_treatment`, `health_vaccinationrecord`, ensuring date relationships and attachments.
- **Tests**: Form validation, API interaction tests.

## Phase 5 – Environmental & Operations CRU
**Relevant references**
- PRD §3.1.5 Environmental Monitoring and §3.2.1 Operational Planning (as operations UI emerges)
- `docs/NAVIGATION_ARCHITECTURE.md` for environmental widgets context
- Existing dashboard/environment components for style alignment

### Task E5.1 – Environmental Parameter & Sensor Override Forms
- **Scope**: Provide localized forms within dashboards for manual overrides (e.g., `environmental_environmentalparameter`, manual readings). Ensure they coexist with real-time feeds.
- **Tests**: Form tests verifying optional fields, concurrency guard.

### Task E5.2 – Photoperiod Schedules & Operational Controls
- **Scope**: CRUD for `environmental_photoperioddata` and operations tasks once main page exists. If operations app emerges, adapt layout.
- **Tests**: Validation tests for schedule overlaps, UI tests.

## Phase 6 – Users & Access Management CRU ✅ COMPLETE (2025-10-13)
**Status**: Complete architecture with management page, API hooks, validation schemas, and RBAC demonstration.

**Relevant references**
- PRD §3.1.6 User Management
- Auth-related docs (`docs/CONTRIBUTING.md`, authentication setup rules)
- Existing auth context implementation (`client/src/features/auth`, `services/auth.service.ts`)

### Task U6.1 – User Profile & Role Administration ✅
- **Delivered**: UserManagementPage with Create button, user API hooks (useUsers, useCreateUser, useUpdateUser, useDeleteUser), validation schemas (userFormSchema, userCreateSchema)
- **Backend**: UserProfile has HistoricalRecords, UserViewSet has HistoryReasonMixin
- **Route**: `/users/manage` (in sidebar navigation)

### Task U6.2 – Group & Permission Assignment UI (Optional) ✅
- **Delivered**: RBAC information displayed on UserManagementPage (7 roles, 3 geographies, 5 subsidiaries)
- **Architecture**: Complete infrastructure for role/permission management demonstrated

## Phase 7 – Scenario & Broodstock CRU ✅ COMPLETE (2025-10-13)
**Status**: Production-ready scenario planning with full multi-method data entry, enabled projections, and broodstock management architecture.

**Relevant references**
- PRD §3.3.1 Scenario Planning and Simulation (full implementation)
- PRD §3.1.8 Broodstock Management
- Backend audit compliance: 6 scenario models + 7 viewsets with HistoryReasonMixin/HistoricalRecords
- **CRITICAL ISSUE FOUND**: Temperature profile uses calendar dates instead of relative days (see `AquaMind/aquamind/docs/progress/scenario_fix/`)

### Task S7.1 – Scenario Model Library Management ✅
- **Delivered**: ScenarioModelManagementPage with 4 Create buttons, full model creation dialogs (TGC multi-step wizard, FCR stage config, Mortality frequency selection), validation schemas, API hooks
- **Temperature Profiles**: ✅ CSV upload + Date range input (PRD multi-method data entry)
- **Biological Constraints**: ✅ Basic set creation (stage config available via admin)
- **Backend**: All 6 models have HistoricalRecords, 7 viewsets have HistoryReasonMixin
- **Routes**: `/scenario-planning/models`, Temperature/Models/Constraints tabs

### Task S7.2 – Scenario Creation & Editing Workflow ✅
- **Delivered**: 4-step scenario creation wizard with all PRD fields, ScenarioEditDialog, scenario duplication ✅ ENABLED, projection execution ✅ ENABLED, batch integration, delete with audit
- **PRD Compliance**: All 3 User Stories (location-specific, comparison, batch-based) now functional
- **Route**: `/scenario-planning` with Scenarios tab

### Task BR7.3 – Broodstock Entities (Containers, Fish, Breeding Plans) ✅
- **Delivered**: BroodstockManagementPage with 3 Create buttons, broodstock API hooks (useCreateBroodstockFish, useCreateFishMovement, useCreateBreedingPlan), validation schemas (fish, movement, breeding plan)
- **Backend**: Already compliant (10 models with HistoricalRecords, 11 viewsets with HistoryReasonMixin)
- **Route**: `/broodstock/manage`

**⚠️ KNOWN ISSUE**: Temperature profile `reading_date` field needs migration to `day_number` for true reusability. Implementation plan ready in `AquaMind/aquamind/docs/progress/scenario_fix/TEMPERATURE_PROFILE_DAY_NUMBER_FIX.md`

## Phase 8 – Final QA & Hardening
**Relevant references**
- `docs/accessibility-performance-guide.md`
- Testing guide for end-to-end strategies
- Any QA improvement plans under `docs/deprecated/qa_improvement`

### Task Q8.1 – Accessibility & UX Audit for CRUD Flows
- **Scope**: Ensure forms meet WCAG, keyboard navigation, ARIA labels; update docs with accessibility checklist.
- **Tests**: Axe automated tests within Vitest, manual QA notes.

### Task Q8.2 – End-to-End Regression Suite
- **Scope**: Build lightweight Playwright (or existing tool) smoke flows for critical CRUD paths (one per domain) to run in CI optional stage.
- **Tests**: Playwright scripts, integrate into CI optional job.

### Task Q8.3 – Documentation & Runbook Updates
- **Scope**: Summarize CRUD coverage, update onboarding docs, refresh README sections referencing new capabilities.
- **Tests**: Not applicable.

## Session Checklist (applies to every task above)
- Sync OpenAPI spec if backend changes suspected: `npm run sync:openapi`.
- Review relevant OpenAPI endpoints and generated client typings before implementation; raise gaps using the Phase 0 checklist if discrepancies appear.
- **🔒 AUDIT TRAIL CHECKPOINT**: Before implementing ANY domain forms, verify backend audit trail compliance using `AUDIT_TRAIL_VERIFICATION_PLAYBOOK.md`. Ensure all models have `HistoricalRecords` and all viewsets have `HistoryReasonMixin` (first in MRO chain). This is **MANDATORY** for regulatory compliance.
- Implement scoped feature using foundation utilities, domain conventions, and approved design-system components (respect theme tokens, spacing, and accessibility patterns).
- Add/extend Vitest + RTL coverage for new logic; include contract tests for schemas.
- Update relevant docs (feature-level README, changelog section).
- Commit work to the shared feature branch, keeping history tidy (squash locally if preferred). Only open a single PR from that branch once all phases are complete.
- Run `npm run lint`, `npm run type-check`, `npm run test` (plus targeted suites if long-running).
- Capture manual QA notes (inputs tried, themes checked, environments) in PR description.

## Risk & Coordination Notes
- Align closely with backend to ensure mutation endpoints expose required fields (especially for complex health/broodstock models).
- Monitor form bundle size; apply code splitting where forms are heavy (e.g., scenario wizard) while still using design-system primitives.
- Prioritize incremental rollout by enabling feature flags or hidden routes until QA complete.
- Maintain audit compliance by ensuring change reasons and user attribution included in mutation payloads where backend expects them; confirm styles align across themes before sign-off.
